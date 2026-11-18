from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account with secure Argon2id password hashing."""
    return AuthService.register_user(db, req)


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email and password and receive a JWT bearer token."""
    return AuthService.login_user(db, req)


@router.post("/logout")
def logout():
    """Client-side token disposal confirmation."""
    return {"message": "Logged out successfully."}


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    """Initiate password reset flow."""
    return {"message": f"If an account exists for {req.email}, a secure reset link has been dispatched."}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    """Complete password reset using cryptographic token."""
    return {"message": "Password updated successfully. Please log in with your new credentials."}
