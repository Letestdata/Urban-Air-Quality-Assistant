from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class PreferenceUpdate(BaseModel):
    occupation: Optional[str] = None
    wake_time: Optional[str] = None
    sleep_time: Optional[str] = None
    working_hours: Optional[str] = None
    commute_mode: Optional[str] = None
    exercise_type: Optional[str] = None
    environmental_goals: Optional[str] = None
    onboarding_completed: Optional[bool] = None


class PreferenceResponse(BaseModel):
    id: str
    occupation: str
    wake_time: str
    sleep_time: str
    working_hours: str
    commute_mode: str
    exercise_type: str
    environmental_goals: Optional[str] = None
    onboarding_completed: bool

    model_config = ConfigDict(from_attributes=True)


class LocationSelect(BaseModel):
    city_name: str
    state_name: Optional[str] = None
    latitude: float
    longitude: float
    monitoring_station_name: Optional[str] = None


class LocationResponse(BaseModel):
    id: str
    city_name: str
    state_name: Optional[str] = None
    latitude: float
    longitude: float
    monitoring_station_name: Optional[str] = None
    station_source: str

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    country: str
    preferred_language: str
    preferences: Optional[PreferenceResponse] = None
    saved_locations: List[LocationResponse] = []

    model_config = ConfigDict(from_attributes=True)
