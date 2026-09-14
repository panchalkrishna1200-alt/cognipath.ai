from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.session import get_db
from database.models import Student

router = APIRouter(prefix="/api/students", tags=["students"])


class StudentCreate(BaseModel):
    name: str
    course: str = ""
    semester: str = ""
    target_subject: str = "Machine Learning"
    current_level: str = "Beginner"
    learning_goal: str = ""


@router.post("")
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    student = Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return {"student_id": student.id, **payload.model_dump()}


@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {
        "student_id": student.id,
        "name": student.name,
        "course": student.course,
        "semester": student.semester,
        "target_subject": student.target_subject,
        "current_level": student.current_level,
        "learning_goal": student.learning_goal,
    }
