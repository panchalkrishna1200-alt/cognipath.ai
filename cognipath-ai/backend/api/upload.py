import os
import shutil
import uuid

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.session import get_db
from database.models import Document, Student
from document.extractor import extract_text
from document.chunker import chunk_document
from ai.rag import store_document_chunks

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./data/knowledge_base")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("")
async def upload_document(
    student_id: int = Form(...),
    subject: str = Form("Machine Learning"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a single document. Original endpoint preserved for backward compatibility."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    result = await _process_single_file(student_id, subject, file, db)
    return result


@router.post("/multi")
async def upload_multiple_documents(
    student_id: int = Form(...),
    subject: str = Form("Machine Learning"),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    """Upload multiple documents at once. Each file is processed independently."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    results = []
    errors = []

    for file in files:
        try:
            result = await _process_single_file(student_id, subject, file, db)
            results.append(result)
        except HTTPException as e:
            errors.append({"filename": file.filename, "error": e.detail})
        except Exception as e:
            errors.append({"filename": file.filename, "error": str(e)})

    if not results and errors:
        raise HTTPException(
            status_code=422,
            detail=f"All files failed to process: {errors}",
        )

    return {
        "uploaded": results,
        "errors": errors,
        "total_uploaded": len(results),
        "total_errors": len(errors),
    }


@router.get("/documents/{student_id}")
def list_student_documents(
    student_id: int,
    db: Session = Depends(get_db),
):
    """List all documents uploaded by a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    documents = (
        db.query(Document)
        .filter(Document.student_id == student_id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return {
        "student_id": student_id,
        "documents": [
            {
                "document_id": doc.id,
                "filename": doc.filename,
                "subject": doc.subject,
                "chunk_count": doc.chunk_count,
                "topics_detected": doc.topics_detected or [],
                "created_at": doc.created_at.isoformat() if doc.created_at else None,
            }
            for doc in documents
        ],
        "total": len(documents),
    }


async def _process_single_file(
    student_id: int,
    subject: str,
    file: UploadFile,
    db: Session,
) -> dict:
    """Process and store a single uploaded file. Shared by both single and multi endpoints."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in (".pdf", ".txt", ".md"):
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    saved_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}{ext}")
    with open(saved_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = extract_text(saved_path)
    if not text.strip():
        raise HTTPException(status_code=422, detail=f"Could not extract any text from {file.filename}")

    chunks = chunk_document(text)

    document = Document(
        student_id=student_id,
        filename=file.filename,
        subject=subject,
        chunk_count=len(chunks),
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    topics_detected = store_document_chunks(document.id, chunks)
    document.topics_detected = topics_detected
    db.commit()

    return {
        "document_id": document.id,
        "filename": document.filename,
        "chunk_count": document.chunk_count,
        "topics_detected": topics_detected,
    }
