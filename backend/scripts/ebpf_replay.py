import json
import time
import os
import sys
from datetime import datetime, timezone

# Add parent directory to path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models import API, APIStatus
from app.models.security import APISecurityPosture
from app.services.alert_engine import AlertEngine

STATE_FILE = "data/replay_state.json"
DATA_FILE = "data/ebpf_capture.jsonl"
OPENAPI_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "openapi.json")

def load_openapi_endpoints():
    try:
        with open(OPENAPI_PATH, 'r') as f:
            data = json.load(f)
            endpoints = set()
            for path, methods in data.get("paths", {}).items():
                for method in methods.keys():
                    endpoints.add((path, method.upper()))
            return endpoints
    except Exception as e:
        print(f"Failed to load OpenAPI spec: {e}")
        return set()

def load_state():
    try:
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {"status": "paused", "speed": 1.0, "events_processed": 0, "total_events": 5000}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def update_api_stats(api, response_time, status_code):
    api.average_response_time_ms = (api.average_response_time_ms * 0.9) + (response_time * 0.1)
    is_error = 1.0 if status_code >= 400 else 0.0
    api.error_rate_percent = (api.error_rate_percent * 0.9) + (is_error * 100 * 0.1)
    api.last_traffic_seen = datetime.now(timezone.utc)

def process_ebpf_event(event_data, allowed_endpoints, db):
    method = event_data["method"]
    path = event_data["endpoint"]
    status = event_data["status"]
    latency = event_data["latency_ms"]
    has_auth_header = True  # Assuming eBPF capture found auth tokens for this demo
    
    # Check if it exists exactly matching endpoint AND method
    api = db.query(API).filter(API.endpoint == path, API.method == method).first()
    
    is_allowed = (path, method) in allowed_endpoints
    current_status = APIStatus.ACTIVE if is_allowed else APIStatus.SHADOW
    
    if not api:
        # Discovery Engine: Found a new API!
        api = API(
            endpoint=path,
            method=method,
            host="localhost",
            current_status=current_status,
            zombie_score=0.8 if not is_allowed else 0.1,
            has_documentation=is_allowed,
            average_response_time_ms=latency,
            error_rate_percent=100.0 if status >= 400 else 0.0,
            last_traffic_seen=datetime.now(timezone.utc)
        )
        db.add(api)
        db.commit()
        db.refresh(api)
        
        # Create default security posture
        try:
            sec = APISecurityPosture(
                api_id=api.id,
                has_authentication=has_auth_header,
                uses_https=True, # Kernel level usually sees decrypted TLS
                owasp_category="OWASP API2:2023" if not has_auth_header else "OWASP API8:2023",
                severity="CRITICAL" if not has_auth_header else "MEDIUM",
                cvss_score=9.1 if not has_auth_header else 5.9,
                security_risk_score=0.9 if not has_auth_header else 0.5,
                last_assessed=datetime.now(timezone.utc)
            )
            db.add(sec)
            db.commit()
        except Exception as e:
            db.rollback()
            
        if current_status == APIStatus.SHADOW:
            AlertEngine.check_shadow_discovery(api, db)
    else:
        # Update existing API
        api.previous_status = api.current_status
        if current_status == APIStatus.SHADOW and api.current_status != APIStatus.SHADOW:
            api.current_status = APIStatus.SHADOW
        elif is_allowed and api.current_status != APIStatus.ACTIVE:
            api.current_status = APIStatus.ACTIVE
            
        update_api_stats(api, latency, status)
        db.commit()

def main():
    print("Starting eBPF Replay Collector with Discovery Engine...")
    db = SessionLocal()
    allowed_endpoints = load_openapi_endpoints()
    
    try:
        with open(DATA_FILE, "r") as f:
            lines = f.readlines()
            
        total_events = len(lines)
        
        while True:
            state = load_state()
            state["total_events"] = total_events
            
            if state["status"] == "playing":
                current_idx = state["events_processed"]
                
                if current_idx >= total_events:
                    state["events_processed"] = 0
                    save_state(state)
                    continue
                    
                event_data = json.loads(lines[current_idx])
                
                # Process event through the Discovery Engine
                process_ebpf_event(event_data, allowed_endpoints, db)
                
                # Update state
                state["events_processed"] += 1
                save_state(state)
                
                base_sleep = 0.2
                sleep_time = base_sleep / max(0.1, float(state.get("speed", 1.0)))
                time.sleep(sleep_time)
                
            else:
                time.sleep(0.5)
                
    except KeyboardInterrupt:
        print("\neBPF Replay Collector stopped.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
