from datetime import date, timedelta
from typing import Dict

from sqlalchemy.orm import Session

from app.models.user import ImpactRecord, User
from app.schemas.impact import ImpactLogRequest, ImpactRecordResponse, ImpactSummaryResponse

# Standard Emission Factors (kg CO2e per passenger-km) in India
EMISSION_FACTORS: Dict[str, float] = {
    "petrol_car": 0.170,
    "diesel_suv": 0.220,
    "standard_cab": 0.180,
    "two_wheeler_petrol": 0.065,
    "cng_auto": 0.075,
    "electric_bus": 0.030,
    "metro": 0.015,
    "ev": 0.045,
    "bicycle": 0.000,
    "walk": 0.000
}


class ImpactService:
    @staticmethod
    def calculate_savings(baseline_mode: str, chosen_mode: str, distance_km: float) -> float:
        """Calculate kg of CO2e avoided using baseline and chosen transport mode factors."""
        base_factor = EMISSION_FACTORS.get(baseline_mode.lower(), 0.170)
        chosen_factor = EMISSION_FACTORS.get(chosen_mode.lower(), 0.015)
        savings = (base_factor - chosen_factor) * distance_km
        return max(0.0, round(savings, 2))

    @staticmethod
    def log_impact(db: Session, user: User, req: ImpactLogRequest) -> ImpactRecordResponse:
        """Record a sustainable trip and compute avoided carbon emissions."""
        log_date = req.date or date.today()
        saved = ImpactService.calculate_savings(req.baseline_mode, req.chosen_mode, req.distance_km)
        assumptions = (
            f"Baseline factor ({req.baseline_mode}): {EMISSION_FACTORS.get(req.baseline_mode, 0.170)} kg/km; "
            f"Chosen factor ({req.chosen_mode}): {EMISSION_FACTORS.get(req.chosen_mode, 0.015)} kg/km."
        )

        record = ImpactRecord(
            user_id=user.id,
            date=log_date,
            baseline_mode=req.baseline_mode,
            chosen_mode=req.chosen_mode,
            distance_km=round(req.distance_km, 2),
            co2e_saved_kg=saved,
            assumptions=assumptions
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return ImpactRecordResponse.model_validate(record)

    @staticmethod
    def get_summary(db: Session, user: User) -> ImpactSummaryResponse:
        """Get aggregate personal carbon avoided summary."""
        records = db.query(ImpactRecord).filter(ImpactRecord.user_id == user.id).all()
        today = date.today()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        total_saved = sum(r.co2e_saved_kg for r in records)
        weekly_saved = sum(r.co2e_saved_kg for r in records if r.date >= week_ago)
        monthly_saved = sum(r.co2e_saved_kg for r in records if r.date >= month_ago)

        mode_dist: Dict[str, float] = {}
        for r in records:
            mode_dist[r.chosen_mode] = mode_dist.get(r.chosen_mode, 0.0) + r.distance_km

        # 1 mature tree absorbs ~22 kg CO2 per year
        tree_equiv = round(total_saved / 22.0, 2)

        recent = (
            db.query(ImpactRecord)
            .filter(ImpactRecord.user_id == user.id)
            .order_by(ImpactRecord.created_at.desc())
            .limit(10)
            .all()
        )

        return ImpactSummaryResponse(
            total_co2e_saved_kg=round(total_saved, 2),
            weekly_co2e_saved_kg=round(weekly_saved, 2),
            monthly_co2e_saved_kg=round(monthly_saved, 2),
            total_trips_logged=len(records),
            equivalent_trees_planted_year=tree_equiv,
            mode_distribution=mode_dist,
            recent_records=[ImpactRecordResponse.model_validate(r) for r in recent]
        )


impact_service = ImpactService()
