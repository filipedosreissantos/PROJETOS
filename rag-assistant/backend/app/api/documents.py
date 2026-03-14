"""Document management API endpoints."""

import asyncio
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, status, BackgroundTasks
from sqlalchemy import select, func

from app.api.deps import DbSession, AdminUser
from app.models import Document, DocumentStatus
from app.schemas import DocumentResponse, DocumentListResponse
from app.services.ingestion import IngestionService


router = APIRouter(prefix="/documents", tags=["documents"])


async def process_document_background(
    document_id: int,
    file_content: bytes,
    db_url: str,
) -> None:
    """Background task to process document."""
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    from sqlalchemy.orm import sessionmaker

    engine = create_async_engine(db_url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        try:
            ingestion_service = IngestionService(session)
            await ingestion_service.ingest_document(document_id, file_content)
        except Exception as e:
            print(f"Error processing document {document_id}: {e}")
        finally:
            await engine.dispose()


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    db: DbSession,
    admin: AdminUser,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(None),
) -> Document:
    """
    Upload a PDF document for processing.

    The document will be processed asynchronously in the background.
    """
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported",
        )

    # Read file content
    file_content = await file.read()
    file_size = len(file_content)

    # Use filename as title if not provided
    doc_title = title or file.filename.rsplit(".", 1)[0]

    # Create document record
    document = Document(
        title=doc_title,
        filename=file.filename,
        status=DocumentStatus.PROCESSING,
        file_size=file_size,
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)

    # Start background processing
    from app.config import settings
    background_tasks.add_task(
        process_document_background,
        document.id,
        file_content,
        settings.async_database_url,
    )

    return document


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    db: DbSession,
    admin: AdminUser,
) -> dict:
    """List all documents."""
    stmt = select(Document).order_by(Document.created_at.desc())
    result = await db.execute(stmt)
    documents = result.scalars().all()

    return {
        "documents": documents,
        "total": len(documents),
    }


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    db: DbSession,
    admin: AdminUser,
) -> Document:
    """Get a specific document by ID."""
    document = await db.get(Document, document_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return document


@router.post("/{document_id}/reindex", response_model=DocumentResponse)
async def reindex_document(
    document_id: int,
    db: DbSession,
    admin: AdminUser,
    background_tasks: BackgroundTasks,
) -> Document:
    """Reindex a document by regenerating its embeddings."""
    document = await db.get(Document, document_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    # Start reindexing in background
    async def reindex_task():
        from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
        from sqlalchemy.orm import sessionmaker
        from app.config import settings

        engine = create_async_engine(settings.async_database_url)
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

        async with async_session() as session:
            try:
                ingestion_service = IngestionService(session)
                await ingestion_service.reindex_document(document_id)
            except Exception as e:
                print(f"Error reindexing document {document_id}: {e}")
            finally:
                await engine.dispose()

    background_tasks.add_task(reindex_task)

    # Update status
    document.status = DocumentStatus.PROCESSING
    await db.commit()
    await db.refresh(document)

    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: int,
    db: DbSession,
    admin: AdminUser,
) -> None:
    """Delete a document and all its chunks."""
    document = await db.get(Document, document_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    await db.delete(document)
    await db.commit()
