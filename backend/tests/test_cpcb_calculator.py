from app.rules.cpcb_calculator import (
    calculate_overall_cpcb_aqi,
    calculate_sub_index,
    get_aqi_category_and_color,
)


def test_pm25_sub_index_breakpoints():
    """Verify CPCB NAQI linear interpolation across all standard PM2.5 breakpoints."""
    # Good (0-30 µg/m³ -> 0-50 AQI)
    assert calculate_sub_index("pm25", 0.0) == 0
    assert calculate_sub_index("pm25", 15.0) == 25
    assert calculate_sub_index("pm25", 30.0) == 50

    # Satisfactory (31-60 µg/m³ -> 51-100 AQI)
    assert calculate_sub_index("pm25", 45.0) == 75
    assert calculate_sub_index("pm25", 60.0) == 100

    # Moderate (61-90 µg/m³ -> 101-200 AQI)
    assert calculate_sub_index("pm25", 75.0) == 150
    assert calculate_sub_index("pm25", 90.0) == 200

    # Poor (91-120 µg/m³ -> 201-300 AQI)
    assert calculate_sub_index("pm25", 105.0) == 250
    assert calculate_sub_index("pm25", 120.0) == 300

    # Very Poor (121-250 µg/m³ -> 301-400 AQI)
    assert calculate_sub_index("pm25", 185.0) == 350
    assert calculate_sub_index("pm25", 250.0) == 400

    # Severe (250+ µg/m³ -> 401-500 AQI)
    assert calculate_sub_index("pm25", 375.0) == 450
    assert calculate_sub_index("pm25", 500.0) == 500
    assert calculate_sub_index("pm25", 650.0) == 500  # Cap at 500


def test_pm10_sub_index():
    assert calculate_sub_index("pm10", 25.0) == 25
    assert calculate_sub_index("pm10", 50.0) == 50
    assert calculate_sub_index("pm10", 175.0) == 150
    assert calculate_sub_index("pm10", 300.0) == 250


def test_gaseous_pollutants():
    # NO2 (0-40 -> 0-50)
    assert calculate_sub_index("no2", 20.0) == 25
    # SO2 (0-40 -> 0-50)
    assert calculate_sub_index("so2", 20.0) == 25
    # CO (0-1 -> 0-50)
    assert calculate_sub_index("co", 0.5) == 25
    # O3 (0-50 -> 0-50)
    assert calculate_sub_index("o3", 25.0) == 25


def test_invalid_concentration():
    assert calculate_sub_index("pm25", None) is None
    assert calculate_sub_index("pm25", -5.0) is None
    assert calculate_sub_index("unknown_pollutant", 50.0) is None


def test_aqi_categories_and_colors():
    cat, color, gen_adv, sens_adv = get_aqi_category_and_color(35)
    assert cat == "Good"
    assert color == "#1F8A63"

    cat, color, _, _ = get_aqi_category_and_color(85)
    assert cat == "Satisfactory"

    cat, color, _, _ = get_aqi_category_and_color(165)
    assert cat == "Moderate"

    cat, color, _, _ = get_aqi_category_and_color(245)
    assert cat == "Poor"

    cat, color, _, _ = get_aqi_category_and_color(345)
    assert cat == "Very Poor"

    cat, color, _, _ = get_aqi_category_and_color(450)
    assert cat == "Severe"


def test_overall_cpcb_aqi_calculation():
    pollutants = {
        "pm25": 85.0,  # sub-index ~183 (Moderate)
        "pm10": 130.0,  # sub-index ~121 (Moderate)
        "no2": 35.0,   # sub-index ~44 (Good)
        "so2": 15.0,   # sub-index ~19 (Good)
        "co": 0.8,     # sub-index ~40 (Good)
        "o3": 30.0     # sub-index ~30 (Good)
    }
    overall_aqi, prominent, sub_indices = calculate_overall_cpcb_aqi(pollutants)
    assert overall_aqi > 150
    assert prominent == "PM25"
    assert sub_indices["pm25"] == overall_aqi
