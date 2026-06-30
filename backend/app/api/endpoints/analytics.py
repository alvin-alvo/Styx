"""
Analytics endpoints for Phase 2.1.
Provides trending data, distributions, heatmaps, and top at-risk APIs.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict
from collections import defaultdict

from app.core.database import get_db
from app.models.api import API
from app.models.dependency import Dependency
from app.models.security import APISecurityPosture
from app.models.lifecycle_score_history import LifecycleScoreHistory
from app.schemas.analytics import (
    ZombieTrendResponse, APITrendPoint, APIDistributionResponse,
    APIDistributionBucket, RiskHeatmapResponse, RiskCell,
    TopAtRiskResponse, TopAtRiskAPI, ScoringEngineMetrics,
    AnalyticsOverviewResponse
)
from app.services.lifecycle_scorer import LifecycleScorer
from app.services.anomaly_detector import get_detector
from app.services.security_analyzer import SecurityAnalyzer
import time

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])
security_analyzer = SecurityAnalyzer()

_cache = {}
CACHE_TTL = 10

def get_cached(key):
    if key in _cache and time.time() - _cache[key]["time"] < CACHE_TTL:
        return _cache[key]["data"]
    return None

def set_cached(key, data):
    _cache[key] = {"time": time.time(), "data": data}


@router.get("/zombie-trend", response_model=ZombieTrendResponse)
def get_zombie_trend(db: Session = Depends(get_db)) -> ZombieTrendResponse:
    """
    Get zombie API trends over last 30 days based on recorded history.
    """
    cached = get_cached("zombie_trend")
    if cached:
        return cached

    now = datetime.utcnow()
    cutoff_date = now - timedelta(days=30)
    
    # Query history
    history_records = db.query(LifecycleScoreHistory).filter(
        LifecycleScoreHistory.recorded_at >= cutoff_date
    ).all()
    
    # Bucket rows by day (YYYY-MM-DD)
    daily_counts = defaultdict(lambda: {"ZOMBIE": 0, "ACTIVE": 0, "DEPRECATED": 0, "SHADOW": 0})
    for record in history_records:
        day_str = record.recorded_at.strftime("%Y-%m-%d")
        if record.classification in daily_counts[day_str]:
            daily_counts[day_str][record.classification] += 1
            
    # Build APITrendPoint objects, forward-filling if no rows
    trend_data = []
    last_known_counts = {"ZOMBIE": 0, "ACTIVE": 0, "DEPRECATED": 0, "SHADOW": 0}
    
    for day_offset in range(29, -1, -1):
        date = now - timedelta(days=day_offset)
        day_str = date.strftime("%Y-%m-%d")
        
        if day_str in daily_counts and sum(daily_counts[day_str].values()) > 0:
            counts = daily_counts[day_str]
            last_known_counts = counts.copy()
        else:
            counts = last_known_counts.copy()
            
        trend_data.append(APITrendPoint(
            date=day_str,
            zombie_count=counts["ZOMBIE"],
            active_count=counts["ACTIVE"],
            deprecated_count=counts["DEPRECATED"],
            shadow_count=counts["SHADOW"]
        ))
        
    current_zombie_count = trend_data[-1].zombie_count
    total_current = sum([trend_data[-1].zombie_count, trend_data[-1].active_count, trend_data[-1].deprecated_count, trend_data[-1].shadow_count])
    zombie_percent = (current_zombie_count / total_current * 100) if total_current > 0 else 0

    first_zombies = trend_data[0].zombie_count
    if current_zombie_count > first_zombies * 1.1:
        trend_direction = "increasing"
    elif current_zombie_count < first_zombies * 0.9:
        trend_direction = "decreasing"
    else:
        trend_direction = "stable"
        
    res = ZombieTrendResponse(
        trend_data=trend_data,
        current_zombie_count=current_zombie_count,
        zombie_percentage=zombie_percent,
        trend_direction=trend_direction
    )
    set_cached("zombie_trend", res)
    return res

@router.get("/distribution", response_model=APIDistributionResponse)
def get_api_distribution(db: Session = Depends(get_db)) -> APIDistributionResponse:
    """Get API distribution by status and risk levels."""
    cached = get_cached("distribution")
    if cached:
        return cached

    apis = db.query(API).all()

    by_status = {"ACTIVE": 0, "DEPRECATED": 0, "ZOMBIE": 0, "SHADOW": 0}
    lifecycle_risks = []
    security_risks = []

    for api in apis:
        by_status[api.current_status] += 1

        # Get lifecycle risk
        result = LifecycleScorer.calculate_zombie_score(api, db)
        lifecycle_risks.append(result["zombie_score"])

        # Get security risk
        security_info = security_analyzer.analyze_security(api, db.query(APISecurityPosture).filter_by(api_id=api.id).first())
        findings = security_info.get("findings", [])
        max_cvss = max([f["cvss_score"] for f in findings], default=0.0)
        security_risks.append(max_cvss / 10.0)

    # Create lifecycle risk buckets
    lifecycle_buckets = [
        APIDistributionBucket(bucket_name="LOW (0-0.3)", count=0, percentage=0),
        APIDistributionBucket(bucket_name="MEDIUM (0.3-0.6)", count=0, percentage=0),
        APIDistributionBucket(bucket_name="HIGH (0.6-1.0)", count=0, percentage=0)
    ]
    for score in lifecycle_risks:
        if score < 0.3:
            lifecycle_buckets[0].count += 1
        elif score < 0.6:
            lifecycle_buckets[1].count += 1
        else:
            lifecycle_buckets[2].count += 1

    # Create security risk buckets
    security_buckets = [
        APIDistributionBucket(bucket_name="LOW (0-0.3)", count=0, percentage=0),
        APIDistributionBucket(bucket_name="MEDIUM (0.3-0.6)", count=0, percentage=0),
        APIDistributionBucket(bucket_name="HIGH (0.6-0.8)", count=0, percentage=0),
        APIDistributionBucket(bucket_name="CRITICAL (0.8-1.0)", count=0, percentage=0)
    ]
    for score in security_risks:
        if score < 0.3:
            security_buckets[0].count += 1
        elif score < 0.6:
            security_buckets[1].count += 1
        elif score < 0.8:
            security_buckets[2].count += 1
        else:
            security_buckets[3].count += 1

    total = len(apis)
    res = APIDistributionResponse(
        by_status=by_status,
        by_lifecycle_risk=lifecycle_buckets,
        by_security_risk=security_buckets,
        total_apis=total
    )
    set_cached("distribution", res)
    return res

@router.get("/risk-heatmap", response_model=RiskHeatmapResponse)
def get_risk_heatmap(db: Session = Depends(get_db)) -> RiskHeatmapResponse:
    """Get 2D heatmap of APIs by lifecycle vs security risk."""
    cached = get_cached("risk_heatmap")
    if cached:
        return cached

    apis = db.query(API).all()

    # Create 3x3 heatmap
    heatmap_dict = {}
    for lifecycle_bin in ["0-33", "33-67", "67-100"]:
        for security_bin in ["0-33", "33-67", "67-100"]:
            heatmap_dict[(lifecycle_bin, security_bin)] = 0

    for api in apis:
        # Get lifecycle risk
        result = LifecycleScorer.calculate_zombie_score(api, db)
        lifecycle_percent = result["zombie_score"] * 100
        if lifecycle_percent < 33:
            lifecycle_bin = "0-33"
        elif lifecycle_percent < 67:
            lifecycle_bin = "33-67"
        else:
            lifecycle_bin = "67-100"

        # Get security risk
        security_info = security_analyzer.analyze_security(api, db.query(APISecurityPosture).filter_by(api_id=api.id).first())
        findings = security_info.get("findings", [])
        max_cvss = max([f["cvss_score"] for f in findings], default=0.0)
        security_percent = (max_cvss / 10.0) * 100
        if security_percent < 33:
            security_bin = "0-33"
        elif security_percent < 67:
            security_bin = "33-67"
        else:
            security_bin = "67-100"

        heatmap_dict[(lifecycle_bin, security_bin)] += 1

    # Convert to heatmap cells
    heatmap = [
        RiskCell(lifecycle_bin=k[0], security_bin=k[1], api_count=v)
        for k, v in heatmap_dict.items()
    ]
    max_count = max(v for v in heatmap_dict.values()) if heatmap_dict else 0
    min_count = min(v for v in heatmap_dict.values()) if heatmap_dict else 0
    
    res = RiskHeatmapResponse(
        heatmap=heatmap,
        max_count=max_count,
        min_count=min_count
    )
    set_cached("risk_heatmap", res)
    return res

@router.get("/top-at-risk", response_model=TopAtRiskResponse)
def get_top_at_risk(limit: int = 10, db: Session = Depends(get_db)) -> TopAtRiskResponse:
    """Get top N APIs by combined risk score."""
    cached = get_cached(f"top_at_risk_{limit}")
    if cached:
        return cached

    apis = db.query(API).all()
    detector = get_detector()

    api_risks = []
    for api in apis:
        # Get lifecycle risk
        result = LifecycleScorer.calculate_zombie_score(api, db)
        lifecycle_score = result["zombie_score"]

        # Get security risk
        security_info = security_analyzer.analyze_security(api, db.query(APISecurityPosture).filter_by(api_id=api.id).first())
        findings = security_info.get("findings", [])
        max_cvss = max([f["cvss_score"] for f in findings], default=0.0)
        security_score = max_cvss / 10.0

        # Get anomalies
        anomalies = detector.get_all_anomalies(api, db)
        anomaly_types = [k for k, (is_anom, _) in anomalies.items() if is_anom]

        # Combined risk (equal weights)
        combined_risk = (lifecycle_score + security_score) / 2.0

        api_risks.append(TopAtRiskAPI(
            api_id=str(api.id),
            endpoint=api.endpoint,
            zombie_score=lifecycle_score,
            security_risk=security_score,
            combined_risk=combined_risk,
            has_anomalies=len(anomaly_types) > 0,
            anomaly_types=anomaly_types
        ))

    # Sort by combined risk (descending)
    api_risks.sort(key=lambda x: x.combined_risk, reverse=True)

    # Count critical (combined_risk > 0.7)
    critical_count = sum(1 for api in api_risks if api.combined_risk > 0.7)

    res = TopAtRiskResponse(
        top_apis=api_risks[:limit],
        total_at_risk=len(api_risks),
        critical_count=critical_count
    )
    set_cached(f"top_at_risk_{limit}", res)
    return res


@router.post("/recalculate-stats")
def recalculate_stats(db: Session = Depends(get_db)) -> Dict:
    """No-op: deterministic scorer requires no training, only population stats."""
    detector = get_detector()
    detector.fit(db)  # this just computes median/MAD per feature, near-instant
    return {
        "status": "success",
        "message": "Population statistics recalculated (deterministic model — no training required)",
        "is_trained": detector.is_trained
    }


@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db)) -> AnalyticsOverviewResponse:
    """Get complete analytics dashboard overview."""
    detector = get_detector()

    # Train model if not already trained
    if not detector.is_trained:
        detector.fit(db)

    zombie_trend = get_zombie_trend(db)
    distribution = get_api_distribution(db)
    risk_heatmap = get_risk_heatmap(db)
    top_at_risk = get_top_at_risk(db=db)

    scoring_metrics = ScoringEngineMetrics(
        model_type="deterministic_mad_zscore",
        is_trained=detector.is_trained,
        training_samples=len(db.query(API).all()),
        contamination_threshold=0.0,
        features_count=8,
        last_trained_at=datetime.utcnow() if detector.is_trained else None
    )

    return AnalyticsOverviewResponse(
        zombie_trend=zombie_trend,
        distribution=distribution,
        risk_heatmap=risk_heatmap,
        top_at_risk=top_at_risk,
        scoring_engine_metrics=scoring_metrics
    )
