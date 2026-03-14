"""API module."""

from app.api.auth import router as auth_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router
from app.api.metrics import router as metrics_router

__all__ = [
    "auth_router",
    "documents_router",
    "chat_router",
    "metrics_router",
]
