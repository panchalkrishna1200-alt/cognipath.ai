from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from database.models import RoadmapPlan, Student, TopicMastery
from ai.roadmap_generator import generate_roadmap

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.post("/{student_id}/generate")
def build_roadmap(student_id: int, weeks: int = 4, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    rows = db.query(TopicMastery).filter(TopicMastery.student_id == student_id).all()
    mastery_map = {r.topic: r.mastery_prob for r in rows}

    result = generate_roadmap(mastery_map, weeks_available=weeks)

    plan = RoadmapPlan(
        student_id=student_id,
        weeks=result["weeks"],
        gap_summary=result["gap_summary"],
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    return {
        "roadmap_id": plan.id,
        "weeks": result["weeks"],
        "gap_summary": result["gap_summary"],
        "message": result["message"],
    }


@router.get("/{student_id}/latest")
def get_latest_roadmap(student_id: int, db: Session = Depends(get_db)):
    plan = (
        db.query(RoadmapPlan)
        .filter(RoadmapPlan.student_id == student_id)
        .order_by(RoadmapPlan.created_at.desc())
        .first()
    )
    if not plan:
        raise HTTPException(status_code=404, detail="No roadmap generated yet")

    return {
        "roadmap_id": plan.id,
        "weeks": plan.weeks,
        "gap_summary": plan.gap_summary,
        "created_at": plan.created_at,
    }
