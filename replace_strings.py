import os
import re

replacements = {
    "Dashboard.jsx": [
        (r'>Global Dashboard<', r'>{t("dash.title")}<'),
        (r'>Enterprise API observability and threat metrics<', r'>{t("dash.subtitle")}<'),
        (r'>Total APIs<', r'>{t("dash.kpi1")}<'),
        (r'>Active Zombies<', r'>{t("dash.kpi2")}<'),
        (r'>Avg Risk Score<', r'>{t("dash.kpi3")}<'),
        (r'>Open Alerts<', r'>{t("dash.kpi4")}<'),
        (r'>API Lifecycle Trends \(30 Days\)<', r'>{t("dash.chart1")}<'),
        (r'>API Status Distribution<', r'>{t("dash.chart2")}<'),
    ],
    "Landing.jsx": [
        (r'>API Observability<', r'>{t("landing.feat1.title")}<'),
        (r'>Gain instant visibility into your entire API inventory\. Detect active, deprecated, shadow, and zombie endpoints across your organization in real-time\.<', r'>{t("landing.feat1.desc")}<'),
        (r'>Threat Matrix Scoring<', r'>{t("landing.feat2.title")}<'),
        (r'>Deterministic threat models score your infrastructure based on lifecycle vulnerabilities, missing documentation, and active security gaps automatically\.<', r'>{t("landing.feat2.desc")}<'),
        (r'>Blast Radius Simulation<', r'>{t("landing.feat3.title")}<'),
        (r'>Safely simulate API decommissioning\. Visually map downstream impact, dependent services, and traffic disruptions before taking services offline\.<', r'>{t("landing.feat3.desc")}<'),
    ],
    "TopNav.jsx": [
        (r'placeholder="Search in Styx\.\.\."', r'placeholder={t("topnav.search")}'),
        (r'>Features & Pages<', r'>{t("topnav.features")}<'),
    ],
    "Inventory.jsx": [
        (r'>API Inventory<', r'>{t("inv.title")}<'),
        (r'>Complete catalogue of all discovered endpoints<', r'>{t("inv.subtitle")}<'),
    ],
    "InventoryTable.jsx": [
        (r'placeholder="Search endpoint or owner\.\.\."', r'placeholder={t("inv.search")}'),
        (r'>Endpoint\s*<', r'>{t("inv.col1")} <'),
        (r'>Security/Docs<', r'>{t("inv.col2")}<'),
        (r'>Owner\s*<', r'>{t("inv.col3")} <'),
        (r'>Status\s*<', r'>{t("inv.col4")} <'),
        (r'>Risk Score\s*<', r'>{t("inv.col5")} <'),
        (r'>Last Seen\s*<', r'>{t("inv.col6")} <'),
        (r'>No APIs found matching filters\.<', r'>{t("inv.empty")}<'),
    ],
    "Security.jsx": [
        (r'>Security Matrix<', r'>{t("sec.title")}<'),
        (r'>API security posture vs lifecycle risk<', r'>{t("sec.subtitle")}<'),
        (r'placeholder="Search endpoints\.\.\."', r'placeholder={t("sec.search")}'),
    ],
    "Alerts.jsx": [
        (r'>Alerts<', r'>{t("alerts.title")}<'),
        (r'>API lifecycle and security events<', r'>{t("alerts.subtitle")}<'),
        (r'placeholder="Search by API ID or type\.\.\."', r'placeholder={t("alerts.search")}'),
    ],
    "Graph.jsx": [
        (r'>Dependency Graph<', r'>{t("graph.title")}<'),
        (r'>API interaction and data flow topology<', r'>{t("graph.subtitle")}<'),
    ],
    "Simulator.jsx": [
        (r'>Blast Radius Simulator<', r'>{t("sim.title")}<'),
        (r'>Test API decommissioning and evaluate downstream impact<', r'>{t("sim.subtitle")}<'),
    ],
}

base_dir = "frontend/src"
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f in replacements:
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            if "useTranslation" not in content:
                content = content.replace("import React", "import React\nimport { useTranslation } from 'react-i18next'")
            
            # Use regex to insert const { t } = useTranslation();
            # if it's not already there and there's a default export function
            if "const { t } = useTranslation();" not in content and "export default function" in content:
                content = re.sub(r'(export default function\s+\w+\(.*?\)\s*\{)', r'\1\n  const { t } = useTranslation();', content)
            
            for pat, repl in replacements[f]:
                content = re.sub(pat, repl, content)
            
            with open(filepath, "w", encoding="utf-8") as file:
                file.write(content)

print("Replacement complete.")
