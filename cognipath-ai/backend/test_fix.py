"""End-to-end test: simulate what happens when gemini-3.6-flash is rate-limited."""
import os
from dotenv import load_dotenv
load_dotenv()

from ai.question_generator import generate_questions, MODEL, FALLBACK_MODELS

print(f"Primary: {MODEL}")
print(f"Fallbacks: {FALLBACK_MODELS}")
print()

# Generate questions - primary model will likely be rate-limited,
# should fall back to gemini-3.5-flash or gemini-3.1-flash-lite
topic = "Clustering"
context = [
    "Clustering is an unsupervised learning technique that groups similar data points. "
    "Common algorithms include K-Means, DBSCAN, and hierarchical clustering. "
    "K-Means partitions data into K clusters by minimizing within-cluster variance."
]

print(f"Generating questions for: {topic}")
print("(if primary model is rate-limited, should auto-fallback)")
print()

qs = generate_questions(topic, context, 3)

print(f"\n{'='*60}")
print(f"RESULT: {len(qs)} questions generated")
print(f"{'='*60}\n")

for i, q in enumerate(qs):
    print(f"Q{i+1} [{q['type'].upper()}]: {q['question']}")
    if q['type'] == 'mcq' and q.get('options'):
        for j, opt in enumerate(q['options']):
            marker = " <-- correct" if j == q.get('correct_index') else ""
            print(f"   {chr(65+j)}) {opt}{marker}")
    elif q['type'] == 'short_answer':
        print(f"   Answer: {q.get('answer', 'N/A')[:100]}")
    print()

# Check if these are real or fallback
is_fallback = any("[Sample]" in q.get("question", "") or "concept definition" in str(q.get("options", "")) for q in qs)
if is_fallback:
    print("WARNING: Got FALLBACK questions (all models failed)")
else:
    print("SUCCESS: Got REAL AI-generated questions!")
