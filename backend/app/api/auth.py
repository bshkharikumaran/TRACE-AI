from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from backend.app.database.session import get_repository

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str = "demo123"

ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "administrator": [
        "all",
        "manage_cases",
        "deposit_evidence",
        "import_data",
        "view_analytics",
        "view_audit_logs",
        "manage_settings",
        "switch_mode",
        "ai_copilot"
    ],
    "investigator": [
        "manage_cases",
        "deposit_evidence",
        "import_data",
        "view_analytics",
        "view_audit_logs",
        "ai_copilot"
    ],
    "analyst": [
        "view_analytics",
        "ai_copilot",
        "view_cases"
    ],
    "auditor": [
        "view_audit_logs",
        "verify_evidence",
        "view_cases",
        "view_analytics"
    ]
}

STATIC_OFFICERS = [
    {
        "id": "u-003",
        "name": "Deputy Director Alok Verma",
        "email": "alok.verma@ncrb.gov.in",
        "role": "administrator",
        "department": "Directorate of Operations, NCRB",
        "badge_number": "NCRB-ADM-1001"
    },
    {
        "id": "u-001",
        "name": "Inspector Rajeshwari Devi",
        "email": "rajeshwari.devi@ncrb.gov.in",
        "role": "investigator",
        "department": "Women Safety Division, NCRB",
        "badge_number": "NCRB-INV-7741"
    },
    {
        "id": "u-002",
        "name": "Sr. Analyst Sameer Sen",
        "email": "sameer.sen@ncrb.gov.in",
        "role": "analyst",
        "department": "Cyber & Financial Intelligence Unit",
        "badge_number": "NCRB-ANA-3302"
    },
    {
        "id": "u-004",
        "name": "Vigilance Officer K. Raman",
        "email": "k.raman@ncrb.gov.in",
        "role": "auditor",
        "department": "Internal Oversight & Compliance Division",
        "badge_number": "NCRB-AUD-5590"
    }
]

EMAIL_ROLE_MAP = {
    "admin@ncrb.gov.in": "u-003",
    "alok.verma@ncrb.gov.in": "u-003",
    "administrator": "u-003",
    "investigator@ncrb.gov.in": "u-001",
    "rajeshwari.devi@ncrb.gov.in": "u-001",
    "investigator": "u-001",
    "analyst@ncrb.gov.in": "u-002",
    "sameer.sen@ncrb.gov.in": "u-002",
    "analyst": "u-002",
    "auditor@ncrb.gov.in": "u-004",
    "k.raman@ncrb.gov.in": "u-004",
    "auditor": "u-004"
}

@router.get("/users")
def get_demo_users():
    repo = get_repository()
    users = repo.get_collection("users")
    user_pool = {u.get("id"): u for u in STATIC_OFFICERS}
    for u in users:
        if u.get("id"):
            user_pool[u["id"]] = u
    enriched = []
    for u in user_pool.values():
        role = u.get("role", "investigator")
        enriched.append({
            **u,
            "permissions": ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS["investigator"])
        })
    return enriched

@router.post("/login")
def login(payload: LoginRequest):
    repo = get_repository()
    users = repo.get_collection("users")
    user_pool = {u.get("id"): u for u in STATIC_OFFICERS}
    for u in users:
        if u.get("id"):
            user_pool[u["id"]] = u

    all_users = list(user_pool.values())
    search_email = payload.email.strip().lower()
    
    # Check alias mapping
    target_id = EMAIL_ROLE_MAP.get(search_email)

    matched_user = None
    if target_id and target_id in user_pool:
        matched_user = user_pool[target_id]

    if not matched_user:
        for u in all_users:
            if u.get("email", "").lower() == search_email:
                matched_user = u
                break

    if not matched_user:
        for u in all_users:
            if u.get("role", "").lower() == search_email:
                matched_user = u
                break

    if not matched_user:
        matched_user = user_pool["u-001"]

    role = matched_user.get("role", "investigator")
    user_with_perms = {
        **matched_user,
        "permissions": ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS["investigator"])
    }

    return {
        "token": f"jwt_ncrb_{matched_user['id']}_{role}",
        "user": user_with_perms
    }
