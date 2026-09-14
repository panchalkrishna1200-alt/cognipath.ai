"""
SQLAlchemy models for CogniPath AI.

Uses SQLite by default (zero setup for a hackathon demo). Swap the engine
URL in session.py to a Postgres DSN for production - the models don't change.
"""
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    course = Column(String)
    semester = Column(String)
    target_subject = Column(String)
    current_level = Column(String, default="Beginner")
    learning_goal = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="student")
    mastery_records = relationship("TopicMastery", back_populates="student")
    assessments = relationship("Assessment", back_populates="student")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    filename = Column(String, nullable=False)
    subject = Column(String)
    topics_detected = Column(JSON, default=list)  # list[str]
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="documents")


class TopicMastery(Base):
    """
    One row per (student, topic). This is the core competency record:
    a running BKT-style mastery probability plus raw score stats.
    """
    __tablename__ = "topic_mastery"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    topic = Column(String, nullable=False)

    mastery_prob = Column(Float, default=0.3)   # P(mastery) - BKT state
    correct_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="mastery_records")

    @property
    def raw_score_pct(self) -> float:
        if self.total_count == 0:
            return 0.0
        return round(100 * self.correct_count / self.total_count, 1)

    @property
    def mastery_pct(self) -> float:
        return round(100 * self.mastery_prob, 1)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    kind = Column(String, default="diagnostic")  # diagnostic | reassessment
    questions = Column(JSON, default=list)   # list[dict] generated questions
    responses = Column(JSON, default=list)   # list[dict] student answers + grading
    topic_breakdown = Column(JSON, default=dict)  # {topic: {correct, total}}
    created_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="assessments")


class RoadmapPlan(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    weeks = Column(JSON, default=list)     # list[{week, topic, items:[...]}]
    gap_summary = Column(JSON, default=list)  # ordered list of topics to fix
    generated_from_assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
