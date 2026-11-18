from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class PlanActivityItem(BaseModel):
    id: Optional[str] = None
    time_bracket: str  # morning, afternoon, evening, night
    suggested_time: str
    category: str  # exercise, commute, indoor_air, daily_routine
    title: str
    action: str
    reason: str
    alternative: str
    evidence_type: str  # measured, forecast, general_guidance
    source_reference: Optional[str] = None
    status: str = "pending"  # pending, completed, skipped


class DailyPlanResponse(BaseModel):
    id: str
    plan_date: date
    aqi_value: int
    aqi_category: str
    weather_summary: Optional[str] = None
    summary: str
    data_status: str  # fresh, delayed, fallback
    safety_guidelines: List[str]
    activities: List[PlanActivityItem]

    model_config = ConfigDict(from_attributes=True)


class PlanGenerateRequest(BaseModel):
    city: Optional[str] = "Delhi"
    force_regenerate: bool = False


class ActivityStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|completed|skipped)$")
