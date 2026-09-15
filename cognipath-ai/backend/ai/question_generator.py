"""
RAG-based diagnostic question generation.

Given retrieved chunks for a topic, ask a Gemini LLM to produce structured,
topic-tagged questions spanning Bloom's Taxonomy levels.

Supports two question types:
  - MCQ: multiple-choice with 4 options
  - short_answer: open-ended question with a reference answer
"""

import json
import os
import sys
import time
from typing import List

from openai import OpenAI


MODEL = os.getenv("COGNIPATH_LLM_MODEL", "gemini-2.5-flash")
print(f"[question_generator] MODEL={MODEL}", file=sys.stderr, flush=True)

GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 1.5

_client = None


def _get_client():
    global _client

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("[question_generator] No GEMINI_API_KEY found -> fallback mode", file=sys.stderr, flush=True)
        return None

    if _client is None:
        print(f"[question_generator] Creating client: key={api_key[:10]}... base_url={GEMINI_BASE_URL}", file=sys.stderr, flush=True)
        _client = OpenAI(api_key=api_key, base_url=GEMINI_BASE_URL)

    return _client


BLOOM_LEVELS = [
    "remember",
    "understand",
    "apply",
    "analyze",
    "evaluate",
]


SYSTEM_PROMPT = """You are an assessment designer for an adaptive learning platform.

Given source material on ONE topic, write diagnostic questions that reveal what
the student actually understands, not just whether they memorized a definition.

You MUST generate BOTH question types:
1. MCQ (multiple-choice) questions — exactly 4 options each.
2. Short-answer (Q&A) questions — open-ended with a concise reference answer.

Return ONLY valid JSON matching this schema:

{"questions": [
    {
        "type": "mcq",
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "correct_index": 0,
        "bloom_level": "remember|understand|apply|analyze|evaluate",
        "topic": "string"
    },
    {
        "type": "short_answer",
        "question": "string",
        "answer": "A concise reference answer (1-3 sentences)",
        "bloom_level": "remember|understand|apply|analyze|evaluate",
        "topic": "string"
    }
]}

Rules:
- Return exactly the requested number of questions total.
- Mix of MCQ and short-answer: roughly 60% MCQ and 40% short-answer.
- Every MCQ must have exactly 4 options.
- correct_index must be 0, 1, 2, or 3.
- Every short_answer must have a clear, accurate reference answer.
- Use different Bloom's Taxonomy levels when possible.
- Questions must be relevant to the provided topic and source material.
- Do not add markdown, code fences, or explanations outside the JSON.
"""


def generate_questions(
    topic: str,
    context_chunks: List[str],
    num_questions: int = 4
) -> List[dict]:

    client = _get_client()

    if client is None:
        return _fallback_questions(topic, num_questions)

    context = "\n\n---\n\n".join(context_chunks)

    if not context:
        context = (
            f"(No extracted material found for {topic}; "
            f"write general questions about the topic.)"
        )

    user_prompt = (
        f"Topic: {topic}\n"
        f"Number of questions: {num_questions}\n\n"
        f"Generate a mix of MCQ and short-answer questions.\n"
        f"Spread the questions across different Bloom levels.\n\n"
        f"Source material:\n{context}"
    )

    # Retry loop: attempt up to MAX_RETRIES times before falling back
    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(
                f"[question_generator] Attempt {attempt}/{MAX_RETRIES} for topic '{topic}'",
                file=sys.stderr, flush=True,
            )

            response = client.chat.completions.create(
                model=MODEL,
                temperature=0.3,
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT,
                    },
                    {
                        "role": "user",
                        "content": user_prompt,
                    },
                ],
            )

            raw_text = response.choices[0].message.content

            questions = _parse_and_validate(raw_text, topic)

            if questions:
                print(
                    f"[question_generator] ✅ Got {len(questions)} valid questions "
                    f"for '{topic}' on attempt {attempt}",
                    file=sys.stderr, flush=True,
                )
                return questions

            print(
                f"[question_generator] ⚠️  Attempt {attempt}: parsed 0 valid questions, "
                f"raw response length={len(raw_text or '')}",
                file=sys.stderr, flush=True,
            )

        except Exception as e:
            last_error = e
            print(
                f"[question_generator] ⚠️  Attempt {attempt} ERROR for topic '{topic}': "
                f"{type(e).__name__}: {e}",
                file=sys.stderr, flush=True,
            )

        # Wait before retrying (but not after the last attempt)
        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY_SECONDS)

    print(
        f"[question_generator] ❌ All {MAX_RETRIES} attempts failed for '{topic}', "
        f"using fallback. Last error: {last_error}",
        file=sys.stderr, flush=True,
    )
    return _fallback_questions(topic, num_questions)


def _parse_and_validate(
    raw_text: str,
    topic: str
) -> List[dict]:

    if not raw_text:
        return []

    # Strip markdown code fences if the LLM wraps its JSON in them
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        # Remove opening fence (e.g. ```json)
        first_newline = cleaned.index("\n") if "\n" in cleaned else len(cleaned)
        cleaned = cleaned[first_newline + 1:]
        # Remove closing fence
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

    try:
        data = json.loads(cleaned)

        if isinstance(data, dict):
            data = data.get("questions", [])

        if not isinstance(data, list):
            return []

    except (json.JSONDecodeError, TypeError):
        return []

    valid = []

    for item in data:

        if not isinstance(item, dict):
            continue

        q_type = item.get("type", "mcq").lower().strip()

        if q_type == "mcq":
            validated = _validate_mcq(item, topic)
            if validated:
                valid.append(validated)

        elif q_type in ("short_answer", "short-answer", "qa", "q&a", "question_answer"):
            validated = _validate_short_answer(item, topic)
            if validated:
                valid.append(validated)

        else:
            # Try to infer type from fields present
            if "options" in item and "correct_index" in item:
                validated = _validate_mcq(item, topic)
                if validated:
                    valid.append(validated)
            elif "answer" in item:
                validated = _validate_short_answer(item, topic)
                if validated:
                    valid.append(validated)

    return valid


def _validate_mcq(item: dict, topic: str) -> dict | None:
    """Validate and normalize an MCQ question dict."""

    if not all(
        key in item
        for key in (
            "question",
            "options",
            "correct_index",
        )
    ):
        return None

    if not isinstance(item["question"], str) or not item["question"].strip():
        return None

    if not isinstance(item["options"], list):
        return None

    options = [opt for opt in item["options"] if isinstance(opt, str) and opt.strip()]

    if len(options) < 2:
        return None

    # Pad to 4 options if the LLM returned fewer
    while len(options) < 4:
        options.append(f"Option {chr(64 + len(options) + 1)}")

    # Trim to 4 options if the LLM returned more
    options = options[:4]

    correct_index = item["correct_index"]
    if not isinstance(correct_index, int):
        # Try to coerce string to int
        try:
            correct_index = int(correct_index)
        except (ValueError, TypeError):
            return None

    # Clamp correct_index to valid range
    if correct_index not in range(len(options)):
        correct_index = 0

    bloom_level = item.get("bloom_level", "understand")
    if bloom_level not in BLOOM_LEVELS:
        bloom_level = "understand"

    return {
        "type": "mcq",
        "question": item["question"].strip(),
        "options": [opt.strip() for opt in options],
        "correct_index": correct_index,
        "bloom_level": bloom_level,
        "topic": item.get("topic", topic) or topic,
    }


def _validate_short_answer(item: dict, topic: str) -> dict | None:
    """Validate and normalize a short-answer question dict."""

    if "question" not in item or "answer" not in item:
        return None

    if not isinstance(item["question"], str) or not item["question"].strip():
        return None

    if not isinstance(item["answer"], str) or not item["answer"].strip():
        return None

    bloom_level = item.get("bloom_level", "understand")
    if bloom_level not in BLOOM_LEVELS:
        bloom_level = "understand"

    return {
        "type": "short_answer",
        "question": item["question"].strip(),
        "answer": item["answer"].strip(),
        "bloom_level": bloom_level,
        "topic": item.get("topic", topic) or topic,
    }


def _fallback_questions(
    topic: str,
    num_questions: int
) -> List[dict]:

    questions = []
    num_mcq = max(1, int(num_questions * 0.6))
    num_qa = num_questions - num_mcq

    # Generate MCQ fallbacks
    for i in range(num_mcq):
        questions.append({
            "type": "mcq",
            "question": (
                f"[Sample] Which of the following best describes "
                f"a key concept in {topic}? (Question {i + 1})"
            ),
            "options": [
                f"{topic} concept definition A",
                f"{topic} concept definition B",
                f"{topic} concept definition C",
                f"{topic} concept definition D",
            ],
            "correct_index": 0,
            "bloom_level": BLOOM_LEVELS[
                i % len(BLOOM_LEVELS)
            ],
            "topic": topic,
        })

    # Generate short-answer fallbacks
    for i in range(num_qa):
        questions.append({
            "type": "short_answer",
            "question": (
                f"[Sample] Explain a fundamental concept of {topic} "
                f"in your own words. (Question {i + 1})"
            ),
            "answer": (
                f"A correct answer would describe the core principles "
                f"and key ideas of {topic}."
            ),
            "bloom_level": BLOOM_LEVELS[
                (num_mcq + i) % len(BLOOM_LEVELS)
            ],
            "topic": topic,
        })

    return questions


def grade_short_answer(
    question: str,
    reference_answer: str,
    student_answer: str,
    topic: str,
) -> dict:
    """
    Use the LLM to grade a student's short-answer response against
    the reference answer. Returns {"correct": bool, "score": float,
    "feedback": str}.
    """
    client = _get_client()

    if client is None or not student_answer or not student_answer.strip():
        return {
            "correct": False,
            "score": 0.0,
            "feedback": "No answer provided." if not (student_answer and student_answer.strip()) else "LLM unavailable; cannot grade.",
        }

    grading_prompt = f"""You are grading a student's answer. Be fair but accurate.

Topic: {topic}
Question: {question}
Reference Answer: {reference_answer}
Student's Answer: {student_answer}

Evaluate the student's answer and return ONLY valid JSON:
{{
    "correct": true or false,
    "score": 0.0 to 1.0 (partial credit allowed),
    "feedback": "Brief explanation of what was right/wrong (1-2 sentences)"
}}

Grading rules:
- "correct" = true if the student demonstrates understanding of the core concept (score >= 0.5).
- Give partial credit for partially correct answers.
- Be lenient with phrasing differences but strict on factual accuracy.
- Do not add markdown or extra text."""

    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                temperature=0.1,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a fair, accurate grader. Return only valid JSON."},
                    {"role": "user", "content": grading_prompt},
                ],
            )

            raw = response.choices[0].message.content
            result = json.loads(raw)

            score = float(result.get("score", 0.0))
            score = max(0.0, min(1.0, score))

            return {
                "correct": bool(result.get("correct", score >= 0.5)),
                "score": score,
                "feedback": str(result.get("feedback", "")),
            }

        except Exception as e:
            print(
                f"[question_generator] grade_short_answer attempt {attempt+1} failed: "
                f"{type(e).__name__}: {e}",
                file=sys.stderr, flush=True,
            )
            if attempt == 0:
                time.sleep(1)

    # If grading fails, do simple keyword matching as last resort
    return _keyword_grade(reference_answer, student_answer)


def _keyword_grade(reference: str, student: str) -> dict:
    """Simple keyword overlap grading as a fallback."""
    ref_words = set(reference.lower().split())
    student_words = set(student.lower().split())

    # Remove common stop words
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "it", "of", "in",
                  "to", "for", "and", "or", "on", "at", "by", "with", "that", "this"}
    ref_keywords = ref_words - stop_words
    student_keywords = student_words - stop_words

    if not ref_keywords:
        return {"correct": False, "score": 0.0, "feedback": "Could not evaluate."}

    overlap = len(ref_keywords & student_keywords)
    score = min(1.0, overlap / max(len(ref_keywords) * 0.5, 1))

    return {
        "correct": score >= 0.5,
        "score": round(score, 2),
        "feedback": (
            f"Keyword match: {overlap}/{len(ref_keywords)} key terms found. "
            f"(Automated fallback grading)"
        ),
    }