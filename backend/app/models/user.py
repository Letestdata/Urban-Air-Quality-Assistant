import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    country = Column(String(64), default="India")
    preferred_language = Column(String(16), default="en")  # en, hi, gu
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    family_members = relationship("FamilyMember", back_populates="user", cascade="all, delete-orphan")
    daily_plans = relationship("DailyPlan", back_populates="user", cascade="all, delete-orphan")
    impact_records = relationship("ImpactRecord", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    user_locations = relationship("UserLocation", back_populates="user", cascade="all, delete-orphan")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    occupation = Column(String(64), default="office_worker")
    wake_time = Column(String(8), default="06:30")
    sleep_time = Column(String(8), default="22:30")
    working_hours = Column(String(32), default="09:00-18:00")
    commute_mode = Column(String(32), default="metro")
    exercise_type = Column(String(32), default="walking")
    environmental_goals = Column(Text, default="Understand air quality, improve indoor habits")
    onboarding_completed = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="preferences")


class Location(Base):
    __tablename__ = "locations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    city_name = Column(String(128), index=True, nullable=False)
    state_name = Column(String(128), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    monitoring_station_name = Column(String(255), nullable=True)
    station_source = Column(String(64), default="CPCB")

    user_locations = relationship("UserLocation", back_populates="location")


class UserLocation(Base):
    __tablename__ = "user_locations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    location_id = Column(String(36), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False)
    is_primary = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="user_locations")
    location = relationship("Location", back_populates="user_locations")


class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String(128), nullable=False)
    age_group = Column(String(32), nullable=False)  # child, adult, senior, pregnant
    sensitivity_notes = Column(String(255), nullable=True)  # e.g., "asthma", "mild dust allergy"
    activity_preferences = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="family_members")


class DailyPlan(Base):
    __tablename__ = "daily_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    plan_date = Column(Date, index=True, nullable=False)
    aqi_value = Column(Integer, nullable=False)
    aqi_category = Column(String(32), nullable=False)
    weather_summary = Column(String(255), nullable=True)
    summary = Column(Text, nullable=False)
    data_status = Column(String(32), default="fresh")  # fresh, delayed, fallback
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="daily_plans")
    activities = relationship("PlanActivity", back_populates="daily_plan", cascade="all, delete-orphan")


class PlanActivity(Base):
    __tablename__ = "plan_activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    plan_id = Column(String(36), ForeignKey("daily_plans.id", ondelete="CASCADE"), index=True, nullable=False)
    time_bracket = Column(String(32), nullable=False)  # morning, afternoon, evening, night
    suggested_time = Column(String(16), nullable=False)
    category = Column(String(64), nullable=False)  # exercise, commute, indoor_air, daily_routine
    title = Column(String(255), nullable=False)
    action = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    alternative = Column(Text, nullable=False)
    evidence_type = Column(String(64), nullable=False)  # measured, forecast, general_guidance
    status = Column(String(32), default="pending")  # pending, completed, skipped
    created_at = Column(DateTime(timezone=True), default=utc_now)

    daily_plan = relationship("DailyPlan", back_populates="activities")


class ImpactRecord(Base):
    __tablename__ = "impact_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    date = Column(Date, nullable=False)
    baseline_mode = Column(String(32), nullable=False)  # petrol_car, diesel_suv
    chosen_mode = Column(String(32), nullable=False)  # metro, bus, bicycle, walk, ev
    distance_km = Column(Float, nullable=False)
    co2e_saved_kg = Column(Float, nullable=False)
    assumptions = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="impact_records")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    type = Column(String(64), nullable=False)  # aqi_alert, plan_ready, stale_data, tip
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="notifications")
