from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter(prefix="/api/v1/ebpf", tags=["ebpf"])

STATE_FILE = "data/replay_state.json"

class ReplayState(BaseModel):
    status: str
    speed: float
    events_processed: int
    total_events: int
    source: str

from typing import Optional

class UpdateReplayState(BaseModel):
    status: Optional[str] = None
    speed: Optional[float] = None

@router.get("/state", response_model=ReplayState)
def get_replay_state():
    """Get current state of the eBPF replay collector."""
    try:
        if not os.path.exists(STATE_FILE):
            return ReplayState(
                status="paused",
                speed=1.0,
                events_processed=0,
                total_events=5000,
                source="ebpf_capture.jsonl"
            )
            
        with open(STATE_FILE, "r") as f:
            data = json.load(f)
            return ReplayState(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/state", response_model=ReplayState)
def update_replay_state(update: UpdateReplayState):
    """Update replay controls (Play, Pause, Speed)."""
    try:
        # Load existing
        if not os.path.exists(STATE_FILE):
            state = {
                "status": "paused",
                "speed": 1.0,
                "events_processed": 0,
                "total_events": 5000,
                "source": "ebpf_capture.jsonl"
            }
        else:
            with open(STATE_FILE, "r") as f:
                state = json.load(f)
                
        # Update
        if update.status is not None:
            if update.status == "restart":
                state["status"] = "playing"
                state["events_processed"] = 0
            else:
                state["status"] = update.status
                
        if update.speed is not None:
            state["speed"] = update.speed
            
        # Save
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)
            
        return ReplayState(**state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
