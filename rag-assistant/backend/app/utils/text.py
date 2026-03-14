"""Text utility functions."""

import re


def normalize_whitespace(text: str) -> str:
    """Normalize whitespace in text."""
    # Replace multiple spaces/tabs with single space
    text = re.sub(r"[ \t]+", " ", text)
    # Replace multiple newlines with double newline
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def truncate_text(text: str, max_length: int = 200, suffix: str = "...") -> str:
    """Truncate text to max length, adding suffix if truncated."""
    if len(text) <= max_length:
        return text
    return text[: max_length - len(suffix)] + suffix


def extract_citations(text: str) -> list[int]:
    """Extract citation numbers from text like [1], [2], etc."""
    pattern = r"\[(\d+)\]"
    matches = re.findall(pattern, text)
    return [int(m) for m in matches]
