"""
Prerequisite Intelligence module.

For the hackathon demo this graph is hand-curated for the Machine Learning
domain (be upfront about that to judges - auto-extracting prerequisite
structure from arbitrary course material is a v2 problem, not an MVP one).
The same data shape works for any subject: add a new dict entry and the
gap-detection algorithm below needs no changes.

Graph shape: { topic: [list of direct prerequisites] }
"""
from typing import Dict, List

PREREQUISITE_GRAPH: Dict[str, List[str]] = {
    "Probability": [],
    "Statistics": ["Probability"],
    "Linear Algebra": [],
    "Python": [],
    "Calculus": [],
    "Linear Regression": ["Statistics", "Linear Algebra"],
    "Logistic Regression": ["Linear Regression"],
    "Classification": ["Logistic Regression"],
    "Model Evaluation": ["Classification"],
    "Decision Trees": ["Classification"],
    "Clustering": ["Statistics", "Linear Algebra"],
    "Neural Networks": ["Linear Algebra", "Calculus", "Model Evaluation"],
    "Deep Learning": ["Neural Networks"],
    "Transformers": ["Deep Learning"],
}

KNOWN_TOPICS = list(PREREQUISITE_GRAPH.keys())

MASTERY_THRESHOLD = 0.65  # below this, a topic counts as "weak" for gap analysis


def get_prerequisites(topic: str) -> List[str]:
    return PREREQUISITE_GRAPH.get(topic, [])


def find_weakest_prerequisite(topic: str, mastery: Dict[str, float], _visited=None) -> str:
    """
    Walk up the prerequisite chain from `topic` and return the single
    weakest ancestor that is below MASTERY_THRESHOLD. If every prerequisite
    is solid, the topic itself is returned (nothing blocking it).

    This is intentionally simple (DFS + min mastery) rather than a full
    topological scheduler - it's the piece you can defend on a whiteboard
    in a 2-minute judge Q&A.
    """
    _visited = _visited or set()
    if topic in _visited:
        return topic
    _visited.add(topic)

    weakest_topic, weakest_score = topic, mastery.get(topic, 0.3)

    for prereq in get_prerequisites(topic):
        prereq_mastery = mastery.get(prereq, 0.3)
        if prereq_mastery < MASTERY_THRESHOLD:
            candidate = find_weakest_prerequisite(prereq, mastery, _visited)
            candidate_score = mastery.get(candidate, 0.3)
            if candidate_score < weakest_score:
                weakest_topic, weakest_score = candidate, candidate_score

    return weakest_topic


def detect_gaps(mastery: Dict[str, float]) -> List[dict]:
    """
    For every topic the student has been assessed on, find the true
    root-cause topic to study next (which may be a prerequisite the
    student never explicitly took a quiz on, but the graph implies
    they need).

    Returns a list ordered by urgency (lowest mastery first), each item:
      { topic, mastery_pct, blocking_prerequisite, blocking_mastery_pct }
    """
    gaps = []
    for topic, score in mastery.items():
        if score >= MASTERY_THRESHOLD:
            continue
        root_cause = find_weakest_prerequisite(topic, mastery)
        gaps.append({
            "topic": topic,
            "mastery_pct": round(score * 100, 1),
            "blocking_prerequisite": root_cause,
            "blocking_mastery_pct": round(mastery.get(root_cause, 0.3) * 100, 1),
        })

    gaps.sort(key=lambda g: g["blocking_mastery_pct"])
    return gaps
