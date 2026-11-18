from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.report import ReportSummaryResponse
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/summary", response_model=ReportSummaryResponse)
def get_report_summary(
    type: str = Query("weekly", pattern="^(daily|weekly|monthly)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve environmental exposure summaries, plan adherence rates, and avoided emissions."""
    return report_service.generate_report(db, current_user, report_type=type)
