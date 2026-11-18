import json
from datetime import date
from typing import Any, Dict, List, Optional

import httpx
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.exceptions import NotFoundException
from app.integrations.open_meteo import open_meteo_client
from app.models.user import DailyPlan, PlanActivity, User
from app.rules.safety_engine import EnvironmentalSafetyEngine
from app.schemas.plan import DailyPlanResponse, PlanActivityItem

settings = get_settings()


class PlannerService:
    @staticmethod
    async def get_or_generate_today_plan(
        db: Session,
        user: User,
        city: Optional[str] = None,
        force_regenerate: bool = False
    ) -> DailyPlanResponse:
        """Fetch today's active plan, or generate a personalized routine if not yet created."""
        today = date.today()

        if not force_regenerate:
            existing_plan = (
                db.query(DailyPlan)
                .filter(DailyPlan.user_id == user.id, DailyPlan.plan_date == today)
                .order_by(DailyPlan.created_at.desc())
                .first()
            )
            if existing_plan:
                return PlannerService._to_response(existing_plan)

        # 1. Fetch live environmental data
        target_city = city or "Delhi NCR"
        aqi_data = await open_meteo_client.fetch_current_data(target_city)

        # 2. Get user preferences
        prefs = user.preferences
        wake_time = prefs.wake_time if prefs else "06:30"
        sleep_time = prefs.sleep_time if prefs else "22:30"
        occupation = prefs.occupation if prefs else "office_worker"
        commute_mode = prefs.commute_mode if prefs else "metro"
        exercise_type = prefs.exercise_type if prefs else "walking"

        # 3. Check for AI Generation or Deterministic Fallback
        activities_data: List[Dict[str, Any]] = []
        data_status = "fresh"

        if settings.OPENAI_API_KEY:
            try:
                activities_data = await PlannerService._call_ai_engine(
                    user_name=user.full_name,
                    occupation=occupation,
                    aqi=aqi_data.aqi,
                    category=aqi_data.category,
                    pm25=aqi_data.pollutants["PM2.5"].value or 0.0,
                    weather_cond=aqi_data.weather.condition,
                    temp=aqi_data.weather.temperature,
                    wake_time=wake_time,
                    sleep_time=sleep_time,
                    commute_mode=commute_mode,
                    exercise_type=exercise_type
                )
                # Run Layer 1 Deterministic Safety Validator
                for act in activities_data:
                    is_safe, violation = EnvironmentalSafetyEngine.validate_activity_safety(
                        category=act.get("category", ""),
                        title=act.get("title", ""),
                        action=act.get("action", ""),
                        aqi=aqi_data.aqi
                    )
                    if not is_safe:
                        # Safety override triggered! Fall back to deterministic plan
                        activities_data = []
                        break
            except Exception:
                activities_data = []

        if not activities_data:
            # Deterministic Rules Engine fallback
            activities_data = EnvironmentalSafetyEngine.generate_deterministic_plan(
                user_name=user.full_name,
                occupation=occupation,
                aqi=aqi_data.aqi,
                category=aqi_data.category,
                weather_summary=f"{aqi_data.weather.temperature}°C, {aqi_data.weather.condition}",
                wake_time=wake_time,
                sleep_time=sleep_time,
                commute_mode=commute_mode,
                exercise_type=exercise_type
            )
            data_status = "fallback" if settings.OPENAI_API_KEY else "fresh"

        # 4. Save plan and activities in DB
        summary = (
            f"Personalized schedule for {user.full_name} in {target_city}. "
            f"Current conditions: AQI {aqi_data.aqi} ({aqi_data.category}). "
            f"{aqi_data.general_health_advisory}"
        )

        new_plan = DailyPlan(
            user_id=user.id,
            plan_date=today,
            aqi_value=aqi_data.aqi,
            aqi_category=aqi_data.category,
            weather_summary=f"{aqi_data.weather.temperature}°C, {aqi_data.weather.condition}",
            summary=summary,
            data_status=data_status
        )
        db.add(new_plan)
        db.flush()

        for act in activities_data:
            act_obj = PlanActivity(
                plan_id=new_plan.id,
                time_bracket=act.get("time_bracket", "morning"),
                suggested_time=act.get("suggested_time", "08:00"),
                category=act.get("category", "daily_routine"),
                title=act.get("title", "Routine Activity"),
                action=act.get("action", ""),
                reason=act.get("reason", ""),
                alternative=act.get("alternative", ""),
                evidence_type=act.get("evidence_type", "measured"),
                status="pending"
            )
            db.add(act_obj)

        db.commit()
        db.refresh(new_plan)
        return PlannerService._to_response(new_plan)

    @staticmethod
    async def _call_ai_engine(
        user_name: str,
        occupation: str,
        aqi: int,
        category: str,
        pm25: float,
        weather_cond: str,
        temp: float,
        wake_time: str,
        sleep_time: str,
        commute_mode: str,
        exercise_type: str
    ) -> List[Dict[str, Any]]:
        """Call external LLM to generate structured daily schedule conforming to strict JSON schema."""
        prompt = f"""You are Urban Air AI's recommendation engine.
User: {user_name}, Occupation: {occupation}, Wake: {wake_time}, Sleep: {sleep_time}, Commute: {commute_mode}, Exercise: {exercise_type}.
Environmental Data: AQI {aqi} ({category}), PM2.5: {pm25} µg/m³, Weather: {weather_cond}, {temp}°C.
CRITICAL SAFETY CONSTRAINTS:
1. If AQI > 200, NEVER recommend outdoor running, cycling, or strenuous workouts.
2. Provide practical, empathetic actions for morning, afternoon, evening, night.
3. NEVER make medical diagnoses or promise cure.
Respond ONLY with a valid JSON array of 4 objects with keys:
"time_bracket" ("morning"|"afternoon"|"evening"|"night"),
"suggested_time" (e.g. "07:00"),
"category" ("exercise"|"commute"|"indoor_air"|"daily_routine"),
"title",
"action",
"reason",
"alternative",
"evidence_type" ("measured"|"forecast"|"general_guidance")
"""
        async with httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                json={
                    "model": settings.AI_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.2
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                # Clean possible markdown fencing
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                return json.loads(content)
        return []

    @staticmethod
    def update_activity_status(db: Session, user: User, activity_id: str, new_status: str) -> PlanActivityItem:
        """Update activity status with IDOR check."""
        activity = (
            db.query(PlanActivity)
            .join(DailyPlan)
            .filter(PlanActivity.id == activity_id, DailyPlan.user_id == user.id)
            .first()
        )
        if not activity:
            raise NotFoundException(detail="Plan activity not found or access denied.")

        activity.status = new_status
        db.commit()
        db.refresh(activity)
        return PlanActivityItem(
            id=activity.id,
            time_bracket=activity.time_bracket,
            suggested_time=activity.suggested_time,
            category=activity.category,
            title=activity.title,
            action=activity.action,
            reason=activity.reason,
            alternative=activity.alternative,
            evidence_type=activity.evidence_type,
            status=activity.status
        )

    @staticmethod
    def _to_response(plan: DailyPlan) -> DailyPlanResponse:
        constraints = EnvironmentalSafetyEngine.get_safety_constraints(plan.aqi_value)
        safety_lines = [
            f"Current Category: {plan.aqi_category} (AQI {plan.aqi_value})",
            f"Advisory: {constraints['guidance_level']}",
            "Outdoor Mask: " + ("Recommended (N95)" if constraints["mask_recommended"] else "Optional"),
            "Ventilation: " + ("Open windows during afternoon solar window" if constraints["ventilation_recommended"] else "Keep windows sealed")
        ]

        act_items = [
            PlanActivityItem(
                id=a.id,
                time_bracket=a.time_bracket,
                suggested_time=a.suggested_time,
                category=a.category,
                title=a.title,
                action=a.action,
                reason=a.reason,
                alternative=a.alternative,
                evidence_type=a.evidence_type,
                status=a.status
            )
            for a in plan.activities
        ]

        return DailyPlanResponse(
            id=plan.id,
            plan_date=plan.plan_date,
            aqi_value=plan.aqi_value,
            aqi_category=plan.aqi_category,
            weather_summary=plan.weather_summary,
            summary=plan.summary,
            data_status=plan.data_status,
            safety_guidelines=safety_lines,
            activities=act_items
        )


planner_service = PlannerService()
