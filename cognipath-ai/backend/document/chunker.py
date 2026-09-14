"""
Semantic chunking.

Strategy for the MVP (good enough for lecture notes / textbook PDFs,
cheap enough to run without an extra model call per document):

1. Split on headings/likely section breaks (short lines, title-case lines,
   numbered sections) to get topic-coherent blocks.
2. Within an oversized block, fall back to a sliding window over sentences
   so no chunk exceeds `max_chars`, with overlap so context isn't lost at
   the boundary.

Each chunk keeps a `heading` field, which downstream (question_generator,
competency_engine) uses as the first-pass topic label before a cleanup
pass against the domain's known topic list.
"""
import re
from dataclasses import dataclass, field
from typing import List


@dataclass
class Chunk:
    text: str
    heading: str
    index: int
    metadata: dict = field(default_factory=dict)


HEADING_PATTERN = re.compile(
    r"^(chapter\s+\d+|unit\s+\d+|\d+(\.\d+)*\s+[A-Z]|[A-Z][A-Za-z0-9 \-]{2,60})$"
)


def _looks_like_heading(line: str) -> bool:
    line = line.strip()
    if not (3 <= len(line) <= 70):
        return False
    if line.endswith((".", ",", ";")):
        return False
    return bool(HEADING_PATTERN.match(line))


def _split_into_sections(text: str):
    lines = text.split("\n")
    sections = []
    current_heading = "General"
    current_lines: List[str] = []

    for line in lines:
        if _looks_like_heading(line):
            if current_lines:
                sections.append((current_heading, "\n".join(current_lines).strip()))
            current_heading = line.strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_lines:
        sections.append((current_heading, "\n".join(current_lines).strip()))

    return [(h, body) for h, body in sections if body]


def _sliding_window(text: str, max_chars: int, overlap: int) -> List[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text)
    windows, current = [], ""
    for sent in sentences:
        if len(current) + len(sent) + 1 <= max_chars:
            current = f"{current} {sent}".strip()
        else:
            if current:
                windows.append(current)
            # start new window with overlap from the tail of the last one
            tail = current[-overlap:] if overlap and current else ""
            current = f"{tail} {sent}".strip()
    if current:
        windows.append(current)
    return windows


def chunk_document(text: str, max_chars: int = 1200, overlap: int = 150) -> List[Chunk]:
    sections = _split_into_sections(text)
    chunks: List[Chunk] = []
    idx = 0
    for heading, body in sections:
        if len(body) <= max_chars:
            chunks.append(Chunk(text=body, heading=heading, index=idx))
            idx += 1
        else:
            for window in _sliding_window(body, max_chars, overlap):
                chunks.append(Chunk(text=window, heading=heading, index=idx))
                idx += 1
    return chunks
