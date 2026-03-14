"""Text chunking service."""

import re
from dataclasses import dataclass

import tiktoken

from app.config import settings


@dataclass
class ChunkResult:
    """Result of chunking a text segment."""

    content: str
    page: int
    token_count: int
    chunk_index: int


class TextChunker:
    """Service for chunking text into smaller segments."""

    def __init__(
        self,
        chunk_size: int | None = None,
        chunk_overlap: int | None = None,
    ):
        """Initialize chunker with configurable parameters."""
        self.chunk_size = chunk_size or settings.chunk_size
        self.chunk_overlap = chunk_overlap or settings.chunk_overlap
        self.tokenizer = tiktoken.get_encoding("cl100k_base")

    def normalize_text(self, text: str) -> str:
        """Normalize text by removing extra whitespace and special characters."""
        # Replace multiple spaces/tabs with single space
        text = re.sub(r"[ \t]+", " ", text)
        # Replace multiple newlines with double newline (paragraph break)
        text = re.sub(r"\n{3,}", "\n\n", text)
        # Remove leading/trailing whitespace from each line
        lines = [line.strip() for line in text.split("\n")]
        text = "\n".join(lines)
        # Remove leading/trailing whitespace from entire text
        return text.strip()

    def count_tokens(self, text: str) -> int:
        """Count tokens in text using tiktoken."""
        return len(self.tokenizer.encode(text))

    def chunk_text(
        self,
        text: str,
        page: int = 1,
        start_index: int = 0,
    ) -> list[ChunkResult]:
        """
        Split text into chunks with overlap.

        Args:
            text: Text to chunk
            page: Page number for reference
            start_index: Starting chunk index

        Returns:
            List of ChunkResult objects
        """
        text = self.normalize_text(text)

        if not text:
            return []

        chunks: list[ChunkResult] = []
        current_pos = 0
        chunk_index = start_index

        while current_pos < len(text):
            # Get chunk of specified size
            end_pos = current_pos + self.chunk_size

            # If not at end, try to break at sentence or word boundary
            if end_pos < len(text):
                # Try to find sentence boundary (., !, ?)
                sentence_end = self._find_sentence_boundary(text, current_pos, end_pos)
                if sentence_end > current_pos:
                    end_pos = sentence_end
                else:
                    # Fall back to word boundary
                    word_end = self._find_word_boundary(text, current_pos, end_pos)
                    if word_end > current_pos:
                        end_pos = word_end

            chunk_text = text[current_pos:end_pos].strip()

            if chunk_text:
                chunks.append(
                    ChunkResult(
                        content=chunk_text,
                        page=page,
                        token_count=self.count_tokens(chunk_text),
                        chunk_index=chunk_index,
                    )
                )
                chunk_index += 1

            # Move position with overlap
            current_pos = end_pos - self.chunk_overlap
            if current_pos <= chunks[-1].chunk_index if chunks else 0:
                current_pos = end_pos

            # Prevent infinite loop
            if end_pos >= len(text):
                break

        return chunks

    def chunk_pages(
        self,
        pages: list[tuple[int, str]],
    ) -> list[ChunkResult]:
        """
        Chunk multiple pages of text.

        Args:
            pages: List of (page_number, text) tuples

        Returns:
            List of ChunkResult objects with proper page references
        """
        all_chunks: list[ChunkResult] = []
        chunk_index = 0

        for page_num, page_text in pages:
            page_chunks = self.chunk_text(
                text=page_text,
                page=page_num,
                start_index=chunk_index,
            )
            all_chunks.extend(page_chunks)
            chunk_index += len(page_chunks)

        return all_chunks

    def _find_sentence_boundary(
        self,
        text: str,
        start: int,
        end: int,
    ) -> int:
        """Find the last sentence boundary before end position."""
        # Look for sentence endings followed by space or newline
        search_text = text[start:end]
        patterns = [". ", ".\n", "! ", "!\n", "? ", "?\n"]

        last_boundary = start
        for pattern in patterns:
            idx = search_text.rfind(pattern)
            if idx > 0:
                boundary = start + idx + len(pattern) - 1
                if boundary > last_boundary:
                    last_boundary = boundary

        return last_boundary

    def _find_word_boundary(
        self,
        text: str,
        start: int,
        end: int,
    ) -> int:
        """Find the last word boundary before end position."""
        search_text = text[start:end]

        # Find last space or newline
        space_idx = search_text.rfind(" ")
        newline_idx = search_text.rfind("\n")

        boundary = max(space_idx, newline_idx)
        if boundary > 0:
            return start + boundary

        return end
