"""Quick test of the assessment endpoint."""
import urllib.request, urllib.error, json

url = "http://127.0.0.1:8000/api/assessment/generate"
payload = json.dumps({
    "student_id": 1,
    "document_id": 1,
    "questions_per_topic": 2,
    "kind": "diagnostic"
}).encode()
req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
        print("Assessment ID:", data["assessment_id"])
        print("Questions count:", len(data["questions"]))
        print()
        for i, q in enumerate(data["questions"][:4]):
            topic = q.get("topic", "?")
            bloom = q.get("bloom_level", "?")
            print(f"  Q{i+1} [{topic} | {bloom}]:")
            print(f"    {q['question'][:100]}")
            for j, opt in enumerate(q["options"]):
                print(f"      {chr(65+j)}) {opt[:70]}")
            print()
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"HTTP {e.code}: {body}")
except Exception as e:
    print(f"Error: {e}")
