# Styx Repo Roadmap

**Goal:** Turn Styx into a high-fidelity, judge-ready API lifecycle intelligence product while keeping the implementation honest, explainable, and feasible.

This roadmap is repo-focused. It describes the changes that should be made in code, docs, data, and UI. The priority is maximum product credibility per engineering hour.

---

## Current Product Baseline

Styx already has:

- FastAPI backend with inventory, scoring, dependencies, simulator, alerts, and analytics endpoints
- PostgreSQL persistence through SQLAlchemy and Alembic
- Nginx gateway log tailing for no-SDK demo telemetry
- React/Vite frontend with Inventory, API Detail, Security, Graph, Simulator, Alerts, and Analytics screens
- deterministic lifecycle scoring with explainable factors
- OWASP/CVSS-style security analysis
- NetworkX dependency graph and blast-radius simulation

The current system is a strong prototype. The next work should make it feel like a polished enterprise product demo.

---

## Phase 0: Documentation Alignment

**Status:** In progress

### Required Changes

- Update docs to stop implying black-box ML is currently implemented.
- State clearly that current scoring is deterministic and explainable.
- Clarify that Nginx log tailing is the current telemetry path.
- Clarify that eBPF, service mesh, and gateway integrations are roadmap telemetry sources.
- Clarify that Styx should store metadata and aggregates, not full request/response payloads.
- Clarify NVD vs NVIDIA:
  - **NVD** = vulnerability/CVE enrichment.
  - **NVIDIA NIM/API Catalog** = future AI inference backend.
  - **Ollama** = future local/private LLM backend.

### Files

- `README.md`
- `ARCHITECTURE.md`
- `WORKFLOW.md`
- `ONBOARDING.md`
- `backend/README.md`
- `frontend/README.md`
- `LOGIC.md`
- `CITATION_LIST.md`

---

## Phase 1: Demo Data Quality

**Priority:** Highest

The demo should look like a banking API estate, not a random endpoint generator.

### Backend Tasks

- Update `backend/scripts/seed_data.py` to generate realistic enterprise APIs:
  - Customer Profile API
  - Identity Service
  - Payment Gateway
  - Transaction Ledger
  - Fraud Detection
  - Loan Eligibility
  - KYC Verification
  - Card Management
  - ATM Gateway
  - Mobile Banking API
  - Notification Service
  - Statement Service
  - Partner Open Banking API
- Use realistic owners:
  - Payments Team
  - Identity Team
  - Fraud Team
  - Digital Banking
  - Risk Platform
  - Platform Engineering
  - Core Banking
- Keep status mix believable:
  - 60% ACTIVE
  - 20% DEPRECATED
  - 12% ZOMBIE
  - 8% SHADOW
- Generate realistic metadata:
  - dormant days based on status
  - owner/documentation based on status
  - latency and error rate based on service type
  - dependencies that reflect real banking flows

### Acceptance Criteria

- Inventory reads like an enterprise system.
- No obviously fake/random names dominate the demo.
- Analytics charts show a healthy mix of statuses and risks.

---

## Phase 2: Explainability UI

**Priority:** Highest

Judges should immediately understand why an API was classified.

### Frontend Tasks

- Upgrade `frontend/src/components/ExplanationCard.jsx`.
- Add a "Why was this classified?" section to API details.
- Show explicit evidence lines:
  - No traffic in N days
  - Missing owner
  - Missing documentation
  - Weak or missing authentication
  - No dependent services
  - Shadow endpoint not present in OpenAPI spec
- Show formula weights:
  - 35% traffic decay
  - 25% documentation gap
  - 20% authentication weakness
  - 20% dependency orphan

### Backend Tasks

- Optionally enrich `GET /api/v1/apis/{id}/score` with a `reasons` array.
- Keep the existing formula unchanged unless there is a clear bug.

### Acceptance Criteria

- A judge can look at one API detail screen and explain the classification back in 20 seconds.
- The UI feels transparent rather than black-box.

---

## Phase 3: Metadata-Only Storage Contract

**Priority:** High

Styx should be presented as privacy-conscious and enterprise-safe.

### Design Principle

Store only metadata and aggregates required for lifecycle decisions. Do not persist raw customer data, request bodies, response bodies, tokens, or secrets.

### Backend Tasks

- Add a docs-backed ingestion contract:
  - method
  - path
  - host
  - status code
  - latency
  - timestamp
  - source service or source IP
  - auth-present boolean, not auth token
  - request count aggregates
  - error-rate aggregates
- Redact or avoid storing:
  - Authorization header values
  - cookies
  - request bodies
  - response bodies
  - customer identifiers
  - account numbers
  - raw PII
- Add retention policy documentation for logs and score history.

### Acceptance Criteria

- Docs clearly answer: "Are you storing customer data?"
- Answer: "No. Styx stores metadata and aggregates for governance."

---

## Phase 4: Inventory Polish

**Priority:** High

Inventory is usually the first screen judges see.

### Frontend Tasks

- Add search by endpoint, owner, method, and status.
- Add filters for:
  - lifecycle status
  - owner
  - documentation present/missing
  - risk level
- Add compact badges:
  - owner
  - docs present/missing
  - auth present/missing
  - last seen
- Add pagination or a fixed-height scroll area for large datasets.
- Add an executive summary strip:
  - total APIs
  - zombies
  - shadow APIs
  - high security risk
  - safe decommission candidates

### Acceptance Criteria

- Inventory can be used as the first demo screen.
- The page visually communicates product value before any click.

---

## Phase 5: Security Intelligence

**Priority:** Medium

Security should become more credible without building a large scanner.

### NVD Roadmap

NVD is the National Vulnerability Database. It is relevant for CVE enrichment, not AI.

Future tasks:

- Add optional CVE enrichment service.
- Store CVE metadata only:
  - CVE ID
  - CVSS score
  - severity
  - published date
  - description summary
  - affected technology tag
- Display CVE cards on Security Insights.
- Link CVEs to APIs through service tags, gateway metadata, or declared technology ownership.

### Acceptance Criteria

- Security page can say: "This API is risky because of lifecycle signals and known vulnerability intelligence."

---

## Phase 6: AI Investigation Assistant

**Priority:** Medium-low for code, high for vision

AI should be a future assistant layer, not the core scoring engine.

### What AI Should Do

- Explain why an API is risky in natural language.
- Summarize blast-radius findings.
- Suggest remediation steps.
- Infer likely owner from repo/API metadata.
- Generate a decommissioning ticket draft.
- Answer: "Can we retire this API safely?"

### What AI Should Not Do

- Replace deterministic lifecycle scoring.
- Invent dependency evidence.
- Store raw payloads for prompting.
- Make final decommissioning decisions.

### Provider Options

- **NVIDIA NIM / NVIDIA API Catalog**
  - Best fit for enterprise/cloud inference and GPU-backed deployment story.
  - Good roadmap item for judges who ask how AI scales.
- **Ollama**
  - Best fit for local/private inference and offline demos.
  - Good roadmap item for privacy-sensitive environments.

### Implementation Shape

- Add a provider interface:
  - `AIProvider.summarize_api_risk(api_metadata)`
  - `AIProvider.suggest_remediation(score, findings, dependencies)`
- Implement providers later:
  - `NvidiaNimProvider`
  - `OllamaProvider`
  - `NoopProvider` for demos without AI
- Prompt only metadata, never raw customer payloads.

### Acceptance Criteria

- Docs make the AI story ambitious but honest.
- Judges understand AI is used for explanation and workflow acceleration, not fake scoring.

---

## Phase 7: Telemetry Roadmap

**Priority:** Medium

### Current

```text
Nginx gateway logs
  -> log_ingestor.py
  -> PostgreSQL metadata
  -> scoring + dashboard
```

This proves no SDK is required for services that route through the gateway.

### Future

```text
API Gateway / Service Mesh / eBPF
  -> Telemetry Collector
  -> Metadata Normalizer
  -> Styx Backend
  -> Risk Engine + Dashboard
```

### Future Integrations

- Nginx
- Kong
- Apigee
- AWS API Gateway
- Azure API Management
- Envoy/Istio
- eBPF collectors

### Acceptance Criteria

- Docs clearly state current limitation: gateway-routed traffic only.
- Roadmap clearly states how East-West service traffic would be added.

---

## Phase 8: Enterprise Hardening

**Priority:** Medium

### Future Tasks

- Authentication:
  - OAuth2/OIDC
  - SAML
  - Okta/Azure AD/Google Workspace
- Authorization:
  - Admin
  - Security Analyst
  - Platform Engineer
  - Read-only Auditor
- Database hardening:
  - no default credentials
  - TLS to PostgreSQL
  - least-privilege DB roles
  - encrypted backups
  - point-in-time recovery
  - audit logging
- Backend hardening:
  - JWT validation
  - CORS restrictions
  - rate limiting
  - security headers
  - error sanitization
- Workflow:
  - API retirement candidate
  - owner review
  - dependent-team approval
  - security approval
  - audit trail

### Acceptance Criteria

- The project is positioned as a prototype today and an enterprise control plane tomorrow.

---

## Phase 9: Presentation Assets

**Priority:** High before judging

### Assets To Add

- architecture diagram
- lifecycle scoring diagram
- metadata-only ingestion diagram
- demo user-flow diagram
- roadmap graphic
- screenshots of polished screens

### Recommended Demo Order

```text
Inventory
  -> API Detail
  -> Security Findings
  -> Dependency Graph
  -> Blast Radius Simulator
  -> Analytics
  -> Roadmap
```

### Closing Message

Styx does not just find zombie APIs. It helps prove whether retiring them is safe for the business.

---

## Do Not Build Before Demo

Avoid these unless the core demo is already polished:

- Kafka
- Kubernetes
- distributed collectors
- real eBPF agent
- production authentication
- multi-tenancy
- complex real-time streaming
- black-box ML scoring
- storing raw payloads

These can be discussed as roadmap items, but they should not distract from the judge-visible product.
