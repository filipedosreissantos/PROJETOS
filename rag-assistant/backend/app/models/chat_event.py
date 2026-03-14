"""ChatEvent model for storing chat history and metrics."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ChatEvent(Base):
    """ChatEvent model for logging chat interactions and metrics."""

    __tablename__ = "chat_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # Request
    message: Mapped[str] = mapped_column(Text, nullable=False)
    document_ids: Mapped[list[int] | None] = mapped_column(JSONB, nullable=True)

    # Response
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    should_abstain: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Citations
    citations_used: Mapped[list[dict]] = mapped_column(JSONB, default=list)

    # Similarity scores
    similarities: Mapped[dict] = mapped_column(JSONB, default=dict)
    # Structure: {top1_similarity, top2_similarity, gap, coverage}

    # Latencies (in milliseconds)
    latencies: Mapped[dict] = mapped_column(JSONB, default=dict)
    # Structure: {total_ms, retrieval_ms, generation_ms}

    # Token usage
    token_usage: Mapped[dict] = mapped_column(JSONB, default=dict)
    # Structure: {input_tokens, output_tokens}

    # Cost estimation
    cost_usd_estimated: Mapped[float] = mapped_column(Float, default=0.0)

    def __repr__(self) -> str:
        return f"<ChatEvent(id={self.id}, abstain={self.should_abstain})>"
