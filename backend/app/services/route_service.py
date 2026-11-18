from typing import List

from app.integrations.open_meteo import open_meteo_client
from app.schemas.routes import RouteCompareRequest, RouteCompareResponse, RouteOption


class RouteService:
    @staticmethod
    async def compare_routes(req: RouteCompareRequest) -> RouteCompareResponse:
        """Compare route transit options based on travel time, micro-environment exposure, and emissions."""
        aqi_data = await open_meteo_client.fetch_current_data("Delhi NCR")
        current_aqi = aqi_data.aqi

        # Base estimated distance based on query length heuristic (5-15 km)
        base_km = round(7.5 + (len(req.origin) + len(req.destination)) % 8, 1)

        routes: List[RouteOption] = [
            RouteOption(
                route_name=f"Metro Route (Via Central Line from {req.origin} to {req.destination})",
                transport_mode="metro",
                distance_km=base_km + 1.2,
                duration_minutes=28,
                estimated_exposure_level="Lowest",
                exposure_score=25,
                co2e_emissions_kg=round((base_km + 1.2) * 0.015, 2),
                is_recommended=True,
                explanation="Air-conditioned metro cabins isolate passengers from street-level tailpipe exhaust and continuous braking dust."
            ),
            RouteOption(
                route_name="EV / Electric City Bus Route",
                transport_mode="bus",
                distance_km=base_km,
                duration_minutes=35,
                estimated_exposure_level="Low to Moderate",
                exposure_score=45,
                co2e_emissions_kg=round(base_km * 0.035, 2),
                is_recommended=False,
                explanation="Dedicated bus lanes reduce idling time in congested corridors; moderate cabin air filtration."
            ),
            RouteOption(
                route_name="Arterial Ring Road via Private Cab / Car",
                transport_mode="private_car",
                distance_km=base_km + 2.0,
                duration_minutes=42,
                estimated_exposure_level="Moderate",
                exposure_score=60,
                co2e_emissions_kg=round((base_km + 2.0) * 0.170, 2),
                is_recommended=False,
                explanation="Requires vehicle AC set to 'Recirculate' mode; prolonged idling in bottlenecks increases localized CO & NO2 ingestion."
            ),
            RouteOption(
                route_name="Surface Auto-Rickshaw / Two-Wheeler Direct",
                transport_mode="open_transit",
                distance_km=base_km - 0.5,
                duration_minutes=32,
                estimated_exposure_level="High",
                exposure_score=85,
                co2e_emissions_kg=round((base_km - 0.5) * 0.065, 2),
                is_recommended=False,
                explanation="Unshielded exposure to direct diesel soot, heavy truck exhaust plumes, and road dust resuspension."
            ),
        ]

        return RouteCompareResponse(
            origin=req.origin,
            destination=req.destination,
            current_city_aqi=current_aqi,
            routes=routes
        )


route_service = RouteService()
