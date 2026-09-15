"""Quick test to see what the LLM actually returns for MCQ options."""
import os
import sys
import json

from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

api_key = os.getenv("GEMINI_API_KEY")
model = os.getenv("COGNIPATH_LLM_MODEL", "gemini-2.5-flash")

print(f"Model: {model}")
print(f"Key: {api_key[:12]}..." if api_key else "NO KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

try:
    response = client.chat.completions.create(
        model=model,
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    'Return ONLY valid JSON matching: '
                    '{"questions": [{"type": "mcq", "question": "string", '
                    '"options": ["A","B","C","D"], "correct_index": 0, '
                    '"bloom_level": "understand", "topic": "string"}]}'
                ),
            },
            {
                "role": "user",
                "content": (
                    "Topic: Statistics\n"
                    "Number of questions: 2\n\n"
                    "Source material:\n"
                    "Statistics is the discipline for data analysis. "
                    "Key concepts include mean, median, mode, standard deviation."
                ),
            },
        ],
    )

    raw = response.choices[0].message.content
    print("\n=== RAW LLM RESPONSE ===")
    print(raw)
    print("=== END RAW ===\n")

    data = json.loads(raw)
    qs = data.get("questions", [])
    print(f"Parsed {len(qs)} questions\n")

    for i, q in enumerate(qs):
        print(f"Q{i+1}:")
        print(f"  type         = {q.get('type')}")
        print(f"  question     = {q.get('question', '')[:80]}")
        print(f"  has 'options'= {'options' in q}")
        print(f"  options      = {q.get('options')}")
        print(f"  len(options) = {len(q['options']) if 'options' in q and isinstance(q.get('options'), list) else 'N/A'}")
        print(f"  correct_index= {q.get('correct_index')}")
        print(f"  bloom_level  = {q.get('bloom_level')}")
        print(f"  topic        = {q.get('topic')}")
        print()

except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
