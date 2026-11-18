from fastapi import APIRouter, Query

from app.schemas.routes import RouteCompareRequest, RouteCompareResponse
from app.services.route_service import route_service

router = APIRouter(prefix="/routes", tags=["Smart Routes"])


@router.post("/alternatives", response_model=RouteCompareResponse)
async def compare_routes_post(req: RouteCompareRequest):
    """Compare transit routes on exposure levels, carbon emissions, and travel times."""
    return await route_service.compare_routes(req)


@router.get("/alternatives", response_model=RouteCompareResponse)
async def compare_routes_get(
    origin: str = Query("Connaught Place, Delhi"),
    destination: str = Query("Cyber City, Gurugram")
):
    """GET alternative routes with comparative particulate exposure estimates."""
    req = RouteCompareRequest(origin=origin, destination=destination)
    return await route_service.compare_routes(req)
