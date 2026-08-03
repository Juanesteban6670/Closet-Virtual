from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration sourced from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", env_prefix="VIRTUAL_CLOSET_"
    )

    app_name: str = "Virtual Closet API"
    app_env: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    database_url: str = (
        "postgresql+psycopg://virtual-closet:virtual-closet@localhost:5432/virtual_closet"
    )
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    jwt_secret_key: str = "development-only-secret-change-before-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 14
    refresh_cookie_name: str = "virtual_closet_refresh_token"
    cookie_secure: bool = False
    cookie_samesite: str = "lax"
    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    return Settings()
