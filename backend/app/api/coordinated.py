from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.graph.coordinated import get_coordinated_engine

router = APIRouter(prefix="/coordinated", tags=["Coordinated Activity"])

@router.get("", response_model=List[Dict[str, Any]])
def list_coordinated_activities():
    engine = get_coordinated_engine()
    return engine.get_coordinated_activities()
