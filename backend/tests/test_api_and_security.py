import pytest


def test_health_check(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"
    assert resp.json()["standard"] == "CPCB_NAQI_INDIA"


def test_auth_registration_and_login(client):
    # 1. Register
    reg_data = {
        "full_name": "Rohan Mehta",
        "email": "rohan@example.com",
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!",
        "country": "India",
        "preferred_language": "en"
    }
    resp = client.post("/api/v1/auth/register", json=reg_data)
    assert resp.status_code == 201
    body = resp.json()
    assert "access_token" in body
    assert body["user"]["email"] == "rohan@example.com"

    # 2. Duplicate registration rejected
    resp_dup = client.post("/api/v1/auth/register", json=reg_data)
    assert resp_dup.status_code == 400
    assert resp_dup.json()["error_code"] == "EMAIL_EXISTS"

    # 3. Password mismatch rejected
    mismatch_data = reg_data.copy()
    mismatch_data["email"] = "different@example.com"
    mismatch_data["confirm_password"] = "MismatchedPw!"
    resp_mis = client.post("/api/v1/auth/register", json=mismatch_data)
    assert resp_mis.status_code == 400
    assert resp_mis.json()["error_code"] == "PASSWORD_MISMATCH"

    # 4. Login with correct password
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "rohan@example.com",
        "password": "SecurePassword123!"
    })
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

    # 5. Login with invalid password
    bad_login = client.post("/api/v1/auth/login", json={
        "email": "rohan@example.com",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401


def test_user_profile_and_export(client, auth_headers):
    # Fetch profile
    resp = client.get("/api/v1/users/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "testuser@urbanair.ai"

    # Update profile
    update_resp = client.put("/api/v1/users/me", headers=auth_headers, json={
        "occupation": "outdoor_worker",
        "commute_mode": "electric_bus"
    })
    assert update_resp.status_code == 200
    assert update_resp.json()["preferences"]["occupation"] == "outdoor_worker"
    assert update_resp.json()["preferences"]["commute_mode"] == "electric_bus"

    # Data Export (GDPR / DPDP)
    export_resp = client.get("/api/v1/users/me/export", headers=auth_headers)
    assert export_resp.status_code == 200
    assert "user_profile" in export_resp.json()
    assert export_resp.json()["user_profile"]["email"] == "testuser@urbanair.ai"


def test_air_quality_endpoints(client):
    # Current
    resp = client.get("/api/v1/air-quality/current?city=Delhi NCR")
    assert resp.status_code == 200
    data = resp.json()
    assert "aqi" in data
    assert "category" in data
    assert "pollutants" in data
    assert "PM2.5" in data["pollutants"]
    assert "weather" in data
    assert data["standard"] == "CPCB_NAQI_INDIA"

    # History
    hist_resp = client.get("/api/v1/air-quality/history?city=Delhi NCR&range=24h")
    assert hist_resp.status_code == 200
    assert len(hist_resp.json()["data_points"]) == 24

    # Forecast
    fc_resp = client.get("/api/v1/air-quality/forecast?city=Delhi NCR")
    assert fc_resp.status_code == 200
    assert len(fc_resp.json()["hourly_forecast"]) == 24
    assert "uncertainty_statement" in fc_resp.json()


def test_daily_planner_flow(client, auth_headers):
    # Generate today plan
    resp = client.get("/api/v1/plans/today", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "activities" in data
    assert len(data["activities"]) == 4

    # Update activity status
    act_id = data["activities"][0]["id"]
    patch_resp = client.patch(
        f"/api/v1/plans/activities/{act_id}",
        headers=auth_headers,
        json={"status": "completed"}
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "completed"


def test_family_profiles_and_idor_protection(client, auth_headers, test_user):
    # 1. Add family member
    add_resp = client.post("/api/v1/family/members", headers=auth_headers, json={
        "name": "Ananya",
        "age_group": "child",
        "sensitivity_notes": "Mild seasonal asthma"
    })
    assert add_resp.status_code == 201
    member_id = add_resp.json()["id"]
    assert add_resp.json()["name"] == "Ananya"
    assert len(add_resp.json()["tailored_recommendations"]) > 0

    # 2. List members
    list_resp = client.get("/api/v1/family/members", headers=auth_headers)
    assert list_resp.status_code == 200
    assert any(m["id"] == member_id for m in list_resp.json())

    # 3. Create a second user and test IDOR
    client.post("/api/v1/auth/register", json={
        "full_name": "Second User",
        "email": "user2@urbanair.ai",
        "password": "Password123!",
        "confirm_password": "Password123!"
    })
    login_user2 = client.post("/api/v1/auth/login", json={
        "email": "user2@urbanair.ai",
        "password": "Password123!"
    })
    user2_token = login_user2.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    # User 2 attempting to delete User 1's family member must return 404 (IDOR prevented)
    idor_del = client.delete(f"/api/v1/family/members/{member_id}", headers=user2_headers)
    assert idor_del.status_code == 404

    # User 1 deleting their own member succeeds
    clean_del = client.delete(f"/api/v1/family/members/{member_id}", headers=auth_headers)
    assert clean_del.status_code == 200


def test_assistant_safety_guardrails(client):
    # 1. Ask general pollutant question
    pm_resp = client.post("/api/v1/assistant/chat", json={
        "message": "What is PM2.5 and why is it dangerous?"
    })
    assert pm_resp.status_code == 200
    assert "alveoli" in pm_resp.json()["reply"]
    assert len(pm_resp.json()["sources"]) > 0

    # 2. Ask medical question (Must be refused with clinical redirect)
    med_resp = client.post("/api/v1/assistant/chat", json={
        "message": "What medicine should I take for asthma coughing?"
    })
    assert med_resp.status_code == 200
    assert "not a medical doctor" in med_resp.json()["reply"]
    assert "pulmonologist" in med_resp.json()["reply"]


def test_impact_and_routes(client, auth_headers):
    # Route comparison
    route_resp = client.get("/api/v1/routes/alternatives?origin=Delhi&destination=Gurugram")
    assert route_resp.status_code == 200
    assert len(route_resp.json()["routes"]) >= 3

    # Log trip
    impact_resp = client.post("/api/v1/impact/log", headers=auth_headers, json={
        "baseline_mode": "petrol_car",
        "chosen_mode": "metro",
        "distance_km": 15.0
    })
    assert impact_resp.status_code == 201
    assert impact_resp.json()["co2e_saved_kg"] > 0

    # Impact summary
    sum_resp = client.get("/api/v1/impact/summary", headers=auth_headers)
    assert sum_resp.status_code == 200
    assert sum_resp.json()["total_co2e_saved_kg"] > 0
    assert "distinct from ambient AQI" in sum_resp.json()["educational_note"]


def test_reports_and_notifications(client, auth_headers):
    # Report summary
    rep_resp = client.get("/api/v1/reports/summary?type=weekly", headers=auth_headers)
    assert rep_resp.status_code == 200
    assert "average_aqi" in rep_resp.json()
    assert "aqi_category_days" in rep_resp.json()

    # Notifications
    notif_resp = client.get("/api/v1/notifications", headers=auth_headers)
    assert notif_resp.status_code == 200
    assert len(notif_resp.json()) > 0
