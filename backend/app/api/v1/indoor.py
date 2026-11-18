from fastapi import APIRouter, Query

from app.schemas.indoor import (
    CADRCalculationRequest,
    CADRResponse,
    IndoorGuidanceResponse,
)
from app.services.indoor_service import indoor_service

router = APIRouter(prefix="/indoor", tags=["Indoor Air Quality"])


@router.get("/guidance", response_model=IndoorGuidanceResponse)
async def get_indoor_guidance(
    city: str = Query("Delhi NCR", description="City for ambient context")
):
    """Retrieve ventilation schedule, cooking smoke controls, dust reduction tips, and purifier guidance."""
    return await indoor_service.get_indoor_guidance(city=city)


@router.post("/cadr-calculate", response_model=CADRResponse)
def calculate_custom_cadr(req: CADRCalculationRequest):
    """Calculate exact Clean Air Delivery Rate (CADR in m³/h and CFM) for custom room dimensions."""
    return indoor_service.calculate_custom_cadr(req)
