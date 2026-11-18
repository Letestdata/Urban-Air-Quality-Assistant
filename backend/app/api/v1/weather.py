from typing import Optional

from fastapi import APIRouter, Query

from app.integrations.open_meteo import open_meteo_client
from app.schemas.air_quality import WeatherReading

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("/current", response_model=WeatherReading)
async def get_current_weather(
    city: str = Query("Delhi NCR"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None)
):
    """Fetch current ambient temperature, humidity, wind speed, wind direction, and rain chance."""
    data = await open_meteo_client.fetch_current_data(city_name=city, lat=lat, lon=lon)
    return data.weather
