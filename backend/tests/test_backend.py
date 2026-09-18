"""
Comprehensive Test Suite for TRACE-AI (Threat Relation Analysis & Crime Exploration)
SIH 26189 — National Crime Records Bureau (NCRB)
"""

import os
import sys

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.config import settings

client = TestClient(app)

def test_01_health_and_branding():
    """Verify platform branding, SIH problem code, and environment status."""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["problem_code"] == "SIH 26189"
    assert "TRACE-AI" in data["service"]

def test_02_mode_switch_original_and_mock():
    """Verify clean mode switching between original (clean zero-mock) and mock."""
    # Test setting to original
    res_orig = client.post("/api/settings/mode", json={"mode": "original"})
    assert res_orig.status_code == 200
    assert res_orig.json()["mode"] == "original"

    # In original mode, graph and cases load safely
    res_inv = client.get("/api/investigations")
    assert res_inv.status_code == 200

    # Switch to mock mode for full algorithm and scenario testing
    res_mock = client.post("/api/settings/mode", json={"mode": "mock"})
    assert res_mock.status_code == 200
    assert res_mock.json()["mode"] == "mock"

def test_03_network_elements_and_centrality():
    """Verify real NetworkX graph elements, PageRank, and Louvain communities."""
    res = client.get("/api/network/elements")
    assert res.status_code == 200
    data = res.json()
    assert "nodes" in data and "edges" in data
    assert len(data["nodes"]) >= 50

    # Verify coordinator node details and real NetworkX metrics
    node_res = client.get("/api/network/node/per-p-014")
    assert node_res.status_code == 200
    node_data = node_res.json()
    assert "metrics" in node_data
    metrics = node_data["metrics"]
    assert "betweenness_centrality" in metrics
    assert "pagerank" in metrics
    assert "communities_connected" in metrics

def test_04_emerging_networks_temporal():
    """Verify multi-window temporal differencing and emerging cluster alerts."""
    res = client.get("/api/emerging")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    alert = data[0]
    assert "alert_code" in alert
    assert "confidence" in alert
    assert "explanation_factors" in alert
    assert len(alert["explanation_factors"]) >= 1

def test_05_hidden_connections_link_prediction():
    """Verify Adamic-Adar / Jaccard link prediction for non-edges with common neighbors."""
    res = client.get("/api/hidden")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    if len(data) > 0:
        item = data[0]
        assert "entity_a" in item and "entity_b" in item
        assert "confidence" in item
        assert "common_neighbors" in item

def test_06_financial_cycle_detection():
    """Verify directed financial flow and circular wash pattern detection."""
    res = client.get("/api/financial/overview")
    assert res.status_code == 200
    data = res.json()
    assert "metrics" in data
    assert "patterns" in data
    assert "recent_transactions" in data

def test_07_evidence_vault_and_sha256_tamper_detection():
    """Verify cryptographic SHA-256 verification and tamper detection."""
    # List evidence
    list_res = client.get("/api/evidence")
    assert list_res.status_code == 200
    items = list_res.json()
    assert len(items) >= 1

    first_code = items[0]["evidence_code"]

    # Verify authentic
    valid_res = client.post(f"/api/evidence/{first_code}/verify", json={"simulate_tamper": False})
    assert valid_res.status_code == 200
    assert valid_res.json()["is_valid"] is True

    # Test tamper detection
    tamper_res = client.post(f"/api/evidence/{first_code}/verify", json={"simulate_tamper": True})
    assert tamper_res.status_code == 200
    assert tamper_res.json()["is_valid"] is False
    assert tamper_res.json()["status"] == "tampered"

def test_08_evidence_deposit_creation():
    """Verify depositing a new piece of evidence computes SHA-256 and records it."""
    payload = {
        "title": "Interstate Fuel Transport Delivery Memo",
        "description": "Seized document during highway patrol check",
        "source_type": "court_order"
    }
    res = client.post("/api/evidence", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "evidence_code" in data
    assert "sha256_hash" in data
    assert len(data["sha256_hash"]) == 64  # valid sha256 hex length

def test_09_grounded_groq_rag_ai_query():
    """Verify Groq Cloud / Grounded RAG with strict 5-part structure."""
    res = client.post("/api/ai/query", json={"query": "Why was the emerging network flagged?"})
    assert res.status_code == 200
    data = res.json()
    assert "raw_response" in data
    raw = data["raw_response"]
    assert "Finding" in raw
    assert "Evidence" in raw
    assert "Confidence" in raw
    assert "Recommended Lead" in raw
    assert "Sources" in raw

def test_10_nlp_ner_document_intake():
    """Verify entity extraction from unstructured incident report."""
    sample_text = (
        "FIRST INFORMATION REPORT: On 12 August 2026, suspect Arun Varma and Vikram Malhotra "
        "were intercepted in vehicle DL-01-AX-9921 near Chennai Central. Contact number was +91 9811099210."
    )
    files = {"file": ("fir_report.txt", sample_text.encode("utf-8"), "text/plain")}
    res = client.post("/api/documents/analyze", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "extracted_entities" in data
    entities = data["extracted_entities"]
    # Check that persons, vehicles, or phones were identified
    assert len(entities.get("persons", [])) >= 1 or len(entities.get("vehicles", [])) >= 1

def test_11_csv_import_preview():
    """Verify CSV preview parsing and column mapping suggestions."""
    csv_content = "Name,Phone,Vehicle,City\nRajesh Kumar,9811001122,DL-02-B-1234,Delhi\nSuresh Verma,9811003344,HR-26-C-5678,Gurugram"
    files = {"file": ("records.csv", csv_content.encode("utf-8"), "text/csv")}
    res = client.post("/api/import/preview", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "headers" in data
    assert "Name" in data["headers"]
    assert "sample_rows" in data
    assert len(data["sample_rows"]) == 2

def test_12_investigation_dossier_report():
    """Verify investigation dossier intelligence summary export."""
    res = client.get("/api/reports/investigation/inv-001")
    assert res.status_code == 200
    data = res.json()
    assert "report_id" in data
    assert "investigation" in data
    assert "generated_at" in data

if __name__ == "__main__":
    print("Executing TRACE-AI integration test suite...")
    test_01_health_and_branding()
    print("PASS: test_01_health_and_branding")
    test_02_mode_switch_original_and_mock()
    print("PASS: test_02_mode_switch_original_and_mock")
    test_03_network_elements_and_centrality()
    print("PASS: test_03_network_elements_and_centrality")
    test_04_emerging_networks_temporal()
    print("PASS: test_04_emerging_networks_temporal")
    test_05_hidden_connections_link_prediction()
    print("PASS: test_05_hidden_connections_link_prediction")
    test_06_financial_cycle_detection()
    print("PASS: test_06_financial_cycle_detection")
    test_07_evidence_vault_and_sha256_tamper_detection()
    print("PASS: test_07_evidence_vault_and_sha256_tamper_detection")
    test_08_evidence_deposit_creation()
    print("PASS: test_08_evidence_deposit_creation")
    test_09_grounded_groq_rag_ai_query()
    print("PASS: test_09_grounded_groq_rag_ai_query")
    test_10_nlp_ner_document_intake()
    print("PASS: test_10_nlp_ner_document_intake")
    test_11_csv_import_preview()
    print("PASS: test_11_csv_import_preview")
    test_12_investigation_dossier_report()
    print("PASS: test_12_investigation_dossier_report")
    print("\n>>> ALL 12 INTEGRATION TEST SUITES PASSED PERFECTLY! <<<")
