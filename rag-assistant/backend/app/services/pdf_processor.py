"""PDF processing service."""

from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader


@dataclass
class PDFPage:
    """Extracted page from PDF."""

    page_number: int
    text: str


@dataclass
class PDFResult:
    """Result of PDF extraction."""

    pages: list[PDFPage]
    total_pages: int
    metadata: dict


class PDFProcessor:
    """Service for extracting text from PDF files."""

    def extract_from_path(self, file_path: str | Path) -> PDFResult:
        """
        Extract text from PDF file.

        Args:
            file_path: Path to PDF file

        Returns:
            PDFResult with pages and metadata
        """
        reader = PdfReader(str(file_path))

        pages: list[PDFPage] = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages.append(PDFPage(page_number=i + 1, text=text))

        # Extract metadata
        metadata = {}
        if reader.metadata:
            metadata = {
                "title": reader.metadata.get("/Title", ""),
                "author": reader.metadata.get("/Author", ""),
                "subject": reader.metadata.get("/Subject", ""),
                "creator": reader.metadata.get("/Creator", ""),
            }
            # Remove empty values
            metadata = {k: v for k, v in metadata.items() if v}

        return PDFResult(
            pages=pages,
            total_pages=len(reader.pages),
            metadata=metadata,
        )

    def extract_from_bytes(self, file_bytes: bytes) -> PDFResult:
        """
        Extract text from PDF bytes.

        Args:
            file_bytes: PDF file content as bytes

        Returns:
            PDFResult with pages and metadata
        """
        from io import BytesIO

        reader = PdfReader(BytesIO(file_bytes))

        pages: list[PDFPage] = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages.append(PDFPage(page_number=i + 1, text=text))

        # Extract metadata
        metadata = {}
        if reader.metadata:
            metadata = {
                "title": reader.metadata.get("/Title", ""),
                "author": reader.metadata.get("/Author", ""),
                "subject": reader.metadata.get("/Subject", ""),
                "creator": reader.metadata.get("/Creator", ""),
            }
            metadata = {k: v for k, v in metadata.items() if v}

        return PDFResult(
            pages=pages,
            total_pages=len(reader.pages),
            metadata=metadata,
        )
