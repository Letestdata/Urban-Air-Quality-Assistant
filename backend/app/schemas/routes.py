from typing import List, Optional

from pydantic import BaseModel, Field


class RouteOption(BaseModel):
    route_name: str
    transport_mode: str  # metro, bus, private_car, bicycle, walking
    distance_km: float
    duration_minutes: int
    estimated_exposure_level: str  # Lowest, Moderate, High
    exposure_score: int  # 0-100 (lower is better)
    co2e_emissions_kg: float
    is_recommended: bool
    explanation: str


class RouteCompareRequest(BaseModel):
    origin: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    preferred_mode: Optional[str] = None


class RouteCompareResponse(BaseModel):
    origin: str
    destination: str
    current_city_aqi: int
    data_limitation_statement: str = (
        "Route exposure comparisons are estimated from regional ambient monitoring, travel duration, "
        "and transport micro-environment factors. Local micro-climates and traffic density may cause variations."
    )
    routes: List[RouteOption]
