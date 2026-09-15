"""
Competency Gap Engine.

Turns a flat list of graded responses into:
  - per-topic raw accuracy (correct/total) - easy to explain to a student
  - per-topic BKT mastery probability - what actually drives the roadmap

Both numbers are shown on the dashboard because they answer different
questions: raw accuracy is "how did you do on this quiz", mastery is
"how confident are we that you actually know this, accounting for
guessing and slips".

Supports two question types:
  - MCQ: graded by comparing selected option to correct_index
  - short_answer: graded via LLM or keyword matching
"""
from collections import defaultdict
from typing import Dict, List, Union

from ai.bkt import update_mastery


def grade_responses(
    questions: List[dict],
    answers: Dict[int, Union[int, str]],
) -> List[dict]:
    """
    answers: {question_index: selected_option_index (int) for MCQ,
              question_index: student_text (str) for short_answer}
    Returns per-question grading with topic + bloom_level preserved for
    downstream aggregation.
    """
    graded = []
    for i, q in enumerate(questions):
        q_type = q.get("type", "mcq")

        if q_type == "mcq":
            graded.append(_grade_mcq(i, q, answers))
        elif q_type == "short_answer":
            graded.append(_grade_short_answer(i, q, answers))
        else:
            # Unknown type, treat as MCQ for backward compatibility
            graded.append(_grade_mcq(i, q, answers))

    return graded


def _grade_mcq(index: int, q: dict, answers: Dict[int, Union[int, str]]) -> dict:
    """Grade an MCQ question by comparing selected index to correct_index."""
    selected = answers.get(index)

    # Handle string answers that should be ints (from JSON parsing)
    if isinstance(selected, str):
        try:
            selected = int(selected)
        except (ValueError, TypeError):
            selected = None

    correct = selected is not None and selected == q["correct_index"]

    return {
        "type": "mcq",
        "question": q["question"],
        "topic": q["topic"],
        "bloom_level": q.get("bloom_level", "understand"),
        "selected_index": selected,
        "correct_index": q["correct_index"],
        "correct": correct,
    }


def _grade_short_answer(index: int, q: dict, answers: Dict[int, Union[int, str]]) -> dict:
    """Grade a short-answer question using LLM-based evaluation."""
    student_answer = answers.get(index)

    if student_answer is None or (isinstance(student_answer, str) and not student_answer.strip()):
        return {
            "type": "short_answer",
            "question": q["question"],
            "topic": q["topic"],
            "bloom_level": q.get("bloom_level", "understand"),
            "student_answer": "",
            "reference_answer": q.get("answer", ""),
            "correct": False,
            "score": 0.0,
            "feedback": "No answer provided.",
        }

    student_text = str(student_answer).strip()

    # Use LLM grading from question_generator
    from ai.question_generator import grade_short_answer

    grading_result = grade_short_answer(
        question=q["question"],
        reference_answer=q.get("answer", ""),
        student_answer=student_text,
        topic=q["topic"],
    )

    return {
        "type": "short_answer",
        "question": q["question"],
        "topic": q["topic"],
        "bloom_level": q.get("bloom_level", "understand"),
        "student_answer": student_text,
        "reference_answer": q.get("answer", ""),
        "correct": grading_result["correct"],
        "score": grading_result.get("score", 1.0 if grading_result["correct"] else 0.0),
        "feedback": grading_result.get("feedback", ""),
    }


def compute_topic_breakdown(graded_responses: List[dict]) -> Dict[str, dict]:
    breakdown = defaultdict(lambda: {"correct": 0, "total": 0})
    for r in graded_responses:
        breakdown[r["topic"]]["total"] += 1
        if r["correct"]:
            breakdown[r["topic"]]["correct"] += 1
    return dict(breakdown)


def apply_mastery_updates(current_mastery: Dict[str, float], graded_responses: List[dict]) -> Dict[str, float]:
    """
    Runs each response through the BKT update in order, per topic, so a
    student who gets progressively better on a topic within one sitting
    is reflected (not just the aggregate correct/total).
    """
    updated = dict(current_mastery)
    for r in graded_responses:
        topic = r["topic"]
        prior = updated.get(topic, 0.3)
        updated[topic] = update_mastery(prior, r["correct"])
    return updated


def status_emoji(mastery_pct: float) -> str:
    if mastery_pct >= 70:
        return "green"
    if mastery_pct >= 45:
        return "yellow"
    return "red"
