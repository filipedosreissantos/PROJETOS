"""Chat-related Pydantic schemas."""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Schema for chat request."""

    message: str = Field(..., min_length=1, max_length=5000)
    document_ids: list[int] | None = Field(
        default=None,
        description="Optional list of document IDs to filter search",
    )


class Citation(BaseModel):
    """Schema for a citation reference."""

    id: int
    document_id: int
    document_title: str
    filename: str
    page: int
    snippet: str
    similarity: float


class Confidence(BaseModel):
    """Schema for confidence metrics."""

    top1_similarity: float
    top2_similarity: float | None = None
    gap: float | None = None
    coverage: int = Field(..., description="Number of relevant chunks found")
    should_abstain: bool


class Metrics(BaseModel):
    """Schema for performance metrics."""

    latency_ms_total: float
    latency_ms_retrieval: float
    latency_ms_generation: float
    input_tokens: int
    output_tokens: int
    cost_usd_estimated: float


class ChatResponse(BaseModel):
    """Schema for chat response."""

    answer: str
    citations: list[Citation]
    confidence: Confidence
    metrics: Metrics
