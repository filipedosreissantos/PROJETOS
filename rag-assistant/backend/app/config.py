"""Application configuration using Pydantic Settings."""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/rag_assistant"

    # Admin Authentication
    admin_password: str = "admin123"
    secret_key: str = "super-secret-key-change-in-production"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # OpenAI Configuration
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"

    # Chunking Configuration
    chunk_size: int = 1000
    chunk_overlap: int = 200

    # Retrieval Configuration
    top_k: int = 5
    similarity_threshold: float = 0.3

    # Cost Estimation (USD per 1K tokens)
    cost_input_per_1k: float = 0.00015
    cost_output_per_1k: float = 0.0006
    cost_embedding_per_1k: float = 0.00002

    # Application
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000", "http://frontend:3000"]

    @property
    def async_database_url(self) -> str:
        """Get async database URL."""
        url = self.database_url
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
