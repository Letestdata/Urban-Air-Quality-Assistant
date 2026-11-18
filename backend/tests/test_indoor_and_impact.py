from app.rules.indoor_engine import IndoorRulesEngine
from app.services.impact_service import ImpactService


def test_cadr_calculation():
    # 4m x 5m room, 3m height, 5 ACH
    # Volume = 20 * 3 = 60 m3
    # CADR = 60 * 5 = 300 m3/h
    # CFM = 300 / 1.699 ~ 176.6
    res = IndoorRulesEngine.calculate_cadr(length=4.0, width=5.0, height=3.0, ach=5)
    assert res.room_area_sqm == 20.0
    assert res.room_volume_cbm == 60.0
    assert res.recommended_cadr_m3h == 300.0
    assert 170.0 < res.recommended_cadr_cfm < 180.0
    assert "True HEPA (H13)" in res.filter_type_recommended


def test_ventilation_windows():
    # Favorable air
    good_windows = IndoorRulesEngine.calculate_ventilation_windows(45)
    assert len(good_windows) == 4
    assert any("Recommended" in w.recommendation for w in good_windows)

    # Severe air
    severe_windows = IndoorRulesEngine.calculate_ventilation_windows(350)
    assert any("Avoid" in w.recommendation for w in severe_windows)


def test_indoor_checklist_content():
    checklist = IndoorRulesEngine.get_indoor_checklist()
    assert len(checklist) >= 5
    tasks = [item.task for item in checklist]
    assert any("kitchen exhaust" in t.lower() for t in tasks)
    assert any("damp-mop" in t.lower() for t in tasks)


def test_impact_carbon_savings():
    # Taking metro (0.015 kg/km) instead of petrol car (0.170 kg/km) for 10 km
    # Saved = (0.170 - 0.015) * 10 = 1.55 kg CO2e
    saved = ImpactService.calculate_savings(
        baseline_mode="petrol_car",
        chosen_mode="metro",
        distance_km=10.0
    )
    assert saved == 1.55

    # Taking bicycle (0.000) instead of diesel SUV (0.220) for 5 km
    # Saved = 0.220 * 5 = 1.10 kg CO2e
    saved_cycle = ImpactService.calculate_savings(
        baseline_mode="diesel_suv",
        chosen_mode="bicycle",
        distance_km=5.0
    )
    assert saved_cycle == 1.10
