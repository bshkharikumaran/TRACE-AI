from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.osint.search_service import get_osint_service

router = APIRouter(prefix="/osint", tags=["OSINT Search"])

class OsintSearchRequest(BaseModel):
    query: str
    investigation_id: str = "inv-001"

class OsintAddToGraphRequest(BaseModel):
    osint_id: str
    investigation_id: str = "inv-001"

@router.post("/search")
async def search_osint(payload: OsintSearchRequest):
    svc = get_osint_service()
    return await svc.search(payload.query, payload.investigation_id)

@router.post("/add-to-graph")
def add_osint_to_graph(payload: OsintAddToGraphRequest):
    svc = get_osint_service()
    return svc.add_to_investigation(payload.osint_id, payload.investigation_id)
