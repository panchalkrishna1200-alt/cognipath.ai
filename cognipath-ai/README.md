# CogniPath AI

**Understand &rarr; Diagnose &rarr; Adapt &rarr; Improve &rarr; Reassess**

An AI learning platform that doesn't just score a student's test - it finds *why* they got
a topic wrong, traces it back to the weak prerequisite underneath, and builds a roadmap
that fixes the root cause before the symptom.

Built for the SIH problem statement: AI Learning Platform + Competency Gap Analysis.

---

## What this is (and isn't)

This is **not** a chatbot or a PDF summarizer. The pipeline is:

```
Upload material -> RAG-based diagnostic assessment -> per-topic competency scoring
   -> prerequisite gap detection -> adaptive weekly roadmap -> reassess -> repeat
```

Two things are intentionally simplified for the hackathon timeline, and you should say so
out loud if a judge asks - it's a stronger answer than pretending otherwise:

1. **Mastery estimation** is a *BKT-inspired* Bayesian update, not a trained BKT model.
   True BKT fits `p_transit`/`p_slip`/`p_guess` per skill from historical response data;
   we use fixed, literature-typical defaults and apply the real BKT update equations on
   top of them. See [`backend/ai/bkt.py`](backend/ai/bkt.py) for the full math and the
   reasoning written into the code comments.
2. **The prerequisite graph** for Machine Learning is hand-curated
   (`backend/ai/prerequisite_graph.py`), not auto-extracted from documents. The data
   shape is generic (`{topic: [prerequisites]}`), so it extends to any subject by adding
   entries - auto-extracting this from arbitrary course material is a real v2 problem.

---

## Architecture

```
Student uploads PDF/notes
        |
        v
PyMuPDF extraction -> heading-aware semantic chunking
        |
        v
Embeddings (sentence-transformers, offline hash fallback) -> ChromaDB per document
        |
        v
RAG retrieval per topic -> Gemini generates topic-tagged, Bloom's-taxonomy MCQs
        |
        v
Student answers -> graded per question
        |
        v
Competency engine: raw accuracy per topic + BKT-style mastery update per topic
        |
        v
Prerequisite graph: walk up the DAG from each weak topic to find the true
root-cause weak prerequisite (not just "you got Statistics wrong")
        |
        v
Roadmap generator: orders topics root-cause-first into a week-by-week plan
        |
        v
Student studies -> reassessment -> mastery updates -> roadmap regenerates
```

### Why this order matters

If a student is weak in "Classification" but the *real* problem is a shaky grasp of
"Logistic Regression" (its direct prerequisite), telling them to "review Classification"
wastes their time. `prerequisite_graph.find_weakest_prerequisite()` walks the DAG and
returns the actual weakest ancestor, so the roadmap fixes the foundation first.

---

## Project structure

```
cognipath-ai/
├── backend/
│   ├── main.py                    FastAPI app entrypoint
│   ├── requirements.txt
│   ├── .env.example
│   ├── database/
│   │   ├── models.py              Student, Document, TopicMastery, Assessment, RoadmapPlan
│   │   └── session.py             SQLite engine (swap URL for Postgres in prod)
│   ├── document/
│   │   ├── extractor.py           PyMuPDF text extraction
│   │   └── chunker.py             Heading-aware semantic chunking
│   ├── ai/
│   │   ├── rag.py                 Embeddings + ChromaDB storage/retrieval + topic normalization
│   │   ├── question_generator.py  Claude-based topic-tagged Bloom's-taxonomy question generation
│   │   ├── competency_engine.py   Grading + per-topic aggregation + BKT updates
│   │   ├── bkt.py                 Simplified Bayesian Knowledge Tracing
│   │   ├── prerequisite_graph.py  ML prerequisite DAG + root-cause gap detection
│   │   └── roadmap_generator.py   Week-by-week adaptive plan from detected gaps
│   └── api/
│       ├── students.py, upload.py, assessment.py, competency.py, roadmap.py
│
└── frontend/
    ├── src/
    │   ├── pages/         Profile, Upload, Assessment, Dashboard, Roadmap
    │   ├── components/    ProgressBar, SkillCard, RadarChartView, DependencyGraph, Layout
    │   └── api/client.js  Fetch wrapper around the backend
    └── tailwind.config.js Design tokens ("trail map" visual identity)
```

---

## Running it locally

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your GEMINI_API_KEY (optional - see note below)
uvicorn main:app --reload
```

API docs at `http://localhost:8000/docs`.

**No API key?** `question_generator.py` falls back to labeled sample questions so you can
demo the full pipeline (competency scoring, gap detection, roadmap) without a live LLM
call. Add `GEMINI_API_KEY` to `.env` to generate real questions from uploaded material.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`, talking to the backend at `http://localhost:8000`
(override with `VITE_API_URL` if needed).

### Try it end-to-end

1. Create a profile (target subject: Machine Learning).
2. Upload a `.txt`/`.pdf` with headed sections like "Statistics", "Linear Regression",
   "Classification" (a real ML notes PDF works well; see `backend/ai/prerequisite_graph.py`
   for the full recognized topic list).
3. Generate the diagnostic assessment, answer the questions.
4. View the Dashboard - topic-wise mastery, radar chart, and the prerequisite gap analysis.
5. Generate the roadmap - it orders topics root-cause-first.
6. (To show the "reassess" loop) generate a new assessment on the same document, answer
   better this time, and watch mastery and the roadmap update.

---

## The demo story (one student journey, not a feature tour)

1. "I'm a student learning Machine Learning." - open Profile, fill it in.
2. Upload `Machine_Learning_Notes.pdf`. CogniPath extracts topics.
3. Generate the diagnostic assessment - answer questions realistically (get some wrong).
4. Dashboard reveals: Statistics 40%, Classification 45%, Regression 70%.
5. Gap analysis reveals Statistics's *actual* blocker is Probability - a topic the student
   never explicitly failed a quiz on, but the graph implies is the real weak link.
6. Generate the 4-week roadmap - Probability first, then Statistics, then the rest.
7. Simulate studying, then retake a diagnostic on Statistics.
8. Statistics mastery: 40% -> 78%.

**Closing line:** "The assessment didn't just give the student a score. It changed the
student's learning path."

---

## The math, for judges who ask

**BKT update** (see `backend/ai/bkt.py` for the implementation):

Given current mastery estimate `P(L)`, slip rate `p_slip`, guess rate `p_guess`, and an
observed answer:

```
if correct:
    P(L | evidence) = P(L)(1 - p_slip) / [P(L)(1 - p_slip) + (1 - P(L)) * p_guess]
if incorrect:
    P(L | evidence) = P(L) * p_slip / [P(L) * p_slip + (1 - P(L)) * (1 - p_guess)]

P(L') = P(L | evidence) + (1 - P(L | evidence)) * p_transit
```

`p_transit` accounts for the chance the student learned the skill *during* this
assessment (e.g. from working through the question), not just what they knew walking in.

We use fixed defaults (`p_init=0.3, p_transit=0.15, p_slip=0.1, p_guess=0.2`) rather than
per-skill fitted parameters - the honest framing is "BKT-inspired real-time estimator,"
not "trained BKT model."

**Gap detection** is a DFS over the prerequisite DAG: from any topic below the mastery
threshold (0.65), walk its prerequisite chain and return the single ancestor with the
lowest mastery. That's the topic that should actually be studied first.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Recharts |
| Backend | Python + FastAPI |
| Database | SQLite (dev) / PostgreSQL (prod - swap one connection string) |
| Vector DB | ChromaDB |
| Document processing | PyMuPDF |
| AI | Gemini API (question generation) |

---

## Roadmap beyond the hackathon

- Fit real per-skill BKT parameters once response-log data exists.
- Auto-extract prerequisite structure from course syllabi instead of hand-curating.
- Support more domains beyond ML by adding to `PREREQUISITE_GRAPH`.
- Spaced-repetition scheduling layered on top of the weekly roadmap.
