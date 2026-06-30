# Styx Architecture

Styx is built as a multi-tier application designed to intercept, analyze, and visualize API traffic to detect "zombie" or risky APIs. Below is a breakdown of the architectural components.

## High-Level Components

1. **API Gateway / Telemetry Interception (Nginx)**
   - **Role:** Acts as the entry point for all API traffic.
   - **Details:** In the current prototype, Nginx is used as a reverse proxy that fronts mock services. It logs all traffic in a structured JSON format. This simulates a real-world scenario where an eBPF-based agent or an enterprise API gateway captures telemetry without needing code instrumentation (zero-instrumentation approach).

2. **Log Ingestion & Processing Pipeline (Python)**
   - **Role:** Parses logs and extracts metrics in real-time.
   - **Details:** A daemon (`scripts/log_ingestor.py`) tails the Nginx access logs. It computes live metrics such as latency, error rates, and identifies shadow APIs by cross-referencing observed traffic with an `openapi.json` allowlist. It continuously upserts this data into the primary database.

3. **Backend Application (FastAPI)**
   - **Role:** Core business logic, machine learning, and data serving.
   - **Details:** Built with Python 3.13 and FastAPI, it serves REST APIs and Server-Sent Events (SSE). It handles:
     - **ML Scoring:** Uses Scikit-learn (Isolation Forest) on 8 features (e.g., days since last call, error rate, orphan dependency ratio) to classify APIs as ACTIVE, DEPRECATED, or ZOMBIE.
     - **Dependency Mapping:** Constructs in-memory graphs using NetworkX to calculate the blast radius of deprecating an API.
     - **Anomaly Detection:** Monitors for traffic spikes, sudden dependency changes, or new OWASP violations.

4. **Database (PostgreSQL 15)**
   - **Role:** Persistent storage.
   - **Details:** Interfaced via SQLAlchemy ORM. It stores the API inventory, computed scores, alert history, and time-series telemetry data for the 30-day trend analytics. Alembic manages the schema migrations.

5. **Frontend Application (React + Vite)**
   - **Role:** User interface and visualization.
   - **Details:** A React 18 application built with Vite and styled using Tailwind CSS (utilizing a `zinc`/`slate` Enterprise SaaS design system). Key visualizations include:
     - **D3.js:** For rendering interactive, force-directed dependency graphs.
     - **Recharts:** For displaying 30-day API usage trends, security risk matrices, and analytics dashboards.
     - **Lucide React:** For clean, professional iconography throughout the platform.

6. **Traffic Simulation Environment**
   - **Role:** Generates synthetic data for the hackathon prototype.
   - **Details:** A `traffic_loop.py` script endlessly hits the Nginx gateway to simulate normal users, while `generate_attack.py` simulates malicious/rogue traffic to trigger security alerts.

## Future Enterprise Architecture (Planned)

While the current setup relies on log tailing, the planned enterprise architecture (Phase 2.2+) will replace Nginx log parsing with **eBPF kernel agents** to natively intercept East-West and North-South L7 traffic with zero overhead, alongside introducing Redis caching for graph queries and multi-tenancy support.
