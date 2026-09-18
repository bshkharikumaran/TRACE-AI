from fastapi import APIRouter, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from backend.app.graph.engine import get_graph_engine
from backend.app.graph.centrality import get_role_analyzer
from backend.app.database.session import get_repository

router = APIRouter(prefix="/network", tags=["Network Explorer"])

@router.get("/elements")
def get_network_elements(
    types: Optional[str] = Query(None, description="Comma-separated entity types (person,phone,vehicle,location,organization,bank_account,fir)"),
    community: Optional[int] = Query(None, description="Community ID filter"),
    limit: int = Query(250, description="Max node limit")
):
    engine = get_graph_engine()
    type_list = [t.strip() for t in types.split(",")] if types else None
    return engine.get_cytoscape_elements(entity_filter=type_list, limit_nodes=limit)

@router.get("/node/{node_id}")
def get_node_details(node_id: str):
    repo = get_repository()
    analyzer = get_role_analyzer()
    engine = get_graph_engine()

    # Find the entity record
    entity_type = "unknown"
    entity_data = None
    for tbl in ["persons", "phone_numbers", "vehicles", "locations", "organizations", "bank_accounts", "firs"]:
        found = repo.find_by_id(tbl, node_id)
        if found:
            entity_data = found
            entity_type = tbl[:-1] if tbl.endswith("s") else tbl
            break

    if not entity_data and engine.graph.has_node(node_id):
        entity_data = engine.graph.nodes[node_id]
        entity_type = entity_data.get("type", "unknown")

    # Get calculated centrality & role metrics
    metrics = analyzer.get_entity_metrics(node_id)
    subgraph = engine.get_node_subgraph(node_id, depth=1)

    # Correlate direct connections
    neighbors = list(engine.graph.neighbors(node_id)) if engine.graph.has_node(node_id) else []
    neighbor_details = []
    for nbr in neighbors[:15]:
        nbr_data = engine.graph.nodes.get(nbr, {})
        neighbor_details.append({
            "id": nbr,
            "label": nbr_data.get("label", nbr),
            "type": nbr_data.get("type", "unknown"),
            "role": nbr_data.get("role", "")
        })

    # Relevant evidence
    relevant_evidence = []
    for ev in repo.get_collection("evidence"):
        if node_id in str(ev.values()) or (entity_data and entity_data.get("person_code") in str(ev.values())):
            relevant_evidence.append(ev)

    return {
        "node_id": node_id,
        "type": entity_type,
        "entity_data": entity_data,
        "metrics": metrics,
        "connections_count": len(neighbors),
        "neighbors": neighbor_details,
        "subgraph": subgraph,
        "relevant_evidence": relevant_evidence[:8]
    }

@router.get("/shortest-path")
def get_shortest_path(source: str = Query(...), target: str = Query(...)):
    engine = get_graph_engine()
    path = engine.find_shortest_path(source, target)
    path_details = []
    for node_id in path:
        node_info = engine.graph.nodes.get(node_id, {})
        path_details.append({
            "id": node_id,
            "label": node_info.get("label", node_id),
            "type": node_info.get("type", "unknown")
        })
    return {"path": path, "path_details": path_details, "hops": max(0, len(path) - 1)}

@router.get("/metrics")
def get_network_metrics():
    analyzer = get_role_analyzer()
    return {
        "top_influential": analyzer.get_top_influential_entities(15),
        "total_nodes": len(analyzer.engine.graph.nodes),
        "total_edges": len(analyzer.engine.graph.edges)
    }

@router.post("/entity")
def add_entity(payload: Dict[str, Any]):
    repo = get_repository()
    engine = get_graph_engine()
    analyzer = get_role_analyzer()

    entity_type = payload.get("type", "person").lower()
    name = payload.get("name") or payload.get("label", "Unknown Entity")
    code = payload.get("code") or f"{entity_type[:3].upper()}-{hash(name) % 900 + 100}"
    entity_id = payload.get("id") or f"{entity_type[:3].lower()}-{code.lower()}"

    table_map = {
        "person": "persons",
        "phone": "phone_numbers",
        "vehicle": "vehicles",
        "location": "locations",
        "organization": "organizations",
        "bank_account": "bank_accounts",
        "fir": "firs"
    }
    target_table = table_map.get(entity_type, "persons")

    item_data = {
        "id": entity_id,
        "name": name,
        "person_code": code if entity_type == "person" else None,
        "vehicle_code": code if entity_type == "vehicle" else None,
        "location_code": code if entity_type == "location" else None,
        "org_code": code if entity_type == "organization" else None,
        "account_code": code if entity_type == "bank_account" else None,
        "fir_number": code if entity_type == "fir" else None,
        "label": name,
        "alias": payload.get("alias", ""),
        "occupation": payload.get("occupation", "Entity of Interest"),
        "risk_score": float(payload.get("risk_score", 50.0)),
        "network_score": float(payload.get("network_score", 50.0)),
        "primary_role": payload.get("role", "suspect"),
        "status": payload.get("status", "under_observation")
    }

    repo.insert(target_table, item_data)
    engine.build_graph()
    analyzer.calculate_all_metrics()

    return {"success": True, "entity": item_data}

@router.post("/relationship")
def add_relationship(payload: Dict[str, Any]):
    repo = get_repository()
    engine = get_graph_engine()
    analyzer = get_role_analyzer()

    src = payload.get("source_id")
    tgt = payload.get("target_id")
    rel_type = payload.get("relationship_type", "associated_with")
    conf = float(payload.get("confidence", 85.0))

    rel_item = {
        "id": f"rel-{hash(f'{src}_{tgt}_{rel_type}') % 100000}",
        "investigation_id": payload.get("investigation_id", "inv-001"),
        "source_entity_type": payload.get("source_type", "person"),
        "source_entity_id": src,
        "target_entity_type": payload.get("target_type", "person"),
        "target_entity_id": tgt,
        "relationship_type": rel_type,
        "confidence": conf,
        "timestamp": payload.get("timestamp", datetime.now(timezone.utc).isoformat()),
        "source": payload.get("source", "Investigator Field Entry")
    }

    repo.insert("relationships", rel_item)
    engine.build_graph()
    analyzer.calculate_all_metrics()

    return {"success": True, "relationship": rel_item}
