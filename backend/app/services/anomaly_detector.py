"""
Anomaly detection for API lifecycle events.
Uses Modified Z-Score via Median Absolute Deviation (MAD) for deterministic anomaly detection.
"""

from datetime import datetime, timezone
from typing import Dict, List, Tuple, Any
from sqlalchemy.orm import Session
import statistics

from app.models.api import API
from app.models.dependency import Dependency
from app.models.security import APISecurityPosture


def median_abs_deviation(values: List[float]) -> float:
    if not values:
        return 0.0
    med = statistics.median(values)
    return statistics.median([abs(v - med) for v in values])

def modified_z_score(x: float, values: List[float]) -> float:
    if not values:
        return 0.0
    med = statistics.median(values)
    mad = median_abs_deviation(values)
    if mad == 0:
        return 0.0  # avoid div/0 when population is degenerate
    return 0.6745 * (x - med) / mad


class AnomalyDetector:
    """Detects anomalies using Modified Z-Score across 8 extracted features."""

    def __init__(self):
        self.is_trained = False
        self.feature_names = [
            "days_since_last_call",
            "documentation_score",
            "auth_mechanism_score",
            "orphan_dependency_ratio",
            "security_violations_count",
            "response_time_ms",
            "error_rate_percent",
            "dependent_api_count"
        ]
        
        # We will store the historical values for each feature here
        self.population_data: Dict[str, List[float]] = {name: [] for name in self.feature_names}
        
        # Feature weights for the composite anomaly score
        self.feature_weights = {
            "days_since_last_call": 0.35,
            "documentation_score": 0.25,
            "auth_mechanism_score": 0.20,
            "orphan_dependency_ratio": 0.20,
            "security_violations_count": 0.25,
            "response_time_ms": 0.20,
            "error_rate_percent": 0.20,
            "dependent_api_count": 0.20
        }
        
        self.total_weight = sum(self.feature_weights.values())

    def _extract_features(self, api: API, session: Session) -> Dict[str, float]:
        """Extract the 8 core features used for anomaly detection."""
        # 1. days_since_last_call
        last_call = api.last_traffic_seen or api.created_at
        now = datetime.utcnow()
        if last_call.tzinfo is not None:
            now = datetime.now(timezone.utc)
        days_since = max(0, (now - last_call).days)
        days_since_norm = min(days_since / 365.0, 1.0)

        # 2. documentation_score
        doc_score = 1.0 if api.has_documentation else 0.0

        # 3. auth_mechanism_score
        security = session.query(APISecurityPosture).filter_by(api_id=api.id).first()
        auth_score = 1.0 if (security and security.has_authentication) else 0.0

        # 4. orphan_dependency_ratio
        dependents = session.query(Dependency).filter_by(target_api_id=api.id).count()
        total_deps = 0  # In original code this was 0.
        orphan_ratio = 0.0 if total_deps == 0 else 1.0 - (dependents / (total_deps + 1))

        # 5. security_violations_count
        violations = 0
        if security:
            if not security.has_authentication:
                violations += 1
            if not security.uses_https:
                violations += 1
            if not security.has_rate_limiting:
                violations += 1
            if security.exposes_sensitive_data:
                violations += 1

        # 6. response_time_ms
        response_time_norm = min(api.average_response_time_ms / 1000.0, 1.0)

        # 7. error_rate_percent
        error_rate_norm = api.error_rate_percent / 100.0

        # 8. dependent_api_count
        dependent_count_norm = float(dependents) / 25.0

        return {
            "days_since_last_call": days_since_norm,
            "documentation_score": doc_score,
            "auth_mechanism_score": auth_score,
            "orphan_dependency_ratio": orphan_ratio,
            "security_violations_count": float(violations),
            "response_time_ms": response_time_norm,
            "error_rate_percent": error_rate_norm,
            "dependent_api_count": dependent_count_norm
        }

    def fit(self, session: Session) -> None:
        """
        Populate the baseline data (medians and MADs) for all APIs in the system.
        This recalculates the population statistics.
        """
        apis = session.query(API).all()
        
        # Reset population data
        self.population_data = {name: [] for name in self.feature_names}
        
        for api in apis:
            features = self._extract_features(api, session)
            for name, val in features.items():
                self.population_data[name].append(val)
                
        self.is_trained = True

    def get_all_anomalies(self, api: API, session: Session) -> Dict[str, Tuple[bool, Dict[str, Any]]]:
        """
        Get composite anomaly score and flag using MAD Modified Z-Score.
        Returns:
            dict with a single 'composite_anomaly' key containing (is_anomaly, metadata)
        """
        if not self.is_trained:
            # Fallback if not fitted yet
            self.fit(session)
            
        features = self._extract_features(api, session)
        
        anomaly_magnitude = 0.0
        z_scores = {}
        
        for name, val in features.items():
            pop_values = self.population_data.get(name, [])
            mod_z = modified_z_score(val, pop_values)
            z_scores[name] = mod_z
            
            weight = self.feature_weights.get(name, 0.20)
            anomaly_magnitude += weight * abs(mod_z)
            
        anomaly_magnitude /= self.total_weight
        
        # Outlier threshold is 3.5 per Iglewicz and Hoaglin (1993)
        is_anomaly = anomaly_magnitude > 3.5
        
        metadata = {
            "anomaly_magnitude": anomaly_magnitude,
            "feature_z_scores": z_scores,
            "is_anomaly": is_anomaly
        }
        
        return {
            "composite_anomaly": (is_anomaly, metadata)
        }
        
    def has_anomalies(self, api: API, session: Session) -> bool:
        """Check if API has any anomalies."""
        anomalies = self.get_all_anomalies(api, session)
        return any(is_anom for is_anom, _ in anomalies.values())


# Global detector instance
_detector = AnomalyDetector()


def get_detector() -> AnomalyDetector:
    """Get global detector instance."""
    return _detector
