from typing import List

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.models.user import FamilyMember, User
from app.schemas.family import FamilyMemberCreate, FamilyMemberResponse, FamilyMemberUpdate


class FamilyService:
    @staticmethod
    def get_members(db: Session, user: User) -> List[FamilyMemberResponse]:
        """List all family members owned by user with tailored recommendations."""
        members = db.query(FamilyMember).filter(FamilyMember.user_id == user.id).all()
        return [FamilyService._to_response(m) for m in members]

    @staticmethod
    def add_member(db: Session, user: User, req: FamilyMemberCreate) -> FamilyMemberResponse:
        """Add new family member."""
        member = FamilyMember(
            user_id=user.id,
            name=req.name.strip(),
            age_group=req.age_group,
            sensitivity_notes=req.sensitivity_notes.strip() if req.sensitivity_notes else None,
            activity_preferences=req.activity_preferences
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        return FamilyService._to_response(member)

    @staticmethod
    def update_member(db: Session, user: User, member_id: str, req: FamilyMemberUpdate) -> FamilyMemberResponse:
        """Update existing family member with IDOR ownership check."""
        member = db.query(FamilyMember).filter(FamilyMember.id == member_id, FamilyMember.user_id == user.id).first()
        if not member:
            raise NotFoundException(detail="Family member not found.")

        if req.name is not None:
            member.name = req.name.strip()
        if req.age_group is not None:
            member.age_group = req.age_group
        if req.sensitivity_notes is not None:
            member.sensitivity_notes = req.sensitivity_notes.strip()
        if req.activity_preferences is not None:
            member.activity_preferences = req.activity_preferences

        db.commit()
        db.refresh(member)
        return FamilyService._to_response(member)

    @staticmethod
    def delete_member(db: Session, user: User, member_id: str) -> None:
        """Delete family member with IDOR ownership check."""
        member = db.query(FamilyMember).filter(FamilyMember.id == member_id, FamilyMember.user_id == user.id).first()
        if not member:
            raise NotFoundException(detail="Family member not found.")
        db.delete(member)
        db.commit()

    @staticmethod
    def _to_response(m: FamilyMember) -> FamilyMemberResponse:
        recs: List[str] = []
        if m.age_group == "child":
            recs = [
                "Children breathe faster per kg of body weight; shift outdoor sports indoors when AQI > 150.",
                "Avoid waiting along busy vehicular intersections during peak school bus drop-off hours.",
                "Ensure bedroom air purifier is active 30 minutes before bedtime."
            ]
        elif m.age_group == "senior":
            recs = [
                "Avoid morning walks before 09:30 AM when ground-level thermal inversion traps cold smog.",
                "Substitute outdoor garden walks with gentle indoor joint mobility and breathing exercises.",
                "Stay well hydrated to maintain mucus membrane defense against fine particulates."
            ]
        elif m.age_group == "pregnant":
            recs = [
                "Strict particulate avoidance recommended; prioritize indoor filtered environments.",
                "Wear an N95 respirator if outdoor travel along busy traffic corridors is unavoidable.",
                "Maintain indoor relative humidity between 40% and 55% to reduce airborne irritants."
            ]
        else:
            recs = [
                "Adjust workout times to the afternoon (12 PM - 3 PM) solar dispersion window.",
                "Use metro or mass transit to lower personal particulate inhalation during commutes."
            ]

        if m.sensitivity_notes and "asthma" in m.sensitivity_notes.lower():
            recs.insert(0, "Sensory Alert: Keep fast-acting inhaler accessible; monitor sudden particulate spikes.")

        return FamilyMemberResponse(
            id=m.id,
            user_id=m.user_id,
            name=m.name,
            age_group=m.age_group,
            sensitivity_notes=m.sensitivity_notes,
            activity_preferences=m.activity_preferences,
            tailored_recommendations=recs
        )


family_service = FamilyService()
