from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.database.session import get_repository

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.get("", response_model=List[Dict[str, Any]])
def list_investigations():
    repo = get_repository()
    return repo.get_collection("investigations")

@router.get("/{investigation_id}")
def get_investigation_detail(investigation_id: str):
    repo = get_repository()
    inv = repo.find_by_id("investigations", investigation_id)
    if not inv:
        # Search by code
        for item in repo.get_collection("investigations"):
            if item.get("investigation_code") == investigation_id:
                inv = item
                break
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    # Aggregate related entities
    firs = [f for f in repo.get_collection("firs") if f.get("investigation_id") == inv["id"]][:10]
    evidence = [e for e in repo.get_collection("evidence") if e.get("investigation_id") == inv["id"]][:15]
    alerts = [a for a in repo.get_collection("alerts") if a.get("investigation_id") == inv["id"]]
    
    return {
        "investigation": inv,
        "related_firs": firs,
        "related_evidence": evidence,
        "active_alerts": alerts,
        "metrics": {
            "total_persons_under_surveillance": len(repo.get_collection("persons")),
            "monitored_vehicles": len(repo.get_collection("vehicles")),
            "flagged_bank_accounts": len(repo.get_collection("bank_accounts")),
            "connected_locations": len(repo.get_collection("locations")),
            "active_emerging_networks": len([a for a in alerts if a.get("alert_type") == "emerging_network"])
        }
    }

@router.post("")
def create_investigation(payload: Dict[str, Any]):
    repo = get_repository()
    inv_code = payload.get("investigation_code") or f"INV-{len(repo.get_collection('investigations')) + 1:03d}"
    new_inv = {
        "id": f"inv-{inv_code.lower()}",
        "investigation_code": inv_code,
        "title": payload.get("title", "Untitled Investigation"),
        "description": payload.get("description", "Active law enforcement inquiry."),
        "status": payload.get("status", "active"),
        "priority": payload.get("priority", "high"),
        "lead_investigator_id": "u-001"
    }
    repo.insert("investigations", new_inv)
    return new_inv
