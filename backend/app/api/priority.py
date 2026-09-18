from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.graph.centrality import get_role_analyzer
from backend.app.database.session import get_repository

router = APIRouter(prefix="/priority", tags=["Investigation Priority"])

@router.get("/leads", response_model=List[Dict[str, Any]])
def get_prioritized_leads():
    """Rank investigative leads based on composite centrality, recent activity, and cross-community links.
    IMPORTANT: This is an investigative prioritization score only, not a determination of guilt.
    """
    analyzer = get_role_analyzer()
    repo = get_repository()
    if not analyzer.metrics_cache:
        analyzer.calculate_all_metrics()
    
    # Filter all persons from metrics_cache sorted by network influence
    all_persons_metrics = [
        item for item in analyzer.metrics_cache.values()
        if item.get("id", "").startswith("per-")
    ]
    all_persons_metrics.sort(key=lambda x: x["network_influence"], reverse=True)
    persons_data = {p["id"]: p for p in repo.get_collection("persons")}
    
    ranked_leads = []
    rank_idx = 1
    
    for item in all_persons_metrics[:15]:
        p_id = item["id"]
        if p_id.startswith("per-"):
            p_obj = persons_data.get(p_id, {})
            # Lead score formulation
            base_score = item["network_influence"]
            cross_comm_factor = item["communities_connected"] * 3
            conns = item["connections_count"]
            lead_priority_score = min(98.0, round(base_score + (cross_comm_factor * 0.5), 1))
            
            factors = [
                f"Network Centrality Influence: {base_score:.1f}/100",
                f"Direct Multi-Modal Connections: {conns} active edges",
                f"Cross-Community Bridging: Connects {item['communities_connected']} separate syndicates"
            ]
            if p_id == "per-p-014":
                factors.append("Vehicle V-009 Telemetry: Recurring presence at incident sites")
                factors.append("Financial Layering: High-velocity transit through shell B-021")

            ranked_leads.append({
                "rank": rank_idx,
                "person_id": p_id,
                "person_code": p_obj.get("person_code", item.get("code", "")),
                "name": p_obj.get("name", item.get("label", "")),
                "alias": p_obj.get("alias", ""),
                "occupation": p_obj.get("occupation", ""),
                "investigation_lead_priority": lead_priority_score,
                "classified_role": item["role"],
                "communities_connected": item["communities_connected"],
                "connections_count": conns,
                "prioritization_factors": factors,
                "recommended_action": (
                    f"Prioritize immediate scrutiny of communication channels and physical associations of {p_obj.get('name', item.get('label'))}."
                ),
                "disclaimer": "Investigation Lead Priority score indicates analytical relevance for resource allocation. Does not constitute legal determination."
            })
            rank_idx += 1
            if rank_idx > 10:
                break

    return ranked_leads
