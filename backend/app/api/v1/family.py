from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.family import (
    FamilyMemberCreate,
    FamilyMemberResponse,
    FamilyMemberUpdate,
)
from app.services.family_service import family_service

router = APIRouter(prefix="/family", tags=["Family Profiles"])


@router.get("/members", response_model=List[FamilyMemberResponse])
def get_family_members(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all household members registered to current user."""
    return family_service.get_members(db, current_user)


@router.post("/members", response_model=FamilyMemberResponse, status_code=status.HTTP_201_CREATED)
def add_family_member(
    req: FamilyMemberCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add new family member (child, senior, adult, pregnant)."""
    return family_service.add_member(db, current_user, req)


@router.put("/members/{member_id}", response_model=FamilyMemberResponse)
def update_family_member(
    member_id: str,
    req: FamilyMemberUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update family member preferences with IDOR check."""
    return family_service.update_member(db, current_user, member_id, req)


@router.delete("/members/{member_id}")
def delete_family_member(
    member_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove family member with IDOR check."""
    family_service.delete_member(db, current_user, member_id)
    return {"message": "Family member removed."}
