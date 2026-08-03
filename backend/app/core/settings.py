from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration sourced from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Virtual Closet API"
    app_env: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://virtual-closet:virtual-closet@localhost:5432/virtual_closet"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    jwt_secret_key: str = "development-only-secret"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    return Settings()
