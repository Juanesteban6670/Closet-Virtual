import hashlib
from datetime import timedelta
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import create_token, decode_token, hash_password, verify_password
from app.core.settings import get_settings
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.refresh_tokens = RefreshTokenRepository(session)

    def register(self, *, name: str, email: str, password: str) -> User:
        normalized_email = email.lower()
        if self.users.get_by_email(normalized_email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )
        try:
            user = self.users.create(
                name=name,
                email=normalized_email,
                password_hash=hash_password(password),
            )
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            ) from exc
        self.session.refresh(user)
        return user

    def authenticate(self, *, email: str, password: str) -> User:
        user = self.users.get_by_email(email.lower())
        if user is None or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    def issue_tokens(self, user: User) -> tuple[str, str]:
        settings = get_settings()
        access_token, _, _ = create_token(
            str(user.id),
            "access",
            timedelta(minutes=settings.jwt_access_token_expire_minutes),
        )
        refresh_token, token_id, expires_at = create_token(
            str(user.id),
            "refresh",
            timedelta(days=settings.jwt_refresh_token_expire_days),
        )
        self.refresh_tokens.create(
            token_id=token_id,
            token_hash=self._hash_token(refresh_token),
            expires_at=expires_at,
            user_id=user.id,
        )
        self.session.commit()
        return access_token, refresh_token

    def refresh(self, refresh_token: str) -> tuple[User, str, str]:
        payload = decode_token(refresh_token, "refresh")
        token_record = self.refresh_tokens.get_active(payload["jti"])
        if token_record is None or token_record.token_hash != self._hash_token(
            refresh_token
        ):
            raise self._invalid_refresh_token()
        user = self.users.get_by_id(UUID(payload["sub"]))
        if user is None:
            raise self._invalid_refresh_token()
        self.refresh_tokens.revoke(token_record)
        access_token, new_refresh_token = self.issue_tokens(user)
        return user, access_token, new_refresh_token

    def logout(self, refresh_token: str | None) -> None:
        if not refresh_token:
            return
        try:
            payload = decode_token(refresh_token, "refresh")
            token_record = self.refresh_tokens.get_active(payload["jti"])
            if token_record:
                self.refresh_tokens.revoke(token_record)
                self.session.commit()
        except HTTPException:
            return

    @staticmethod
    def _hash_token(token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()

    @staticmethod
    def _invalid_refresh_token() -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token."
        )
