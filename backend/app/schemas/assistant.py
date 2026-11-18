from typing import List, Optional

from pydantic import BaseModel, Field


class AssistantContext(BaseModel):
    city: Optional[str] = "Delhi"
    current_aqi: Optional[int] = None
    prominent_pollutant: Optional[str] = None
    weather_condition: Optional[str] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    context: Optional[AssistantContext] = None


class ChatResponse(BaseModel):
    reply: str
    sources: List[str]
    safety_notes: List[str]
    disclaimer: str = (
        "Urban Air AI Assistant provides environmental guidance only. "
        "It does not provide medical diagnoses or healthcare prescriptions."
    )
