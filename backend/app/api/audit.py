from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.database.session import get_repository

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("", response_model=List[Dict[str, Any]])
def list_audit_logs():
    repo = get_repository()
    logs = repo.get_collection("audit_logs")
    return sorted(logs, key=lambda x: x.get("timestamp", ""), reverse=True)
