from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.graph.emerging import get_emerging_engine

router = APIRouter(prefix="/emerging", tags=["Emerging Networks"])

@router.get("", response_model=List[Dict[str, Any]])
def list_emerging_networks():
    engine = get_emerging_engine()
    return engine.get_emerging_networks()

@router.get("/{alert_code}")
def get_emerging_network_detail(alert_code: str):
    engine = get_emerging_engine()
    return engine.get_emerging_network_by_code(alert_code)
