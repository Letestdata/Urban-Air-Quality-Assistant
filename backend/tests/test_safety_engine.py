from app.rules.safety_engine import EnvironmentalSafetyEngine


def test_safety_constraints_levels():
    good_c = EnvironmentalSafetyEngine.get_safety_constraints(40)
    assert good_c["outdoor_exercise_allowed"] is True
    assert good_c["mask_recommended"] is False

    poor_c = EnvironmentalSafetyEngine.get_safety_constraints(250)
    assert poor_c["outdoor_exercise_allowed"] is False
    assert poor_c["mask_recommended"] is True

    severe_c = EnvironmentalSafetyEngine.get_safety_constraints(450)
    assert severe_c["outdoor_exercise_allowed"] is False
    assert severe_c["max_outdoor_duration_mins"] == 0


def test_safety_engine_blocks_outdoor_running_at_high_aqi():
    # Attempting to recommend outdoor jogging at AQI 260 must fail validation
    is_safe, violation = EnvironmentalSafetyEngine.validate_activity_safety(
        category="exercise",
        title="Morning Outdoor Run",
        action="Run 5 kilometers through the city park.",
        aqi=260
    )
    assert is_safe is False
    assert "Outdoor strenuous exercise is unsafe at AQI 260" in violation


def test_safety_engine_allows_indoor_exercise_at_high_aqi():
    is_safe, violation = EnvironmentalSafetyEngine.validate_activity_safety(
        category="exercise",
        title="Indoor Core Workout",
        action="Complete 30 minutes of indoor bodyweight exercises with air purifier on.",
        aqi=260
    )
    assert is_safe is True
    assert violation is None


def test_safety_engine_blocks_medical_claims():
    is_safe, violation = EnvironmentalSafetyEngine.validate_activity_safety(
        category="health",
        title="Breathing cure",
        action="This routine will cure asthma permanently.",
        aqi=80
    )
    assert is_safe is False
    assert "medical diagnosis or guarantee" in violation


def test_deterministic_plan_structure():
    plan = EnvironmentalSafetyEngine.generate_deterministic_plan(
        user_name="Priya Patel",
        occupation="software_engineer",
        aqi=185,
        category="Moderate",
        weather_summary="24°C, Clear",
        wake_time="07:00",
        sleep_time="23:00",
        commute_mode="metro",
        exercise_type="walking"
    )
    assert len(plan) == 4
    brackets = [act["time_bracket"] for act in plan]
    assert brackets == ["morning", "afternoon", "evening", "night"]
    for act in plan:
        assert "title" in act
        assert "action" in act
        assert "reason" in act
        assert "alternative" in act
        assert "evidence_type" in act
