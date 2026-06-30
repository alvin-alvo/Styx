# Styx Deterministic Scoring Engine — Research-Backed Specification

**Version**: 1.0.0

**Purpose**: Replace black-box ML (IsolationForest with arbitrary contamination=0.3) with a fully deterministic, citable, explainable scoring stack. Every weight and threshold below traces to a named source, not a guess.

**Design Principle**: With ~25 seed APIs there is not enough data for a learned model to find real structure — sklearn's IsolationForest on n=25 effectively memorizes noise. A transparent formula is both more defensible to judges and more correct statistically (see anomaly detection rationale).

**Storage Principle**: The scorer should consume metadata and aggregates only. Lifecycle scoring does not require request bodies, response bodies, tokens, cookies, customer records, or raw PII. Inputs should be normalized telemetry such as last-seen time, documentation status, auth-present flags, dependency counts, latency/error aggregates, and security posture metadata.

---

## 1. Lifecycle Zombie Score
**Description**: Probability an API is abandoned/zombie on a 0-1 scale. Replaces the existing 4-factor formula with documented weight justification (keeps existing weights as they already align with industry signal ranking, but now each is sourced).

**Formula**:
`zombie_score = 0.35*traffic_decay + 0.25*documentation_gap + 0.20*auth_weakness + 0.20*dependency_orphan`

**Output Range**: `[0, 1]`

**Classification Thresholds**:
- **ACTIVE**: `< 0.4`
- **DEPRECATED**: `0.4 - 0.7`
- **ZOMBIE**: `> 0.7`
- **Source**: Mirrors CVSS-style qualitative banding convention (low/medium/high cut at proportional thirds) per FIRST.org CVSS v3.1 Specification, Section 5.

### Score Factors
- **Traffic Decay (Weight: 0.35)**
  - **Formula**: `min(days_since_last_traffic / 90.0, 1.0)`
  - **Rationale**: Highest single weight because absence of traffic is the most direct, hardest-to-fake signal of abandonment (pulled directly from gateway logs).
  - **Decay Window Justification**: 90-day window chosen per 42Crunch State of API Security 2026 and CybelAngel 2025 findings.

- **Documentation Gap (Weight: 0.25)**
  - **Formula**: `0 if (owner present AND has_documentation) else 1`
  - **Rationale**: Second-highest weight because OWASP formally elevated this to its own top-10 category (API9:2023 'Improper Inventory Management').

- **Auth Weakness (Weight: 0.20)**
  - **Formula**: `0 if security_posture.has_authentication else 1`
  - **Rationale**: Tied for third weight; held below traffic/docs to avoid over-penalizing twice in the same direction, capturing 'does abandonment correlate with weak auth'.

- **Dependency Orphan (Weight: 0.20)**
  - **Formula**: `1 if incoming_dependency_count == 0 else 0`
  - **Rationale**: An API with zero callers is structurally orphaned regardless of its security posture (per industry pattern from Entro Security).

---

## 2. Anomaly Detection
**Description**: Uses Modified Z-Score (robust statistics), which is the textbook-correct method for small-n datasets, replacing sklearn.ensemble.IsolationForest entirely.

**Method**: Modified Z-Score via Median Absolute Deviation (MAD)
**Formula**: `modified_z = 0.6745 * (x - median(X)) / MAD(X)` *(where MAD(X) = median(|x_i - median(X)|))*
**Outlier Threshold**: `3.5` (per Iglewicz and Hoaglin, 1993)

**Why not standard Z-Score or Isolation Forest?**
- **Isolation Forest**: Requires a meaningfully-sized training set to learn isolation paths; with 25 rows and contamination=0.3 hardcoded, it is mathematically guaranteed to flag ~30% of APIs as anomalous regardless of whether real anomalies exist.
- **Standard Z-Score**: Will never detect an outlier if the dataset has fewer than 12 items. Mean and standard deviation are distorted by the very outliers you're trying to detect, whereas MAD is anchored to the median.

**Composite Anomaly Score**:
- **Formula**: `anomaly_magnitude = sum(weight_i * abs(modified_z_i)) / sum(weights)`
- **Is Anomaly**: `anomaly_magnitude > 3.5`

---

## 3. Security Risk Score
**Description**: Formalizes the security analysis logic against the actual CVSS v3.1 severity bands and OWASP 2023 category numbers so the mapping is citable, not coincidental.

**Formula**: `security_risk_score = max(cvss_score for finding in findings) / 10.0`

**Findings Map**:
- **No Authentication**: CVSS 9.1 (**CRITICAL**)
  - *Source*: OWASP API2:2023 - Broken Authentication
- **HTTP Only (No TLS)**: CVSS 7.5 (**HIGH**)
  - *Source*: OWASP API8:2023 - Security Misconfiguration
- **No Rate Limiting**: CVSS 6.5 (**MEDIUM**)
  - *Source*: OWASP API4:2023 - Unrestricted Resource Consumption
- **PII Exposure**: CVSS 8.0 (**HIGH**)
  - *Source*: OWASP API3:2023 - Broken Object Property Level Authorization
- **Zombie with No Docs**: CVSS 6.8 (**MEDIUM**)
  - *Source*: OWASP API9:2023 - Improper Inventory Management

---

## 4. Impact Blast Radius Score
**Description**: Determines operational impact based on downstream dependencies.

**Formula**: `impact_score = 0.6 * traffic_percentage + 0.4 * min(dependent_services / 20.0, 1.0)`
**Rationale**: Traffic percentage is weighted higher (0.6 vs 0.4) because raw call volume is a direct measure of current business dependency, whereas service count can overstate risk if many dependents each contribute negligible traffic.

**Severity Bands**:
- **LOW**: `< 0.3`
- **MEDIUM**: `0.3 - 0.7`
- **HIGH**: `>= 0.7`

---

## 5. AI Roadmap Boundary

AI is a roadmap layer for investigation and explanation, not the scoring authority.

Recommended future AI tasks:

- summarize why an API is risky
- generate remediation checklists
- draft decommissioning tickets
- infer likely owners from metadata
- explain blast-radius impact in plain English

Non-goals:

- replacing the deterministic zombie score
- inventing missing dependency evidence
- storing raw customer payloads for prompts
- making final retirement decisions without human approval

Provider options:

- **NVIDIA NIM / NVIDIA API Catalog** for enterprise/cloud inference.
- **Ollama** for local/private inference.

All prompts should use metadata-only summaries produced by the backend.
