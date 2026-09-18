from fastapi import APIRouter, Query
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from backend.app.database.session import get_repository
from backend.app.graph.engine import get_graph_engine

router = APIRouter(prefix="/timeline", tags=["Timeline Intelligence"])

@router.get("/evolution")
def get_timeline_evolution(
    days: int = Query(30, description="Window size in days (e.g. 7, 30, 90)"),
    step_day: int = Query(30, description="Current simulation day for timeline slider (1 to 35)")
):
    repo = get_repository()
    engine = get_graph_engine()
    
    base_time = datetime(2026, 8, 1, 0, 0, 0, tzinfo=timezone.utc)
    current_cutoff = base_time + timedelta(days=step_day)
    window_start = max(base_time, current_cutoff - timedelta(days=days))

    # Filter relationships up to current cutoff
    all_rels = repo.get_collection("relationships")
    active_rels = []
    active_node_ids = set()
    
    for r in all_rels:
        ts_str = r.get("timestamp", "")
        try:
            ts = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
            if ts <= current_cutoff:
                active_rels.append(r)
                active_node_ids.add(r["source_entity_id"])
                active_node_ids.add(r["target_entity_id"])
        except Exception:
            active_rels.append(r)

    # Milestones across the timeline
    milestones = [
        {"day": 5, "date": "Aug 05", "event": "FIR-102 Lodged", "category": "incident", "summary": "Dhaula Kuan transport coercion complaint"},
        {"day": 12, "date": "Aug 12", "event": "Highway Intercept FIR-108", "category": "incident", "summary": "GT Road toll coercion by Suresh Nair cell"},
        {"day": 18, "date": "Aug 18", "event": "First Contact P-014 <-> P-021", "category": "communication", "summary": "Encrypted VoIP session linking Extortion and Port syndicates"},
        {"day": 20, "date": "Aug 20", "event": "Fund Injection B-033 -> B-021", "category": "financial", "summary": "₹4,50,000 loan scam proceeds layered into Swift Horizons"},
        {"day": 24, "date": "Aug 24", "event": "Midnight Meeting L-012", "category": "meeting", "summary": "CCTV captures V-009 Fortuner meeting V-004 at Nhava Terminal"},
        {"day": 28, "date": "Aug 28", "event": "🚨 NET-017 Triggered", "category": "alert", "summary": "Emerging Network convergence confidence reaches 89%"}
    ]

    return {
        "simulation_day": step_day,
        "current_date": current_cutoff.strftime("%Y-%m-%d"),
        "window_days": days,
        "active_nodes_count": len(active_node_ids),
        "active_relationships_count": len(active_rels),
        "milestones": milestones,
        "recent_firs_count": len([f for f in repo.get_collection("firs") if f.get("date", "") <= current_cutoff.isoformat()]),
        "recent_tx_count": len([t for t in repo.get_collection("transactions") if t.get("timestamp", "") <= current_cutoff.isoformat()])
    }
