"""
Dual-Mode Data Repository for TRACE-AI (Threat Relation Analysis & Crime Exploration).
Integrates Supabase PostgreSQL as primary cloud storage with local persistence fallback.
Supports two distinct operational modes:
1. 'original' (Original / Live Data Mode - Default) - Clean live investigation workspace.
2. 'mock' (Demo / Training Mode) - Preloaded with complete synthetic Operation Trident scenario.
"""

import json
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from backend.app.config import settings

logger = logging.getLogger("trace_ai.database")

# Optional Supabase client import
supabase_client = None
if settings.SUPABASE_URL and settings.SUPABASE_SECRET_KEY:
    try:
        from supabase import create_client
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)
        logger.info("Supabase client initialized successfully with service secret key.")
    except Exception as e:
        logger.warning(f"Could not initialize Supabase client: {e}")

class DualModeRepository:
    def __init__(self):
        self.mode = "original"  # Default to production original data mode
        self.mock_data: Dict[str, List[Dict[str, Any]]] = {}
        self.original_data: Dict[str, List[Dict[str, Any]]] = self._get_empty_store()
        self.supabase = supabase_client
        self._supabase_table_cache: Dict[str, bool] = {}
        
        self.load_mock_data()
        self.load_original_data()

    def _get_empty_store(self) -> Dict[str, List[Dict[str, Any]]]:
        return {
            "users": [
                {
                    "id": "u-001",
                    "name": "Inspector Rajeshwari Devi",
                    "email": "rajeshwari.devi@ncrb.gov.in",
                    "role": "investigator",
                    "department": "Women Safety Division, NCRB",
                    "badge_number": "NCRB-INV-7741",
                    "created_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "u-002",
                    "name": "Sr. Analyst Sameer Sen",
                    "email": "sameer.sen@ncrb.gov.in",
                    "role": "analyst",
                    "department": "Cyber & Financial Intelligence Unit",
                    "badge_number": "NCRB-ANA-3302",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
            ],
            "investigations": [],
            "persons": [],
            "phone_numbers": [],
            "vehicles": [],
            "locations": [],
            "organizations": [],
            "bank_accounts": [],
            "firs": [],
            "transactions": [],
            "communications": [],
            "relationships": [],
            "evidence": [],
            "alerts": [],
            "osint_results": [],
            "audit_logs": []
        }

    def load_mock_data(self):
        json_path = settings.DATA_DIR / "seed_data.json"
        if json_path.exists():
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    self.mock_data = json.load(f)
            except Exception as e:
                logger.warning(f"Could not load mock seed data: {e}")

    def load_original_data(self):
        orig_file = settings.DATA_DIR / "original_cases.json"
        if orig_file.exists():
            try:
                with open(orig_file, "r", encoding="utf-8") as f:
                    saved = json.load(f)
                    if isinstance(saved, dict):
                        self.original_data.update(saved)
            except Exception as e:
                logger.warning(f"Could not load original cases: {e}")

    def persist_original(self):
        try:
            settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
            orig_file = settings.DATA_DIR / "original_cases.json"
            with open(orig_file, "w", encoding="utf-8") as f:
                json.dump(self.original_data, f, indent=2)
        except Exception as e:
            logger.warning(f"Could not persist original cases: {e}")

    def reset_original_workspace(self):
        """Reset the live original workspace to empty."""
        self.original_data = self._get_empty_store()
        self.persist_original()
        logger.info("Reset original live workspace to empty state.")

    def seed_original_demo(self):
        """Seed the live original workspace with Operation Falcon investigation."""
        now = datetime.now(timezone.utc).isoformat()
        falcon_case = {
            "id": "inv-orig-001",
            "case_number": "FIR-2026-DL-8819",
            "investigation_code": "INV-2026-DEL-042",
            "title": "Operation Falcon: Inter-State Cyber Fraud & Hawala Ring",
            "status": "Active",
            "priority": "High",
            "lead_investigator": "Inspector Rajeshwari Devi",
            "department": "NCRB Women Safety & Cyber Cell",
            "created_at": now,
            "description": "High-value digital arrest & extortion syndicate operating across NCR and Mewat using compromised SIMs and mule accounts."
        }

        persons = [
            {
                "id": "p-orig-01",
                "person_code": "P-ORIG-01",
                "name": "Vikram @ Vicky",
                "aliases": ["Vicky Don", "V-7"],
                "role": "Syndicate Head / Mastermind",
                "risk_score": 92,
                "status": "Suspect",
                "phone": "+91 98110 44219",
                "location": "Noida Sector 62",
                "active": True,
                "created_at": now
            },
            {
                "id": "p-orig-02",
                "person_code": "P-ORIG-02",
                "name": "Rohit Malhotra",
                "aliases": ["Cashier"],
                "role": "Hawala Operator / Mule Recruiter",
                "risk_score": 85,
                "status": "Suspect",
                "phone": "+91 98731 99201",
                "location": "Laxmi Nagar, Delhi",
                "active": True,
                "created_at": now
            },
            {
                "id": "p-orig-03",
                "person_code": "P-ORIG-03",
                "name": "Simran Kaur",
                "aliases": ["Operator 3"],
                "role": "Tele-caller / Script Operator",
                "risk_score": 68,
                "status": "Person of Interest",
                "phone": "+91 99102 33814",
                "location": "Rohini Sector 9",
                "active": True,
                "created_at": now
            },
            {
                "id": "p-orig-04",
                "person_code": "P-ORIG-04",
                "name": "Karan Chawla",
                "aliases": ["Technician"],
                "role": "SIM Box Operator / Device Mule",
                "risk_score": 74,
                "status": "Suspect",
                "phone": "+91 98109 55112",
                "location": "Gurugram Phase 3",
                "active": True,
                "created_at": now
            }
        ]

        phones = [
            {
                "id": "ph-orig-01",
                "phone_id": "PH-ORIG-01",
                "number": "+91 98110 44219",
                "imei": "864201049921820",
                "subscriber_name": "Vikram Sharma (Forged ID)",
                "provider": "Airtel",
                "status": "Active",
                "created_at": now
            },
            {
                "id": "ph-orig-02",
                "phone_id": "PH-ORIG-02",
                "number": "+91 98731 99201",
                "imei": "359128091823741",
                "subscriber_name": "Rohit Malhotra",
                "provider": "Jio",
                "status": "Active",
                "created_at": now
            }
        ]

        bank_accounts = [
            {
                "id": "acc-orig-01",
                "account_id": "ACC-ORIG-01",
                "account_number": "91802004819201",
                "bank_name": "HDFC Bank",
                "holder_name": "Falcon Global Impex (Mule)",
                "branch": "Nehru Place, Delhi",
                "balance": "₹42,50,000",
                "status": "Frozen by LEA",
                "created_at": now
            },
            {
                "id": "acc-orig-02",
                "account_id": "ACC-ORIG-02",
                "account_number": "60341011009823",
                "bank_name": "ICICI Bank",
                "holder_name": "Rohit Malhotra",
                "branch": "Laxmi Nagar, Delhi",
                "balance": "₹18,20,000",
                "status": "Under Surveillance",
                "created_at": now
            }
        ]

        relationships = [
            {"id": "rel-orig-01", "source": "p-orig-01", "target": "p-orig-02", "relationship_type": "Directs Financials", "weight": 0.9, "confidence": 0.95, "created_at": now},
            {"id": "rel-orig-02", "source": "p-orig-01", "target": "p-orig-03", "relationship_type": "Supervises Calls", "weight": 0.8, "confidence": 0.90, "created_at": now},
            {"id": "rel-orig-03", "source": "p-orig-01", "target": "ph-orig-01", "relationship_type": "Uses Device", "weight": 1.0, "confidence": 0.99, "created_at": now},
            {"id": "rel-orig-04", "source": "p-orig-02", "target": "ph-orig-02", "relationship_type": "Uses Device", "weight": 1.0, "confidence": 0.99, "created_at": now},
            {"id": "rel-orig-05", "source": "p-orig-02", "target": "acc-orig-01", "relationship_type": "Operates Mule Account", "weight": 0.95, "confidence": 0.94, "created_at": now},
            {"id": "rel-orig-06", "source": "p-orig-02", "target": "acc-orig-02", "relationship_type": "Transfers Funds To", "weight": 0.88, "confidence": 0.92, "created_at": now},
            {"id": "rel-orig-07", "source": "p-orig-04", "target": "p-orig-01", "relationship_type": "Supplies Cloned SIMs", "weight": 0.85, "confidence": 0.89, "created_at": now},
            {"id": "rel-orig-08", "source": "p-orig-04", "target": "ph-orig-01", "relationship_type": "Activated SIM For", "weight": 0.92, "confidence": 0.95, "created_at": now}
        ]

        evidence = [
            {
                "id": "ev-orig-01",
                "evidence_code": "EVD-2026-DL-001",
                "investigation_id": "inv-orig-001",
                "title": "Seized OnePlus 11 Phone & SIM Box Cloning Array",
                "description": "Seized OnePlus 11 phone and 16-channel SIM cloning kit recovered from Noida Sector 62 hideout.",
                "source_type": "digital_forensics",
                "file_path": "/vault/evidence/ev-orig-01.dat",
                "sha256_hash": "4a7261a868a8677c77f0203f8f2b704c7c598b04a44f9f7435f114c0a59a7a9d",
                "verification_status": "verified",
                "verified_at": now,
                "created_at": now
            }
        ]

        firs = [
            {
                "id": "fir-orig-01",
                "fir_number": "FIR-2026-DL-8819",
                "investigation_id": "inv-orig-001",
                "police_station": "Cyber PS Lodhi Colony, New Delhi",
                "sections": "BNS 318(4), 316(2), 61(2) & IT Act 66D",
                "date_filed": "2026-08-15",
                "narrative": "Coordinated cyber extortion and digital arrest racket targeting victims with fraudulent police summons and siphon transfers to mule accounts.",
                "created_at": now
            }
        ]

        store = self.original_data
        store["investigations"] = [falcon_case]
        store["persons"] = persons
        store["phone_numbers"] = phones
        store["bank_accounts"] = bank_accounts
        store["relationships"] = relationships
        store["evidence"] = evidence
        store["firs"] = firs
        self.persist_original()
        logger.info(f"Seeded original live workspace with Operation Falcon (8 entities, 8 edges).")

    @property
    def current_data(self) -> Dict[str, List[Dict[str, Any]]]:
        return self.mock_data if self.mode == "mock" else self.original_data

    def set_mode(self, new_mode: str):
        if new_mode in ["mock", "original"]:
            self.mode = new_mode
            logger.info(f"TRACE-AI switched to {new_mode.upper()} mode.")
            return True
        return False

    def is_supabase_available(self, table_name: str) -> bool:
        if not self.supabase or self.mode != "original":
            return False
        if table_name in self._supabase_table_cache:
            return self._supabase_table_cache[table_name]
        try:
            res = self.supabase.table(table_name).select("*").limit(1).execute()
            self._supabase_table_cache[table_name] = True
            return True
        except Exception as e:
            # PGRST205 means table not created in Supabase schema yet
            self._supabase_table_cache[table_name] = False
            return False

    def get_collection(self, table_name: str) -> List[Dict[str, Any]]:
        if self.mode == "original" and self.is_supabase_available(table_name):
            try:
                res = self.supabase.table(table_name).select("*").execute()
                if res.data is not None:
                    # Sync to local in-memory store
                    self.original_data[table_name] = res.data
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase fetch error for {table_name}: {e}")
        return self.current_data.get(table_name, [])

    def find_by_id(self, table_name: str, item_id: str) -> Optional[Dict[str, Any]]:
        items = self.get_collection(table_name)
        for it in items:
            if (it.get("id") == item_id or 
                it.get("person_code") == item_id or 
                it.get("evidence_code") == item_id or
                it.get("investigation_code") == item_id or
                it.get("code") == item_id):
                return it
        return None

    def insert(self, table_name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        store = self.original_data if self.mode == "original" else self.mock_data
        if table_name not in store:
            store[table_name] = []
        if "created_at" not in item:
            item["created_at"] = datetime.now(timezone.utc).isoformat()
            
        store[table_name].append(item)
        if self.mode == "original":
            self.persist_original()
            if self.is_supabase_available(table_name):
                try:
                    # Clean payload for Postgres
                    clean_item = {k: v for k, v in item.items() if not isinstance(v, (dict, list)) or table_name in ["alerts", "osint_results", "audit_logs", "relationships"]}
                    self.supabase.table(table_name).insert(clean_item).execute()
                except Exception as e:
                    logger.warning(f"Supabase insert error for {table_name}: {e}")
        return item

    def update(self, table_name: str, item_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        items = self.get_collection(table_name)
        for it in items:
            if (it.get("id") == item_id or 
                it.get("person_code") == item_id or 
                it.get("evidence_code") == item_id or
                it.get("investigation_code") == item_id):
                it.update(updates)
                if self.mode == "original":
                    self.persist_original()
                    if self.is_supabase_available(table_name):
                        try:
                            self.supabase.table(table_name).update(updates).eq("id", it.get("id")).execute()
                        except Exception as e:
                            logger.warning(f"Supabase update error: {e}")
                return it
        return None

    def delete(self, table_name: str, item_id: str) -> bool:
        store = self.original_data if self.mode == "original" else self.mock_data
        if table_name in store:
            initial_len = len(store[table_name])
            store[table_name] = [
                it for it in store[table_name] 
                if it.get("id") != item_id and it.get("person_code") != item_id
            ]
            if len(store[table_name]) < initial_len:
                if self.mode == "original":
                    self.persist_original()
                    if self.is_supabase_available(table_name):
                        try:
                            self.supabase.table(table_name).delete().eq("id", item_id).execute()
                        except Exception as e:
                            logger.warning(f"Supabase delete error: {e}")
                return True
        return False

    def get_status(self) -> Dict[str, Any]:
        return {
            "mode": self.mode,
            "supabase_connected": bool(self.supabase),
            "supabase_url": settings.SUPABASE_URL,
            "has_groq_key": bool(settings.GROQ_API_KEY),
            "groq_model": settings.GROQ_MODEL
        }

# Global instance
repo = DualModeRepository()

def get_repository() -> DualModeRepository:
    return repo

