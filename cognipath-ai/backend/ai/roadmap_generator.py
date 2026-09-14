"""
Adaptive Roadmap Generator.

Takes the ordered gap list from prerequisite_graph.detect_gaps() and turns
it into a week-by-week plan. The ordering logic (fix the weakest blocking
prerequisite before its dependents) is what makes this "adaptive" rather
than a static syllabus - regenerating after a reassessment reshuffles the
weeks because the mastery numbers changed.
"""
from typing import Dict, List

from ai.prerequisite_graph import detect_gaps

TOPIC_STUDY_ITEMS = {
    "Probability": ["Probability basics", "Random variables", "Common distributions", "Practice set"],
    "Statistics": ["Mean/variance/std-dev", "Hypothesis testing basics", "Correlation vs causation", "Practice set"],
    "Linear Algebra": ["Vectors & matrices", "Matrix multiplication", "Eigenvalues (intuition)", "Practice set"],
    "Linear Regression": ["Linear regression theory", "Cost function", "Gradient descent", "Worked example"],
    "Logistic Regression": ["Logistic regression theory", "Sigmoid & decision boundary", "Practice set"],
    "Classification": ["Classification overview", "Decision trees", "Practice set"],
    "Model Evaluation": ["Accuracy/precision/recall", "Confusion matrix", "Cross-validation", "Practice set"],
    "Decision Trees": ["Tree splitting criteria", "Overfitting & pruning", "Practice set"],
    "Clustering": ["K-means", "Choosing k", "Practice set"],
    "Neural Networks": ["Perceptron", "Backpropagation intuition", "Practice set"],
    "Deep Learning": ["CNN basics", "RNN basics", "Practice set"],
    "Transformers": ["Attention mechanism", "Transformer architecture", "Practice set"],
}


def generate_roadmap(mastery: Dict[str, float], weeks_available: int = 4) -> dict:
    gaps = detect_gaps(mastery)

    # Build the ordered list of *distinct* topics to actually study this
    # cycle: the blocking prerequisite first, then the originally weak
    # topic itself if it isn't already covered.
    study_order: List[str] = []
    for gap in gaps:
        for t in (gap["blocking_prerequisite"], gap["topic"]):
            if t not in study_order:
                study_order.append(t)

    if not study_order:
        return {
            "weeks": [],
            "gap_summary": [],
            "message": "No significant gaps detected - student is on track. "
                       "Recommend moving to the next subject module.",
        }

    weeks = []
    topics_per_week = max(1, -(-len(study_order) // weeks_available))  # ceil division
    for week_num in range(weeks_available):
        start = week_num * topics_per_week
        week_topics = study_order[start:start + topics_per_week]
        if not week_topics:
            break
        weeks.append({
            "week": week_num + 1,
            "topics": [
                {"topic": t, "items": TOPIC_STUDY_ITEMS.get(t, [f"{t} fundamentals", "Practice set"])}
                for t in week_topics
            ],
        })

    # Always end with an integrative mini-project if there's room
    if len(weeks) < weeks_available:
        weeks.append({
            "week": len(weeks) + 1,
            "topics": [{
                "topic": "Mini Project",
                "items": ["Build a small model using the topics above", "Evaluate it", "Explain your results"],
            }],
        })

    return {"weeks": weeks, "gap_summary": gaps, "message": None}
