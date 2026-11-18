from app.integrations.open_meteo import open_meteo_client
from app.rules.indoor_engine import IndoorRulesEngine
from app.schemas.indoor import CADRCalculationRequest, CADRResponse, IndoorGuidanceResponse


class IndoorService:
    @staticmethod
    async def get_indoor_guidance(city: str = "Delhi NCR") -> IndoorGuidanceResponse:
        """Generate comprehensive indoor air quality guidance, ventilation windows, and CADR recommendations."""
        aqi_data = await open_meteo_client.fetch_current_data(city)
        windows = IndoorRulesEngine.calculate_ventilation_windows(aqi_data.aqi)
        default_cadr = IndoorRulesEngine.calculate_cadr(length=4.5, width=4.0, height=2.8, ach=5)
        checklist = IndoorRulesEngine.get_indoor_checklist()

        cooking_advisories = [
            "Always turn on the kitchen exhaust hood or chimney 2 minutes before igniting gas burners.",
            "Use lids on pans during deep-frying or tadka tempering to trap oil aerosols.",
            "Ensure cross-ventilation in the kitchen area while isolating living and sleeping quarters."
        ]

        dust_practices = [
            "Use microfiber damp cloths for dusting surfaces rather than dry feather dusters.",
            "Wash bedding and curtain fabrics weekly in warm water to reduce mite allergens.",
            "Avoid vacuum cleaners without sealed HEPA exhaust filtration."
        ]

        return IndoorGuidanceResponse(
            city=aqi_data.city,
            ambient_aqi=aqi_data.aqi,
            ventilation_status="Restricted" if aqi_data.aqi > 200 else "Windowed",
            best_ventilation_windows=windows,
            cooking_smoke_advisories=cooking_advisories,
            dust_control_practices=dust_practices,
            purifier_guidance=default_cadr,
            daily_checklist=checklist
        )

    @staticmethod
    def calculate_custom_cadr(req: CADRCalculationRequest) -> CADRResponse:
        """Calculate custom room CADR based on user room dimensions."""
        return IndoorRulesEngine.calculate_cadr(
            length=req.room_length_m,
            width=req.room_width_m,
            height=req.ceiling_height_m,
            ach=req.target_air_changes_per_hour
        )


indoor_service = IndoorService()
