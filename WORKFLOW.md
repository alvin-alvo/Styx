# Styx Execution Workflow

This document outlines the end-to-end workflow of how data flows through the Styx platform, from the initial API request to the final frontend visualization.

## 1. Telemetry Interception (eBPF)
- The **eBPF Replay Engine** perfectly simulates a live Linux BCC kernel probe natively on macOS.
- It parses a raw `.jsonl` trace file of kernel-level HTTP network events.
- This represents how an enterprise would deploy Styx: dropping a zero-instrumentation eBPF sensor onto their Kubernetes nodes to intercept East-West and North-South traffic invisibly.

## 2. Ingestion & Discovery Pipeline
- The Replay Engine (`scripts/ebpf_replay.py`) streams the trace file.
- For every incoming kernel event, it:
  - Dynamically auto-discovers endpoints that aren't in the inventory, instantly assigning them a SHADOW status and generating a default security posture.
  - Updates the in-memory aggregated metrics (e.g., rolling average response time, error rate).
- Data is upserted into the **PostgreSQL database** via SQLAlchemy.

### Metadata-Only Rule

The ingestion workflow persists metadata, not full payloads. Styx stores method, path, host, timestamp, status code, latency, source identity, aggregate counts, dependency edges, security flags, and alert metadata. It does not store raw request bodies, response bodies, tokens, cookies, secrets, account numbers, or unredacted PII.

## 3. Analysis (Backend)
The **FastAPI Backend** constantly analyzes the incoming data to provide insights:
- **Zombie Scoring:** A deterministic, explainable formula evaluates traffic decay, documentation gap, authentication weakness, and dependency orphan status to categorize APIs as ACTIVE, DEPRECATED, or ZOMBIE.
- **Anomaly Detection:** The system looks for standard deviation breaches (Z-score > 2.5) in traffic or sudden shifts in security posture. If detected, an alert is generated.
- **Blast Radius Calculation:** Using **NetworkX**, the backend evaluates the dependency tree to simulate what downstream systems would break if an API were decommissioned.

## 4. Frontend Consumption & Visualization
- The **React Frontend** queries the FastAPI backend via REST.
- Users can view the API inventory, sorted by risk.
- **Interactive Dashboards:** 
  - **D3.js** renders the complex dependency relationships, allowing users to visually inspect blast radius.
  - **eBPF Controls:** A global widget allows the user to play, pause, or accelerate the kernel ingestion stream in real-time.
  - **Recharts** displays heatmaps and 30-day historical trends of API lifecycle statuses.
- When an anomaly (e.g., a "resurrected" zombie API receiving traffic) occurs, a real-time alert is populated in the frontend's alert feed.

## 5. Action and Remediation
- Once an API is confidently identified as a "Zombie" with a minimal blast radius, the operations team can safely plan its decommissioning, armed with cryptographic proof of its non-usage and low impact.

## 6. Styx AI Assistant Workflow

The platform features an active Styx AI Investigation Assistant powered by local **Ollama (`llama3`)**.

1. The user asks a question via the global Chatbot Widget.
2. The FastAPI Backend (`/api/v1/ai/chat`) intercepts the request and injects real-time SQLite database context (API counts, Zombie counts, Shadow APIs) into the system prompt.
3. The LLM summarizes the evidence in plain language, with temperature locked at `0.1` to prevent hallucination.
4. The AI acts as a Senior Security Architect, advising on remediation steps based on deterministic evidence produced by Styx.
