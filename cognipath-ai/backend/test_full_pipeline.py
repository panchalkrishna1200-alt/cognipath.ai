"""Test the full question generation pipeline exactly as assessment.py calls it."""
import os
import sys
import json

from dotenv import load_dotenv
load_dotenv()

# Simulate importing the full pipeline
from ai.question_generator import generate_questions, _get_client, MODEL, SYSTEM_PROMPT

print(f"Model: {MODEL}")
print(f"Client: {_get_client()}")
print()

# Test with a simple topic and context
topic = "Statistics"
context_chunks = [
    "Statistics is the discipline that concerns the collection, "
    "organization, analysis, interpretation, and presentation of data.",
    "Key concepts include mean, median, mode, standard deviation, "
    "and hypothesis testing. The mean is the average of all values.",
]

print(f"Generating questions for topic: {topic}")
print(f"Context chunks: {len(context_chunks)}")
print()

questions = generate_questions(topic, context_chunks, num_questions=4)

print(f"\n=== GENERATED {len(questions)} QUESTIONS ===\n")

for i, q in enumerate(questions):
    print(f"Q{i+1}:")
    print(f"  type         = {q.get('type')}")
    print(f"  question     = {q.get('question', '')[:100]}")
    
    if q.get('type') == 'mcq':
        print(f"  has 'options'= {'options' in q}")
        opts = q.get('options', [])
        print(f"  options      = {opts}")
        print(f"  len(options) = {len(opts) if isinstance(opts, list) else 'N/A'}")
        print(f"  correct_index= {q.get('correct_index')}")
    elif q.get('type') == 'short_answer':
        print(f"  answer       = {q.get('answer', '')[:100]}")
    
    print(f"  bloom_level  = {q.get('bloom_level')}")
    print(f"  topic        = {q.get('topic')}")
    print()

# Now simulate the sanitization from assessment.py
print("=== SANITIZED (as sent to frontend) ===\n")

sanitized = []
for q in questions:
    clean = {k: v for k, v in q.items() if k not in ("correct_index", "answer")}
    sanitized.append(clean)

for i, q in enumerate(sanitized):
    print(f"Q{i+1} (sanitized):")
    print(f"  keys = {list(q.keys())}")
    if q.get('type') == 'mcq':
        print(f"  has 'options'= {'options' in q}")
        print(f"  options      = {q.get('options')}")
    print()

print(json.dumps({"questions": sanitized}, indent=2))
