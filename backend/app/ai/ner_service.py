"""
Transformer-based Named Entity Recognition (NER) for TRACE-AI.
Extracts: PERSON, PHONE, LOCATION, VEHICLE, ORGANIZATION, DATE, ACCOUNT, EVENT.
Uses Groq Transformer model when configured; provides an honest, explicitly-labeled rule fallback if unavailable.
"""

import re
import json
import httpx
import logging
from typing import Dict, Any, List
from backend.app.config import settings

logger = logging.getLogger("trace_ai.ner")

class TransformerNERService:
    def __init__(self):
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
        self.candidate_models = [settings.GROQ_MODEL, "openai/gpt-oss-20b", "qwen/qwen3.8-27b", "groq/compound-mini"]

    async def extract_entities(self, text: str) -> Dict[str, Any]:
        """Extract structured entities from incident text with confidence scores."""
        if settings.GROQ_API_KEY:
            try:
                res = await self._extract_via_transformer(text)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Transformer NER extraction error: {e}")

        # Honest, clearly labeled fallback
        return self._extract_via_fallback(text)

    async def _extract_via_transformer(self, text: str) -> Dict[str, Any]:
        system_prompt = (
            "You are an expert NLP Entity Extractor for Law Enforcement Intelligence (TRACE-AI). "
            "Extract entities strictly from the provided text into JSON with categories:\n"
            "persons: list of {name: string, confidence: float (0.5-0.99)}\n"
            "phones: list of {number: string, confidence: float}\n"
            "vehicles: list of {registration: string, confidence: float}\n"
            "locations: list of {name: string, confidence: float}\n"
            "organizations: list of {name: string, confidence: float}\n"
            "dates: list of {date: string, confidence: float}\n"
            "accounts: list of {account: string, confidence: float}\n"
            "events: list of {event: string, confidence: float}\n\n"
            "Return ONLY a valid JSON object with these keys. No conversational text."
        )

        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=12.0) as client:
            for model_name in self.candidate_models:
                try:
                    payload = {
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": f"Document Text:\n{text[:3000]}"}
                        ],
                        "temperature": 0.1
                    }
                    resp = await client.post(self.groq_url, json=payload, headers=headers)
                    if resp.status_code == 200:
                        raw = resp.json()["choices"][0]["message"]["content"]
                        # Extract json block if surrounded by markdown
                        match = re.search(r"\{.*\}", raw, re.DOTALL)
                        if match:
                            parsed = json.loads(match.group(0))
                            return {
                                "model_used": model_name,
                                "is_transformer": True,
                                "engine_type": "Groq Cloud Transformer NER",
                                "entities": parsed
                            }
                except Exception as e:
                    logger.warning(f"Error in model {model_name} for NER: {e}")
        return None

    def _extract_via_fallback(self, text: str) -> Dict[str, Any]:
        """Controlled, explicitly-labeled rule fallback when Transformer model is offline."""
        persons_raw = list(set(re.findall(r"(?:Shri\s+|Mr\.\s+|suspect\s+|officer\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)", text)))
        phones_raw = list(set(re.findall(r"(?:\+91[\-\s]?)?[6-9]\d{9}", text)))
        vehicles_raw = list(set(re.findall(r"\b[A-Z]{2}[-\s]?\d{2}[-\s]?[A-Z]{1,2}[-\s]?\d{4}\b", text)))
        dates_raw = list(set(re.findall(r"\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b", text, re.IGNORECASE)))
        accounts_raw = list(set(re.findall(r"\b(?:A/C|Account|Acc|A/c)[:\s]*([A-Z0-9]{8,18})\b", text, re.IGNORECASE)))

        return {
            "model_used": "regex_rule_fallback",
            "is_transformer": False,
            "engine_type": "Deterministic Pattern Engine",
            "notice": "Running in rule fallback mode. Cloud Transformer model active when GROQ_API_KEY configured.",
            "entities": {
                "persons": [{"name": p, "confidence": 0.72} for p in persons_raw[:6]],
                "phones": [{"number": p, "confidence": 0.85} for p in phones_raw[:5]],
                "vehicles": [{"registration": v, "confidence": 0.88} for v in vehicles_raw[:5]],
                "locations": [],
                "organizations": [],
                "dates": [{"date": d, "confidence": 0.90} for d in dates_raw[:5]],
                "accounts": [{"account": a, "confidence": 0.80} for a in accounts_raw[:5]],
                "events": []
            }
        }

ner_service = TransformerNERService()

def get_ner_service() -> TransformerNERService:
    return ner_service
