"""AI Assistant endpoints."""

import requests
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.api import API
import os

router = APIRouter(prefix="/api/v1", tags=["assistant"])

class AISummaryRequest(BaseModel):
    api_data: Dict[str, Any]
    context_type: str = "api_detail"  # "api_detail" or "blast_radius"

class AISummaryResponse(BaseModel):
    summary: str
    model_used: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    message: ChatMessage
    model_used: str

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_CHAT_URL = os.environ.get("OLLAMA_CHAT_URL", "http://localhost:11434/api/chat")
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "llama3")

@router.post("/ai/chat", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Interact with the Styx AI Assistant via Ollama's chat API with strict scoping and real-time context.
    """
    
    # Dynamically fetch real-time API inventory stats
    apis = db.query(API).all()
    total_apis = len(apis)
    status_counts = {}
    dead_apis = []
    
    for api in apis:
        status = api.current_status
        status_counts[status] = status_counts.get(status, 0) + 1
        if status in ['ZOMBIE', 'DEPRECATED']:
            dead_apis.append(api.endpoint)
            
    # Format a context block
    context_block = f"""
[REAL-TIME SYSTEM STATE]
Total APIs in Inventory: {total_apis}
Status Breakdown: {status_counts}
Dead/Zombie/Deprecated APIs: {', '.join(dead_apis[:15])} {'(Truncated)' if len(dead_apis) > 15 else ''}
"""
    
    # Broadened but strictly professional System Prompt
    system_prompt = ChatMessage(
        role="system",
        content=f"""You are Styx-AI, an Enterprise API Security Architect. 
YOUR CAPABILITIES: You have real-time access to the Styx API inventory. You can advise users on shortcuts, mathematical thresholds, and exact API counts.
CURRENT KNOWLEDGE:
{context_block}
YOUR SCOPE IS STRICTLY LIMITED to API Security, Zombie/Shadow APIs, Traffic Analytics, Mathematical anomaly detection (MAD/Z-scores), and the Styx Platform workflow.
CRITICAL RULE: If the user asks about ANY topic outside of this scope (e.g., writing general code, history, math unrelated to Styx, cooking, or general AI assistance), you MUST refuse to answer and politely redirect them to API security.
Do not break character. Be professional, direct, analytical, and concise."""
    )
    
    # Ensure system prompt is first
    messages = [system_prompt.model_dump()] + [msg.model_dump() for msg in request.messages]

    try:
        response = requests.post(
            OLLAMA_CHAT_URL,
            json={
                "model": DEFAULT_MODEL,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.1  # Set low for deterministic, factual, analytical responses
                }
            },
            timeout=60
        )
        response.raise_for_status()
        
        result = response.json()
        return ChatResponse(
            message=ChatMessage(**result.get("message", {"role": "assistant", "content": "No response."})),
            model_used=DEFAULT_MODEL
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to AI instance: {str(e)}")

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
            timeout=60
        )
        response.raise_for_status()
        
        result = response.json()
        return AISummaryResponse(
            summary=result.get("response", "No response generated."),
            model_used=DEFAULT_MODEL
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to AI instance: {str(e)}")
