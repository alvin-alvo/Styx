# Styx Architecture

Styx is built as a multi-tier application designed to intercept, analyze, and visualize API traffic to detect "zombie" or risky APIs. Below is a breakdown of the architectural components.

## High-Level Components

1. **API Gateway / Telemetry Interception (eBPF)**
   - **Role:** Acts as the entry point for all API telemetry.
   - **Details:** Styx natively utilizes an **eBPF Replay Engine** to process raw Linux kernel network captures. This bypasses the need for gateway integration (zero-instrumentation) and perfectly intercepts East-West and North-South L7 traffic dynamically.

2. **Replay & Discovery Pipeline (Python)**
   - **Role:** Parses kernel network events and extracts metrics in real-time.
   - **Details:** The engine (`scripts/ebpf_replay.py`) streams an `ebpf_capture.jsonl` trace file. It instantly auto-discovers undocumented APIs (Shadow APIs) and dynamically generates security postures and latency aggregates natively into the primary database.

3. **Backend Application (FastAPI)**
   - **Role:** Core business logic, machine learning, and data serving.
   - **Details:** Built with Python 3.13 and FastAPI, it serves REST APIs and Server-Sent Events (SSE). It handles:
     - **Lifecycle Scoring:** Uses an explainable deterministic formula over traffic decay, documentation gap, authentication weakness, and dependency orphan status to classify APIs as ACTIVE, DEPRECATED, or ZOMBIE.
     - **Styx AI Assistant:** Integrates with Ollama (`llama3`) locally. With `temperature: 0.1`, it has real-time database context injection to answer deterministic inventory queries without hallucination.
     - **Dependency Mapping:** Constructs in-memory graphs using NetworkX to calculate the blast radius of deprecating an API.
     - **Anomaly Detection:** Monitors for traffic spikes, sudden dependency changes, or new OWASP violations.

4. **Database (PostgreSQL 15)**
   - **Role:** Persistent storage.
   - **Details:** Interfaced via SQLAlchemy ORM. It stores the API inventory, computed scores, alert history, and time-series telemetry data for the 30-day trend analytics. Alembic manages the schema migrations.

5. **Frontend Application (React + Vite)**
   - **Role:** User interface and visualization.
   - **Details:** A React 18 application built with Vite and styled using Tailwind CSS. Key visualizations include:
     - **D3.js:** For rendering interactive, force-directed dependency graphs.
     - **Global Chatbot UI:** Floating Styx AI widget on all screens.
     - **eBPF Interactive Controls:** Global topbar controls to play/pause/accelerate the telemetry ingestion stream.
     - **Recharts:** For displaying 30-day API usage trends, security risk matrices, and analytics dashboards.

## Metadata-Only Data Contract

Styx should be treated as a metadata intelligence layer, not a payload storage system. The ingestion path should persist only the minimum data needed to classify lifecycle risk and compute blast radius:

- HTTP method, normalized path, host, status code, timestamp, and latency
- source IP or source service identity
- derived request counts, error-rate aggregates, and last-seen timestamps
- dependency edges between caller/service and target API
- security posture flags such as auth present/missing, TLS present/missing, rate limiting, and sensitive-data exposure indicators
- alert metadata and score history

Production deployments should not store raw request bodies, response bodies, authorization tokens, cookies, full customer records, account numbers, or unredacted PII. If payload inspection is ever added, it should run as a redaction/classification step before persistence.

## Future Enterprise Architecture (Planned)

While the current setup seamlessly simulates kernel probes via the eBPF Replay Engine, the planned enterprise architecture (Phase 2.3+) will allow users to deploy a live BCC kernel agent on real production Linux clusters, alongside introducing Redis caching for graph queries and multi-tenancy support.
