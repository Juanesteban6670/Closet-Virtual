from datetime import timedelta

import pytest
from fastapi import HTTPException

from app.core.security import create_token, decode_token, hash_password, verify_password


def test_password_hashing_is_non_reversible() -> None:
    password = "StrongPassword1!"
    password_hash = hash_password(password)
    assert password_hash != password
    assert verify_password(password, password_hash)
    assert not verify_password("AnotherPassword1!", password_hash)


def test_jwt_validation_enforces_token_type() -> None:
    token, _, _ = create_token("user-id", "access", timedelta(minutes=5))
    payload = decode_token(token, "access")
    assert payload["sub"] == "user-id"
    with pytest.raises(HTTPException):
        decode_token(token, "refresh")
