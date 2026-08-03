from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(
        self, *, token_id: str, token_hash: str, expires_at: datetime, user_id: UUID
    ) -> RefreshToken:
        token = RefreshToken(
            token_id=token_id,
            token_hash=token_hash,
            expires_at=expires_at,
            user_id=user_id,
        )
        self.session.add(token)
        self.session.flush()
        return token

    def get_active(self, token_id: str) -> RefreshToken | None:
        return self.session.scalar(
            select(RefreshToken).where(
                RefreshToken.token_id == token_id,
                RefreshToken.revoked_at.is_(None),
                RefreshToken.expires_at > datetime.now(UTC),
            )
        )

    def revoke(self, token: RefreshToken) -> None:
        token.revoked_at = datetime.now(UTC)
        self.session.flush()
