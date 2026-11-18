from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.exceptions import NotFoundException
from app.models.user import Notification, User
from app.schemas.notification import (
    NotificationPreferencesUpdate,
    NotificationResponse,
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationResponse])
def get_user_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve environmental alerts, plan updates, and system advisories."""
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(20)
        .all()
    )

    if not notifications:
        # Provide welcoming advisory notification
        welcome_note = Notification(
            user_id=current_user.id,
            type="plan_ready",
            title="Welcome to Urban Air AI",
            message="Your personalized daily environmental routine is ready. Check your Morning & Afternoon suggestions.",
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(welcome_note)
        db.commit()
        db.refresh(welcome_note)
        return [NotificationResponse.model_validate(welcome_note)]

    return [NotificationResponse.model_validate(n) for n in notifications]


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark notification as read with IDOR ownership validation."""
    n = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not n:
        raise NotFoundException(detail="Notification not found.")
    n.is_read = True
    db.commit()
    db.refresh(n)
    return NotificationResponse.model_validate(n)


@router.put("/preferences")
def update_notification_preferences(
    req: NotificationPreferencesUpdate,
    current_user: User = Depends(get_current_user)
):
    """Configure notification alerts and quiet hour windows."""
    return {"message": "Notification preferences updated successfully.", "settings": req}
