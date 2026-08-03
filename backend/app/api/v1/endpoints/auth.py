from fastapi import APIRouter, Cookie, Response, status

from app.api.dependencies import DatabaseSession
from app.core.settings import get_settings
from app.schemas.auth import (
    AccessTokenResponse,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth")


def set_refresh_cookie(response: Response, token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.jwt_refresh_token_expire_days * 24 * 60 * 60,
        path=f"{settings.api_v1_prefix}/auth",
    )


def clear_refresh_cookie(response: Response) -> None:
    settings = get_settings()
    response.delete_cookie(
        key=settings.refresh_cookie_name, path=f"{settings.api_v1_prefix}/auth"
    )


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(payload: RegisterRequest, session: DatabaseSession) -> UserResponse:
    return AuthService(session).register(**payload.model_dump())


@router.post("/login", response_model=AccessTokenResponse)
def login(
    payload: LoginRequest, response: Response, session: DatabaseSession
) -> AccessTokenResponse:
    service = AuthService(session)
    user = service.authenticate(**payload.model_dump())
    access_token, refresh_token = service.issue_tokens(user)
    set_refresh_cookie(response, refresh_token)
    return AccessTokenResponse(access_token=access_token, user=user)


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(
    response: Response,
    session: DatabaseSession,
    refresh_token: str | None = Cookie(
        default=None, alias=get_settings().refresh_cookie_name
    ),
) -> AccessTokenResponse:
    if refresh_token is None:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is required.",
        )
    user, access_token, new_refresh_token = AuthService(session).refresh(refresh_token)
    set_refresh_cookie(response, new_refresh_token)
    return AccessTokenResponse(access_token=access_token, user=user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    session: DatabaseSession,
    refresh_token: str | None = Cookie(
        default=None, alias=get_settings().refresh_cookie_name
    ),
) -> None:
    AuthService(session).logout(refresh_token)
    clear_refresh_cookie(response)
