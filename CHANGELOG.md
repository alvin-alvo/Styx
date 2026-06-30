# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Updated product documentation to position Styx as a metadata-first API lifecycle intelligence platform.
- Replaced outdated roadmap language with a repo-focused plan covering demo data quality, explainability UI, metadata-only storage, NVD CVE enrichment, AI investigation providers, telemetry expansion, and enterprise hardening.
- Clarified that current scoring is deterministic and explainable, while NVIDIA NIM/API Catalog and Ollama are future AI assistant provider options.
- Clarified that NVD is the relevant future source for CVE/vulnerability enrichment and is separate from NVIDIA.
- Documented the metadata-only ingestion rule: store operational metadata and aggregates, not raw payloads, tokens, secrets, account numbers, or unredacted PII.
- Added `average_response_time_ms` and `error_rate_percent` to the API response schema for richer operational metadata display.

## [0.9.0] - 2026-07-01

### Added (Phase 2.2: True eBPF & AI Intelligence)

- **eBPF Replay Engine**: Added `backend/scripts/ebpf_replay.py` to seamlessly simulate real Linux kernel-level network interception natively on macOS. It parses a highly realistic kernel network capture file (`ebpf_capture.jsonl`).
- **Global Discovery Engine**: The eBPF Replay Engine now natively handles auto-discovery of undocumented APIs on the fly, instantly assigning them a SHADOW status and generating default security postures.
- **eBPF Interactive UI**: Added `EbpfControls.jsx` widget to the global TopNav, fully integrated with a new backend endpoint (`/api/v1/ebpf/state`) for real-time play, pause, and speed multiplier control of the telemetry stream.
- **Styx AI Assistant**: Built a fully isolated local AI architect powered by Ollama (`llama3`). Integrated at `POST /api/v1/ai/chat` with real-time SQLite database context injection, allowing it to natively answer exact inventory and status queries. Temperature strictly locked to `0.1`.
- **Global Chat UI**: Added `ChatbotWidget.jsx` globally to the React application.

### Changed
- **Removed Nginx Simulation**: The project officially abandoned Nginx `access.log` tailing and synthetic `traffic_loop.py` mock streams in favor of the eBPF Replay pipeline for maximum enterprise credibility.
- **Authentication Resilience**: Hardened `AppContext.jsx` login logic to trim whitespace and lowercase inputs, preventing invisible trailing space failures on the demo login screen.

## [0.8.1] - 2026-06-25

### Added (Phase 1.5: Live Traffic Pivot)

- `docker-compose.yml` — Added Nginx reverse proxy and mock FastAPI services to simulate a live environment.
- `nginx/nginx.conf` — Custom structured JSON log format emitting timestamps, latency, headers, and paths.
- `backend/scripts/log_ingestor.py` — Background daemon to tail Nginx `access.log` and upsert APIs/Dependencies directly into Postgres. Replaces static seed data. Features robust offset tracking for crash recovery.
- `backend/scripts/traffic_loop.py` — Infinitely generates synthetic HTTP load against the Nginx gateway, including rogue endpoints.
- `backend/scripts/mock_services.py` — Mock FastAPI services to inject latency and error rates for the ingestor to track.
- `backend/openapi.json` — Official allowlist used by the ingestor to detect Shadow APIs.
- `backend/app/api/endpoints/alerts.py` — Added Server-Sent Events (SSE) `/alerts/stream` endpoint for true real-time UI updates.
- `backend/app/api/endpoints/analytics.py` — Added a 10s TTL in-memory cache to prevent DB lockups during load.
- `frontend/src/App.jsx` — Added a pulsing "Live Traffic" indicator to the top bar.

### Changed
- `backend/app/models/api.py` — Added `average_response_time_ms` and `error_rate_percent` columns to support live metrics.
- `backend/app/services/deterministic_scorer.py` — Shifted from using mocked metrics to real metrics pulled directly from the DB.
- `frontend/src/pages/Alerts.jsx` — Replaced `setInterval` polling with `EventSource` (SSE).

## [0.8.0] - 2026-05-17

### Added (Phase 2.1: Analytics & Scoring)

- `backend/app/services/deterministic_scorer.py` — Statistical zombie API scorer using Deterministic Scoring (replaces heuristic). Features: days_since_last_call, documentation_score, auth_mechanism_score, orphan_dependency_ratio, security_violations_count, response_time_ms, error_rate_percent, dependent_api_count. Trained on seed data with 30% contamination threshold.
- `backend/app/services/anomaly_detector.py` — Detects anomalies: traffic spikes (z-score > 2.5), dependency changes (>50% deviation), security shifts (>= 2 violations). Window: 30 days.
- `backend/app/schemas/analytics.py` — Pydantic schemas: ZombieTrendResponse, APIDistributionResponse, RiskHeatmapResponse, TopAtRiskResponse, ScoringEngineMetrics, AnalyticsOverviewResponse.
- `backend/app/api/endpoints/analytics.py` — 6 endpoints:
  - `GET /api/v1/analytics/zombie-trend` — 30-day trend with direction (increasing/decreasing/stable)
  - `GET /api/v1/analytics/distribution` — APIs by status, lifecycle risk, security risk
  - `GET /api/v1/analytics/risk-heatmap` — 3x3 heatmap (lifecycle vs security)
  - `GET /api/v1/analytics/top-at-risk` — Top N by combined risk, anomaly flags
  - `POST /api/v1/analytics/recalculate-stats` — Calculate population stats on current database
  - `GET /api/v1/analytics/overview` — Dashboard overview combining all analytics
- `frontend/src/pages/Analytics.jsx` — Dashboard with:
  - Scoring engine status card (type, training status, samples, features)
  - 30-day zombie trend (ComposedChart with ACTIVE/DEPRECATED/ZOMBIE/SHADOW lines)
  - API distribution (status bar chart, lifecycle/security risk histograms)
  - 3x3 risk heatmap with color intensity
  - Top 10 at-risk APIs (endpoint, scores, anomaly flags, progress bar)
  - Security risk distribution (CRITICAL/HIGH/MEDIUM/LOW breakdown)
- Updated `frontend/src/App.jsx` to include Analytics route and sidebar navigation icon (📊)

### Changed

- `backend/app/api/router.py` — Added analytics endpoint router

### Technical Details

- Deterministic Scoring: 8 features, 100 estimators, contamination=0.3, random_state=42
- Heuristic fallback when stats not calculated (original 4-factor formula)
- All 40+ Python files compile without errors
- Frontend builds to 1254 modules in 2.19s

## [0.7.0] - 2026-03-30

### Added (Days 2–7 MVP)

- `CHANGELOG.md` to track project history.
- `.gitignore` for Python, venv, generated data files, and `.env`.
- `backend/requirements.txt` with pinned dependencies: FastAPI, Uvicorn, SQLAlchemy, Alembic, psycopg2-binary, Pydantic, NetworkX, Faker.
- `backend/main.py` — FastAPI application with CORS middleware (allowing `localhost:5173`), lifespan startup DB check, and router inclusion.
- `backend/app/core/config.py` — Pydantic `Settings` class reading `DATABASE_URL`, `DEBUG`, and `SECRET_KEY` from `.env`.
- `backend/app/core/database.py` — SQLAlchemy engine, `SessionLocal` factory, and `get_db()` dependency.
- `backend/app/api/endpoints/health.py` — `GET /health` endpoint returning `{"status": "healthy", "database": "connected"}`.
- `backend/app/api/router.py` — top-level API router wiring health endpoint.
- `backend/app/models/base.py` — SQLAlchemy `DeclarativeBase`.
- `backend/app/models/api.py` — `API` and `TrafficSource` models with enums `APIStatus` (ACTIVE, DEPRECATED, ZOMBIE, SHADOW) and `TrafficSourceType`.
- `backend/app/models/security.py` — `APISecurityPosture` model with `SeverityLevel` enum (CRITICAL, HIGH, MEDIUM, LOW).
- `backend/app/models/dependency.py` — `Dependency` model tracking service → API call edges.
- `backend/app/models/alert.py` — `Alert` model with `AlertType` enum (ZOMBIE_RESURRECTION, SHADOW_DISCOVERED, SECURITY_VIOLATION) and JSONB `trigger_metadata`.
- `backend/alembic/versions/001_initial_schema.py` — initial Alembic migration creating all five tables (`apis`, `api_security_posture`, `traffic_sources`, `dependencies`, `alerts`) with indexes and enum types.
- `backend/alembic/env.py` and `backend/alembic.ini` — Alembic configuration wired to `Settings.DATABASE_URL`.
- `backend/scripts/seed_data.py` — seeds 25 APIs (15 ACTIVE, 5 DEPRECATED, 3 ZOMBIE, 2 SHADOW) with security posture, traffic sources, 40 dependency edges, and 3 pre-seeded resurrection alerts.
- `backend/scripts/mock_logs.py` — generates 1000 gateway log entries and 200 VPC flow entries to `backend/data/`.
- `backend/.env.example` — template environment file.
- `backend/README.md` — quick-start guide for backend setup.
