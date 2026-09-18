from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from backend.app.config import settings
from backend.app.api.auth import router as auth_router
from backend.app.api.investigations import router as investigations_router
from backend.app.api.network import router as network_router
from backend.app.api.emerging import router as emerging_router
from backend.app.api.hidden import router as hidden_router
from backend.app.api.coordinated import router as coordinated_router
from backend.app.api.financial import router as financial_router
from backend.app.api.timeline import router as timeline_router
from backend.app.api.documents import router as documents_router
from backend.app.api.ai import router as ai_router
from backend.app.api.osint import router as osint_router
from backend.app.api.evidence import router as evidence_router
from backend.app.api.priority import router as priority_router
from backend.app.api.audit import router as audit_router
from backend.app.api.settings_api import router as settings_router
from backend.app.api.import_data import router as import_router
from backend.app.api.reports import router as reports_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trace_ai")

app = FastAPI(
    title="TRACE-AI",
    version=settings.VERSION,
    description="TRACE-AI — Threat Relation Analysis & Crime Exploration"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for development / hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(investigations_router, prefix="/api")
app.include_router(network_router, prefix="/api")
app.include_router(emerging_router, prefix="/api")
app.include_router(hidden_router, prefix="/api")
app.include_router(coordinated_router, prefix="/api")
app.include_router(financial_router, prefix="/api")
app.include_router(timeline_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(osint_router, prefix="/api")
app.include_router(evidence_router, prefix="/api")
app.include_router(priority_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(settings_router, prefix="/api")
app.include_router(import_router, prefix="/api")
app.include_router(reports_router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "organization": settings.ORGANIZATION,
        "problem_code": settings.PROBLEM_CODE,
        "database_mode": "supabase" if settings.SUPABASE_URL else "embedded_local_repo",
        "ai_engine": "groq_cloud" if settings.GROQ_API_KEY else "grounded_rule_engine",
        "osint_mode": "live_web" if settings.SEARCH_API_KEY else "high_fidelity_demo"
    }

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "organization": settings.ORGANIZATION,
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
