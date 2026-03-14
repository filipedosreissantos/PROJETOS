"""Document ingestion service."""

import asyncio
from pathlib import Path

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Document, Chunk, DocumentStatus
from app.services.chunker import TextChunker
from app.services.embeddings import EmbeddingService
from app.services.pdf_processor import PDFProcessor


class IngestionService:
    """Service for ingesting documents into the system."""

    def __init__(self, db: AsyncSession):
        """Initialize ingestion service."""
        self.db = db
        self.pdf_processor = PDFProcessor()
        self.chunker = TextChunker()
        self.embedding_service = EmbeddingService()

    async def ingest_document(
        self,
        document_id: int,
        file_content: bytes,
    ) -> None:
        """
        Ingest a document: extract text, chunk, embed, and store.

        This should be called as a background task.

        Args:
            document_id: ID of the document in the database
            file_content: PDF file content as bytes
        """
        try:
            # Update status to PROCESSING
            await self._update_status(document_id, DocumentStatus.PROCESSING)

            # 1. Extract text from PDF
            pdf_result = self.pdf_processor.extract_from_bytes(file_content)

            # Update page count and metadata
            await self._update_document(
                document_id,
                page_count=pdf_result.total_pages,
                metadata=pdf_result.metadata,
            )

            # 2. Chunk the text
            pages = [(p.page_number, p.text) for p in pdf_result.pages]
            chunks = self.chunker.chunk_pages(pages)

            if not chunks:
                raise ValueError("No text content extracted from PDF")

            # 3. Generate embeddings
            chunk_texts = [c.content for c in chunks]
            embeddings = await self.embedding_service.embed_texts(chunk_texts)

            # 4. Store chunks
            chunk_models = []
            for chunk, embedding in zip(chunks, embeddings):
                chunk_model = Chunk(
                    document_id=document_id,
                    chunk_index=chunk.chunk_index,
                    page=chunk.page,
                    content=chunk.content,
                    embedding=embedding,
                    token_count=chunk.token_count,
                )
                chunk_models.append(chunk_model)

            self.db.add_all(chunk_models)
            await self.db.commit()

            # 5. Update status to READY
            await self._update_status(
                document_id,
                DocumentStatus.READY,
                chunk_count=len(chunks),
            )

        except Exception as e:
            # Update status to ERROR
            await self._update_status(
                document_id,
                DocumentStatus.ERROR,
                error_message=str(e),
            )
            raise

    async def reindex_document(
        self,
        document_id: int,
    ) -> None:
        """
        Reindex a document by regenerating embeddings.

        Args:
            document_id: ID of the document to reindex
        """
        # Get existing chunks
        document = await self.db.get(Document, document_id)
        if not document:
            raise ValueError(f"Document {document_id} not found")

        # Update status
        await self._update_status(document_id, DocumentStatus.PROCESSING)

        try:
            # Get chunks
            chunks = document.chunks

            if not chunks:
                raise ValueError("Document has no chunks to reindex")

            # Regenerate embeddings
            chunk_texts = [c.content for c in chunks]
            embeddings = await self.embedding_service.embed_texts(chunk_texts)

            # Update chunks
            for chunk, embedding in zip(chunks, embeddings):
                chunk.embedding = embedding

            await self.db.commit()

            # Update status
            await self._update_status(document_id, DocumentStatus.READY)

        except Exception as e:
            await self._update_status(
                document_id,
                DocumentStatus.ERROR,
                error_message=str(e),
            )
            raise

    async def delete_document(
        self,
        document_id: int,
    ) -> bool:
        """
        Delete a document and all its chunks.

        Args:
            document_id: ID of the document to delete

        Returns:
            True if deleted, False if not found
        """
        document = await self.db.get(Document, document_id)
        if not document:
            return False

        await self.db.delete(document)
        await self.db.commit()
        return True

    async def _update_status(
        self,
        document_id: int,
        status: DocumentStatus,
        chunk_count: int | None = None,
        error_message: str | None = None,
    ) -> None:
        """Update document status."""
        values: dict = {"status": status}
        if chunk_count is not None:
            values["chunk_count"] = chunk_count
        if error_message is not None:
            values["error_message"] = error_message

        stmt = (
            update(Document)
            .where(Document.id == document_id)
            .values(**values)
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def _update_document(
        self,
        document_id: int,
        page_count: int,
        metadata: dict,
    ) -> None:
        """Update document metadata."""
        stmt = (
            update(Document)
            .where(Document.id == document_id)
            .values(
                page_count=page_count,
                metadata_=metadata,
            )
        )
        await self.db.execute(stmt)
        await self.db.commit()
