from fastapi import APIRouter
import networkx as nx
from typing import List, Dict, Any
from backend.app.database.session import get_repository

router = APIRouter(prefix="/financial", tags=["Financial Intelligence"])

@router.get("/overview")
def get_financial_overview():
    repo = get_repository()
    accounts = repo.get_collection("bank_accounts")
    transactions = repo.get_collection("transactions")
    
    flagged_tx = [t for t in transactions if t.get("is_suspicious")]
    total_volume = sum(float(t.get("amount", 0)) for t in transactions)
    suspicious_volume = sum(float(t.get("amount", 0)) for t in flagged_tx)

    patterns = []

    if transactions:
        # Build directed financial flow graph
        G_fin = nx.DiGraph()
        for t in transactions:
            src = t.get("sender_account_id") or "Unknown"
            tgt = t.get("receiver_account_id") or "Unknown"
            amt = float(t.get("amount", 0))
            if src and tgt:
                G_fin.add_edge(src, tgt, amount=amt, timestamp=t.get("timestamp", ""), tx_id=t.get("id"))

        # 1. Circular Wash Loop Detection via NetworkX simple_cycles
        try:
            cycles = list(nx.simple_cycles(G_fin))
            for c_idx, cycle in enumerate(cycles[:3]):
                if len(cycle) >= 3:
                    cycle_nodes = list(cycle)
                    cycle_nodes.append(cycle[0]) # close loop
                    
                    steps = []
                    total_loop_amt = 0.0
                    for i in range(len(cycle)):
                        u = cycle_nodes[i]
                        v = cycle_nodes[i+1]
                        edge_data = G_fin.get_edge_data(u, v, default={"amount": 0.0})
                        amt = edge_data.get("amount", 0.0)
                        total_loop_amt += amt
                        steps.append({
                            "step": i + 1,
                            "from": u,
                            "to": v,
                            "amount": f"₹{amt:,.2f}"
                        })

                    patterns.append({
                        "id": f"pat-cyc-{c_idx+1}",
                        "pattern_type": "Circular Wash Movement",
                        "severity": "critical",
                        "title": f"Potentially Suspicious Cyclic Fund Routing ({' → '.join(cycle[:3])})",
                        "description": f"Cyclic flow returning funds to origin across {len(cycle)} intermediary hops without clear underlying commercial trade.",
                        "involved_accounts": list(cycle),
                        "total_amount": f"₹{total_loop_amt:,.2f}",
                        "hop_count": len(cycle),
                        "flow_nodes": steps,
                        "disclaimer": "Potentially Suspicious Financial Pattern — Requires forensic audit verification."
                    })
        except Exception:
            pass

        # 2. Rapid Mule Consolidation / Intermediary Layering
        for node in G_fin.nodes():
            in_deg = G_fin.in_degree(node)
            out_deg = G_fin.out_degree(node)
            if in_deg >= 2 and out_deg >= 1:
                in_amt = sum(G_fin[u][node].get("amount", 0) for u in G_fin.predecessors(node))
                out_amt = sum(G_fin[node][v].get("amount", 0) for v in G_fin.successors(node))
                
                steps = []
                step_n = 1
                for u in list(G_fin.predecessors(node))[:3]:
                    steps.append({
                        "step": step_n,
                        "from": u,
                        "to": node,
                        "amount": f"₹{G_fin[u][node].get('amount', 0):,.2f}"
                    })
                    step_n += 1
                for v in list(G_fin.successors(node))[:2]:
                    steps.append({
                        "step": step_n,
                        "from": node,
                        "to": v,
                        "amount": f"₹{G_fin[node][v].get('amount', 0):,.2f}"
                    })
                    step_n += 1

                patterns.append({
                    "id": f"pat-lay-{node}",
                    "pattern_type": "Intermediary Account Layering",
                    "severity": "high",
                    "title": f"Mule Aggregation & Rapid Disbursement Hub ({node})",
                    "description": f"Account {node} receives inflows from {in_deg} disparate sources and swiftly disburses outward to {out_deg} beneficiary accounts.",
                    "involved_accounts": [node] + list(G_fin.predecessors(node))[:2] + list(G_fin.successors(node))[:2],
                    "total_amount": f"₹{in_amt:,.2f}",
                    "hop_count": in_deg + out_deg,
                    "flow_nodes": steps,
                    "disclaimer": "Potentially Suspicious Financial Pattern — Requires forensic audit verification."
                })
                break

    return {
        "metrics": {
            "total_monitored_accounts": len(accounts),
            "flagged_accounts_count": len([a for a in accounts if a.get("is_flagged")]),
            "total_transactions_analyzed": len(transactions),
            "suspicious_transactions_count": len(flagged_tx),
            "total_flow_volume": total_volume,
            "suspicious_flow_volume": suspicious_volume
        },
        "patterns": patterns,
        "recent_transactions": transactions[:25]
    }

