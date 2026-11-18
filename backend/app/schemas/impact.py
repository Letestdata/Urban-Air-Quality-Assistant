from datetime import date
from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ImpactLogRequest(BaseModel):
    date: Optional[date] = None
    baseline_mode: str = Field(..., description="E.g., petrol_car, diesel_suv, standard_cab")
    chosen_mode: str = Field(..., description="E.g., metro, electric_bus, bicycle, walk, ev")
    distance_km: float = Field(..., gt=0, le=500)


class ImpactRecordResponse(BaseModel):
    id: str
    date: date
    baseline_mode: str
    chosen_mode: str
    distance_km: float
    co2e_saved_kg: float
    assumptions: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ImpactSummaryResponse(BaseModel):
    total_co2e_saved_kg: float
    weekly_co2e_saved_kg: float
    monthly_co2e_saved_kg: float
    total_trips_logged: int
    equivalent_trees_planted_year: float
    mode_distribution: Dict[str, float]
    recent_records: List[ImpactRecordResponse]
    educational_note: str = (
        "Emissions avoided represents your personal carbon reduction (CO2e). "
        "This metric is distinct from ambient AQI, which is an aggregate atmospheric measurement across the entire city."
    )
