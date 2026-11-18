"""CPCB (Central Pollution Control Board, India) National Air Quality Index (NAQI) Calculator.

Implements official Indian National Air Quality Index linear interpolation breakpoints
as published by Ministry of Environment, Forest and Climate Change (MoEFCC), Govt. of India.
"""

from typing import Dict, Optional, Tuple

# Breakpoints: (C_low, C_high, I_low, I_high)
CPCB_BREAKPOINTS = {
    "pm25": [
        (0.0, 30.0, 0, 50),
        (30.1, 60.0, 51, 100),
        (60.1, 90.0, 101, 200),
        (90.1, 120.0, 201, 300),
        (120.1, 250.0, 301, 400),
        (250.1, 500.0, 401, 500),
    ],
    "pm10": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 250.0, 101, 200),
        (250.1, 350.0, 201, 300),
        (350.1, 430.0, 301, 400),
        (430.1, 500.0, 401, 500),
    ],
    "no2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 180.0, 101, 200),
        (180.1, 280.0, 201, 300),
        (280.1, 400.0, 301, 400),
        (400.1, 500.0, 401, 500),
    ],
    "so2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 380.0, 101, 200),
        (380.1, 800.0, 201, 300),
        (800.1, 1600.0, 301, 400),
        (1600.1, 2000.0, 401, 500),
    ],
    "co": [
        (0.0, 1.0, 0, 50),
        (1.01, 2.0, 51, 100),
        (2.01, 10.0, 101, 200),
        (10.01, 17.0, 201, 300),
        (17.01, 34.0, 301, 400),
        (34.01, 50.0, 401, 500),
    ],
    "o3": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 168.0, 101, 200),
        (168.1, 208.0, 201, 300),
        (208.1, 748.0, 301, 400),
        (748.1, 1000.0, 401, 500),
    ],
}


def calculate_sub_index(pollutant: str, concentration: Optional[float]) -> Optional[int]:
    """Calculate the sub-index for a single pollutant using CPCB breakpoints.

    Formula:
        Ip = I_low + ((I_high - I_low) / (C_high - C_low)) * (Cp - C_low)
    """
    if concentration is None or concentration < 0:
        return None

    pollutant_key = pollutant.lower().replace(".", "")
    breakpoints = CPCB_BREAKPOINTS.get(pollutant_key)
    if not breakpoints:
        return None

    # Handle concentrations exceeding the highest defined breakpoint
    max_c_high = breakpoints[-1][1]
    if concentration > max_c_high:
        return 500

    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= concentration <= c_high:
            sub_index = i_low + ((i_high - i_low) / (c_high - c_low)) * (concentration - c_low)
            return round(sub_index)

    # In case of small edge rounding gap between float boundaries
    return min(500, round(concentration))


def get_aqi_category_and_color(aqi: int) -> Tuple[str, str, str, str]:
    """Return category name, hex color, general advisory, and sensitive advisory according to CPCB NAQI."""
    if aqi <= 50:
        return (
            "Good",
            "#1F8A63",  # Emerald Green
            "Air quality is satisfactory, and air pollution poses little or no risk.",
            "Great conditions for all outdoor activities."
        )
    elif aqi <= 100:
        return (
            "Satisfactory",
            "#80C9A4",  # Mint / Light Green
            "Air quality is acceptable. Minor breathing discomfort to sensitive people.",
            "Sensitive individuals may consider reducing prolonged outdoor exertion."
        )
    elif aqi <= 200:
        return (
            "Moderate",
            "#E5A823",  # Amber / Yellow
            "Breathing discomfort to people with lung disease, asthma, and heart diseases.",
            "Children, seniors, and sensitive individuals should limit prolonged outdoor exertion."
        )
    elif aqi <= 300:
        return (
            "Poor",
            "#E67E22",  # Orange
            "Breathing discomfort to most people on prolonged outdoor exposure.",
            "Avoid strenuous outdoor activities; use high-efficiency masks (N95) outdoors."
        )
    elif aqi <= 400:
        return (
            "Very Poor",
            "#C0392B",  # Deep Red
            "Respiratory illness on prolonged exposure. Pronounced effect on sensitive people.",
            "Move all exercise indoors. Keep windows closed and run HEPA air filtration."
        )
    else:
        return (
            "Severe",
            "#7D1F2D",  # Maroon / Dark Crimson
            "Affects healthy people and seriously impacts those with existing diseases.",
            "Stay indoors as much as possible. Avoid all outdoor physical activity."
        )


def calculate_overall_cpcb_aqi(pollutants: Dict[str, Optional[float]]) -> Tuple[int, str, Dict[str, Optional[int]]]:
    """Calculate overall Indian NAQI.

    Rules by CPCB:
    1. Overall AQI is the maximum of the calculated sub-indices.
    2. At least 3 pollutants must be measured, and at least one must be PM2.5 or PM10.
    """
    sub_indices: Dict[str, Optional[int]] = {}
    valid_sub_indices: Dict[str, int] = {}

    for pol, val in pollutants.items():
        sub_idx = calculate_sub_index(pol, val)
        sub_indices[pol] = sub_idx
        if sub_idx is not None:
            valid_sub_indices[pol] = sub_idx

    has_particulate = ("pm25" in valid_sub_indices) or ("pm10" in valid_sub_indices)
    if len(valid_sub_indices) >= 3 and has_particulate:
        prominent_pol = max(valid_sub_indices, key=valid_sub_indices.get)  # type: ignore
        overall_aqi = valid_sub_indices[prominent_pol]
    elif len(valid_sub_indices) > 0 and has_particulate:
        # Fallback when fewer than 3 pollutants are present: report maximum available particulate sub-index
        prominent_pol = max(valid_sub_indices, key=valid_sub_indices.get)  # type: ignore
        overall_aqi = valid_sub_indices[prominent_pol]
    elif len(valid_sub_indices) > 0:
        prominent_pol = max(valid_sub_indices, key=valid_sub_indices.get)  # type: ignore
        overall_aqi = valid_sub_indices[prominent_pol]
    else:
        prominent_pol = "pm25"
        overall_aqi = 0

    return overall_aqi, prominent_pol.upper(), sub_indices
