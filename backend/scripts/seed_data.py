import os
import sys

# Add the backend root directory to sys.path so 'app' can be imported when running script directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import random
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete

from app.core.database import SessionLocal
from app.models import (
    API,
    APISecurityPosture,
    APIStatus,
    Alert,
    AlertType,
    Dependency,
    SeverityLevel,
    TrafficSource,
    TrafficSourceType,
)

random.seed(42)


def iso_now() -> datetime:
    return datetime.now(timezone.utc)


def random_last_seen(min_days: int, max_days: int) -> tuple[datetime, int]:
    dormant_days = random.randint(min_days, max_days)
    seen_at = iso_now() - timedelta(days=dormant_days, hours=random.randint(0, 23))
    return seen_at, dormant_days


def seed_apis() -> list[API]:
    endpoint_pool = [
        # Stripe (Payment/Billing) - 25
        "/v1/customers", "/v1/customers/{id}", "/v1/charges", "/v1/charges/{id}", "/v1/payment_intents",
        "/v1/payment_intents/{id}", "/v1/payment_methods", "/v1/payment_methods/{id}", "/v1/invoices",
        "/v1/invoices/{id}", "/v1/invoices/{id}/pay", "/v1/products", "/v1/products/{id}", "/v1/prices",
        "/v1/prices/{id}", "/v1/subscriptions", "/v1/subscriptions/{id}", "/v1/tax_rates", "/v1/webhook_endpoints",
        "/v1/refunds", "/v1/disputes", "/v1/payouts", "/v1/balance", "/v1/balance_transactions", "/v1/events",
        
        # Twilio (Voice/Messaging) - 25
        "/2010-04-01/Accounts", "/2010-04-01/Accounts/{id}/Calls", "/2010-04-01/Accounts/{id}/Calls/{call_id}",
        "/2010-04-01/Accounts/{id}/Messages", "/2010-04-01/Accounts/{id}/Messages/{message_id}", 
        "/2010-04-01/Accounts/{id}/Conferences", "/2010-04-01/Accounts/{id}/Recordings", 
        "/2010-04-01/Accounts/{id}/IncomingPhoneNumbers", "/2010-04-01/Accounts/{id}/Addresses", 
        "/2010-04-01/Accounts/{id}/Queues", "/2010-04-01/Accounts/{id}/Applications", 
        "/v2/Services", "/v2/Services/{id}", "/v2/Services/{id}/Channels", "/v2/Services/{id}/Users", 
        "/v1/Flows", "/v1/Flows/{id}/Executions", "/v1/Workspaces", "/v1/Workspaces/{id}/Workers", 
        "/v1/Workspaces/{id}/TaskQueues", "/2010-04-01/Accounts/{id}/Keys", "/2010-04-01/Accounts/{id}/Tokens", 
        "/2010-04-01/Accounts/{id}/Usage/Records", "/2010-04-01/Accounts/{id}/AvailablePhoneNumbers/US/Local", "/2010-04-01/Accounts/{id}/SIP/Domains",
        
        # GitHub (Repo/Social) - 25
        "/user", "/users/{username}", "/users/{username}/repos", "/orgs/{org}/repos", "/repos/{owner}/{repo}", 
        "/repos/{owner}/{repo}/issues", "/repos/{owner}/{repo}/pulls", "/repos/{owner}/{repo}/commits", 
        "/repos/{owner}/{repo}/branches", "/repos/{owner}/{repo}/releases", "/repos/{owner}/{repo}/actions/workflows", 
        "/repos/{owner}/{repo}/actions/runs", "/search/repositories", "/search/code", "/search/users", 
        "/emojis", "/gitignore/templates", "/licenses", "/rate_limit", "/events",
        "/repos/{owner}/{repo}/collaborators", "/repos/{owner}/{repo}/hooks", "/repos/{owner}/{repo}/keys",
        "/orgs/{org}/members", "/orgs/{org}/teams",
        
        # Shopify (E-commerce) - 25
        "/admin/api/2024-01/products.json", "/admin/api/2024-01/products/{id}.json", "/admin/api/2024-01/orders.json", 
        "/admin/api/2024-01/orders/{id}.json", "/admin/api/2024-01/customers.json", "/admin/api/2024-01/customers/{id}.json", 
        "/admin/api/2024-01/inventory_items.json", "/admin/api/2024-01/inventory_levels.json", "/admin/api/2024-01/locations.json", 
        "/admin/api/2024-01/discounts.json", "/admin/api/2024-01/price_rules.json", "/admin/api/2024-01/gift_cards.json", 
        "/admin/api/2024-01/checkouts.json", "/admin/api/2024-01/draft_orders.json", "/admin/api/2024-01/fulfillments.json", 
        "/admin/api/2024-01/smart_collections.json", "/admin/api/2024-01/custom_collections.json", "/admin/api/2024-01/themes.json", 
        "/admin/api/2024-01/assets.json", "/admin/api/2024-01/webhooks.json", "/admin/api/2024-01/blogs.json",
        "/admin/api/2024-01/articles.json", "/admin/api/2024-01/pages.json", "/admin/api/2024-01/redirects.json", "/admin/api/2024-01/script_tags.json"
    ]

    methods = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    apis: list[API] = []

    status_distribution = ([APIStatus.ACTIVE] * 60) + ([APIStatus.DEPRECATED] * 20) + ([APIStatus.ZOMBIE] * 12) + ([APIStatus.SHADOW] * 8)

    for index, status in enumerate(status_distribution):
        endpoint = endpoint_pool[index]
        method = random.choice(methods)
        host = random.choice(["core.styx.local", "edge.styx.local", "risk.styx.local"])

        if status == APIStatus.ACTIVE:
            last_seen, dormant_days = random_last_seen(0, 7)
            has_docs = True
            owner = random.choice(["payments-team", "risk-team", "platform-team"])
            zombie_score = round(random.uniform(0.05, 0.32), 2)
        elif status == APIStatus.DEPRECATED:
            last_seen, dormant_days = random_last_seen(30, 80)
            has_docs = True
            owner = random.choice(["legacy-team", "platform-team"])
            zombie_score = round(random.uniform(0.42, 0.68), 2)
        elif status == APIStatus.ZOMBIE:
            last_seen, dormant_days = random_last_seen(90, 120)
            has_docs = False
            owner = None
            zombie_score = round(random.uniform(0.74, 0.94), 2)
        else:
            last_seen, dormant_days = random_last_seen(10, 45)
            has_docs = False
            owner = None
            zombie_score = round(random.uniform(0.61, 0.79), 2)

        apis.append(
            API(
                endpoint=endpoint,
                method=method,
                host=host,
                current_status=status,
                previous_status="ZOMBIE" if status == APIStatus.ACTIVE and index < 3 else None,
                status_changed_at=iso_now() - timedelta(days=random.randint(1, 30)),
                zombie_score=zombie_score,
                last_traffic_seen=last_seen,
                dormant_duration_days=dormant_days,
                has_documentation=has_docs,
                owner=owner,
            )
        )

    return apis


def main() -> None:
    db = SessionLocal()

    db.execute(delete(Alert))
    db.execute(delete(Dependency))
    db.execute(delete(TrafficSource))
    db.execute(delete(APISecurityPosture))
    db.execute(delete(API))

    apis = seed_apis()
    db.add_all(apis)
    db.flush()

    for api in apis:
        insecure = api.current_status in {APIStatus.ZOMBIE, APIStatus.SHADOW}
        uses_https = not insecure or random.random() > 0.4
        has_auth = not insecure or random.random() > 0.5
        has_rate_limit = not insecure or random.random() > 0.6
        exposes_sensitive_data = insecure and random.random() > 0.4

        severity = (
            SeverityLevel.CRITICAL
            if not has_auth
            else SeverityLevel.HIGH if not uses_https or exposes_sensitive_data else SeverityLevel.MEDIUM
        )
        cvss = 9.1 if severity == SeverityLevel.CRITICAL else 7.5 if severity == SeverityLevel.HIGH else 5.9

        db.add(
            APISecurityPosture(
                api_id=api.id,
                owasp_category="OWASP API2:2023" if not has_auth else "OWASP API8:2023",
                cvss_score=cvss,
                severity=severity,
                has_authentication=has_auth,
                uses_https=uses_https,
                tls_version="TLS1.3" if uses_https else None,
                has_rate_limiting=has_rate_limit,
                exposes_sensitive_data=exposes_sensitive_data,
                security_risk_score=round(cvss / 10.0, 2),
                last_assessed=iso_now() - timedelta(days=random.randint(0, 15)),
            )
        )

        if api.current_status == APIStatus.SHADOW:
            source_types = [TrafficSourceType.VPC_FLOW]
        elif api.current_status == APIStatus.ZOMBIE:
            source_types = [TrafficSourceType.GATEWAY, TrafficSourceType.VPC_FLOW]
        else:
            source_types = [random.choice([TrafficSourceType.GATEWAY, TrafficSourceType.LOAD_BALANCER, TrafficSourceType.OPENAPI_SPEC])]

        for source_type in source_types:
            db.add(
                TrafficSource(
                    api_id=api.id,
                    source_type=source_type,
                    discovered_at=iso_now() - timedelta(days=random.randint(0, 90)),
                )
            )

    services = [
        "loan-processor",
        "fraud-engine",
        "kyc-service",
        "mobile-app",
        "web-portal",
        "statement-worker",
        "collections-bot",
        "crm-sync",
        "underwriting-orchestrator",
        "notification-hub",
        "etl-warehouse",
        "risk-proxy",
        "merchant-onboarding",
        "partner-gateway",
    ]

    for _ in range(40):
        target = random.choice(apis)
        db.add(
            Dependency(
                source_service=random.choice(services),
                source_ip=f"10.0.{random.randint(1, 20)}.{random.randint(2, 254)}",
                target_api_id=target.id,
                call_frequency=random.randint(20, 1200),
                traffic_percentage=round(random.uniform(0.01, 0.2), 3),
                last_observed=iso_now() - timedelta(hours=random.randint(1, 240)),
            )
        )

    candidate_apis = [api for api in apis if api.current_status == APIStatus.ACTIVE][:3]
    for api in candidate_apis:
        db.add(
            Alert(
                api_id=api.id,
                alert_type=AlertType.ZOMBIE_RESURRECTION,
                trigger_metadata={
                    "ips": [f"185.220.101.{random.randint(1, 254)}" for _ in range(3)],
                    "user_agents": ["curl/8.1.0", "Mozilla/5.0", "python-requests/2.31.0"],
                    "geo_regions": ["IN", "SG", "DE"],
                    "triggers": ["traffic_spike", "new_caller_ips"],
                },
                previous_dormant_days=random.randint(91, 140),
                severity="HIGH",
            )
        )

    db.commit()

    counts = {
        "ACTIVE": sum(api.current_status == APIStatus.ACTIVE for api in apis),
        "DEPRECATED": sum(api.current_status == APIStatus.DEPRECATED for api in apis),
        "ZOMBIE": sum(api.current_status == APIStatus.ZOMBIE for api in apis),
        "SHADOW": sum(api.current_status == APIStatus.SHADOW for api in apis),
    }
    print("Seed complete")
    print(f"APIs: {len(apis)} -> {counts}")
    print("Dependencies: 40")
    print("Resurrection alerts: 3")


if __name__ == "__main__":
    main()