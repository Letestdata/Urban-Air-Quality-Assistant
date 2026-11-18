import httpx

from app.core.config import get_settings
from app.integrations.open_meteo import open_meteo_client
from app.schemas.assistant import ChatRequest, ChatResponse

settings = get_settings()

ASSISTANT_KNOWLEDGE_BASE = [
    {
        "keywords": ["pm2.5", "pm25", "fine particulate", "particulate"],
        "reply": (
            "PM2.5 refers to fine inhalable particles with diameters 2.5 micrometers or smaller (about 3% the width of a human hair). "
            "Because of their tiny size, they stay airborne longer and penetrate deep into pulmonary alveoli, even entering the blood circulation. "
            "In India, CPCB sets the safe 24-hour ambient standard at 60 µg/m³ (WHO guideline is 15 µg/m³)."
        ),
        "sources": ["CPCB National Ambient Air Quality Standards (NAAQS)", "WHO Air Quality Guidelines 2021"]
    },
    {
        "keywords": ["aqi", "air quality index", "index meaning", "how is aqi calculated"],
        "reply": (
            "The Indian National Air Quality Index (NAQI) transforms complex pollutant concentrations into a single numerical index from 0 to 500. "
            "It monitors 6 primary criteria pollutants: PM2.5, PM10, NO2, SO2, CO, and O3. The overall AQI is governed by the highest individual pollutant sub-index. "
            "Categories are: Good (0-50), Satisfactory (51-100), Moderate (101-200), Poor (201-300), Very Poor (301-400), and Severe (401-500)."
        ),
        "sources": ["MoEFCC / CPCB National Air Quality Index Technical Manual"]
    },
    {
        "keywords": ["exercise", "run", "jog", "workout", "gym", "cycling"],
        "reply": (
            "During aerobic exercise, your minute ventilation increases 5 to 10 fold, causing you to inhale significantly more pollutants deeper into your lungs. "
            "When AQI exceeds 200 (Poor to Severe), high-intensity outdoor running or cycling should be shifted indoors into a room with filtered air. "
            "If AQI is between 101-200, reduce workout duration or schedule outdoor activity during the afternoon solar dispersion window (12 PM - 3 PM)."
        ),
        "sources": ["American College of Sports Medicine (ACSM)", "CPCB Health Advisory Framework"]
    },
    {
        "keywords": ["indoor", "purifier", "ventilation", "windows", "smoke", "cooking"],
        "reply": (
            "Indoor air can often be 2 to 5 times more polluted than outdoor air if sources like cooking smoke, incense, and resuspension are unmanaged. "
            "To maintain safe indoor air: 1) Run kitchen exhaust before and during cooking, 2) Open windows only during afternoon atmospheric dispersion (12:30 PM - 3 PM) when ground inversion has lifted, "
            "and 3) Size your HEPA purifier using room volume to ensure at least 5 Air Changes per Hour (ACH)."
        ),
        "sources": ["ASHRAE Standard 62.2 (Ventilation and Acceptable Indoor Air Quality)", "EPA Guide to Air Cleaners in the Home"]
    },
    {
        "keywords": ["mask", "n95", "cloth mask", "protection"],
        "reply": (
            "Standard cloth or surgical masks do not filter fine PM2.5 particulates because they lack electrostatic charge and airtight perimeter seals. "
            "When outdoor AQI exceeds 200, an authentic, certified N95 or FFP2 respirator is recommended for outdoor commutes, ensuring a snug fit over the nose and chin."
        ),
        "sources": ["NIOSH Respirator Standards", "CPCB Public Health Advisories"]
    }
]


class AssistantService:
    @staticmethod
    async def chat(req: ChatRequest) -> ChatResponse:
        """Process conversational query, applying safety filters and scientific references."""
        user_msg = req.message.strip().lower()

        # Guardrail 1: Refusal of medical prescriptions or clinical diagnoses
        medical_triggers = ["cure my", "diagnose", "medicine for asthma", "cough syrup", "antibiotic", "what medicine should i take"]
        if any(trig in user_msg for trig in medical_triggers):
            return ChatResponse(
                reply=(
                    "I am an environmental intelligence assistant, not a medical doctor. I cannot provide clinical diagnoses or prescribe medications. "
                    "If you or a family member are experiencing acute respiratory distress, severe wheezing, chest tightness, or persistent coughing, "
                    "please consult a qualified pulmonologist or healthcare professional immediately."
                ),
                sources=["Urban Air AI Safety Protocols", "Medical Disclaimer Policy"],
                safety_notes=["Medical advice strictly restricted to licensed clinical practitioners."]
            )

        # Context enrichment from live data
        city = req.context.city if req.context and req.context.city else "Delhi NCR"
        live_aqi_data = await open_meteo_client.fetch_current_data(city)
        current_aqi = live_aqi_data.aqi
        current_cat = live_aqi_data.category

        # If OpenAI API Key is configured, query LLM with safety system prompt
        if settings.OPENAI_API_KEY:
            try:
                system_prompt = f"""You are the Urban Air AI Assistant, an environmental science and daily planning assistant for India.
Current Ground Data: City: {city}, AQI: {current_aqi} ({current_cat}), Prominent Pollutant: {live_aqi_data.prominent_pollutant}.
RULES:
1. Ground your answers strictly in CPCB NAQI and environmental science principles.
2. NEVER prescribe medical treatments or promise a cure for diseases.
3. NEVER invent fake AQI numbers; always reference current city AQI: {current_aqi}.
4. Be empathetic, concise, and actionable. Provide 2-3 bulleted real-world takeaways.
"""
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": settings.AI_MODEL,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": req.message}
                            ],
                            "temperature": 0.3
                        }
                    )
                    if resp.status_code == 200:
                        content = resp.json()["choices"][0]["message"]["content"]
                        return ChatResponse(
                            reply=content,
                            sources=["CPCB Continuous Ambient Air Quality Monitoring", "Ministry of Environment, Forest & Climate Change (MoEFCC)"],
                            safety_notes=[f"Active context: {city} (AQI {current_aqi} - {current_cat})"]
                        )
            except Exception:
                pass  # Fall through to built-in knowledge base

        # Fallback to Built-in Environmental Knowledge Base
        for item in ASSISTANT_KNOWLEDGE_BASE:
            if any(k in user_msg for k in item["keywords"]):
                reply_text = f"Regarding {city} (Current AQI: {current_aqi} - {current_cat}):\n\n{item['reply']}"
                return ChatResponse(
                    reply=reply_text,
                    sources=item["sources"],
                    safety_notes=[f"Evaluated against live CPCB conditions in {city}"]
                )

        # General contextual answer
        default_reply = (
            f"In {city}, the current air quality is {current_aqi} ({current_cat}), with {live_aqi_data.prominent_pollutant} as the primary concern. "
            f"{live_aqi_data.general_health_advisory} "
            f"For daily activities, keep track of our morning/afternoon recommendations and check indoor ventilation timing."
        )
        return ChatResponse(
            reply=default_reply,
            sources=["Central Pollution Control Board (CPCB) India", "Open-Meteo Environmental Network"],
            safety_notes=[f"Station: {live_aqi_data.monitoring_station}"]
        )


assistant_service = AssistantService()
