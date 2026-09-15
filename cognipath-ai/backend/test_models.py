"""Test which fallback models work for MCQ generation."""
import os
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

api_key = os.getenv("GEMINI_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

models_to_test = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-3.8-flash",
    "gemini-3.7-flash",
]

for model in models_to_test:
    try:
        response = client.chat.completions.create(
            model=model,
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": 'Return JSON: {"questions": [{"type":"mcq","question":"What is 2+2?","options":["3","4","5","6"],"correct_index":1}]}'},
                {"role": "user", "content": "Generate 1 MCQ about math"},
            ],
        )
        raw = response.choices[0].message.content
        print(f"  {model}: OK -> {raw[:80]}")
    except Exception as e:
        err = str(e)[:100]
        print(f"  {model}: FAIL -> {err}")
