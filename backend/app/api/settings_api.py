from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from backend.app.config import settings
from backend.app.database.session import get_repository
from backend.app.graph.engine import get_graph_engine
from backend.app.graph.centrality import get_role_analyzer

router = APIRouter(prefix="/settings", tags=["Settings"])

class ModeRequest(BaseModel):
    mode: str  # 'mock' or 'original'

class ApiKeysRequest(BaseModel):
    groq_api_key: Optional[str] = None
    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    search_api_key: Optional[str] = None

@router.get("/mode")
def get_mode():
    repo = get_repository()
    return {
        "mode": repo.mode,
        "description": "Mock Data Mode (Preloaded Demo)" if repo.mode == "mock" else "Original Data Mode (Live Clean Workspace)"
    }

@router.post("/mode")
def set_mode(payload: ModeRequest):
    repo = get_repository()
    engine = get_graph_engine()
    analyzer = get_role_analyzer()

    success = repo.set_mode(payload.mode)
    engine.build_graph()
    analyzer.calculate_all_metrics()

    return {
        "success": success,
        "mode": repo.mode,
        "message": f"TRACE-AI switched to {repo.mode.upper()} mode successfully."
    }

@router.post("/seed-original")
def seed_original_investigation():
    repo = get_repository()
    engine = get_graph_engine()
    analyzer = get_role_analyzer()

    repo.seed_original_demo()
    engine.build_graph()
    analyzer.calculate_all_metrics()

    return {
        "success": True,
        "message": "Operation Falcon live demonstration dataset seeded into Original Workspace.",
        "case_id": "inv-orig-001",
        "entity_count": len(repo.original_data.get("persons", [])) + len(repo.original_data.get("phone_numbers", [])) + len(repo.original_data.get("bank_accounts", [])),
        "edge_count": len(repo.original_data.get("relationships", []))
    }

@router.post("/reset-original")
def reset_original_workspace():
    repo = get_repository()
    engine = get_graph_engine()
    analyzer = get_role_analyzer()

    repo.reset_original_workspace()
    engine.build_graph()
    analyzer.calculate_all_metrics()

    return {
        "success": True,
        "message": "Original Live Workspace reset to clean empty state."
    }

@router.get("/keys")
def get_keys_status():
    return {
        "groq_api_key_configured": bool(settings.GROQ_API_KEY),
        "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY),
        "search_api_key_configured": bool(settings.SEARCH_API_KEY)
    }

@router.post("/keys")
def update_keys(payload: ApiKeysRequest):
    if payload.groq_api_key is not None:
        settings.GROQ_API_KEY = payload.groq_api_key.strip()
    if payload.supabase_url is not None:
        settings.SUPABASE_URL = payload.supabase_url.strip()
    if payload.supabase_anon_key is not None:
        settings.SUPABASE_ANON_KEY = payload.supabase_anon_key.strip()
    if payload.search_api_key is not None:
        settings.SEARCH_API_KEY = payload.search_api_key.strip()

    return {
        "success": True,
        "message": "API credentials updated in memory.",
        "status": {
            "groq_api_key_configured": bool(settings.GROQ_API_KEY),
            "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY),
            "search_api_key_configured": bool(settings.SEARCH_API_KEY)
        }
    }
