from typing import List

from pydantic import BaseModel, Field


class VentilationWindow(BaseModel):
    time_range: str
    recommendation: str  # Recommended, Avoid, Use Filters
    reason: str
    expected_ambient_aqi: int
    outdoor_status: str


class CADRCalculationRequest(BaseModel):
    room_length_m: float = Field(..., gt=0, le=50)
    room_width_m: float = Field(..., gt=0, le=50)
    ceiling_height_m: float = Field(default=2.8, gt=1.5, le=10)
    target_air_changes_per_hour: int = Field(default=5, ge=3, le=8)


class CADRResponse(BaseModel):
    room_area_sqm: float
    room_volume_cbm: float
    recommended_cadr_m3h: float
    recommended_cadr_cfm: float
    filter_type_recommended: str = "True HEPA (H13) with Activated Carbon"
    purifier_placement_advice: str
    maintenance_reminder: str


class IndoorChecklistItem(BaseModel):
    id: str
    task: str
    category: str
    importance: str
    tip: str


class IndoorGuidanceResponse(BaseModel):
    city: str
    ambient_aqi: int
    ventilation_status: str
    best_ventilation_windows: List[VentilationWindow]
    cooking_smoke_advisories: List[str]
    dust_control_practices: List[str]
    purifier_guidance: CADRResponse
    daily_checklist: List[IndoorChecklistItem]
    disclaimer: str = (
        "Indoor air guidance is estimated based on ambient conditions and building science principles. "
        "Measured indoor air quality requires a connected physical sensor."
    )
