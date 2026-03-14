"""Metrics API endpoints."""

from sqlalchemy import select, func, text
from fastapi import APIRouter

from app.api.deps import DbSession, AdminUser
from app.models import ChatEvent
from app.schemas import MetricsResponse, MetricsSummary, TopDocument


router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("", response_model=MetricsResponse)
async def get_metrics(
    db: DbSession,
    admin: AdminUser,
) -> MetricsResponse:
    """
    Get chat metrics summary.

    Returns aggregated statistics and top consulted documents.
    """
    # Get basic counts
    total_result = await db.execute(select(func.count(ChatEvent.id)))
    total_chats = total_result.scalar() or 0

    abstain_result = await db.execute(
        select(func.count(ChatEvent.id)).where(ChatEvent.should_abstain == True)
    )
    abstain_count = abstain_result.scalar() or 0

    # Calculate abstain rate
    abstain_rate = (abstain_count / total_chats * 100) if total_chats > 0 else 0

    # Get average latencies using JSON extraction
    latency_query = text("""
        SELECT 
            AVG((latencies->>'total_ms')::float) as avg_total,
            AVG((latencies->>'retrieval_ms')::float) as avg_retrieval,
            AVG((latencies->>'generation_ms')::float) as avg_generation
        FROM chat_events
    """)
    latency_result = await db.execute(latency_query)
    latency_row = latency_result.one_or_none()

    avg_latency_ms = float(latency_row[0] or 0) if latency_row else 0
    avg_latency_retrieval_ms = float(latency_row[1] or 0) if latency_row else 0
    avg_latency_generation_ms = float(latency_row[2] or 0) if latency_row else 0

    # Get cost and token totals
    cost_query = text("""
        SELECT 
            SUM(cost_usd_estimated) as total_cost,
            AVG(cost_usd_estimated) as avg_cost,
            SUM((token_usage->>'input_tokens')::int) as total_input,
            SUM((token_usage->>'output_tokens')::int) as total_output
        FROM chat_events
    """)
    cost_result = await db.execute(cost_query)
    cost_row = cost_result.one_or_none()

    total_cost_usd = float(cost_row[0] or 0) if cost_row else 0
    avg_cost_usd = float(cost_row[1] or 0) if cost_row else 0
    total_input_tokens = int(cost_row[2] or 0) if cost_row else 0
    total_output_tokens = int(cost_row[3] or 0) if cost_row else 0

    # Get top documents by query count
    top_docs_query = text("""
        WITH doc_queries AS (
            SELECT 
                jsonb_array_elements(citations_used)->>'document_id' as doc_id,
                jsonb_array_elements(citations_used)->>'document_title' as doc_title
            FROM chat_events
            WHERE citations_used IS NOT NULL AND jsonb_array_length(citations_used) > 0
        )
        SELECT 
            doc_id::int as document_id,
            doc_title as document_title,
            COUNT(*) as query_count
        FROM doc_queries
        GROUP BY doc_id, doc_title
        ORDER BY query_count DESC
        LIMIT 10
    """)
    top_docs_result = await db.execute(top_docs_query)
    top_docs_rows = top_docs_result.all()

    top_documents = [
        TopDocument(
            document_id=row[0],
            document_title=row[1] or "Unknown",
            query_count=row[2],
        )
        for row in top_docs_rows
    ]

    summary = MetricsSummary(
        total_chats=total_chats,
        abstain_count=abstain_count,
        abstain_rate=round(abstain_rate, 2),
        avg_latency_ms=round(avg_latency_ms, 2),
        avg_latency_retrieval_ms=round(avg_latency_retrieval_ms, 2),
        avg_latency_generation_ms=round(avg_latency_generation_ms, 2),
        total_cost_usd=round(total_cost_usd, 4),
        avg_cost_usd=round(avg_cost_usd, 6),
        total_input_tokens=total_input_tokens,
        total_output_tokens=total_output_tokens,
    )

    return MetricsResponse(
        summary=summary,
        top_documents=top_documents,
    )
