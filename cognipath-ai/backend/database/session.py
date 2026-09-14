import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Swap this for a Postgres DSN in production, e.g.:
# postgresql+psycopg2://user:password@localhost:5432/cognipath
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cognipath.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from database.models import Base
    Base.metadata.create_all(bind=engine)
