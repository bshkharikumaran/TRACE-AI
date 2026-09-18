from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from backend.app.database.session import get_repository
from backend.app.evidence.integrity import get_evidence_integrity_engine

router = APIRouter(prefix="/evidence", tags=["Evidence Vault"])

class VerifyRequest(BaseModel):
    simulate_tamper: Optional[bool] = False

@router.get("")
def list_evidence():
    repo = get_repository()
    return repo.get_collection("evidence")

@router.get("/{evidence_id}")
def get_evidence_detail(evidence_id: str):
    repo = get_repository()
    ev = repo.find_by_id("evidence", evidence_id)
    if not ev:
        for it in repo.get_collection("evidence"):
            if it.get("evidence_code") == evidence_id:
                ev = it
                break
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence item not found")
    return ev

@router.post("/{evidence_id}/verify")
def verify_evidence_hash(evidence_id: str, payload: VerifyRequest):
    engine = get_evidence_integrity_engine()
    res = engine.verify_evidence(evidence_id, simulated_tampered=payload.simulate_tamper or False)
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("message"))
    return res

@router.post("")
def create_evidence(payload: dict):
    repo = get_repository()
    code = payload.get("evidence_code") or f"EVID-{len(repo.get_collection('evidence')) + 1001}"
    title = payload.get("title", "Investigative Exhibit")
    
    import hashlib
    from datetime import datetime, timezone
    sha256 = payload.get("sha256_hash") or hashlib.sha256(f"{code}_{title}_{datetime.now()}".encode()).hexdigest()
    
    new_ev = {
        "id": f"ev-{code.lower()}",
        "evidence_code": code,
        "investigation_id": payload.get("investigation_id", "inv-001"),
        "title": title,
        "description": payload.get("description", "Certified custody record."),
        "source_type": payload.get("source_type", "document"),
        "sha256_hash": sha256,
        "verification_status": "verified",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    repo.insert("evidence", new_ev)
    
    # Audit log
    repo.insert("audit_logs", {
        "id": f"aud-{int(datetime.now().timestamp() * 1000)}",
        "user_id": "u-001",
        "action": "EVIDENCE_DEPOSITED",
        "entity_type": "evidence",
        "entity_id": code,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metadata": {"sha256": sha256}
    })
    return new_ev

