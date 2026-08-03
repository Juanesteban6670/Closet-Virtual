from typing import Annotated
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.database.session import get_db
from app.models.user import User
from app.services.user_service import UserService

bearer_scheme = HTTPBearer(auto_error=True)
DatabaseSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    session: DatabaseSession,
) -> User:
    payload = decode_token(credentials.credentials, "access")
    return UserService(session).get_profile(UUID(payload["sub"]))


CurrentUser = Annotated[User, Depends(get_current_user)]
