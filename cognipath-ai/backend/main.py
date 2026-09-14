from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.session import init_db
from api import students, upload, assessment, competency, roadmap

app = FastAPI(
    title="CogniPath AI",
    description="Understand -> Diagnose -> Adapt -> Improve -> Reassess",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(upload.router)
app.include_router(assessment.router)
app.include_router(competency.router)
app.include_router(roadmap.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def root():
    return {"status": "CogniPath AI backend running", "docs": "/docs"}
