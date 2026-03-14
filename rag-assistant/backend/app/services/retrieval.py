"""Retrieval service for semantic search."""

from dataclasses import dataclass

from pgvector.sqlalchemy import Vector
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import Chunk, Document
from app.services.embeddings import EmbeddingService


@dataclass
class RetrievalResult:
    """Result of chunk retrieval."""

    chunk_id: int
    document_id: int
    document_title: str
    filename: str
    page: int
    content: str
    similarity: float


class RetrievalService:
    """Service for retrieving relevant chunks using vector similarity."""

    def __init__(self, db: AsyncSession):
        """Initialize retrieval service."""
        self.db = db
        self.embedding_service = EmbeddingService()
        self.top_k = settings.top_k
        self.similarity_threshold = settings.similarity_threshold

    async def retrieve(
        self,
        query: str,
        document_ids: list[int] | None = None,
        top_k: int | None = None,
    ) -> list[RetrievalResult]:
        """
        Retrieve relevant chunks for a query.

        Args:
            query: Search query
            document_ids: Optional list of document IDs to filter
            top_k: Number of results to return

        Returns:
            List of RetrievalResult objects sorted by similarity
        """
        k = top_k or self.top_k

        # Generate query embedding
        query_embedding = await self.embedding_service.embed_text(query)

        # Build query with cosine similarity
        # pgvector uses <=> for cosine distance, we convert to similarity
        similarity_expr = 1 - Chunk.embedding.cosine_distance(query_embedding)

        stmt = (
            select(
                Chunk.id,
                Chunk.document_id,
                Chunk.page,
                Chunk.content,
                Document.title,
                Document.filename,
                similarity_expr.label("similarity"),
            )
            .join(Document, Chunk.document_id == Document.id)
            .where(Document.status == "READY")
            .where(Chunk.embedding.isnot(None))
        )

        # Filter by document IDs if provided
        if document_ids:
            stmt = stmt.where(Chunk.document_id.in_(document_ids))

        # Order by similarity (descending) and limit
        stmt = stmt.order_by(similarity_expr.desc()).limit(k)

        result = await self.db.execute(stmt)
        rows = result.all()

        return [
            RetrievalResult(
                chunk_id=row.id,
                document_id=row.document_id,
                document_title=row.title,
                filename=row.filename,
                page=row.page,
                content=row.content,
                similarity=float(row.similarity),
            )
            for row in rows
        ]

    def compute_confidence(
        self,
        results: list[RetrievalResult],
    ) -> dict:
        """
        Compute confidence metrics from retrieval results.

        Args:
            results: List of retrieval results

        Returns:
            Dictionary with confidence metrics
        """
        if not results:
            return {
                "top1_similarity": 0.0,
                "top2_similarity": None,
                "gap": None,
                "coverage": 0,
                "should_abstain": True,
            }

        top1_sim = results[0].similarity
        top2_sim = results[1].similarity if len(results) > 1 else None
        gap = (top1_sim - top2_sim) if top2_sim is not None else None

        # Count results above threshold
        coverage = sum(1 for r in results if r.similarity >= self.similarity_threshold)

        # Determine if we should abstain
        should_abstain = (
            top1_sim < self.similarity_threshold
            or coverage == 0
        )

        return {
            "top1_similarity": top1_sim,
            "top2_similarity": top2_sim,
            "gap": gap,
            "coverage": coverage,
            "should_abstain": should_abstain,
        }
