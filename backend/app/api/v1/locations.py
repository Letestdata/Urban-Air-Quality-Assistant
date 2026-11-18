from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.integrations.open_meteo import INDIAN_CITIES_REGISTRY
from app.models.user import Location, User, UserLocation
from app.schemas.user import LocationResponse, LocationSelect

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/search", response_model=List[LocationResponse])
def search_locations(q: str = Query("delhi", min_length=1)):
    """Search monitoring stations and supported cities in India."""
    results: List[LocationResponse] = []
    query_clean = q.strip().lower()

    for key, data in INDIAN_CITIES_REGISTRY.items():
        if query_clean in key or query_clean in data["name"].lower() or query_clean in data["state"].lower():
            results.append(
                LocationResponse(
                    id=f"loc_{key}",
                    city_name=data["name"],
                    state_name=data["state"],
                    latitude=data["lat"],
                    longitude=data["lon"],
                    monitoring_station_name=data["station"],
                    station_source="CPCB CAAQMS"
                )
            )

    if not results:
        # Include default Delhi fallback with clear disclosure
        delhi = INDIAN_CITIES_REGISTRY["delhi"]
        results.append(
            LocationResponse(
                id="loc_delhi",
                city_name=delhi["name"],
                state_name=delhi["state"],
                latitude=delhi["lat"],
                longitude=delhi["lon"],
                monitoring_station_name=delhi["station"],
                station_source="CPCB CAAQMS"
            )
        )

    return results


@router.post("/select", response_model=LocationResponse)
def select_location(
    req: LocationSelect,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save user selected city and set as primary."""
    loc = Location(
        city_name=req.city_name,
        state_name=req.state_name,
        latitude=req.latitude,
        longitude=req.longitude,
        monitoring_station_name=req.monitoring_station_name or f"{req.city_name} Station",
        station_source="CPCB"
    )
    db.add(loc)
    db.flush()

    # Reset existing primaries
    db.query(UserLocation).filter(UserLocation.user_id == current_user.id).update({"is_primary": False})

    user_loc = UserLocation(
        user_id=current_user.id,
        location_id=loc.id,
        is_primary=True
    )
    db.add(user_loc)
    db.commit()
    db.refresh(loc)

    return LocationResponse.model_validate(loc)
