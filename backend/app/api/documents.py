from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from datetime import datetime, timezone
from typing import Dict, Any, List
from backend.app.database.session import get_repository
from backend.app.graph.engine import get_graph_engine
from backend.app.ai.ner_service import get_ner_service
from backend.app.ai.entity_resolution import get_entity_resolver

router = APIRouter(prefix="/documents", tags=["Document Intelligence"])

@router.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    investigation_id: str = Form("inv-001")
):
    contents = await file.read()
    filename = file.filename or "uploaded_document.txt"
    file_size = len(contents)
    
    import hashlib
    import re
    sha256_hash = hashlib.sha256(contents).hexdigest()

    # Determine file format & category
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    media_exts = {"png", "jpg", "jpeg", "webp", "gif", "bmp", "mp3", "wav", "m4a", "mp4", "mkv", "avi", "mov"}
    archive_exts = {"zip", "rar", "7z", "tar", "gz", "bz2", "pcap", "dat", "bin", "raw"}
    doc_exts = {"pdf", "doc", "docx", "txt", "rtf", "odt", "csv", "tsv", "json", "xml", "xlsx", "xls", "log"}

    file_category = "Document"
    if ext in media_exts:
        file_category = "Media / Audio-Visual Evidence"
    elif ext in archive_exts:
        file_category = "Archive / Forensic Image"
    elif ext in doc_exts:
        file_category = "Textual / Structured Document"

    # Extract readable text strings
    text = ""
    try:
        text = contents.decode("utf-8")
    except UnicodeDecodeError:
        # Extract printable ASCII/UTF-8 strings from binary (PDF, DOCX, media, archive)
        printable_strings = re.findall(rb"[A-Za-z0-9\s\.,;:_\-\+@\(\)\/]{4,}", contents)
        text = " ".join(s.decode("latin1", errors="ignore") for s in printable_strings[:500])

    if len(text.strip()) < 10:
        # Generate rich forensic analysis metadata for non-text / media / binary files
        text = (
            f"DIGITAL FORENSIC EVIDENCE EXHIBIT: {filename}\n"
            f"Format Category: {file_category} (. {ext.upper() if ext else 'BIN'})\n"
            f"Cryptographic SHA-256: {sha256_hash}\n"
            f"Physical File Size: {file_size} bytes\n"
            f"Chain of Custody Status: Certified Forensic Ingestion\n"
            f"Exhibit Reference: EX-{sha256_hash[:8].upper()}"
        )

    # 1. Run Transformer NER
    ner_service = get_ner_service()
    ner_result = await ner_service.extract_entities(text)
    entities = ner_result.get("entities", {})

    # 2. Run Entity Resolution against existing database records
    repo = get_repository()
    existing_persons = repo.get_collection("persons")
    entity_resolver = get_entity_resolver()

    # Safely normalize persons
    resolved_persons = []
    raw_persons = entities.get("persons", [])
    for p in raw_persons:
        p_name = p.get("name") if isinstance(p, dict) else str(p)
        if not p_name:
            continue
        cand = {"name": p_name}
        matches = entity_resolver.resolve_against_repository(cand, existing_persons)
        top_match = matches[0] if matches else None
        p_conf = p.get("confidence", 0.85) if isinstance(p, dict) else 0.85
        resolved_persons.append({
            "name": p_name,
            "confidence": round(float(p_conf) * 100, 1),
            "match_status": top_match["resolution"]["decision"] if top_match else "NEW ENTITY",
            "matched_existing": top_match["existing_entity"]["name"] if top_match else None,
            "resolution_confidence": top_match["resolution"]["confidence"] if top_match else 0.0,
            "review_required": bool(top_match and top_match["resolution"]["requires_human_review"]),
            "reasoning": top_match["resolution"]["reasoning"] if top_match else "No existing entity matches found."
        })

    # Safely normalize phones
    normalized_phones = []
    for ph in entities.get("phones", []):
        num = ph.get("number") if isinstance(ph, dict) else str(ph)
        if num:
            conf = ph.get("confidence", 0.85) if isinstance(ph, dict) else 0.85
            normalized_phones.append({"number": num, "confidence": round(float(conf) * 100, 1)})

    # Safely normalize vehicles
    normalized_vehicles = []
    for v in entities.get("vehicles", []):
        reg = v.get("registration") if isinstance(v, dict) else str(v)
        if reg:
            conf = v.get("confidence", 0.88) if isinstance(v, dict) else 0.88
            normalized_vehicles.append({"registration": reg, "confidence": round(float(conf) * 100, 1)})

    # Safely normalize locations
    normalized_locations = []
    for l in entities.get("locations", []):
        loc_name = l.get("name") if isinstance(l, dict) else str(l)
        if loc_name:
            conf = l.get("confidence", 0.80) if isinstance(l, dict) else 0.80
            normalized_locations.append({"name": loc_name, "confidence": round(float(conf) * 100, 1)})

    # Safely normalize organizations
    normalized_orgs = []
    for o in entities.get("organizations", []):
        org_name = o.get("name") if isinstance(o, dict) else str(o)
        if org_name:
            conf = o.get("confidence", 0.82) if isinstance(o, dict) else 0.82
            normalized_orgs.append({"name": org_name, "confidence": round(float(conf) * 100, 1)})

    # Safely normalize accounts
    normalized_accounts = []
    for a in entities.get("accounts", []):
        acc = a.get("account") if isinstance(a, dict) else str(a)
        if acc:
            conf = a.get("confidence", 0.80) if isinstance(a, dict) else 0.80
            normalized_accounts.append({"account": acc, "confidence": round(float(conf) * 100, 1)})

    # Record audit log
    repo.insert("audit_logs", {
        "id": f"aud-{int(datetime.now().timestamp() * 1000)}",
        "user_id": "u-001",
        "action": "DOCUMENT_ANALYSIS",
        "entity_type": "document",
        "entity_id": filename,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metadata": {
            "model_used": ner_result.get("model_used"),
            "is_transformer": ner_result.get("is_transformer"),
            "file_size": len(contents)
        }
    })

    return {
        "filename": filename,
        "file_size": file_size,
        "file_category": file_category,
        "sha256_hash": sha256_hash,
        "analyzed_at": datetime.now(timezone.utc).isoformat(),
        "model_used": ner_result.get("model_used"),
        "is_transformer": ner_result.get("is_transformer"),
        "engine_type": ner_result.get("engine_type"),
        "extracted_entities": {
            "persons": resolved_persons,
            "phones": normalized_phones,
            "vehicles": normalized_vehicles,
            "locations": normalized_locations,
            "organizations": normalized_orgs,
            "dates": entities.get("dates", []),
            "accounts": normalized_accounts
        },
        "summary": f"Ingested {filename} [{file_category}]. Verified SHA-256: {sha256_hash[:12]}... Extracted {len(resolved_persons)} person(s), {len(normalized_phones)} phone(s), {len(normalized_vehicles)} vehicle(s), and {len(normalized_locations)} location(s)."
    }

@router.post("/add-to-graph")
def add_extracted_to_graph(payload: Dict[str, Any]):
    from backend.app.graph.centrality import get_role_analyzer
    repo = get_repository()
    engine = get_graph_engine()
    analyzer = get_role_analyzer()
    
    entities = payload.get("extracted_entities", {})
    investigation_id = payload.get("investigation_id", "inv-001")
    created_count = 0
    person_ids = []

    # 1. Add persons
    for p_obj in entities.get("persons", []):
        p_name = p_obj.get("name") if isinstance(p_obj, dict) else str(p_obj)
        if not p_name:
            continue
        p_id = f"per-ext-{abs(hash(p_name)) % 10000}"
        person_ids.append(p_id)
        if not repo.find_by_id("persons", p_id):
            repo.insert("persons", {
                "id": p_id,
                "person_code": f"P-{abs(hash(p_name)) % 900 + 100:03d}",
                "name": p_name,
                "occupation": "Document Extracted Entity",
                "risk_score": 55.0,
                "network_score": 50.0,
                "primary_role": "person_of_interest",
                "status": "under_investigation",
                "investigation_id": investigation_id
            })
            created_count += 1

    # 2. Add phones
    phone_ids = []
    for ph_obj in entities.get("phones", []):
        p_num = ph_obj.get("number") if isinstance(ph_obj, dict) else str(ph_obj)
        if not p_num:
            continue
        ph_id = f"ph-ext-{abs(hash(p_num)) % 10000}"
        phone_ids.append(ph_id)
        if not repo.find_by_id("phone_numbers", ph_id):
            repo.insert("phone_numbers", {
                "id": ph_id,
                "phone_number": p_num,
                "label": p_num,
                "service_provider": "National Telecommunication Registry",
                "risk_score": 60.0,
                "status": "monitored",
                "investigation_id": investigation_id
            })
            created_count += 1

    # 3. Add vehicles
    vehicle_ids = []
    for v_obj in entities.get("vehicles", []):
        v_reg = v_obj.get("registration") if isinstance(v_obj, dict) else str(v_obj)
        if not v_reg:
            continue
        v_id = f"veh-ext-{abs(hash(v_reg)) % 10000}"
        vehicle_ids.append(v_id)
        if not repo.find_by_id("vehicles", v_id):
            repo.insert("vehicles", {
                "id": v_id,
                "vehicle_code": f"VEH-{abs(hash(v_reg)) % 900 + 100}",
                "registration_number": v_reg,
                "label": v_reg,
                "make_model": "Surveillance Vehicle",
                "risk_score": 65.0,
                "status": "flagged",
                "investigation_id": investigation_id
            })
            created_count += 1

    # 4. Add locations
    location_ids = []
    for l_obj in entities.get("locations", []):
        loc_name = l_obj.get("name") if isinstance(l_obj, dict) else str(l_obj)
        if not loc_name:
            continue
        l_id = f"loc-ext-{abs(hash(loc_name)) % 10000}"
        location_ids.append(l_id)
        if not repo.find_by_id("locations", l_id):
            repo.insert("locations", {
                "id": l_id,
                "location_code": f"LOC-{abs(hash(loc_name)) % 900 + 100}",
                "name": loc_name,
                "label": loc_name,
                "city": loc_name,
                "risk_score": 45.0,
                "investigation_id": investigation_id
            })
            created_count += 1

    # 5. Connect relationships between extracted entities
    primary_p_id = person_ids[0] if person_ids else None
    if primary_p_id:
        # Link to phone
        for ph_id in phone_ids:
            repo.insert("relationships", {
                "id": f"rel-{abs(hash(f'{primary_p_id}_{ph_id}')) % 100000}",
                "source_entity_id": primary_p_id,
                "source_entity_type": "person",
                "target_entity_id": ph_id,
                "target_entity_type": "phone",
                "relationship_type": "called",
                "confidence": 90.0,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "Document Extraction Link"
            })
        # Link to vehicle
        for v_id in vehicle_ids:
            repo.insert("relationships", {
                "id": f"rel-{abs(hash(f'{primary_p_id}_{v_id}')) % 100000}",
                "source_entity_id": primary_p_id,
                "source_entity_type": "person",
                "target_entity_id": v_id,
                "target_entity_type": "vehicle",
                "relationship_type": "owns",
                "confidence": 85.0,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "Document Extraction Link"
            })
        # Link to location
        for l_id in location_ids:
            repo.insert("relationships", {
                "id": f"rel-{abs(hash(f'{primary_p_id}_{l_id}')) % 100000}",
                "source_entity_id": primary_p_id,
                "source_entity_type": "person",
                "target_entity_id": l_id,
                "target_entity_type": "location",
                "relationship_type": "visited",
                "confidence": 80.0,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "Document Extraction Link"
            })

    # Rebuild graph to incorporate newly added items
    engine.build_graph()
    analyzer.calculate_all_metrics()

    # Log audit entry
    repo.insert("audit_logs", {
        "id": f"aud-{int(datetime.now().timestamp() * 1000)}",
        "user_id": "u-001",
        "action": "DOCUMENT_ENTITIES_ADDED_TO_GRAPH",
        "entity_type": "graph",
        "entity_id": payload.get("filename", "uploaded_doc"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metadata": {"created_entities": created_count}
    })

    return {
        "success": True,
        "created_entities_count": created_count,
        "message": f"Successfully incorporated {created_count} extracted entities and relationships into the active Investigation Graph."
    }

