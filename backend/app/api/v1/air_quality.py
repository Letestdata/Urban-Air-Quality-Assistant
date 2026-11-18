from typing import Optional

from fastapi import APIRouter, Query

from app.integrations.open_meteo import open_meteo_client
from app.schemas.air_quality import (
    AQIResponse,
    ForecastResponse,
    HistoricalAQIResponse,
)

router = APIRouter(prefix="/air-quality", tags=["Air Quality"])


@router.get("/current", response_model=AQIResponse)
async def get_current_air_quality(
    city: str = Query("Delhi NCR", description="Indian city name"),
    lat: Optional[float] = Query(None, description="Optional latitude"),
    lon: Optional[float] = Query(None, description="Optional longitude")
):
    """Fetch live CPCB NAQI and criteria pollutants (PM2.5, PM10, NO2, SO2, CO, O3)."""
    return await open_meteo_client.fetch_current_data(city_name=city, lat=lat, lon=lon)


@router.get("/history", response_model=HistoricalAQIResponse)
async def get_historical_air_quality(
    city: str = Query("Delhi NCR"),
    range: str = Query("24h", pattern="^(24h|7d|30d)$")
):
    """Fetch verified historical ambient measurements with completeness statistics."""
    return await open_meteo_client.fetch_history(city_name=city, range_sel=range)


@router.get("/forecast", response_model=ForecastResponse)
async def get_air_quality_forecast(
    city: str = Query("Delhi NCR")
):
    """Fetch 24-hour hourly forward projections with model uncertainty statements."""
    return await open_meteo_client.fetch_forecast(city_name=city)
