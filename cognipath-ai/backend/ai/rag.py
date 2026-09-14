"""
RAG layer: turns chunks into embeddings, stores them in ChromaDB per
document, and retrieves the most relevant chunks for a topic when the
question generator needs source material.

Falls back to a lightweight hashing embedding if sentence-transformers
isn't installed/downloaded yet, so the rest of the pipeline (and a live
demo on a machine with no internet) never hard-fails on this step.
"""
import hashlib
import os
from typing import List

import chromadb
import numpy as np

from document.chunker import Chunk
from ai.prerequisite_graph import KNOWN_TOPICS

CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")
_client = chromadb.PersistentClient(path=CHROMA_PATH)

_embedder = None


def _get_embedder():
    global _embedder
    if _embedder is not None:
        return _embedder
    try:
        from sentence_transformers import SentenceTransformer
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
    except Exception:
        _embedder = "fallback"
    return _embedder


def embed_texts(texts: List[str]) -> List[List[float]]:
    model = _get_embedder()
    if model == "fallback":
        return [_hash_embedding(t) for t in texts]
    return model.encode(texts, show_progress_bar=False).tolist()


def _hash_embedding(text: str, dim: int = 384) -> List[float]:
    """Deterministic bag-of-hashed-tokens embedding. Not semantically rich,
    but keeps the pipeline runnable offline / without model downloads."""
    vec = np.zeros(dim)
    for token in text.lower().split():
        h = int(hashlib.md5(token.encode()).hexdigest(), 16)
        vec[h % dim] += 1.0
    norm = np.linalg.norm(vec)
    return (vec / norm if norm > 0 else vec).tolist()


def normalize_topic(heading: str, subject_topics: List[str] = None) -> str:
    """Map a free-text heading to the closest known domain topic so the
    competency engine and prerequisite graph work with a consistent label
    set instead of every document inventing its own topic names."""
    candidates = subject_topics or KNOWN_TOPICS
    heading_lower = heading.lower()
    for topic in candidates:
        if topic.lower() in heading_lower or heading_lower in topic.lower():
            return topic
    # crude keyword overlap fallback
    best, best_score = "General", 0
    heading_words = set(heading_lower.split())
    for topic in candidates:
        score = len(heading_words & set(topic.lower().split()))
        if score > best_score:
            best, best_score = topic, score
    return best


def store_document_chunks(document_id: int, chunks: List[Chunk]) -> List[str]:
    collection = _client.get_or_create_collection(name=f"doc_{document_id}")
    embeddings = embed_texts([c.text for c in chunks])
    topics = [normalize_topic(c.heading) for c in chunks]

    collection.add(
        ids=[f"{document_id}_{c.index}" for c in chunks],
        documents=[c.text for c in chunks],
        embeddings=embeddings,
        metadatas=[{"heading": c.heading, "topic": t} for c, t in zip(chunks, topics)],
    )
    return sorted(set(topics))


def retrieve_for_topic(document_id: int, topic: str, k: int = 4) -> List[str]:
    collection = _client.get_or_create_collection(name=f"doc_{document_id}")
    query_embedding = embed_texts([topic])[0]
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(k, max(collection.count(), 1)),
        where={"topic": topic} if topic else None,
    )
    docs = results.get("documents", [[]])
    return docs[0] if docs else []
