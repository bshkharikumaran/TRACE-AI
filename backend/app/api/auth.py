from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from backend.app.database.session import get_repository

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str = "demo123"

@router.get("/users")
def get_demo_users():
    repo = get_repository()
    return repo.get_collection("users")

@router.post("/login")
def login(payload: LoginRequest):
    repo = get_repository()
    users = repo.get_collection("users")
    for u in users:
        if u.get("email").lower() == payload.email.lower():
            return {
                "token": f"jwt_mock_{u['id']}",
                "user": u
            }
    # Return default investigator user for quick demo login
    default_user = users[0] if users else {
        "id": "u-001",
        "name": "Inspector Rajeshwari Devi",
        "email": "rajeshwari.devi@ncrb.gov.in",
        "role": "investigator",
        "department": "Women Safety Division, NCRB"
    }
    return {
        "token": f"jwt_mock_{default_user['id']}",
        "user": default_user
    }
