"""Coverage boost suite targeting all remaining branches in API, rules, and services."""

from app.rules.cpcb_calculator import (
    calculate_overall_cpcb_aqi,
    calculate_sub_index,
    get_aqi_category_and_color,
)
from app.rules.indoor_engine import IndoorRulesEngine
from app.rules.safety_engine import EnvironmentalSafetyEngine


def test_locations_api_endpoints(client):
    """Test searching locations, getting specific city, and coordinate lookup."""
    # 1. Search existing city
    res = client.get("/api/v1/locations/search?q=del")
    assert res.status_code == 200
    assert len(res.json()) >= 1

    # 2. Search query returns results list
    res = client.get("/api/v1/locations/search?q=mumbai")
    assert res.status_code == 200
    assert any("Mumbai" in item["city_name"] for item in res.json())

    # 3. Select location
    res = client.post(
        "/api/v1/locations/select",
        headers={"Authorization": "Bearer fake_token"},
        json={"city_name": "Delhi NCR", "state_name": "Delhi", "latitude": 28.61, "longitude": 77.23}
    )
    # Auth required so returns 401
    assert res.status_code == 401

    # 4. Search query returns results list
    res = client.get("/api/v1/locations/search?q=kolkata")
    assert res.status_code == 200


def test_notifications_full_lifecycle(client):
    """Test notification listing, marking read, and preference updates."""
    reg = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Notify User",
            "email": "notify@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!",
            "country": "India",
            "preferred_language": "en"
        }
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch notifications
    res = client.get("/api/v1/notifications", headers=headers)
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs) >= 1

    notif_id = notifs[0]["id"]

    # Mark single as read
    res = client.patch(f"/api/v1/notifications/{notif_id}/read", headers=headers)
    assert res.status_code == 200
    assert res.json()["is_read"] is True

    # Update notification preferences
    res = client.put(
        "/api/v1/notifications/preferences",
        headers=headers,
        json={
            "enable_high_aqi_alerts": True,
            "enable_daily_morning_briefing": True,
            "enable_sensitive_group_warnings": True,
            "alert_aqi_threshold": 200
        }
    )
    assert res.status_code == 200


def test_user_settings_and_preferences(client):
    """Test user settings updates, preferences toggles, and data export."""
    reg = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Settings User",
            "email": "settings@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!",
            "country": "India",
            "preferred_language": "en"
        }
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get settings
    res = client.get("/api/v1/settings", headers=headers)
    assert res.status_code == 200

    # Update settings
    res = client.put(
        "/api/v1/settings",
        headers=headers,
        json={
            "full_name": "Settings User Updated",
            "preferred_language": "hi"
        }
    )
    assert res.status_code == 200
    assert res.json()["full_name"] == "Settings User Updated"

    # Export account data (GDPR/DPDP compliance)
    res = client.get("/api/v1/users/me/export", headers=headers)
    assert res.status_code == 200
    assert "user_profile" in res.json()

    # Delete account
    res = client.delete("/api/v1/users/me", headers=headers)
    assert res.status_code == 200


def test_cpcb_calculator_edge_cases():
    """Verify sub-indices for all secondary pollutants and extreme values."""
    so2_sub = calculate_sub_index("so2", 40.0)
    assert so2_sub is not None
    assert 0 <= so2_sub <= 100

    co_sub = calculate_sub_index("co", 1.5)
    assert co_sub is not None
    assert 0 <= co_sub <= 100

    o3_sub = calculate_sub_index("o3", 75.0)
    assert o3_sub is not None
    assert 0 <= o3_sub <= 100

    # Severe overall calculation
    high_pollutants = {
        "pm25": 450.0,
        "pm10": 600.0,
        "no2": 250.0,
        "so2": 200.0,
        "co": 15.0,
        "o3": 300.0
    }
    overall_aqi, pol, _ = calculate_overall_cpcb_aqi(high_pollutants)
    assert overall_aqi >= 400

    cat, color, _, _ = get_aqi_category_and_color(450)
    assert cat == "Severe"
    assert color == "#7D1F2D"

    # Fallback with few pollutants
    aqi_single, _, _ = calculate_overall_cpcb_aqi({"pm25": 45.0})
    assert aqi_single > 0


def test_safety_and_indoor_engines():
    """Test safety constraints across different age categories and room CADR."""
    # Safety evaluation under high AQI for sensitive groups
    constraints = EnvironmentalSafetyEngine.get_safety_constraints(aqi=80, is_sensitive_group=True)
    assert constraints["max_outdoor_duration_mins"] == 60

    constraints_severe = EnvironmentalSafetyEngine.get_safety_constraints(aqi=350, is_sensitive_group=False)
    assert constraints_severe["outdoor_exercise_allowed"] is False

    # Indoor CADR requirements calculation
    cadr_res = IndoorRulesEngine.calculate_cadr(length=5.0, width=4.0, height=3.0, ach=5)
    assert cadr_res.room_area_sqm == 20.0
    assert cadr_res.recommended_cadr_cfm > 100

    checklist = IndoorRulesEngine.get_indoor_checklist()
    assert len(checklist) >= 4
