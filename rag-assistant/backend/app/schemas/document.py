"""Document-related Pydantic schemas."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class DocumentStatus(str, Enum):
    """Document processing status."""

    PROCESSING = "PROCESSING"
    READY = "READY"
    ERROR = "ERROR"


class DocumentCreate(BaseModel):
    """Schema for creating a document (metadata only, file uploaded separately)."""

    title: str = Field(..., min_length=1, max_length=500)


class DocumentResponse(BaseModel):
    """Schema for document response."""

    id: int
    title: str
    filename: str
    status: DocumentStatus
    page_count: int
    chunk_count: int
    file_size: int
    error_message: str | None = None
    metadata: dict = Field(default_factory=dict, alias="metadata_")
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class DocumentListResponse(BaseModel):
    """Schema for listing documents."""

    documents: list[DocumentResponse]
    total: int
