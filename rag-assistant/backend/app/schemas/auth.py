"""Authentication-related Pydantic schemas."""

from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Schema for login request."""

    password: str


class LoginResponse(BaseModel):
    """Schema for login response."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for JWT token data."""

    is_admin: bool = False
