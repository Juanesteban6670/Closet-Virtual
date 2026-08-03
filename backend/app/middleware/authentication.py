from fastapi import HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.security import decode_token


class AuthenticationContextMiddleware(BaseHTTPMiddleware):
    """Adds validated optional access-token claims to request state."""

    async def dispatch(self, request: Request, call_next):
        authorization = request.headers.get("Authorization", "")
        if authorization.startswith("Bearer "):
            try:
                request.state.auth_claims = decode_token(authorization[7:], "access")
            except HTTPException:
                request.state.auth_claims = None
        else:
            request.state.auth_claims = None
        return await call_next(request)
