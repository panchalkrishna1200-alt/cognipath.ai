"""
Debug script to diagnose MCQ generation issues.
Run from the backend/ directory:  python debug_mcq.py
"""
import os
import sys

# Load .env first
from dotenv import load_dotenv
load_dotenv()

print("=" * 60)
print("1. ENVIRONMENT CHECK")
print("=" * 60)

api_key = os.getenv("GEMINI_API_KEY")
model = os.getenv("COGNIPATH_LLM_MODEL", "gemini-2.0-flash")

print(f"   GEMINI_API_KEY present: {bool(api_key)}")
if api_key:
    print(f"   Key prefix: {api_key[:10]}...")
    print(f"   Key length: {len(api_key)}")
    if api_key.startswith("AIza"):
        print("   ✅ Key looks like a valid Gemini API key")
    elif api_key.startswith("gsk_"):
        print("   ❌ This is a GROQ key, not a Gemini key!")
    elif api_key == "PASTE_YOUR_GEMINI_API_KEY_HERE":
        print("   ❌ Placeholder — you haven't pasted your actual key!")
    else:
        print(f"   ⚠️  Unrecognized key format (expected AIza... for Gemini)")
else:
    print("   ❌ No API key found!")

print(f"   Model: {model}")

print()
print("=" * 60)
print("2. DIRECT API TEST (using urllib, no SDK)")
print("=" * 60)

import urllib.request
import urllib.error
import json

# Test 1: List models (verifies key works at all)
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
print(f"   Testing key against Google API...")

try:
    with urllib.request.urlopen(url, timeout=15) as response:
        data = json.loads(response.read().decode())
        model_names = [m.get("name", "") for m in data.get("models", [])]
        print(f"   ✅ Key is VALID! {len(model_names)} models available.")
        # Check if our target model exists
        target = f"models/{model}"
        if target in model_names:
            print(f"   ✅ Model '{model}' is available")
        else:
            print(f"   ⚠️  Model '{model}' not found in available models")
            # Show similar models
            flash_models = [m for m in model_names if "flash" in m.lower() or "gemini" in m.lower()]
            print(f"   Available Gemini models: {flash_models[:8]}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"   ❌ FAILED with HTTP {e.code}")
    print(f"   Response: {body[:500]}")
except Exception as e:
    print(f"   ❌ FAILED: {type(e).__name__}: {e}")

print()
print("=" * 60)
print("3. OPENAI SDK TEST (same path as question_generator.py)")
print("=" * 60)

try:
    from openai import OpenAI

    GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
    client = OpenAI(api_key=api_key, base_url=GEMINI_BASE_URL)

    print(f"   Calling {model} via OpenAI SDK → Gemini endpoint...")

    response = client.chat.completions.create(
        model=model,
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a quiz generator. Return ONLY valid JSON matching: "
                    '{"questions": [{"question": "string", "options": ["A","B","C","D"], '
                    '"correct_index": 0, "bloom_level": "understand", "topic": "string"}]}'
                ),
            },
            {
                "role": "user",
                "content": (
                    "Topic: Statistics\n"
                    "Number of questions: 2\n\n"
                    "Source material:\n"
                    "Statistics is the discipline that concerns the collection, "
                    "organization, analysis, interpretation, and presentation of data. "
                    "Key concepts include mean, median, mode, standard deviation, "
                    "and hypothesis testing."
                ),
            },
        ],
    )

    raw_text = response.choices[0].message.content
    print(f"   ✅ Got response from LLM!")
    print(f"   Raw response (first 500 chars):")
    print(f"   {raw_text[:500]}")

    # Try parsing
    data = json.loads(raw_text)
    questions = data.get("questions", data) if isinstance(data, dict) else data
    print(f"\n   ✅ Parsed {len(questions)} questions successfully!")
    for i, q in enumerate(questions):
        print(f"   Q{i+1}: {q.get('question', 'NO QUESTION')[:80]}...")

except Exception as e:
    print(f"   ❌ FAILED: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print()
print("=" * 60)
print("DONE")
print("=" * 60)
