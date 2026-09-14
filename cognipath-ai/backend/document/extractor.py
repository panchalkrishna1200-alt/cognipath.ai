"""
Document -> raw text extraction.

Supports PDF (via PyMuPDF) and plain text / markdown notes. PPTX support
can be added the same way using python-pptx if needed later.
"""
import os
import fitz  # PyMuPDF


def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return _extract_pdf(file_path)
    elif ext in (".txt", ".md"):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def _extract_pdf(file_path: str) -> str:
    text_parts = []
    with fitz.open(file_path) as doc:
        for page in doc:
            text_parts.append(page.get_text("text"))
    raw = "\n".join(text_parts)
    return _clean(raw)


def _clean(text: str) -> str:
    # Collapse excessive whitespace/newlines left behind by PDF extraction,
    # strip page-number-only lines, de-hyphenate line-wrapped words.
    lines = [ln.strip() for ln in text.splitlines()]
    lines = [ln for ln in lines if ln and not ln.isdigit()]
    joined = "\n".join(lines)
    joined = joined.replace("-\n", "")
    return joined
