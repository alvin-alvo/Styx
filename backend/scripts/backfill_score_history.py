import os
import sys
import math
from datetime import datetime, timedelta, timezone

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import delete, func
from app.core.database import SessionLocal
from app.models import API, APISecurityPosture, Dependency, APIStatus
from app.models.lifecycle_score_history import LifecycleScoreHistory

def main():
    db = SessionLocal()
    
    # Clear existing history
    db.execute(delete(LifecycleScoreHistory))
    db.commit()

    apis = db.query(API).all()
    now = datetime.now(timezone.utc)
    
    total_inserted = 0

    from app.models.api import TrafficSource
    
    for api in apis:
        # Get earliest discovery date
        earliest_source = db.query(func.min(TrafficSource.discovered_at)).filter_by(api_id=api.id).scalar()
        if earliest_source:
            discovered_at_naive = earliest_source.replace(tzinfo=None)
        else:
            discovered_at_naive = now.replace(tzinfo=None) - timedelta(days=90)

        # Pre-compute static factors (doc, auth, orphan)
        doc_penalty = 0.0
        if not api.owner:
            doc_penalty += 0.5
        if not api.has_documentation:
            doc_penalty += 0.5
        documentation = doc_penalty
        
        security = db.query(APISecurityPosture).filter_by(api_id=api.id).first()
        auth_weakness = 0.0 if (security and security.has_authentication) else 1.0
        
        incoming_deps = db.query(func.count(Dependency.id)).filter_by(target_api_id=api.id).scalar()
        dependency_orphan = 0.0 if incoming_deps > 0 else 1.0
        
        # We loop 29 down to 1
        for day_offset in range(29, 0, -1):
            date_at_offset = now - timedelta(days=day_offset)
            date_naive = date_at_offset.replace(tzinfo=None)
            
            # Skip scoring if API was not discovered yet
            if date_naive < discovered_at_naive:
                continue
            
            if api.current_status == APIStatus.SHADOW:
                classification = "SHADOW"
                zombie_score = 0.0  # Or whatever makes sense, not used for SHADOW typically
            else:
                # Compute traffic decay dynamically
                if api.last_traffic_seen:
                    last_seen_naive = api.last_traffic_seen.replace(tzinfo=None)
                    
                    if last_seen_naive > date_naive:
                        # If traffic was seen AFTER this historical date, we assume it was active then too
                        traffic_decay = 0.0
                    else:
                        days_since = max(0, (date_naive - last_seen_naive).days)
                        traffic_decay = 1.0 - math.exp(-days_since / 30.0)
                else:
                    traffic_decay = 1.0

                zombie_score = (
                    0.35 * traffic_decay
                    + 0.25 * documentation
                    + 0.20 * auth_weakness
                    + 0.20 * dependency_orphan
                )
                
                if zombie_score < 0.4:
                    classification = "ACTIVE"
                elif zombie_score < 0.7:
                    classification = "DEPRECATED"
                else:
                    classification = "ZOMBIE"

            history_row = LifecycleScoreHistory(
                api_id=api.id,
                zombie_score=zombie_score,
                classification=classification,
                recorded_at=date_at_offset,
                is_backfilled=True
            )
            db.add(history_row)
            total_inserted += 1

    db.commit()
    db.close()
    
    print(f"Backfill complete! Inserted {total_inserted} history records.")
    print("Note: Today's slot (day_offset=0) is intentionally left empty for live pipeline data.")

if __name__ == "__main__":
    main()
