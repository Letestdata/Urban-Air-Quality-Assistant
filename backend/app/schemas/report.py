from datetime import date
from typing import Dict, List

from pydantic import BaseModel


class ReportSummaryResponse(BaseModel):
    report_type: str  # daily, weekly, monthly
    period_start: date
    period_end: date
    city: str
    average_aqi: float
    peak_aqi: int
    lowest_aqi: int
    aqi_category_days: Dict[str, int]
    plan_activities_total: int
    plan_activities_completed: int
    completion_rate_pct: float
    total_co2e_saved_kg: float
    data_sources_used: List[str]
    missing_data_hours: int
    summary_insight: str
