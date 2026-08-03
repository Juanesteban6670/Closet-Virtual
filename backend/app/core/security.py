from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

import jwt
from fastapi import HTTPException, status
from passlib.context import CryptContext

from app.core.settings import get_settings

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_context.verify(password, password_hash)


def create_token(
    subject: str, token_type: str, expires_delta: timedelta
) -> tuple[str, str, datetime]:
    expires_at = datetime.now(UTC) + expires_delta
    token_id = str(uuid4())
    payload = {
        "sub": subject,
        "jti": token_id,
        "type": token_type,
        "iat": datetime.now(UTC),
        "exp": expires_at,
    }
    settings = get_settings()
    token = jwt.encode(
        payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )
    return token, token_id, expires_at


def decode_token(token: str, expected_type: str) -> dict[str, Any]:
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
    except jwt.PyJWTError as exc:
        raise credentials_exception from exc
    if payload.get("type") != expected_type or not payload.get("sub"):
        raise credentials_exception
    return payload
