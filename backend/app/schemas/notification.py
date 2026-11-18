from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    id: str
    type: str  # aqi_alert, plan_ready, stale_data, tip
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationPreferencesUpdate(BaseModel):
    aqi_alerts: bool = True
    daily_plan_reminder: bool = True
    quiet_hours_enabled: bool = False
    quiet_hours_start: str = "22:00"
    quiet_hours_end: str = "07:00"
