"""
Isolation Forest & Statistical Anomaly Detection Engine for TRACE-AI.
Analyzes transactions, communication bursts, and graph degree spikes.
Designates findings strictly as: 'Statistical Anomaly Indicator  -  Requires human verification.'
"""

import numpy as np
from datetime import datetime
from typing import List, Dict, Any
from sklearn.ensemble import IsolationForest
from backend.app.database.session import get_repository
from backend.app.graph.engine import get_graph_engine

class AnomalyDetectionEngine:
    def __init__(self):
        self.repo = get_repository()
        self.engine = get_graph_engine()

    def detect_transaction_anomalies(self) -> List[Dict[str, Any]]:
        """Detect outliers in financial transaction patterns using Isolation Forest."""
        transactions = self.repo.get_collection("transactions")
        if len(transactions) < 3:
            return []

        # Extract numerical features: [amount, is_weekend, hour_of_day]
        features = []
        for t in transactions:
            amt = float(t.get("amount", 0.0))
            ts_str = t.get("timestamp", "")
            hour = 12
            is_weekend = 0
            try:
                dt = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
                hour = dt.hour
                is_weekend = 1 if dt.weekday() >= 5 else 0
            except Exception:
                pass
            features.append([amt, hour, is_weekend])

        X = np.array(features)
        
        try:
            # Isolation Forest anomaly scoring
            clf = IsolationForest(contamination=min(0.25, max(0.05, 2.0 / len(transactions))), random_state=42)
            preds = clf.fit_predict(X)
            scores = clf.decision_function(X)
        except Exception:
            preds = [-1 if x[0] > 300000 else 1 for x in features]
            scores = [-0.5 if p == -1 else 0.5 for p in preds]

        anomalies = []
        for idx, (t, pred, score) in enumerate(zip(transactions, preds, scores)):
            if pred == -1:  # Outlier detected
                contributing = []
                if X[idx][0] > 200000:
                    contributing.append(f"Elevated amount: ?{X[idx][0]:,.2f}")
                if X[idx][1] < 6 or X[idx][1] > 22:
                    contributing.append(f"Nocturnal timing: {int(X[idx][1]):02d}:00 hrs")
                if X[idx][2] == 1:
                    contributing.append("Weekend execution")
                if not contributing:
                    contributing.append("Multivariate statistical deviation from baseline distribution")

                anomalies.append({
                    "id": f"anom-tx-{idx+1}",
                    "record_id": t.get("id"),
                    "category": "Financial Outlier",
                    "anomaly_score": round(float(abs(score)), 3),
                    "is_anomaly": True,
                    "contributing_features": contributing,
                    "timestamp": t.get("timestamp"),
                    "related_entities": [t.get("sender_account_id"), t.get("receiver_account_id")],
                    "disclaimer": "Statistical Anomaly Indicator  -  Does not constitute determination of criminality. Requires forensic review."
                })

        return sorted(anomalies, key=lambda x: x["anomaly_score"], reverse=True)

    def detect_graph_degree_anomalies(self) -> List[Dict[str, Any]]:
        """Detect entities with sudden degree or hub connection spikes."""
        G = self.engine.graph
        if len(G) < 5:
            return []

        degrees = [d for _, d in G.degree()]
        mean_deg = float(np.mean(degrees))
        std_deg = float(np.std(degrees)) or 1.0

        anomalies = []
        for node_id, deg in G.degree():
            z_score = (deg - mean_deg) / std_deg
            if z_score > 2.0 and deg >= 4:
                anomalies.append({
                    "id": f"anom-node-{node_id}",
                    "entity_id": node_id,
                    "label": G.nodes[node_id].get("label", node_id),
                    "category": "High-Degree Convergence Spike",
                    "degree": deg,
                    "z_score": round(z_score, 2),
                    "is_anomaly": True,
                    "contributing_features": [
                        f"Direct connectivity ({deg} edges) exceeds mean ({mean_deg:.1f}) by {z_score:.1f} standard deviations"
                    ],
                    "timestamp": datetime.utcnow().isoformat(),
                    "disclaimer": "Topology Anomaly  -  Indicates structural hub clustering. Human validation required."
                })

        return sorted(anomalies, key=lambda x: x["z_score"], reverse=True)

anomaly_engine = AnomalyDetectionEngine()

def get_anomaly_engine() -> AnomalyDetectionEngine:
    return anomaly_engine
