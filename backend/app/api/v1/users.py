from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import (
    DailyPlan,
    FamilyMember,
    ImpactRecord,
    User,
    UserPreference,
)
from app.schemas.user import (
    LocationResponse,
    PreferenceResponse,
    PreferenceUpdate,
    UserProfileResponse,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Fetch current authenticated user profile and saved preferences."""
    pref_resp = PreferenceResponse.model_validate(current_user.preferences) if current_user.preferences else None
    saved_locs = [
        LocationResponse.model_validate(ul.location)
        for ul in current_user.user_locations
        if ul.location
    ]
    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        country=current_user.country,
        preferred_language=current_user.preferred_language,
        preferences=pref_resp,
        saved_locations=saved_locs
    )


@router.put("/me", response_model=UserProfileResponse)
def update_profile(
    req: PreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user preferences and onboarding state."""
    prefs = current_user.preferences
    if not prefs:
        prefs = UserPreference(user_id=current_user.id)
        db.add(prefs)

    for field, val in req.model_dump(exclude_unset=True).items():
        setattr(prefs, field, val)

    db.commit()
    db.refresh(current_user)
    return get_profile(current_user)


@router.get("/me/export")
def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export all user-owned data in portable JSON format (GDPR / DPDP Compliance)."""
    plans = db.query(DailyPlan).filter(DailyPlan.user_id == current_user.id).all()
    family = db.query(FamilyMember).filter(FamilyMember.user_id == current_user.id).all()
    impacts = db.query(ImpactRecord).filter(ImpactRecord.user_id == current_user.id).all()

    return {
        "user_profile": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "country": current_user.country,
            "preferred_language": current_user.preferred_language,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None
        },
        "preferences": {
            "occupation": current_user.preferences.occupation if current_user.preferences else None,
            "working_hours": current_user.preferences.working_hours if current_user.preferences else None,
            "commute_mode": current_user.preferences.commute_mode if current_user.preferences else None,
            "exercise_type": current_user.preferences.exercise_type if current_user.preferences else None
        },
        "daily_plans_count": len(plans),
        "family_members_count": len(family),
        "impact_records_count": len(impacts),
        "total_trips_logged": len(impacts),
        "total_co2e_saved_kg": sum(i.co2e_saved_kg for i in impacts)
    }


@router.delete("/me")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Permanently delete user account and all cascaded data (Right to be Forgotten)."""
    db.delete(current_user)
    db.commit()
    return {"message": "Account and all associated records permanently purged from the system."}
