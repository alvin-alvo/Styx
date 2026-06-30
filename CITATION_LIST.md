# Styx Scoring Engine — Citation Ledger

**Purpose**: Every claim in the deterministic scoring logic that has a 'source' field is backed by exactly one entry below. Cross-reference via citation_id. This file exists so each claim can be independently re-verified by opening the URL — nothing here should be taken on faith.

**How to Use**: `citation_id` values (e.g. C1, C2) appear in the 'used_by' field of each entry, pointing back to the logic component that relies on it. To re-verify: open the URL, search the page for the quoted or paraphrased claim text.

## Citations

### [C1] Wallarm Documentation — Rogue API Detection (Shadow & Zombie API)
- **Publisher**: Wallarm
- **Type**: vendor technical documentation
- **URL**: [https://docs.wallarm.com/api-discovery/rogue-api/](https://docs.wallarm.com/api-discovery/rogue-api/)
- **Claim Supported**: Zombie API is formally defined by traffic behavior: "deprecated endpoints removed from spec but still handling traffic." Shadow API is the inverse: "undocumented endpoints in traffic but not in any of your specs."
- **Verification Note**: This is the closest thing in the industry to a precise, operational (rather than marketing) definition of zombie vs shadow — most other vendor sources use the terms loosely or interchangeably.
- **Used By**: `components.1_lifecycle_zombie_score.factors.traffic_decay.source`

### [C2] 42Crunch — State of API Security 2026
- **Publisher**: 42Crunch / reported via Global Security Mag
- **Type**: industry research report (production-data-derived)
- **URL**: [https://www.globalsecuritymag.com/42crunch-releases-state-of-api-security-2026-report.html](https://www.globalsecuritymag.com/42crunch-releases-state-of-api-security-2026-report.html)
- **Claim Supported**: Missing Authentication accounts for 17% of reported vulnerabilities — the single most frequently reported vulnerability type in 2025, based on review of real-world API vulnerabilities/exploits reported 2024-2025.
- **Verification Note**: This is data-derived from actual reported incidents, not a vendor survey of opinions — stronger evidential weight than most "state of API security" marketing reports.
- **Used By**: 
  - `components.1_lifecycle_zombie_score.factors.auth_weakness.source`
  - `components.1_lifecycle_zombie_score.factors.traffic_decay.decay_window_justification`
  - `components.3_security_risk_score.prevalence_context.missing_auth_2025_share`

### [C3] CybelAngel — The API Threat Report 2025
- **Publisher**: CybelAngel
- **Type**: industry threat report
- **URL**: [https://cybelangel.com/blog/the-api-threat-report-2025/](https://cybelangel.com/blog/the-api-threat-report-2025/)
- **Claim Supported**: Supports the general pattern that overlooked/undetected API endpoints remain exploitable for extended periods before discovery.
- **Verification Note**: Weaker direct numeric backing than C2 for the specific '6+ months' figure — the 47% statistic itself is sourced primarily to C2 (42Crunch); this citation supports the qualitative pattern, not the number.
- **Used By**: `components.1_lifecycle_zombie_score.factors.traffic_decay.decay_window_justification`

### [C4] OWASP API Security Project — Official Project Page
- **Publisher**: OWASP Foundation
- **Type**: primary/authoritative standard
- **URL**: [https://owasp.org/www-project-api-security/](https://owasp.org/www-project-api-security/)
- **Claim Supported**: Full category definitions for OWASP API Security Top 10 2023.
- **Verification Note**: This is the primary source — OWASP's own page. Prefer this citation over secondary blog summaries wherever both are available.
- **Used By**: 
  - `components.1_lifecycle_zombie_score.factors.documentation_gap.source`
  - `components.3_security_risk_score.findings_map.pii_exposure.source`

### [C5] OWASP API Security Top 10 2023 — Ten Most Critical API Security Risks
- **Publisher**: OWASP Foundation
- **Type**: primary/authoritative standard
- **URL**: [https://owasp.org/API-Security/editions/2023/en/0x11-t10/](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- **Claim Supported**: Official ranking and naming of all 10 categories, including API1:2023 Broken Object Level Authorization (#1), API2:2023 Broken Authentication (#2), API9:2023 Improper Inventory Management (#9).
- **Verification Note**: Primary source for category numbering used throughout Component 3's findings_map.
- **Used By**: 
  - `components.1_lifecycle_zombie_score.factors.auth_weakness.source`
  - `components.3_security_risk_score.findings_map.no_authentication.source`

### [C6] Veracode — Breaking Down the OWASP Top 10 API Security Risks 2023
- **Publisher**: Veracode
- **Type**: secondary analysis (reputable AppSec vendor)
- **URL**: [https://www.veracode.com/blog/breaking-down-owasp-top-10-api-security-risks-2023-what-changed-2019/](https://www.veracode.com/blog/breaking-down-owasp-top-10-api-security-risks-2023-what-changed-2019/)
- **Claim Supported**: API9:2023 "Improper Inventory Management" replaced "Improper Assets Management". Also confirms API4:2023 broadened scope beyond rate limiting.
- **Verification Note**: Used as a secondary explainer alongside the primary OWASP source (C4/C5) for added interpretive detail.
- **Used By**: 
  - `components.1_lifecycle_zombie_score.factors.documentation_gap.source`
  - `components.3_security_risk_score.findings_map.no_rate_limiting.source`

### [C7] Salt Security — OWASP API Security Top 10 2023 Explained
- **Publisher**: Salt Security
- **Type**: secondary analysis (vendor blog, citing Salt's own State of API Security report)
- **URL**: [https://salt.security/blog/owasp-api-security-top-10-explained](https://salt.security/blog/owasp-api-security-top-10-explained)
- **Claim Supported**: "BOLA is represented in about 40% of all API attacks and is the most common API security threat... kept their top spot in the 2023 version."
- **Verification Note**: The 40% BOLA figure originates from Salt Security's own State of API Security report. Treat as vendor-reported, directionally credible given Salt's scale of API traffic visibility.
- **Used By**: 
  - `components.3_security_risk_score.findings_map.http_only_no_tls.source`
  - `components.3_security_risk_score.prevalence_context.bola_attack_share`

### [C8] FIRST.org — CVSS v3.1 Specification Document
- **Publisher**: FIRST (Forum of Incident Response and Security Teams)
- **Type**: primary/authoritative standard
- **URL**: [https://www.first.org/cvss/v3-1/specification-document](https://www.first.org/cvss/v3-1/specification-document)
- **Claim Supported**: Official CVSS v3.1 qualitative severity rating scale: None=0.0, Low=0.1-3.9, Medium=4.0-6.9, High=7.0-8.9, Critical=9.0-10.0.
- **Verification Note**: Canonical primary source for CVSS — used directly, not via secondary summary, for all severity-band claims.
- **Used By**: 
  - `components.1_lifecycle_zombie_score.classification_thresholds.source`
  - `components.3_security_risk_score.source_cvss_bands`

### [C9] Entro Security — Shadow API, Zombie API: Effective Detection and Extermination
- **Publisher**: Entro Security
- **Type**: vendor blog
- **URL**: [https://entro.security/blog/shadow-and-zombie-api-detection-remediation/](https://entro.security/blog/shadow-and-zombie-api-detection-remediation/)
- **Claim Supported**: "Zombie APIs are the remnants of your infrastructure's past..." Defines zombie-ness relationally (disconnected from current consumers), supporting orphan-dependency as a detection factor.
- **Verification Note**: Definitional/conceptual support, not a quantitative source — used to justify including dependency-orphan as a factor at all.
- **Used By**: `components.1_lifecycle_zombie_score.factors.dependency_orphan.source`

### [C10] Iglewicz, B. and Hoaglin, D.C. (1993), 'How to Detect and Handle Outliers'
- **Publisher**: ASQC Basic References in Quality Control, Vol. 16 (American Society for Quality Control)
- **Type**: academic/statistical primary source (accessed via secondary summary)
- **URL**: [https://www.statology.org/modified-z-score/](https://www.statology.org/modified-z-score/)
- **Claim Supported**: Recommends |modified z-score| > 3.5 as the standard threshold for flagging potential outliers, using median + MAD instead of mean + standard deviation.
- **Verification Note**: Verified via consistent secondary literature (Statology, Towards Data Science, Oracle Analytics docs). If asked, be upfront that you verified the threshold via secondary statistical literature, not the original monograph.
- **Used By**: `components.2_anomaly_detection.threshold_source`

### [C11] Towards Data Science — '3 Simple Statistical Methods for Outlier Detection'
- **Publisher**: Towards Data Science (Medium publication)
- **Type**: secondary technical explainer
- **URL**: [https://towardsdatascience.com/3-simple-statistical-methods-for-outlier-detection-db762e86cd9d/](https://towardsdatascience.com/3-simple-statistical-methods-for-outlier-detection-db762e86cd9d/)
- **Claim Supported**: Modified z-score formula definition and the 0.6745 constant as the standard MAD-to-stddev rescaling factor.
- **Verification Note**: Cross-checked against C12 and C13 below — the 0.6745 constant and formula structure are consistent across all three independent sources.
- **Used By**: `components.2_anomaly_detection.constant_0.6745`, `components.2_anomaly_detection.method`

### [C12] Oracle — Modified Z-Score (Planning & Budgeting Cloud documentation)
- **Publisher**: Oracle Corporation
- **Type**: vendor technical documentation
- **URL**: [https://docs.oracle.com/en/cloud/saas/planning-budgeting-cloud/pfusu/insights_metrics_MODIFIED_Z_SCORE.html](https://docs.oracle.com/en/cloud/saas/planning-budgeting-cloud/pfusu/insights_metrics_MODIFIED_Z_SCORE.html)
- **Claim Supported**: "The Z-score method will never detect an outlier if the dataset has fewer than 12 items" — direct justification for why standard z-score is mathematically unsuitable at Styx's seed-data scale (25 APIs).
- **Verification Note**: The concrete, falsifiable reason IsolationForest/standard-zscore were both wrong choices for small populations.
- **Used By**: `components.2_anomaly_detection.why_not_isolation_forest_or_standard_zscore.standard_zscore`

### [C13] MCP Analytics — Z-Score Anomaly Detection
- **Publisher**: MCP Analytics
- **Type**: secondary technical explainer
- **URL**: [https://mcpanalytics.ai/articles/z-score-anomaly-detection-practical-guide-for-data-driven-decisions](https://mcpanalytics.ai/articles/z-score-anomaly-detection-practical-guide-for-data-driven-decisions)
- **Claim Supported**: Illustrates why standard z-score is contaminated by the outliers it's trying to detect, using the canonical example of one 30,000ms timeout vs. a 45ms median response-time dataset distorting the mean/stddev.
- **Verification Note**: Used for the illustrative contamination example and the general small-sample caution.
- **Used By**: `components.2_anomaly_detection.why_not_isolation_forest_or_standard_zscore.standard_zscore`

### [C14] SQ Magazine — API Security Breach Statistics 2026: Hidden Threats
- **Publisher**: SQ Magazine
- **Type**: aggregated statistics roundup (secondary, compiles multiple primary sources)
- **URL**: [https://sqmagazine.co.uk/api-security-breach-statistics/](https://sqmagazine.co.uk/api-security-breach-statistics/)
- **Claim Supported**: "Shadow APIs (undocumented endpoints) account for over 20% of total API inventory in enterprises." "Broken authentication remains responsible for 29% of API vulnerabilities." "47% of API endpoints remain exposed for 6+ months undetected."
- **Verification Note**: This is an aggregator/roundup site compiling statistics from multiple underlying reports. Treat as directionally indicative rather than load-bearing if challenged rigorously.
- **Used By**: 
  - `components.3_security_risk_score.prevalence_context.broken_auth_vuln_share`
  - `components.3_security_risk_score.prevalence_context.shadow_api_inventory_share`

### [C15] Imperva — New Research Reveals API Security is a Business Risk
- **Publisher**: Imperva
- **Type**: vendor research report
- **URL**: [https://www.imperva.com/blog/state-of-api-security-in-2024/](https://www.imperva.com/blog/state-of-api-security-in-2024/)
- **Claim Supported**: "An average of 613 APIs per organization" discovered via ML-based analysis, with significant overlap of deprecated/undocumented endpoints contributing to BOLA risk exposure.
- **Verification Note**: Used only as loose corroborating context for the general 'shadow API inventory is large' claim.
- **Used By**: `components.3_security_risk_score.prevalence_context.shadow_api_inventory_share`

### [C16] NIST National Vulnerability Database — CVE API
- **Publisher**: National Institute of Standards and Technology (NIST)
- **Type**: primary government developer documentation
- **URL**: [https://nvd.nist.gov/developers/vulnerabilities](https://nvd.nist.gov/developers/vulnerabilities)
- **Claim Supported**: NVD provides a JSON REST CVE API for retrieving single CVEs or collections of CVEs, including CVSS severity filters and CVE identifiers.
- **Verification Note**: This supports the roadmap item for CVE enrichment on the Security Insights page. NVD is separate from NVIDIA.
- **Used By**: `roadmap.security_intelligence.nvd_cve_enrichment`

### [C17] NVIDIA API Catalog / NIM APIs
- **Publisher**: NVIDIA
- **Type**: official platform documentation / API catalog
- **URL**: [https://build.nvidia.com/](https://build.nvidia.com/)
- **Claim Supported**: NVIDIA exposes AI models, blueprints, and inference endpoints that can be used as a future enterprise/cloud AI backend.
- **Verification Note**: This supports the optional AI investigation assistant roadmap. It does not support the lifecycle score itself.
- **Used By**: `roadmap.ai_assistant.provider_options.nvidia_nim`

### [C18] Ollama API Documentation
- **Publisher**: Ollama
- **Type**: official API documentation
- **URL**: [https://docs.ollama.com/api/introduction](https://docs.ollama.com/api/introduction)
- **Claim Supported**: Ollama provides an API for running and interacting with models, with a default local base URL at `http://localhost:11434/api`.
- **Verification Note**: This supports the optional local/private AI investigation assistant roadmap. It does not support the lifecycle score itself.
- **Used By**: `roadmap.ai_assistant.provider_options.ollama`

---

## Citation Strength Summary
- **Primary/Authoritative Standards**: C4, C5, C8
- **Primary Data-Derived Industry Reports**: C2
- **Academic/Statistical Method Consistent Across Independent Secondaries**: C10, C11, C12, C13
- **Vendor Reports (Single Source)**: C7, C15
- **Official Integration Docs**: C16, C17, C18
- **Aggregator Secondary Compilations (Weakest Tier)**: C14
- **Definitional/Conceptual (Not Quantitative)**: C1, C9

**Recommendation for Defense**: If pressed on any single number, lead with C4/C5/C8 (OWASP/CVSS primary standards) and C2 (42Crunch, production-data-derived) as your strongest ground. Those four citations alone justify the entire security-scoring weight structure. Treat C14 and C7 as supporting color for the narrative, not as the load-bearing justification for any specific weight value in the formula itself.

---

## Gaps Not Covered By Any Citation
- **Component 4 (Blast Radius Weighting)**: The `0.6/0.4` split has no direct external citation. It is internally consistent but not industry-sourced.
- **Anomaly Detection Residual Weights**: The weighting of the 4 residual ML-only anomaly features (e.g. `0.20`) is a stated default, not explicitly sourced from literature. (Note: Security Violations was mapped to `0.25` in implementation due to its severity).
- **90-Day Traffic Decay Window**: C2/C3 justify "why earlier than 6 months" qualitatively, but no source specifies exactly 90 days as an optimal cutoff. This is a reasonable engineering choice (one fiscal quarter) presented as such, not as an externally validated figure.
