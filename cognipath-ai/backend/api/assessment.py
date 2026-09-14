from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.session import get_db
from database.models import Assessment, Document, Student, TopicMastery
from ai.rag import retrieve_for_topic
from ai.question_generator import generate_questions
from ai.competency_engine import grade_responses, compute_topic_breakdown, apply_mastery_updates

router = APIRouter(prefix="/api/assessment", tags=["assessment"])


class GenerateRequest(BaseModel):
    student_id: int
    document_id: int
    topics: Optional[List[str]] = None   # defaults to all topics detected in the document
    questions_per_topic: int = 3
    kind: str = "diagnostic"


class SubmitRequest(BaseModel):
    assessment_id: int
    answers: Dict[int, int]   # question index -> selected option index


@router.post("/generate")
def generate_assessment(req: GenerateRequest, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == req.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    topics = req.topics or document.topics_detected or []
    if not topics:
        raise HTTPException(status_code=422, detail="No topics available to assess")

    all_questions = []
    for topic in topics:
        context = retrieve_for_topic(document.id, topic, k=4)
        all_questions.extend(generate_questions(topic, context, req.questions_per_topic))

    assessment = Assessment(
        student_id=req.student_id,
        document_id=document.id,
        kind=req.kind,
        questions=all_questions,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # Strip correct_index before sending to the client so the frontend
    # can't just read the answer out of the network tab.
    sanitized = [
        {k: v for k, v in q.items() if k != "correct_index"}
        for q in all_questions
    ]

    return {"assessment_id": assessment.id, "questions": sanitized}


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
    return {
        "assessment_id": assessment.id,
        "score": score,
        "total": len(graded),
        "topic_breakdown": topic_breakdown,
        "updated_mastery": {t: round(m * 100, 1) for t, m in updated_mastery.items() if t in topic_breakdown},
    }
