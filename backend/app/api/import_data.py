"""
CSV Data Import & Column Mapping API for TRACE-AI.
Supports CSV parsing, preview, schema validation, entity resolution pre-check,
and confirmed batch ingestion into the investigation database and graph.
"""

import csv
import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from backend.app.database.session import get_repository
from backend.app.graph.engine import get_graph_engine
from backend.app.ai.entity_resolution import get_entity_resolver

router = APIRouter(prefix="/import", tags=["Data Import"])

@router.post("/preview")
async def preview_csv(file: UploadFile = File(...)):
    """Parse uploaded CSV and return column headers and preview rows."""
    contents = await file.read()
    filename = file.filename or "import.csv"
    text = contents.decode("utf-8", errors="ignore")

    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV file must contain valid headers.")

    headers = list(reader.fieldnames)
    rows = []
    for idx, row in enumerate(reader):
        if idx < 10:
            rows.append(row)
        else:
            break

    # Suggested column mappings
    mapping_suggestions = {}
    for h in headers:
        hl = h.lower()
        if "name" in hl or "person" in hl or "suspect" in hl:
            mapping_suggestions[h] = "person_name"
        elif "phone" in hl or "mobile" in hl or "contact" in hl:
            mapping_suggestions[h] = "phone"
        elif "vehicle" in hl or "reg" in hl or "plate" in hl:
            mapping_suggestions[h] = "vehicle"
        elif "location" in hl or "city" in hl or "address" in hl:
            mapping_suggestions[h] = "location"
        elif "account" in hl or "bank" in hl:
            mapping_suggestions[h] = "bank_account"
        elif "time" in hl or "date" in hl:
            mapping_suggestions[h] = "timestamp"
        elif "role" in hl or "status" in hl:
            mapping_suggestions[h] = "role"

    return {
        "filename": filename,
        "total_columns": len(headers),
        "headers": headers,
        "sample_rows": rows,
        "suggested_mappings": mapping_suggestions
    }

@router.post("/execute")
async def execute_import(payload: Dict[str, Any]):
    """Execute confirmed CSV batch import using validated column mappings."""
    repo = get_repository()
    engine = get_graph_engine()
    resolver = get_entity_resolver()

    rows = payload.get("rows", [])
    mappings = payload.get("mappings", {})  # e.g. {"Full Name": "person_name", "Phone No": "phone"}
    investigation_id = payload.get("investigation_id", "inv-001")

    valid_count = 0
    duplicate_count = 0
    potential_matches = []
    created_entities = []

    existing_persons = repo.get_collection("persons")

    for r_idx, row in enumerate(rows):
        # Extract mapped fields
        name = None
        phone = None
        vehicle = None
        role = "person_of_interest"

        for col, target in mappings.items():
            val = str(row.get(col, "")).strip()
            if target == "person_name" and val:
                name = val
            elif target == "phone" and val:
                phone = val
            elif target == "vehicle" and val:
                vehicle = val
            elif target == "role" and val:
                role = val

        if not name:
            continue

        cand = {"name": name, "phone": phone, "vehicle": vehicle}
        
        # Check for potential matches in existing database
        matches = resolver.resolve_against_repository(cand, existing_persons)
        if matches and matches[0]["resolution"]["decision"] == "MATCH":
            duplicate_count += 1
            continue
        elif matches and matches[0]["resolution"]["decision"] == "POSSIBLE MATCH":
            potential_matches.append({
                "imported_name": name,
                "matched_name": matches[0]["existing_entity"].get("name"),
                "confidence": matches[0]["resolution"]["confidence"]
            })

        # Insert new person
        p_id = f"per-imp-{abs(hash(name + str(phone))) % 100000}"
        new_p = {
            "id": p_id,
            "person_code": f"P-IMP-{abs(hash(name)) % 900 + 100:03d}",
            "name": name,
            "phone": phone,
            "vehicle": vehicle,
            "primary_role": role,
            "risk_score": 50.0,
            "network_score": 45.0,
            "status": "active",
            "investigation_id": investigation_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        repo.insert("persons", new_p)
        created_entities.append(new_p)
        valid_count += 1

    # Rebuild active graph
    engine.build_graph()

    # Log audit entry
    repo.insert("audit_logs", {
        "id": f"aud-{int(datetime.now().timestamp() * 1000)}",
        "user_id": "u-001",
        "action": "CSV_DATA_IMPORT",
        "entity_type": "batch_import",
        "entity_id": f"import_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metadata": {
            "valid_records": valid_count,
            "duplicates_filtered": duplicate_count,
            "potential_matches": len(potential_matches)
        }
    })

    return {
        "success": True,
        "valid_records_imported": valid_count,
        "duplicates_skipped": duplicate_count,
        "potential_matches_detected": potential_matches,
        "message": f"Successfully imported {valid_count} records into the active investigation dataset."
    }
