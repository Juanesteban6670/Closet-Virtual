from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.users import router as users_router
from app.core.settings import get_settings

router = APIRouter(prefix=get_settings().api_v1_prefix)
router.include_router(health_router, tags=["health"])
router.include_router(auth_router, tags=["authentication"])
router.include_router(users_router, tags=["users"])
