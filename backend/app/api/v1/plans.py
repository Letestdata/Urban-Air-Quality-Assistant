from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.plan import (
    ActivityStatusUpdate,
    DailyPlanResponse,
    PlanActivityItem,
    PlanGenerateRequest,
)
from app.services.planner_service import planner_service

router = APIRouter(prefix="/plans", tags=["Daily Planner"])


@router.get("/today", response_model=DailyPlanResponse)
async def get_today_plan(
    city: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve today's active schedule, or auto-generate if first login of the day."""
    return await planner_service.get_or_generate_today_plan(
        db=db,
        user=current_user,
        city=city,
        force_regenerate=False
    )


@router.post("/generate", response_model=DailyPlanResponse)
async def generate_plan(
    req: PlanGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Explicitly generate or refresh daily plan based on latest sensor telemetry."""
    return await planner_service.get_or_generate_today_plan(
        db=db,
        user=current_user,
        city=req.city,
        force_regenerate=req.force_regenerate
    )


@router.patch("/activities/{activity_id}", response_model=PlanActivityItem)
def update_activity_status(
    activity_id: str,
    req: ActivityStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle completion status (pending, completed, skipped) for a scheduled activity."""
    return planner_service.update_activity_status(
        db=db,
        user=current_user,
        activity_id=activity_id,
        new_status=req.status
    )
