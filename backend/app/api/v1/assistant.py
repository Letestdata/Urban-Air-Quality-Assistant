from fastapi import APIRouter

from app.schemas.assistant import ChatRequest, ChatResponse
from app.services.assistant_service import assistant_service

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    """Ask questions regarding AQI, PM2.5, ventilation, and daily precautions.

    Applies deterministic safety guardrails, refuses medical diagnosis, and includes source citations.
    """
    return await assistant_service.chat(req)
