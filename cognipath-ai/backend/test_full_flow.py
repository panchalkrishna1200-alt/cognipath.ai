"""
End-to-end test: multi-PDF upload, MCQ+QA generation, and submission.
Run from backend/ directory:  python test_full_flow.py
"""
import urllib.request
import urllib.error
import json
import os
import sys

BASE = "http://127.0.0.1:8000"

def api_post(path, data):
    payload = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode())

def api_get(path):
    with urllib.request.urlopen(f"{BASE}{path}", timeout=30) as resp:
        return json.loads(resp.read().decode())


print("=" * 60)
print("STEP 1: Create a student")
print("=" * 60)

try:
    student = api_post("/api/students", {
        "name": "Test Student",
        "course": "CS",
        "semester": "3",
        "target_subject": "Machine Learning",
        "current_level": "Beginner",
        "learning_goal": "Learn ML basics",
    })
    student_id = student.get("student_id") or student.get("id")
    print(f"  ✓ Created student ID: {student_id}")
except Exception as e:
    print(f"  ✗ Failed: {e}")
    # Try using existing student
    student_id = 1
    print(f"  Using existing student ID: {student_id}")

print()
print("=" * 60)
print("STEP 2: Upload a test document (single file)")
print("=" * 60)

# Create a small test text file
test_file = os.path.join("data", "test_upload.txt")
os.makedirs("data", exist_ok=True)
with open(test_file, "w", encoding="utf-8") as f:
    f.write("""
Linear Regression
Linear regression is a statistical method for modeling the relationship between
a dependent variable and one or more independent variables. The simplest form is
y = mx + b where m is the slope and b is the intercept. The method minimizes
the sum of squared residuals (least squares). Key assumptions include linearity,
independence, homoscedasticity, and normality of residuals.

Logistic Regression
Logistic regression is used for binary classification problems. Unlike linear
regression, it uses a sigmoid function to map outputs to probabilities between
0 and 1. The decision boundary is where the predicted probability equals 0.5.
Maximum likelihood estimation is used to find the optimal parameters.
""")

# Upload using multipart form
import http.client
import mimetypes

def upload_file(filepath, student_id, subject="Machine Learning"):
    """Upload a file using raw HTTP multipart/form-data."""
    boundary = "----TestBoundary12345"
    filename = os.path.basename(filepath)
    
    with open(filepath, "rb") as f:
        file_data = f.read()
    
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="student_id"\r\n\r\n'
        f"{student_id}\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="subject"\r\n\r\n'
        f"{subject}\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: text/plain\r\n\r\n"
    ).encode() + file_data + f"\r\n--{boundary}--\r\n".encode()
    
    req = urllib.request.Request(
        f"{BASE}/api/upload",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())

try:
    doc1 = upload_file(test_file, student_id)
    doc1_id = doc1["document_id"]
    print(f"  ✓ Uploaded doc1 ID: {doc1_id}")
    print(f"    Filename: {doc1['filename']}")
    print(f"    Chunks: {doc1['chunk_count']}")
    print(f"    Topics: {doc1['topics_detected']}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"  ✗ HTTP {e.code}: {body}")
    doc1_id = None
except Exception as e:
    print(f"  ✗ Failed: {e}")
    doc1_id = None

print()
print("=" * 60)
print("STEP 3: Upload a second document")
print("=" * 60)

test_file2 = os.path.join("data", "test_upload2.txt")
with open(test_file2, "w", encoding="utf-8") as f:
    f.write("""
Decision Trees
A decision tree is a supervised learning algorithm used for classification and
regression. It splits data based on feature values to create a tree structure.
Key concepts include information gain, Gini impurity, and pruning. Overfitting
can be controlled through max depth and minimum samples per leaf.

Neural Networks
Neural networks are computational models inspired by the human brain. They
consist of layers of neurons (input, hidden, output). Each connection has a
weight, and neurons apply an activation function. Backpropagation is used to
train the network by adjusting weights to minimize the loss function.
Common activation functions include ReLU, sigmoid, and tanh.
""")

try:
    doc2 = upload_file(test_file2, student_id)
    doc2_id = doc2["document_id"]
    print(f"  ✓ Uploaded doc2 ID: {doc2_id}")
    print(f"    Filename: {doc2['filename']}")
    print(f"    Chunks: {doc2['chunk_count']}")
    print(f"    Topics: {doc2['topics_detected']}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"  ✗ HTTP {e.code}: {body}")
    doc2_id = None
except Exception as e:
    print(f"  ✗ Failed: {e}")
    doc2_id = None

print()
print("=" * 60)
print("STEP 4: List all documents for the student")
print("=" * 60)

try:
    docs = api_get(f"/api/upload/documents/{student_id}")
    print(f"  ✓ Total documents: {docs['total']}")
    for d in docs["documents"]:
        print(f"    - ID={d['document_id']} | {d['filename']} | {d['chunk_count']} chunks | topics={d['topics_detected']}")
except Exception as e:
    print(f"  ✗ Failed: {e}")

print()
print("=" * 60)
print("STEP 5: Generate assessment from MULTIPLE documents")
print("=" * 60)

doc_ids = [d for d in [doc1_id, doc2_id] if d is not None]
if not doc_ids:
    print("  ✗ No documents uploaded, skipping assessment")
    sys.exit(1)

try:
    assessment = api_post("/api/assessment/generate", {
        "student_id": student_id,
        "document_ids": doc_ids,
        "questions_per_topic": 3,
        "kind": "diagnostic",
    })
    assessment_id = assessment["assessment_id"]
    questions = assessment["questions"]
    
    print(f"  ✓ Assessment ID: {assessment_id}")
    print(f"    Total questions: {len(questions)}")
    print(f"    Document IDs used: {assessment.get('document_ids', 'N/A')}")
    print(f"    Topics: {assessment.get('topics', 'N/A')}")
    print()
    
    mcq_count = sum(1 for q in questions if q.get("type", "mcq") == "mcq")
    qa_count = sum(1 for q in questions if q.get("type") == "short_answer")
    print(f"    MCQ questions: {mcq_count}")
    print(f"    Q&A questions: {qa_count}")
    print()
    
    for i, q in enumerate(questions[:6]):
        q_type = q.get("type", "mcq")
        badge = "[MCQ]" if q_type == "mcq" else "[Q&A]"
        print(f"  Q{i+1} {badge} [{q.get('topic','?')} | {q.get('bloom_level','?')}]:")
        print(f"    {q['question'][:120]}")
        if q_type == "mcq" and "options" in q:
            for j, opt in enumerate(q["options"]):
                print(f"      {chr(65+j)}) {opt[:80]}")
        print()

except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"  ✗ HTTP {e.code}: {body}")
    sys.exit(1)
except Exception as e:
    print(f"  ✗ Failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print()
print("=" * 60)
print("STEP 6: Submit answers (auto-answer)")
print("=" * 60)

try:
    answers = {}
    for i, q in enumerate(questions):
        q_type = q.get("type", "mcq")
        if q_type == "mcq":
            answers[i] = 0  # Just pick first option
        elif q_type == "short_answer":
            answers[i] = "This concept involves key principles and mathematical foundations that are fundamental to the topic."
    
    result = api_post("/api/assessment/submit", {
        "assessment_id": assessment_id,
        "answers": answers,
    })
    
    print(f"  ✓ Score: {result['score']}/{result['total']}")
    print(f"    Topic breakdown:")
    for topic, stats in result["topic_breakdown"].items():
        mastery = result["updated_mastery"].get(topic, "?")
        print(f"      {topic}: {stats['correct']}/{stats['total']} correct | mastery {mastery}%")
    
    if result.get("qa_feedback"):
        print(f"\n    Q&A Feedback ({len(result['qa_feedback'])} items):")
        for fb in result["qa_feedback"]:
            status = "✓" if fb["correct"] else "✗"
            print(f"      {status} [{fb['topic']}] Score: {fb.get('score', 0)*100:.0f}%")
            print(f"        Q: {fb['question'][:80]}...")
            print(f"        Feedback: {fb.get('feedback', 'N/A')[:100]}")
    
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"  ✗ HTTP {e.code}: {body}")
except Exception as e:
    print(f"  ✗ Failed: {e}")
    import traceback
    traceback.print_exc()

print()
print("=" * 60)
print("ALL TESTS COMPLETE")
print("=" * 60)
