from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User

router = APIRouter(prefix="/settings", tags=["Settings"])


class GeneralSettingsUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    preferred_language: Optional[str] = Field(None, pattern="^(en|hi|gu)$")


@router.get("")
def get_user_settings(current_user: User = Depends(get_current_user)):
    """Fetch user account, language, and display configuration."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "preferred_language": current_user.preferred_language,
        "country": current_user.country,
        "supported_languages": [
            {"code": "en", "label": "English"},
            {"code": "hi", "label": "हिंदी (Hindi)"},
            {"code": "gu", "label": "ગુજરાતી (Gujarati)"}
        ]
    }


@router.put("")
def update_user_settings(
    req: GeneralSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile name and interface language."""
    if req.full_name is not None:
        current_user.full_name = req.full_name.strip()
    if req.preferred_language is not None:
        current_user.preferred_language = req.preferred_language

    db.commit()
    db.refresh(current_user)
    return {
        "message": "Settings updated successfully.",
        "full_name": current_user.full_name,
        "preferred_language": current_user.preferred_language
    }
