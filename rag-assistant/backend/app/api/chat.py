"""Chat API endpoints."""

import time
from fastapi import APIRouter

from app.api.deps import DbSession
from app.models import ChatEvent
from app.schemas import (
    ChatRequest,
    ChatResponse,
    Citation,
    Confidence,
    Metrics,
)
from app.services.retrieval import RetrievalService
from app.services.llm import LLMService
from app.config import settings


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: DbSession,
) -> ChatResponse:
    """
    Process a chat message using RAG.

    Returns answer with citations and confidence metrics.
    """
    start_time = time.time()

    # 1. Retrieve relevant chunks
    retrieval_start = time.time()
    retrieval_service = RetrievalService(db)
    results = await retrieval_service.retrieve(
        query=request.message,
        document_ids=request.document_ids,
    )
    retrieval_time = (time.time() - retrieval_start) * 1000  # Convert to ms

    # 2. Compute confidence
    confidence_data = retrieval_service.compute_confidence(results)

    # 3. Generate response
    llm_service = LLMService()
    generation_start = time.time()

    if confidence_data["should_abstain"]:
        # Return abstain response
        answer = await llm_service.generate_abstain_response()
        input_tokens = 0
        output_tokens = llm_service.count_tokens(answer)
    else:
        # Build context and generate response
        chunks_for_context = [
            {
                "document_title": r.document_title,
                "page": r.page,
                "content": r.content,
            }
            for r in results
        ]
        context = llm_service.build_context(chunks_for_context)
        answer, input_tokens, output_tokens = await llm_service.generate_response(
            question=request.message,
            context=context,
        )

    generation_time = (time.time() - generation_start) * 1000  # Convert to ms
    total_time = (time.time() - start_time) * 1000  # Convert to ms

    # 4. Build citations
    citations = [
        Citation(
            id=i + 1,
            document_id=r.document_id,
            document_title=r.document_title,
            filename=r.filename,
            page=r.page,
            snippet=r.content[:200] + "..." if len(r.content) > 200 else r.content,
            similarity=round(r.similarity, 4),
        )
        for i, r in enumerate(results)
    ]

    # 5. Calculate cost
    cost_estimated = llm_service.estimate_cost(input_tokens, output_tokens)

    # 6. Build response objects
    confidence = Confidence(
        top1_similarity=round(confidence_data["top1_similarity"], 4),
        top2_similarity=round(confidence_data["top2_similarity"], 4) if confidence_data["top2_similarity"] else None,
        gap=round(confidence_data["gap"], 4) if confidence_data["gap"] else None,
        coverage=confidence_data["coverage"],
        should_abstain=confidence_data["should_abstain"],
    )

    metrics = Metrics(
        latency_ms_total=round(total_time, 2),
        latency_ms_retrieval=round(retrieval_time, 2),
        latency_ms_generation=round(generation_time, 2),
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        cost_usd_estimated=round(cost_estimated, 6),
    )

    # 7. Log chat event
    chat_event = ChatEvent(
        message=request.message,
        document_ids=request.document_ids,
        answer=answer,
        should_abstain=confidence_data["should_abstain"],
        citations_used=[c.model_dump() for c in citations],
        similarities={
            "top1_similarity": confidence_data["top1_similarity"],
            "top2_similarity": confidence_data["top2_similarity"],
            "gap": confidence_data["gap"],
            "coverage": confidence_data["coverage"],
        },
        latencies={
            "total_ms": total_time,
            "retrieval_ms": retrieval_time,
            "generation_ms": generation_time,
        },
        token_usage={
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
        },
        cost_usd_estimated=cost_estimated,
    )
    db.add(chat_event)
    await db.commit()

    return ChatResponse(
        answer=answer,
        citations=citations,
        confidence=confidence,
        metrics=metrics,
    )
