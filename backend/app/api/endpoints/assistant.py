"""AI Assistant endpoints."""

import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

import os

router = APIRouter(prefix="/api/v1", tags=["assistant"])

class AISummaryRequest(BaseModel):
    api_data: Dict[str, Any]
    context_type: str = "api_detail"  # "api_detail" or "blast_radius"

class AISummaryResponse(BaseModel):
    summary: str
    model_used: str

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "llama3")

@router.post("/ai/summary", response_model=AISummaryResponse)
def generate_ai_summary(request: AISummaryRequest):
    """
    Generate an AI summary using local Ollama instance.
    """
    if request.context_type == "api_detail":
        prompt = f"""You are an expert API Security Architect. Review the following Styx API profile and provide a 3-sentence executive summary explaining the risk, and 2 bullet points for remediation steps. Be concise, direct, and professional. Do not invent details not present in the data.

API Data:
{request.api_data}

Response format:
**Executive Summary**
(3 sentences)

**Remediation Steps**
- (step 1)
- (step 2)
"""
    elif request.context_type == "blast_radius":
        prompt = f"""You are an expert Enterprise Architect. Review the following Styx Blast Radius Simulation results and provide a 3-sentence executive summary explaining the business impact of decommissioning this API, and 1 clear recommendation. Be concise and professional.

Simulation Data:
{request.api_data}

Response format:
**Business Impact**
(3 sentences)

**Recommendation**
(1 sentence)
"""
    else:
        raise HTTPException(status_code=400, detail="Invalid context_type")

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": DEFAULT_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        return AISummaryResponse(
            summary=result.get("response", "No response generated."),
            model_used=DEFAULT_MODEL
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to local Ollama instance: {str(e)}")
