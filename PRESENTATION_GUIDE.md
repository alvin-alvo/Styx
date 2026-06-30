# Styx: Hackathon Presentation Guide & Roadmap

This document outlines the practical roadmap and presentation strategy for demonstrating the Styx MVP to technical judges and security architects. It is heavily grounded in industry standards and empirical research to provide a defensible, authoritative pitch.

## Phase 1: Make The Demo Believable
**Goal:** Remove the "random prototype data" feeling.
**Current State:** Implemented. The backend uses a realistic banking/enterprise API estate (Customer Profile, Payment Gateway, Fraud Detection).
- **Industry Context:** We cleanly separate ZOMBIE and SHADOW APIs, aligning with **Wallarm's strict operational definitions (Citation C1)**. 
  - **ZOMBIE:** Deprecated/abandoned endpoints still in traffic.
  - **SHADOW:** Undocumented endpoints actively taking traffic but absent from OpenAPI specs. 
*(Note: Industry aggregates show Shadow APIs make up over 20% of enterprise inventory [C14]).*

> **Speaker Note:** *"We modeled a realistic banking API estate with active, deprecated, zombie, and shadow APIs. Our definitions strictly follow Wallarm's taxonomy."*

## Phase 2: Make Classification Explainable
**Goal:** Judges should instantly understand why an API is risky and trust the math.
**Current State:** Deterministic, heavily-cited formula.

**Explainable Breakdown & Citations:**
- **35% Traffic Decay:** Absence of traffic is the strongest signal of abandonment. Decay windows are backed by **42Crunch and CybelAngel (C2, C3)**, noting that forgotten endpoints often remain exposed for 6+ months.
- **25% Documentation Gap:** Maps directly to **OWASP API9:2023 (Improper Inventory Management) (C4, C5)**.
- **20% Authentication Weakness:** Maps to **OWASP API2:2023 (Broken Authentication)**. Backed by **42Crunch (C2)** showing missing auth accounts for the highest share of real-world vulnerabilities.
- **20% Dependency Orphan:** Backed by **Entro Security (C9)**; an API with zero callers is structurally orphaned.

> **Speaker Note:** *"Every score is explainable and backed by OWASP and 42Crunch threat data. We avoid black-box ML because security teams need defensible reasoning based on recognized standards."*

## Phase 3: Polish The Demo Flow
**Goal:** No dead clicks, no confusion.

**Demo Order:**
1. **Inventory:** *"Here are all APIs."*
2. **API Detail:** *"Here is why this one is risky." (Point to OWASP citations).*
3. **Security Findings:** *"Here are OWASP-style findings graded on official CVSS v3.1 bands (C8)."*
4. **Dependency Graph:** *"Here is what depends on it."*
5. **Blast Radius Simulator:** *"Here is what breaks if we remove it."*
6. **Analytics Dashboard:** *"Here is the organization-wide risk view."*
7. **Future Roadmap:** *"Here is how this becomes enterprise-ready."*

## Phase 4: Product Polish
**Goal:** Make it look like a serious product.

**High-ROI Enhancements:**
- Search/filter/sort in inventory
- Risk and Owner badges
- Auth/documentation indicators
- **CRITICAL:** A "Why was this classified?" section on the API Detail view. That single section sells the whole product.

## Phase 5: Security Hardening Roadmap
*(Present as future enterprise readiness)*
- SSO login with OAuth/OIDC
- RBAC roles (Admin, Security Analyst, Platform Engineer, Auditor)
- Audit logs and approval workflows before decommissioning
- TLS everywhere, PostgreSQL hardening, Secrets in Vault/AWS Secrets Manager
- Rate limiting, secure headers, CORS restrictions, encrypted telemetry, mTLS between collectors and backend

> **Speaker Note:** *"The current prototype is a security analytics demo. The production version would add enterprise authentication, RBAC, auditability, and hardened infrastructure."*

## Phase 6: Telemetry Roadmap
**Current Prototype:** Nginx logs → log ingestor → database → dashboard
**Future Enterprise Version:** API Gateway / eBPF / Service Mesh → Telemetry Collector → Styx Backend → Risk Engine → Dashboard

> **Speaker Note:** *"Today we use Nginx log tailing for a no-SDK prototype. In production, we can plug in eBPF or service-mesh telemetry for deeper East-West visibility."*

## Phase 7: Intelligence & Anomaly Detection
**Goal:** Defend your architectural choices against "Why didn't you just use ML/AI?"
**Current State:** 
Styx uses **Modified Z-Score via Median Absolute Deviation (MAD) (C10, C11)** for anomaly detection rather than standard Isolation Forests or generic Z-Scores. 
- **Why not Standard Z-Score?** As noted by **Oracle (C12)** and **MCP Analytics (C13)**, standard Z-scores fail on datasets with fewer than 12 items and are easily contaminated by the outliers they attempt to detect.
- **Why not Isolation Forests?** They require massive datasets to train effectively, making them mathematically unsuitable for an MVP/seed-scale environment.

> **Speaker Note:** *"We deliberately bypassed black-box ML for anomaly detection. At enterprise scales or our MVP scale, statistical methods like Modified Z-Score are mathematically superior, uncontaminated by outliers, and fully deterministic."*

## Phase 8: Integrations Roadmap
**Future Integrations:**
- **Jira/ServiceNow:** Decommissioning tickets & approval workflows
- **Slack/PagerDuty:** Alert notifications & incident escalation
- **Datadog/Splunk:** Observability import
- **GitHub/GitLab:** API spec ownership
- **NVD / CMDB:** CVE intelligence & service ownership mapping

> **Speaker Note:** *"Styx can become the control plane for API lifecycle governance."*

---

## Final Roadmap Slide Structure

### Now
- API inventory
- Deterministic Zombie scoring (OWASP/42Crunch backed)
- Security findings (CVSS v3.1 bands)
- Anomaly Detection (Modified Z-Score / MAD)
- Dependency graph & Analytics dashboard

### Next
- Better telemetry sources
- Enterprise authentication
- RBAC and audit logs
- Approval workflows
- CVE intelligence
- Slack/Jira/ServiceNow integrations

### Later
- eBPF collectors
- ML anomaly detection for massive scale
- Ownership inference
- Lifecycle prediction
- Multi-tenant enterprise deployment

> **Closing Statement:** *"The prototype proves the decision workflow with mathematically rigorous, cited methodology. The roadmap turns it into an enterprise API governance platform."*
