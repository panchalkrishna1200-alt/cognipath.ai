"""
RAG-based diagnostic question generation.

Given retrieved chunks for a topic, ask a Gemini LLM to produce structured,
topic-tagged questions spanning Bloom's Taxonomy levels.
"""

import json
import os
import sys
from typing import List

from openai import OpenAI


MODEL = os.getenv("COGNIPATH_LLM_MODEL", "gemini-2.5-flash")
print(f"[question_generator] MODEL={MODEL}", file=sys.stderr, flush=True)

GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

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

Return ONLY valid JSON matching this schema:

{"questions": [
    {
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "correct_index": 0,
        "bloom_level": "remember|understand|apply|analyze|evaluate",
        "topic": "string"
    }
]}

Rules:
- Return exactly the requested number of questions.
- Every question must have exactly 4 options.
- correct_index must be 0, 1, 2, or 3.
- Use different Bloom's Taxonomy levels when possible.
- Questions must be relevant to the provided topic.
- Do not add markdown or explanations.
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
        f"Spread the questions across different Bloom levels.\n\n"
        f"Source material:\n{context}"
    )

    try:
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
            return questions

    except Exception as e:
        print(f"[question_generator] ERROR for topic '{topic}': {type(e).__name__}: {e}", file=sys.stderr, flush=True)

    return _fallback_questions(topic, num_questions)


def _parse_and_validate(
    raw_text: str,
    topic: str
) -> List[dict]:

    try:
        data = json.loads(raw_text)

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

        if not all(
            key in item
            for key in (
                "question",
                "options",
                "correct_index",
            )
        ):
            continue

        if not isinstance(item["question"], str):
            continue

        if not isinstance(item["options"], list):
            continue

        if len(item["options"]) != 4:
            continue

        if not isinstance(item["correct_index"], int):
            continue

        if item["correct_index"] not in range(4):
            continue

        bloom_level = item.get(
            "bloom_level",
            "understand"
        )

        if bloom_level not in BLOOM_LEVELS:
            bloom_level = "understand"

        valid.append(
            {
                "question": item["question"],
                "options": item["options"],
                "correct_index": item["correct_index"],
                "bloom_level": bloom_level,
                "topic": topic,
            }
        )

    return valid


def _fallback_questions(
    topic: str,
    num_questions: int
) -> List[dict]:

    template = {
        "options": [
            "Definition A",
            "Definition B",
            "Definition C",
            "Definition D",
        ],
        "correct_index": 0,
    }

    return [
        {
            **template,
            "question": (
                f"[Sample] {topic} - "
                f"conceptual question {i + 1}"
            ),
            "bloom_level": BLOOM_LEVELS[
                i % len(BLOOM_LEVELS)
            ],
            "topic": topic,
        }
        for i in range(num_questions)
    ]