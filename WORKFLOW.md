# Styx Execution Workflow

This document outlines the end-to-end workflow of how data flows through the Styx platform, from the initial API request to the final frontend visualization.

## 1. Traffic Generation
In the development/demo environment, synthetic traffic is generated to simulate real-world API usage.
- The `scripts/traffic_loop.py` script continuously sends HTTP requests to the Nginx reverse proxy.
- This includes normal usage patterns, occasional latency spikes, and calls to deprecated/shadow endpoints.
- Additionally, `scripts/generate_attack.py` can be used to simulate malicious OWASP-violating payloads.

## 2. Telemetry Interception
- The **Nginx API Gateway** receives these requests before routing them to the underlying mock services.
- It formats the request metadata (method, path, status, latency, IP) into a structured JSON log entry.
- This step mimics how an enterprise gateway or an eBPF agent would passively monitor traffic.

## 3. Log Ingestion & Real-Time Processing
- The **Log Ingestor** (`scripts/log_ingestor.py`) runs as a continuous background daemon, tailing the Nginx log file.
- For every incoming log line, it:
  - Parses the JSON payload.
  - Updates the in-memory aggregated metrics (e.g., rolling average response time, error rate).
  - Infers upstream dependencies based on call graphs.
  - Identifies if the API is undocumented by checking against the `openapi.json` spec.
- Data is upserted into the **PostgreSQL database** via SQLAlchemy.

## 4. Machine Learning & Analysis (Backend)
The **FastAPI Backend** constantly analyzes the incoming data to provide insights:
- **Zombie Scoring:** An **Isolation Forest** model evaluates the API's behavior against 8 features (usage frequency, security violations, dependency count, etc.) to calculate a risk score, categorizing the API as ACTIVE, DEPRECATED, or ZOMBIE.
- **Anomaly Detection:** The system looks for standard deviation breaches (Z-score > 2.5) in traffic or sudden shifts in security posture. If detected, an alert is generated.
- **Blast Radius Calculation:** Using **NetworkX**, the backend evaluates the dependency tree to simulate what downstream systems would break if an API were decommissioned.

## 5. Frontend Consumption & Visualization
- The **React Frontend** queries the FastAPI backend via REST for initial loads and establishes an SSE (Server-Sent Events) connection or polling mechanism for live updates.
- Users can view the API inventory, sorted by risk.
- **Interactive Dashboards:** 
  - **D3.js** renders the complex dependency relationships, allowing users to visually inspect blast radius.
  - **Recharts** displays heatmaps and 30-day historical trends of API lifecycle statuses.
- When an anomaly (e.g., a "resurrected" zombie API receiving traffic) occurs, a real-time alert is populated in the frontend's alert feed.

## 6. Action and Remediation
- Once an API is confidently identified as a "Zombie" with a minimal blast radius, the operations team can safely plan its decommissioning, armed with cryptographic proof of its non-usage and low impact.
