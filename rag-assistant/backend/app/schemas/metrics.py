"""Metrics-related Pydantic schemas."""

from pydantic import BaseModel


class TopDocument(BaseModel):
    """Schema for top consulted document."""

    document_id: int
    document_title: str
    query_count: int


class MetricsSummary(BaseModel):
    """Schema for metrics summary."""

    total_chats: int
    abstain_count: int
    abstain_rate: float
    avg_latency_ms: float
    avg_latency_retrieval_ms: float
    avg_latency_generation_ms: float
    total_cost_usd: float
    avg_cost_usd: float
    total_input_tokens: int
    total_output_tokens: int


class MetricsResponse(BaseModel):
    """Schema for metrics response."""

    summary: MetricsSummary
    top_documents: list[TopDocument]
