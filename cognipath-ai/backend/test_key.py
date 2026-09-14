import os
import re
import urllib.request
import urllib.error
import json

env_path = os.path.join(os.path.dirname(__file__), ".env")

if not os.path.exists(env_path):
    print(f"ERROR: .env not found at {env_path}")
    exit(1)

key = None
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if line.startswith("GEMINI_API_KEY"):
            _, _, value = line.partition("=")
            key = value.strip()
            break

if not key:
    print("ERROR: GEMINI_API_KEY not found in .env")
    exit(1)

print(f"Raw value found in .env: {key!r}")
print(f"Length: {len(key)}")

cleaned = key.strip('"').strip("'").strip()
print(f"After stripping quotes/whitespace: {cleaned!r}")
print(f"Length after cleaning: {len(cleaned)}")

allowed = re.compile(r'^[A-Za-z0-9_\-\.]+$')
if not allowed.match(cleaned):
    bad_chars = set(c for c in cleaned if not allowed.match(c))
    print(f"WARNING: key contains unexpected characters: {bad_chars}")

print("\n--- Testing against Google API ---")

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={cleaned}"

try:
    with urllib.request.urlopen(url, timeout=15) as response:
        data = json.loads(response.read().decode())
        print("SUCCESS! Key is valid.")
        print(f"Number of models available: {len(data.get('models', []))}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"FAILED with HTTP {e.code}")
    print(body)
except Exception as e:
    print(f"FAILED with error: {type(e).__name__}: {e}")