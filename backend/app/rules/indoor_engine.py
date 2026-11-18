"""Indoor Environmental Quality & Ventilation Engine.

Calculates science-backed ventilation windows and CADR (Clean Air Delivery Rate)
for room air purifiers based on building physics and diurnal air dispersion dynamics.
"""

from typing import List

from app.schemas.indoor import CADRResponse, IndoorChecklistItem, VentilationWindow


class IndoorRulesEngine:
    @staticmethod
    def calculate_cadr(length: float, width: float, height: float = 2.8, ach: int = 5) -> CADRResponse:
        """Calculate required CADR for an enclosed residential room.

        Formula:
            Room Volume (m³) = Length * Width * Height
            CADR (m³/h) = Room Volume * Air Changes per Hour (ACH)
            CADR (CFM) = CADR (m³/h) / 1.699
        """
        area = round(length * width, 2)
        volume = round(area * height, 2)
        cadr_m3h = round(volume * ach, 1)
        cadr_cfm = round(cadr_m3h / 1.699, 1)

        placement = (
            "Place the air purifier in an unobstructed central area or at least 0.5m away from walls and curtains. "
            "Avoid placing it right next to an open window or kitchen stove."
        )
        maintenance = (
            "Vacuum the pre-filter mesh every 2-3 weeks to remove hair and coarse lint. "
            "Replace the True HEPA (H13) filter every 6 to 12 months depending on ambient particulate levels."
        )

        return CADRResponse(
            room_area_sqm=area,
            room_volume_cbm=volume,
            recommended_cadr_m3h=cadr_m3h,
            recommended_cadr_cfm=cadr_cfm,
            filter_type_recommended="True HEPA (H13) + Activated Carbon Granules",
            purifier_placement_advice=placement,
            maintenance_reminder=maintenance
        )

    @staticmethod
    def calculate_ventilation_windows(ambient_aqi: int) -> List[VentilationWindow]:
        """Compute the 4 diurnal periods and recommend window opening actions."""
        if ambient_aqi <= 100:
            return [
                VentilationWindow(
                    time_range="07:00 - 10:00",
                    recommendation="Recommended",
                    reason="Outdoor air is within acceptable ranges. Gentle cross-ventilation flushes indoor CO2.",
                    expected_ambient_aqi=ambient_aqi,
                    outdoor_status="Favorable"
                ),
                VentilationWindow(
                    time_range="12:00 - 15:30",
                    recommendation="Recommended",
                    reason="Peak solar insolation maximizes atmospheric mixing and vertical dispersion.",
                    expected_ambient_aqi=max(25, int(ambient_aqi * 0.85)),
                    outdoor_status="Optimal"
                ),
                VentilationWindow(
                    time_range="17:00 - 20:00",
                    recommendation="Use Filters",
                    reason="Evening traffic and temperature drop increase localized street-level emissions.",
                    expected_ambient_aqi=int(ambient_aqi * 1.15),
                    outdoor_status="Moderate"
                ),
                VentilationWindow(
                    time_range="21:00 - 06:00",
                    recommendation="Use Filters",
                    reason="Keep windows cracked slightly only if room CO2 builds up; otherwise run purifier on quiet mode.",
                    expected_ambient_aqi=int(ambient_aqi * 1.1),
                    outdoor_status="Night Stagnation"
                ),
            ]
        elif ambient_aqi <= 250:
            return [
                VentilationWindow(
                    time_range="06:30 - 10:30",
                    recommendation="Avoid",
                    reason="Thermal inversion traps nocturnal vehicular particulates near ground level.",
                    expected_ambient_aqi=int(ambient_aqi * 1.2),
                    outdoor_status="Elevated"
                ),
                VentilationWindow(
                    time_range="12:30 - 15:00",
                    recommendation="Recommended (15-20 min)",
                    reason="Highest boundary layer of the day offers the cleanest outdoor air window for a quick air flush.",
                    expected_ambient_aqi=int(ambient_aqi * 0.8),
                    outdoor_status="Best Window"
                ),
                VentilationWindow(
                    time_range="17:00 - 21:00",
                    recommendation="Avoid",
                    reason="Post-sunset cooling and heavy commuter traffic concentrate exhaust near dwellings.",
                    expected_ambient_aqi=int(ambient_aqi * 1.25),
                    outdoor_status="Elevated"
                ),
                VentilationWindow(
                    time_range="21:30 - 06:00",
                    recommendation="Use Filters",
                    reason="Seal windows and run HEPA air purification in bedrooms overnight.",
                    expected_ambient_aqi=ambient_aqi,
                    outdoor_status="Controlled Indoor"
                ),
            ]
        else:
            return [
                VentilationWindow(
                    time_range="All Day (06:00 - 12:00)",
                    recommendation="Avoid",
                    reason="Severe outdoor particulate concentration. Keep all exterior doors and windows sealed.",
                    expected_ambient_aqi=ambient_aqi,
                    outdoor_status="Hazardous"
                ),
                VentilationWindow(
                    time_range="13:30 - 14:15",
                    recommendation="Brief Crack Only if CO2 > 1200ppm",
                    reason="Brief cross-draft only if occupants experience drowsiness from indoor CO2 buildup.",
                    expected_ambient_aqi=int(ambient_aqi * 0.88),
                    outdoor_status="Relative Minimum"
                ),
                VentilationWindow(
                    time_range="16:00 - 24:00",
                    recommendation="Avoid",
                    reason="High toxic particulate infiltration risk. Continuous HEPA filtration recommended.",
                    expected_ambient_aqi=int(ambient_aqi * 1.15),
                    outdoor_status="Hazardous"
                ),
            ]

    @staticmethod
    def get_indoor_checklist() -> List[IndoorChecklistItem]:
        return [
            IndoorChecklistItem(
                id="c1",
                task="Turn on kitchen exhaust chimney 2 minutes before cooking",
                category="Cooking Smoke",
                importance="High",
                tip="Captures ultra-fine frying oils and combustion gases before they disperse into living areas."
            ),
            IndoorChecklistItem(
                id="c2",
                task="Damp-mop hard floors instead of dry sweeping",
                category="Dust Control",
                importance="High",
                tip="Dry brooms resuspend settled PM2.5 and PM10 particles into your breathing zone for 2-3 hours."
            ),
            IndoorChecklistItem(
                id="c3",
                task="Inspect and clean air purifier pre-filter mesh",
                category="Filtration",
                importance="Medium",
                tip="Removing hair and visible lint extends HEPA life and restores optimal volumetric airflow."
            ),
            IndoorChecklistItem(
                id="c4",
                task="Avoid burning incense (agarbatti) or dhoop indoors during high AQI days",
                category="Indoor Sources",
                importance="High",
                tip="Incense produces dense polycyclic aromatic hydrocarbons and particulate spikes exceeding 500 µg/m³."
            ),
            IndoorChecklistItem(
                id="c5",
                task="Ventilate during the afternoon solar dispersion window",
                category="Ventilation",
                importance="Medium",
                tip="Prevents indoor VOC and CO2 accumulation while taking advantage of natural atmospheric mixing."
            ),
        ]
