"""
Multi-Signal Entity Resolution & Semantic Matching Engine for TRACE-AI.
Combines String Token Overlap, TF-IDF Semantic Embeddings, Attribute Corroboration,
and Conflict Detection. Outputs: MATCH, POSSIBLE MATCH, AMBIGUOUS, NO MATCH.
"""

from typing import Dict, Any, List, Optional
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class EntityResolutionEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 3), analyzer="char_wb")

    def compare_entities(self, candidate: Dict[str, Any], existing: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compare candidate entity with existing entity across multiple signals.
        Signals:
        1. Name string & fuzzy similarity
        2. Semantic TF-IDF cosine similarity
        3. Phone match/conflict
        4. Vehicle match/conflict
        5. Location overlap
        6. Organization overlap
        """
        cand_name = str(candidate.get("name", "")).strip().lower()
        exist_name = str(existing.get("name", "")).strip().lower()

        if not cand_name or not exist_name:
            return {
                "decision": "NO MATCH",
                "confidence": 0.0,
                "reasoning": "Missing name identifiers for comparison."
            }

        # 1. String & Token Overlap Similarity
        seq_ratio = difflib.SequenceMatcher(None, cand_name, exist_name).ratio()
        
        # Token intersection
        cand_tokens = set(cand_name.split())
        exist_tokens = set(exist_name.split())
        token_jaccard = len(cand_tokens & exist_tokens) / max(len(cand_tokens | exist_tokens), 1)

        # 2. Semantic n-gram similarity via TF-IDF
        try:
            tfidf_matrix = self.vectorizer.fit_transform([cand_name, exist_name])
            semantic_score = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        except Exception:
            semantic_score = seq_ratio

        base_name_score = (seq_ratio * 0.4) + (token_jaccard * 0.3) + (semantic_score * 0.3)

        # 3. Supporting Attributes Analysis
        cand_phone = str(candidate.get("phone", "")).strip()
        exist_phone = str(existing.get("phone", "")).strip()

        cand_vehicle = str(candidate.get("vehicle", "")).strip().upper()
        exist_vehicle = str(existing.get("vehicle", "")).strip().upper()

        cand_loc = str(candidate.get("location", "")).strip().lower()
        exist_loc = str(existing.get("location", "")).strip().lower()

        has_phone_match = bool(cand_phone and exist_phone and cand_phone == exist_phone)
        has_phone_conflict = bool(cand_phone and exist_phone and cand_phone != exist_phone)

        has_veh_match = bool(cand_vehicle and exist_vehicle and cand_vehicle == exist_vehicle)
        has_veh_conflict = bool(cand_vehicle and exist_vehicle and cand_vehicle != exist_vehicle)

        has_loc_match = bool(cand_loc and exist_loc and (cand_loc in exist_loc or exist_loc in cand_loc))

        # 4. Score Calculation with Multi-Signal Corroboration
        score = base_name_score

        reasons = [f"Name similarity: {base_name_score:.2f}"]

        if has_phone_match:
            score += 0.35
            reasons.append("Corroborating phone match (+0.35)")
        elif has_phone_conflict:
            score -= 0.30
            reasons.append("Conflicting phone numbers (-0.30)")

        if has_veh_match:
            score += 0.30
            reasons.append("Corroborating vehicle match (+0.30)")
        elif has_veh_conflict:
            score -= 0.25
            reasons.append("Conflicting vehicle identifiers (-0.25)")

        if has_loc_match:
            score += 0.10
            reasons.append("Shared operational location (+0.10)")

        score = max(0.0, min(1.0, score))
        confidence_pct = round(score * 100, 1)

        # 5. Classify Decision
        if has_phone_conflict or has_veh_conflict:
            decision = "AMBIGUOUS"
            reasons.append("Conflicting primary attributes; marked for Mandatory Human Review")
        elif score >= 0.90 and (has_phone_match or has_veh_match or base_name_score > 0.95):
            decision = "MATCH"
        elif score >= 0.70:
            decision = "POSSIBLE MATCH"
        elif score >= 0.45:
            decision = "AMBIGUOUS"
            reasons.append("Moderate similarity without sufficient corroboration")
        else:
            decision = "NO MATCH"

        return {
            "decision": decision,
            "confidence": confidence_pct,
            "name_similarity": round(base_name_score, 2),
            "semantic_similarity": round(semantic_score, 2),
            "has_supporting_evidence": has_phone_match or has_veh_match,
            "requires_human_review": decision in ["AMBIGUOUS", "POSSIBLE MATCH"],
            "reasoning": "; ".join(reasons)
        }

    def resolve_against_repository(self, candidate: Dict[str, Any], existing_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Evaluate candidate against existing records in the database."""
        matches = []
        for existing in existing_list:
            res = self.compare_entities(candidate, existing)
            if res["decision"] != "NO MATCH":
                matches.append({
                    "existing_entity": existing,
                    "resolution": res
                })
        return sorted(matches, key=lambda x: x["resolution"]["confidence"], reverse=True)

entity_resolver = EntityResolutionEngine()

def get_entity_resolver() -> EntityResolutionEngine:
    return entity_resolver
