from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.graph.hidden_links import get_hidden_engine

router = APIRouter(prefix="/hidden", tags=["Hidden Connections"])

@router.get("", response_model=List[Dict[str, Any]])
def list_hidden_connections():
    engine = get_hidden_engine()
    return engine.get_hidden_connections()
