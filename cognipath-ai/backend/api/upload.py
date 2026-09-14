import os
import shutil
import uuid

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

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
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in (".pdf", ".txt", ".md"):
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    saved_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}{ext}")
    with open(saved_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = extract_text(saved_path)
    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract any text from this file")

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
