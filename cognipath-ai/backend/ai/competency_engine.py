"""
Competency Gap Engine.

Turns a flat list of graded responses into:
  - per-topic raw accuracy (correct/total) - easy to explain to a student
  - per-topic BKT mastery probability - what actually drives the roadmap

Both numbers are shown on the dashboard because they answer different
questions: raw accuracy is "how did you do on this quiz", mastery is
"how confident are we that you actually know this, accounting for
guessing and slips".
"""
from collections import defaultdict
from typing import Dict, List

from ai.bkt import update_mastery


def grade_responses(questions: List[dict], answers: Dict[int, int]) -> List[dict]:
    """
    answers: {question_index: selected_option_index}
    Returns per-question grading with topic + bloom_level preserved for
    downstream aggregation.
    """
    graded = []
    for i, q in enumerate(questions):
        selected = answers.get(i)
        correct = selected is not None and selected == q["correct_index"]
        graded.append({
            "question": q["question"],
            "topic": q["topic"],
            "bloom_level": q.get("bloom_level", "understand"),
            "selected_index": selected,
            "correct_index": q["correct_index"],
            "correct": correct,
        })
    return graded


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
