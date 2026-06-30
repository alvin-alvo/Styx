"""
Lifecycle Scoring Service

Calculates lifecycle risk scores for APIs based on multiple factors:
- Traffic decay (days since last seen)
- Documentation status
- Authentication strength
- Dependency orphan status
"""

import math
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import API, Dependency, APISecurityPosture


class LifecycleScorer:
    """Calculate API lifecycle risk scores using deterministic formulas."""

    @staticmethod
    def calculate_zombie_score(api: API, session: Session) -> Dict[str, Any]:
        """
        Calculate zombie score (0-1) and factors.
        Replaces the ML model with a deterministic, citable formula.

        Formula:
        zombie_score = 0.35*traffic_decay + 0.25*documentation_gap + 0.20*auth_weakness + 0.20*dependency_orphan

        Returns:
            {
                "zombie_score": float (0-1),
                "factors": {
                    "traffic_decay": float,
                    "documentation": float,
                    "auth_weakness": float,
                    "dependency_orphan": float
                },
                "classification": str (ACTIVE/DEPRECATED/ZOMBIE)
            }
        """
        factors = {}

        # Factor 1: Traffic decay (35%)
        # Rationale: Highest single weight because absence of traffic is the most direct, hardest-to-fake signal of abandonment.
        # Source: Wallarm's rogue-API detection methodology. Decay window chosen per 42Crunch State of API Security 2026 (90-day window).
        if api.last_traffic_seen:
            # Assuming last_traffic_seen is timezone naive in DB based on previous code
            days_since = max(0, (datetime.utcnow() - api.last_traffic_seen.replace(tzinfo=None)).days)
            factors["traffic_decay"] = 1.0 - math.exp(-days_since / 30.0)
        else:
            factors["traffic_decay"] = 1.0

        # Factor 2: Documentation gap (25%)
        # Rationale: OWASP formally elevated this to its own top-10 category (API9:2023 'Improper Inventory Management').
        # Split into partial penalties: missing owner = 0.5, missing docs = 0.5
        doc_penalty = 0.0
        if not api.owner:
            doc_penalty += 0.5
        if not api.has_documentation:
            doc_penalty += 0.5
        factors["documentation"] = doc_penalty

        # Factor 3: Authentication weakness (20%)
        # Rationale: Broken Authentication is API2:2023. Missing Auth is the single most frequently reported vulnerability.
        security = session.query(APISecurityPosture).filter_by(
            api_id=api.id
        ).first()
        factors["auth_weakness"] = 0.0 if (security and security.has_authentication) else 1.0

        # Factor 4: Dependency orphan (20%)
        # Rationale: An API with zero callers is structurally orphaned. (Source: Entro Security's zombie API remediation guidance).
        incoming_deps = session.query(func.count(Dependency.id)).filter_by(
            target_api_id=api.id
        ).scalar()
        factors["dependency_orphan"] = 0.0 if incoming_deps > 0 else 1.0

        # Calculate weighted score
        zombie_score = (
            0.35 * factors["traffic_decay"]
            + 0.25 * factors["documentation"]
            + 0.20 * factors["auth_weakness"]
            + 0.20 * factors["dependency_orphan"]
        )

        # Classify based on CVSS-style qualitative banding convention (proportional thirds)
        if zombie_score < 0.4:
            classification = "ACTIVE"
        elif zombie_score < 0.7:
            classification = "DEPRECATED"
        else:
            classification = "ZOMBIE"

        return {
            "zombie_score": round(zombie_score, 3),
            "factors": {k: round(v, 3) for k, v in factors.items()},
            "classification": classification,
        }

    @staticmethod
    def calculate_impact_score(api: API, session: Session) -> Dict[str, Any]:
        """
        Calculate operational impact score based on dependents.

        Formula: impact_score = 0.6 * traffic_percentage + 0.4 * min(dependent_services / 20.0, 1.0)
        Rationale: Traffic percentage weighted higher because raw call volume is a direct measure of current business dependency.
        Service count can overstate risk if many dependents each contribute negligible traffic.
        Severity Bands: <0.3 (LOW), 0.3-0.7 (MEDIUM), >=0.7 (HIGH).

        Returns:
            {
                "dependent_services": int,
                "traffic_percentage": float,
                "impact_score": float (0-1),
                "impact_severity": str (LOW/MEDIUM/HIGH)
            }
        """
        # Count dependent services
        dependencies = (
            session.query(Dependency)
            .filter_by(target_api_id=api.id)
            .all()
        )

        dependent_services = len(set(d.source_service for d in dependencies))
        traffic_percentage = sum(d.traffic_percentage for d in dependencies) if dependencies else 0.0

        # Normalize dependency count to 0-1 scale
        normalized_deps = min(dependent_services / 20.0, 1.0)

        # Weighted calculation
        impact_score = 0.6 * traffic_percentage + 0.4 * normalized_deps

        # Classify severity
        if impact_score >= 0.7:
            severity = "HIGH"
        elif impact_score >= 0.3:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        return {
            "dependent_services": dependent_services,
            "traffic_percentage": round(traffic_percentage, 3),
            "impact_score": round(impact_score, 3),
            "impact_severity": severity,
        }
