from datetime import datetime
from typing import Dict, List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from database.session import get_db
from database.models import Assessment, Document, Student, TopicMastery
from ai.rag import retrieve_for_topic, retrieve_for_topic_multi
from ai.question_generator import generate_questions
from ai.competency_engine import grade_responses, compute_topic_breakdown, apply_mastery_updates

router = APIRouter(prefix="/api/assessment", tags=["assessment"])


class GenerateRequest(BaseModel):
    student_id: int
    # Accept either a single document_id or a list of document_ids
    document_id: Optional[int] = None
    document_ids: Optional[List[int]] = None
    topics: Optional[List[str]] = None   # defaults to all topics detected in the documents
    questions_per_topic: int = 3
    kind: str = "diagnostic"

    @field_validator("document_ids", mode="before")
    @classmethod
    def ensure_document_ids(cls, v, info):
        return v

    def get_document_ids(self) -> List[int]:
        """Return the resolved list of document IDs."""
        ids = []
        if self.document_ids:
            ids.extend(self.document_ids)
        if self.document_id and self.document_id not in ids:
            ids.append(self.document_id)
        return ids


class SubmitRequest(BaseModel):
    assessment_id: int
    # answers can be {index: int} for MCQ or {index: str} for short_answer
    answers: Dict[int, Union[int, str]]


@router.post("/generate")
def generate_assessment(req: GenerateRequest, db: Session = Depends(get_db)):
    doc_ids = req.get_document_ids()
    if not doc_ids:
        raise HTTPException(
            status_code=400,
            detail="Provide either document_id or document_ids",
        )

    # Validate all documents exist and collect topics
    all_topics = set()
    valid_doc_ids = []

    for doc_id in doc_ids:
        document = db.query(Document).filter(Document.id == doc_id).first()
        if not document:
            raise HTTPException(status_code=404, detail=f"Document {doc_id} not found")
        valid_doc_ids.append(doc_id)
        if document.topics_detected:
            all_topics.update(document.topics_detected)

    topics = req.topics or sorted(all_topics)
    if not topics:
        raise HTTPException(status_code=422, detail="No topics available to assess")

    all_questions = []
    for topic in topics:
        # Use multi-document retrieval to get context from all uploaded docs
        context = retrieve_for_topic_multi(valid_doc_ids, topic, k=6)
        all_questions.extend(generate_questions(topic, context, req.questions_per_topic))

    # Debug logging: check question structure before storing
    import sys
    mcq_count = sum(1 for q in all_questions if q.get("type") == "mcq")
    mcq_with_options = sum(1 for q in all_questions if q.get("type") == "mcq" and q.get("options"))
    qa_count = sum(1 for q in all_questions if q.get("type") == "short_answer")
    print(
        f"[assessment] Generated {len(all_questions)} questions: "
        f"{mcq_count} MCQ ({mcq_with_options} with options), {qa_count} short_answer",
        file=sys.stderr, flush=True,
    )

    assessment = Assessment(
        student_id=req.student_id,
        document_id=valid_doc_ids[0] if valid_doc_ids else None,  # primary doc for backward compat
        kind=req.kind,
        questions=all_questions,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # Strip sensitive fields before sending to the client
    # - MCQ: remove correct_index so the frontend can't read the answer
    # - Short answer: remove reference answer so student can't cheat
    sanitized = []
    for q in all_questions:
        clean = {k: v for k, v in q.items() if k not in ("correct_index", "answer")}
        sanitized.append(clean)

    # Debug: verify options survived sanitization
    sanitized_with_options = sum(1 for q in sanitized if q.get("type") == "mcq" and q.get("options"))
    print(
        f"[assessment] Sanitized: {len(sanitized)} questions, "
        f"{sanitized_with_options} MCQ with options",
        file=sys.stderr, flush=True,
    )

    return {
        "assessment_id": assessment.id,
        "questions": sanitized,
        "document_ids": valid_doc_ids,
        "topics": list(topics),
    }


@router.post("/submit")
def submit_assessment(req: SubmitRequest, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == req.assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    graded = grade_responses(assessment.questions, req.answers)
    topic_breakdown = compute_topic_breakdown(graded)

    mastery_rows = db.query(TopicMastery).filter(TopicMastery.student_id == assessment.student_id).all()
    current_mastery = {r.topic: r.mastery_prob for r in mastery_rows}
    updated_mastery = apply_mastery_updates(current_mastery, graded)

    existing_by_topic = {r.topic: r for r in mastery_rows}
    for topic, stats in topic_breakdown.items():
        row = existing_by_topic.get(topic)
        if row is None:
            row = TopicMastery(student_id=assessment.student_id, topic=topic,
                                correct_count=0, total_count=0, mastery_prob=0.3)
            db.add(row)
        row.correct_count = (row.correct_count or 0) + stats["correct"]
        row.total_count = (row.total_count or 0) + stats["total"]
        row.mastery_prob = updated_mastery.get(topic, row.mastery_prob)
        row.last_updated = datetime.utcnow()

    assessment.responses = graded
    assessment.topic_breakdown = topic_breakdown
    assessment.submitted_at = datetime.utcnow()
    db.commit()

    score = sum(1 for r in graded if r["correct"])

    # Include Q&A feedback in the response
    qa_feedback = []
    for r in graded:
        if r.get("type") == "short_answer":
            qa_feedback.append({
                "question": r["question"],
                "topic": r["topic"],
                "student_answer": r.get("student_answer", ""),
                "reference_answer": r.get("reference_answer", ""),
                "correct": r["correct"],
                "score": r.get("score", 0.0),
                "feedback": r.get("feedback", ""),
            })

    return {
        "assessment_id": assessment.id,
        "score": score,
        "total": len(graded),
        "topic_breakdown": topic_breakdown,
        "updated_mastery": {t: round(m * 100, 1) for t, m in updated_mastery.items() if t in topic_breakdown},
        "qa_feedback": qa_feedback,
    }
