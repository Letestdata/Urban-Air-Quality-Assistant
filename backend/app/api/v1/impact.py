from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.impact import (
    ImpactLogRequest,
    ImpactRecordResponse,
    ImpactSummaryResponse,
)
from app.services.impact_service import impact_service

router = APIRouter(prefix="/impact", tags=["My Impact"])


@router.post("/log", response_model=ImpactRecordResponse, status_code=status.HTTP_201_CREATED)
def log_sustainable_trip(
    req: ImpactLogRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a green commute trip and calculate avoided CO2e emissions."""
    return impact_service.log_impact(db, current_user, req)


@router.get("/summary", response_model=ImpactSummaryResponse)
def get_impact_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve cumulative carbon avoidance stats, tree equivalence, and journey log."""
    return impact_service.get_summary(db, current_user)
