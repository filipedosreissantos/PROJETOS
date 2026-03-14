"""Authentication API endpoints."""

from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.schemas import LoginRequest, LoginResponse
from app.api.deps import create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest) -> LoginResponse:
    """
    Authenticate with admin password.

    Returns JWT token if password is correct.
    """
    if request.password != settings.admin_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password",
        )

    access_token = create_access_token(data={"is_admin": True})
    return LoginResponse(access_token=access_token)


@router.post("/verify")
async def verify_token() -> dict:
    """
    Verify if the current token is valid.

    This endpoint requires authentication (handled by dependency).
    """
    return {"valid": True}
