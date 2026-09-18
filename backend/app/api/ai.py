from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.ai.groq_service import get_ai_investigator

router = APIRouter(prefix="/ai", tags=["AI Investigator"])

class AiQueryRequest(BaseModel):
    query: str
    investigation_id: str = "inv-001"

@router.post("/query")
async def query_ai_investigator(payload: AiQueryRequest):
    ai = get_ai_investigator()
    return await ai.answer_investigator_query(payload.query, payload.investigation_id)
