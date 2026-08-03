from fastapi import APIRouter

from app.api.dependencies import CurrentUser
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/users")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: CurrentUser) -> UserResponse:
    return current_user
