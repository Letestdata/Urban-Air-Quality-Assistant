from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import UnauthorizedException
from app.core.security import decode_access_token
from app.models.user import User
from app.services.auth_service import AuthService


def get_current_user(
    authorization: str = Header(..., description="Bearer JWT token"),
    db: Session = Depends(get_db)
) -> User:
    """Extract and validate bearer token from Authorization header."""
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise UnauthorizedException(detail="Invalid Authorization header format. Expected 'Bearer <token>'.")

    token = parts[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise UnauthorizedException(detail="Token is invalid or expired.")

    user_id = payload["sub"]
    user = AuthService.get_current_user(db, user_id)
    return user
