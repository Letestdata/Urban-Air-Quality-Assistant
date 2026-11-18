from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class PollutantReading(BaseModel):
    pollutant: str  # PM2.5, PM10, NO2, SO2, CO, O3
    display_name: str
    value: Optional[float] = None
    unit: str
    sub_index: Optional[int] = None
    category: Optional[str] = None
    health_impact: Optional[str] = None
    is_available: bool = True
    standard_limit_24h: Optional[float] = None


class WeatherReading(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    wind_direction: float
    precipitation: float
    condition: str
    is_measured: bool = True


class AQIResponse(BaseModel):
    city: str
    state: Optional[str] = None
    latitude: float
    longitude: float
    aqi: int
    category: str  # Good, Satisfactory, Moderate, Poor, Very Poor, Severe
    category_color: str
    prominent_pollutant: str
    standard: str = "CPCB_NAQI_INDIA"
    monitoring_station: str
    station_distance_km: Optional[float] = None
    data_source: str
    timestamp: datetime
    data_freshness: str  # Fresh, Delayed, Stale, Unavailable
    is_forecast: bool = False
    general_health_advisory: str
    sensitive_group_advisory: str
    pollutants: Dict[str, PollutantReading]
    weather: WeatherReading


class HistoricalPoint(BaseModel):
    timestamp: datetime
    aqi: int
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    category: str


class HistoricalAQIResponse(BaseModel):
    city: str
    range_selected: str  # 24h, 7d, 30d
    data_points: List[HistoricalPoint]
    average_aqi: float
    peak_aqi: int
    min_aqi: int
    data_completeness_pct: float
    source: str


class ForecastPoint(BaseModel):
    hour: str
    aqi_estimate: int
    category: str
    confidence: str  # high, moderate, preliminary
    weather_summary: str


class ForecastResponse(BaseModel):
    city: str
    generated_at: datetime
    forecast_horizon_hours: int = 24
    provider: str
    uncertainty_statement: str
    hourly_forecast: List[ForecastPoint]
