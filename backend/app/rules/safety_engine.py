"""Layer 1: Deterministic Environmental Safety Engine.

Enforces physical and environmental boundaries on daily activities and AI recommendations.
The AI recommendation engine CANNOT override the safety rules defined here.
"""

from typing import Any, Dict, List, Optional, Tuple


class EnvironmentalSafetyEngine:
    @staticmethod
    def get_safety_constraints(aqi: int, is_sensitive_group: bool = False) -> Dict[str, Any]:
        """Determine hard safety boundaries for activity planning."""
        if aqi <= 50:
            return {
                "outdoor_exercise_allowed": True,
                "max_outdoor_duration_mins": 180,
                "mask_recommended": False,
                "ventilation_recommended": True,
                "guidance_level": "Unrestricted"
            }
        elif aqi <= 100:
            return {
                "outdoor_exercise_allowed": True,
                "max_outdoor_duration_mins": 120 if not is_sensitive_group else 60,
                "mask_recommended": False,
                "ventilation_recommended": True,
                "guidance_level": "Mild caution for sensitive individuals"
            }
        elif aqi <= 200:
            return {
                "outdoor_exercise_allowed": not is_sensitive_group,
                "max_outdoor_duration_mins": 60 if not is_sensitive_group else 20,
                "mask_recommended": is_sensitive_group,
                "ventilation_recommended": True,  # selective afternoon window
                "guidance_level": "Moderate precautions; shift intense cardio indoors"
            }
        elif aqi <= 300:
            return {
                "outdoor_exercise_allowed": False,
                "max_outdoor_duration_mins": 30,
                "mask_recommended": True,
                "ventilation_recommended": False,
                "guidance_level": "Avoid outdoor workouts; wear N95 mask outside"
            }
        elif aqi <= 400:
            return {
                "outdoor_exercise_allowed": False,
                "max_outdoor_duration_mins": 15,
                "mask_recommended": True,
                "ventilation_recommended": False,
                "guidance_level": "Very poor air; minimize exposure, run HEPA filter"
            }
        else:
            return {
                "outdoor_exercise_allowed": False,
                "max_outdoor_duration_mins": 0,
                "mask_recommended": True,
                "ventilation_recommended": False,
                "guidance_level": "Severe hazard; stay strictly indoors with air purification"
            }

    @staticmethod
    def validate_activity_safety(
        category: str,
        title: str,
        action: str,
        aqi: int,
        is_sensitive: bool = False
    ) -> Tuple[bool, Optional[str]]:
        """Validate if an activity proposed by AI complies with deterministic safety rules.

        Returns (is_safe, violation_reason).
        """
        lower_text = f"{title} {action}".lower()

        # Hard Rule 1: No intense outdoor cardio when AQI > 200
        if aqi > 200 and any(w in lower_text for w in ["jogging", "running", "outdoor run", "outdoor cycling", "marathon"]):
            return False, f"Outdoor strenuous exercise is unsafe at AQI {aqi}. Must be indoor exercise."

        # Hard Rule 2: Children/Seniors outdoor sports banned above AQI 200
        if is_sensitive and aqi > 200 and any(w in lower_text for w in ["playground", "park play", "outdoor sports"]):
            return False, f"Children/sensitive groups cannot engage in outdoor activities at AQI {aqi}."

        # Hard Rule 3: No medical claims allowed
        medical_terms = ["cure asthma", "heals lung", "treat bronchitis", "prescribed medicine", "guaranteed prevention"]
        if any(term in lower_text for term in medical_terms):
            return False, "Contains unsupported medical diagnosis or guarantee."

        return True, None

    @classmethod
    def generate_deterministic_plan(
        cls,
        user_name: str,
        occupation: str,
        aqi: int,
        category: str,
        weather_summary: str,
        wake_time: str = "06:30",
        sleep_time: str = "22:30",
        commute_mode: str = "metro",
        exercise_type: str = "walking"
    ) -> List[Dict[str, Any]]:
        """Produce a safe, rule-derived deterministic daily plan when AI is offline or fails validation."""
        constraints = cls.get_safety_constraints(aqi)

        # Morning Activity (Exercise / Wakeup Routine)
        if constraints["outdoor_exercise_allowed"]:
            morning_act = {
                "time_bracket": "morning",
                "suggested_time": "07:00",
                "category": "exercise",
                "title": f"Morning {exercise_type.capitalize()} Routine",
                "action": f"Enjoy a brisk 30-minute {exercise_type} session outdoors in the park.",
                "reason": f"Current AQI is {aqi} ({category}), which is within safe limits for physical activity.",
                "alternative": "Perform dynamic stretching or yoga indoors if you feel early morning humidity.",
                "evidence_type": "measured",
                "source_reference": f"CPCB NAQI ({aqi})"
            }
        else:
            morning_act = {
                "time_bracket": "morning",
                "suggested_time": "07:00",
                "category": "exercise",
                "title": "Indoor Mobility & Bodyweight Routine",
                "action": "Complete a 30-minute indoor session (yoga, resistance bands, or pilates) with windows closed.",
                "reason": f"Current AQI is {aqi} ({category}). Morning particulate levels peak due to surface thermal inversion.",
                "alternative": "Low-impact indoor treadmill walk or core strengthening workout.",
                "evidence_type": "measured",
                "source_reference": f"CPCB NAQI ({aqi})"
            }

        # Afternoon Activity (Commute & Workplace Environment)
        afternoon_act = {
            "time_bracket": "afternoon",
            "suggested_time": "13:00",
            "category": "commute",
            "title": "Midday Air Check & Travel Planning",
            "action": f"Plan any necessary midday transit using {commute_mode}. If stepping out, check local traffic.",
            "reason": "Midday solar heating raises the atmospheric boundary layer, often providing the day's lowest particulate exposure.",
            "alternative": "Reschedule non-urgent outdoor errands to the afternoon window (1 PM - 3 PM).",
            "evidence_type": "forecast",
            "source_reference": "Diurnal boundary layer dispersion cycle"
        }

        # Evening Activity (Indoor Air & Evening Routine)
        evening_act = {
            "time_bracket": "evening",
            "suggested_time": "18:30",
            "category": "daily_routine",
            "title": "Evening Commute & Infiltration Control",
            "action": "Upon returning home, keep external footwear outside and close street-facing windows.",
            "reason": f"Evening traffic and cooling temperatures cause pollutants to accumulate near ground level (AQI ~{aqi}).",
            "alternative": "Use an N95 respirator if your evening transit involves congested road corridors.",
            "evidence_type": "general_guidance",
            "source_reference": "Urban micro-environment exposure guidelines"
        }

        # Night Activity (Sleep Hygiene & Filtration)
        night_act = {
            "time_bracket": "night",
            "suggested_time": "21:30",
            "category": "indoor_air",
            "title": "Nighttime Indoor Air Optimization",
            "action": "Wipe bedroom surfaces with a damp cloth and run the HEPA air purifier on sleep mode.",
            "reason": "Clean indoor sleeping air reduces nocturnal airway irritation and promotes restorative rest.",
            "alternative": "Ensure cross-room airflow without opening external windows directly into traffic plumes.",
            "evidence_type": "general_guidance",
            "source_reference": "Indoor environmental hygiene principles"
        }

        return [morning_act, afternoon_act, evening_act, night_act]
