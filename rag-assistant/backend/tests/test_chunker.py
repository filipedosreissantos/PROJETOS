"""Tests for the text chunker service."""

import pytest
from app.services.chunker import TextChunker


class TestTextChunker:
    """Test suite for TextChunker."""

    def test_normalize_text_removes_extra_spaces(self):
        """Test that normalize_text removes extra spaces."""
        chunker = TextChunker()
        text = "Hello    world  test"
        result = chunker.normalize_text(text)
        assert result == "Hello world test"

    def test_normalize_text_removes_extra_newlines(self):
        """Test that normalize_text reduces multiple newlines."""
        chunker = TextChunker()
        text = "Para 1\n\n\n\nPara 2"
        result = chunker.normalize_text(text)
        assert result == "Para 1\n\nPara 2"

    def test_normalize_text_strips_lines(self):
        """Test that normalize_text strips leading/trailing whitespace from lines."""
        chunker = TextChunker()
        text = "  line 1  \n  line 2  "
        result = chunker.normalize_text(text)
        assert result == "line 1\nline 2"

    def test_count_tokens(self):
        """Test token counting."""
        chunker = TextChunker()
        # Simple sentence should have tokens
        text = "Hello, this is a test sentence."
        count = chunker.count_tokens(text)
        assert count > 0
        assert count < 20  # Should be around 7-8 tokens

    def test_chunk_text_basic(self):
        """Test basic text chunking."""
        chunker = TextChunker(chunk_size=100, chunk_overlap=20)
        text = "This is a test. " * 20  # About 320 chars
        chunks = chunker.chunk_text(text, page=1)
        
        assert len(chunks) > 0
        assert all(c.page == 1 for c in chunks)
        assert all(c.token_count > 0 for c in chunks)

    def test_chunk_text_preserves_page(self):
        """Test that chunking preserves page number."""
        chunker = TextChunker(chunk_size=100, chunk_overlap=10)
        text = "Some content here."
        chunks = chunker.chunk_text(text, page=5)
        
        assert len(chunks) == 1
        assert chunks[0].page == 5

    def test_chunk_text_empty_input(self):
        """Test that empty input returns empty list."""
        chunker = TextChunker()
        chunks = chunker.chunk_text("", page=1)
        assert chunks == []

    def test_chunk_pages(self):
        """Test chunking multiple pages."""
        chunker = TextChunker(chunk_size=50, chunk_overlap=10)
        pages = [
            (1, "Content on page one. Some more text here."),
            (2, "Content on page two. Different text here."),
        ]
        chunks = chunker.chunk_pages(pages)
        
        assert len(chunks) >= 2
        # Check that we have chunks from both pages
        page_numbers = {c.page for c in chunks}
        assert 1 in page_numbers
        assert 2 in page_numbers

    def test_chunk_indices_are_sequential(self):
        """Test that chunk indices are sequential across pages."""
        chunker = TextChunker(chunk_size=50, chunk_overlap=10)
        pages = [
            (1, "Content on page one. " * 5),
            (2, "Content on page two. " * 5),
        ]
        chunks = chunker.chunk_pages(pages)
        
        indices = [c.chunk_index for c in chunks]
        assert indices == list(range(len(chunks)))

    def test_chunk_respects_sentence_boundaries(self):
        """Test that chunker tries to respect sentence boundaries."""
        chunker = TextChunker(chunk_size=100, chunk_overlap=20)
        text = "First sentence. Second sentence. Third sentence. Fourth sentence."
        chunks = chunker.chunk_text(text)
        
        # At least one chunk should end with a period
        ends_with_period = any(c.content.rstrip().endswith('.') for c in chunks)
        assert ends_with_period
