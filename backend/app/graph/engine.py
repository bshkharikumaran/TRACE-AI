"""
NetworkX Graph Engine for CRIMESHIELD AI.
Maintains the heterogeneous investigation graph and produces Cytoscape.js compatible structures.
"""

import networkx as nx
from typing import Dict, List, Any, Optional
from backend.app.database.session import get_repository

class NetworkGraphEngine:
    def __init__(self):
        self.repo = get_repository()
        self.graph = nx.Graph()
        self.build_graph()

    def build_graph(self):
        self.graph.clear()
        
        # Add Persons
        for p in self.repo.get_collection("persons"):
            self.graph.add_node(
                p["id"],
                type="person",
                label=p["name"],
                code=p["person_code"],
                risk_score=p.get("risk_score", 0),
                network_score=p.get("network_score", 0),
                role=p.get("primary_role", "suspect"),
                community_id=p.get("community_id", "COMM-0"),
                details=p
            )
            
        # Add Phones
        for ph in self.repo.get_collection("phone_numbers"):
            self.graph.add_node(
                ph["id"],
                type="phone",
                label=ph["masked_number"],
                code=ph["phone_code"],
                carrier=ph.get("carrier", "unknown"),
                details=ph
            )

        # Add Vehicles
        for v in self.repo.get_collection("vehicles"):
            self.graph.add_node(
                v["id"],
                type="vehicle",
                label=v["registration_number"],
                code=v["vehicle_code"],
                vehicle_type=v["vehicle_type"],
                details=v
            )

        # Add Locations
        for loc in self.repo.get_collection("locations"):
            self.graph.add_node(
                loc["id"],
                type="location",
                label=loc["name"],
                code=loc["location_code"],
                lat=loc["latitude"],
                lng=loc["longitude"],
                location_type=loc["location_type"],
                details=loc
            )

        # Add Organizations
        for o in self.repo.get_collection("organizations"):
            self.graph.add_node(
                o["id"],
                type="organization",
                label=o["name"],
                code=o["org_code"],
                org_type=o["type"],
                details=o
            )

        # Add Bank Accounts
        for b in self.repo.get_collection("bank_accounts"):
            self.graph.add_node(
                b["id"],
                type="bank_account",
                label=f"{b['bank_name']} ({b['account_reference']})",
                code=b["account_code"],
                is_flagged=b.get("is_flagged", False),
                details=b
            )

        # Add FIRs
        for fir in self.repo.get_collection("firs"):
            self.graph.add_node(
                fir["id"],
                type="fir",
                label=fir["fir_number"],
                code=fir["fir_number"],
                title=fir["title"],
                details=fir
            )

        # Add Relationships (Edges)
        for r in self.repo.get_collection("relationships"):
            src = r["source_entity_id"]
            tgt = r["target_entity_id"]
            if self.graph.has_node(src) and self.graph.has_node(tgt):
                self.graph.add_edge(
                    src,
                    tgt,
                    id=r["id"],
                    relationship_type=r["relationship_type"],
                    confidence=r.get("confidence", 85.0),
                    timestamp=r.get("timestamp", ""),
                    source=r.get("source", "Field Intelligence"),
                    evidence_id=r.get("evidence_id")
                )

    def get_cytoscape_elements(self, entity_filter: Optional[List[str]] = None, limit_nodes: int = 250) -> Dict[str, Any]:
        """Convert NetworkX graph into Cytoscape.js format."""
        nodes = []
        edges = []
        
        for n_id, data in self.graph.nodes(data=True):
            node_type = data.get("type", "unknown")
            if entity_filter and node_type not in entity_filter:
                continue
                
            nodes.append({
                "data": {
                    "id": n_id,
                    "label": data.get("label", n_id),
                    "type": node_type,
                    "code": data.get("code", n_id),
                    "role": data.get("role", ""),
                    "risk_score": data.get("risk_score", 0),
                    "network_score": data.get("network_score", 0),
                    "community_id": data.get("community_id", ""),
                    "details": data.get("details", {})
                }
            })
            if len(nodes) >= limit_nodes:
                break
                
        valid_node_ids = {n["data"]["id"] for n in nodes}
        
        for u, v, data in self.graph.edges(data=True):
            if u in valid_node_ids and v in valid_node_ids:
                edges.append({
                    "data": {
                        "id": data.get("id", f"edge-{u}-{v}"),
                        "source": u,
                        "target": v,
                        "relationship_type": data.get("relationship_type", "connected_to"),
                        "confidence": data.get("confidence", 85.0),
                        "timestamp": data.get("timestamp", ""),
                        "source_label": data.get("source", "")
                    }
                })

        return {"nodes": nodes, "edges": edges}

    def get_node_subgraph(self, node_id: str, depth: int = 1) -> Dict[str, Any]:
        """Extract ego-graph around a specific node for focused analysis."""
        if not self.graph.has_node(node_id):
            return {"nodes": [], "edges": []}
            
        ego_nodes = nx.single_source_shortest_path_length(self.graph, node_id, cutoff=depth).keys()
        sub = self.graph.subgraph(ego_nodes)
        
        nodes = []
        for n_id, data in sub.nodes(data=True):
            nodes.append({
                "data": {
                    "id": n_id,
                    "label": data.get("label", n_id),
                    "type": data.get("type", "unknown"),
                    "code": data.get("code", n_id),
                    "role": data.get("role", ""),
                    "details": data.get("details", {})
                }
            })
            
        edges = []
        for u, v, data in sub.edges(data=True):
            edges.append({
                "data": {
                    "id": data.get("id", f"edge-{u}-{v}"),
                    "source": u,
                    "target": v,
                    "relationship_type": data.get("relationship_type", "connected_to"),
                    "confidence": data.get("confidence", 85.0)
                }
            })
            
        return {"nodes": nodes, "edges": edges}

    def find_shortest_path(self, source_id: str, target_id: str) -> List[str]:
        """Find the shortest investigative path between any two entities."""
        if self.graph.has_node(source_id) and self.graph.has_node(target_id):
            try:
                return nx.shortest_path(self.graph, source=source_id, target=target_id)
            except (nx.NetworkXNoPath, nx.NodeNotFound):
                return []
        return []

# Singleton instance
graph_engine = NetworkGraphEngine()

def get_graph_engine() -> NetworkGraphEngine:
    return graph_engine
