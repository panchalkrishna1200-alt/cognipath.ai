from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from database.models import Student, TopicMastery
from ai.competency_engine import status_emoji
from ai.prerequisite_graph import detect_gaps

router = APIRouter(prefix="/api/competency", tags=["competency"])


@router.get("/{student_id}")
def get_competency(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    rows = db.query(TopicMastery).filter(TopicMastery.student_id == student_id).all()
    if not rows:
        return {
            "overall_mastery_pct": 0,
            "topics": [],
            "biggest_gap": None,
            "message": "No assessments taken yet.",
        }

    topics = []
    mastery_map = {}
    for r in rows:
        topics.append({
            "topic": r.topic,
            "mastery_pct": r.mastery_pct,
            "raw_score_pct": r.raw_score_pct,
            "status": status_emoji(r.mastery_pct),
        })
        mastery_map[r.topic] = r.mastery_prob

    topics.sort(key=lambda t: t["mastery_pct"])
    overall = round(sum(t["mastery_pct"] for t in topics) / len(topics), 1)

    gaps = detect_gaps(mastery_map)
    biggest_gap = gaps[0] if gaps else None

    return {
        "overall_mastery_pct": overall,
        "topics": topics,
        "biggest_gap": biggest_gap,
        "message": None,
    }
