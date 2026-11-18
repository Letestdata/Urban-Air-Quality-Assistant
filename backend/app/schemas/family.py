from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class FamilyMemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age_group: str = Field(..., pattern="^(child|adult|senior|pregnant)$")
    sensitivity_notes: Optional[str] = Field(None, max_length=255)
    activity_preferences: Optional[str] = None


class FamilyMemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age_group: Optional[str] = Field(None, pattern="^(child|adult|senior|pregnant)$")
    sensitivity_notes: Optional[str] = Field(None, max_length=255)
    activity_preferences: Optional[str] = None


class FamilyMemberResponse(BaseModel):
    id: str
    user_id: str
    name: str
    age_group: str
    sensitivity_notes: Optional[str] = None
    activity_preferences: Optional[str] = None
    tailored_recommendations: List[str] = []

    model_config = ConfigDict(from_attributes=True)
