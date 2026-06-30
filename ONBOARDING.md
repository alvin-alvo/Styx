# Welcome to Styx 🚀

Welcome to **Styx** — the API Lifecycle Intelligence Platform! We are thrilled to have you on board. 

Styx is built to solve a critical challenge in modern software architecture, specifically for banking operations: **safely decommissioning risky APIs without breaking dependent systems.** 

By analyzing live telemetry, identifying zombie APIs, mapping dependency blast radii, and detecting anomalies in real-time, Styx provides teams with the intelligence they need to maintain a secure and efficient API ecosystem.

This document is designed to get you up to speed quickly. It will guide you through your local setup, introduce you to the codebase structure, and point you toward key concepts and further reading.

---

## 1. Local Development Setup

To start contributing, you'll need to set up the Styx stack locally. Styx consists of a FastAPI backend, a React frontend, a PostgreSQL database, and an Nginx gateway.

### Prerequisites

Ensure you have the following installed on your machine:
*   **Node.js** (v18+)
*   **Python** (v3.13+)
*   **PostgreSQL** (v15+) or **Docker**

### Step-by-Step Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Rizzy1857/Styx
    cd Styx
    ```

2.  **Start the Infrastructure (Database & Nginx)**
    ```bash
    docker-compose up -d
    ```

3.  **Set Up the Python Backend**
    ```bash
    cd backend
    python -m venv .venv
    
    # Activate virtual environment
    source .venv/bin/activate  # macOS/Linux
    # .venv\Scripts\activate   # Windows
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Run database migrations
    alembic upgrade head
    ```

4.  **Set Up the React Frontend**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application Pipeline

Styx relies on a simulated data pipeline to function. You will need **four** terminal windows to run the complete stack locally.

*   **Terminal 1 (FastAPI Server):**
    ```bash
    cd backend
    source .venv/bin/activate
    uvicorn main:app --reload --port 8000
    ```
*   **Terminal 2 (Nginx Log Ingestor):**
    ```bash
    cd backend
    source .venv/bin/activate
    python scripts/log_ingestor.py
    ```
*   **Terminal 3 (Traffic Generator):**
    ```bash
    cd backend
    source .venv/bin/activate
    python scripts/traffic_loop.py
    ```
*   **Terminal 4 (React Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```

Once everything is running, access the application at:
*   **Frontend UI:** `http://localhost:5173`
*   **API Documentation (Swagger):** `http://localhost:8000/docs`

---

## 2. Codebase Orientation

Styx is organized into distinct backend and frontend directories, keeping concerns cleanly separated.

### Backend (`/backend`)
Built with **Python 3.13** and **FastAPI**.
*   `app/api/endpoints/`: Contains the route definitions for CRUD operations, scoring, alerts, and analytics.
*   `app/models/`: SQLAlchemy ORM models defining the database schema.
*   `app/schemas/`: Pydantic models for request/response validation.
*   `app/services/`: Core business logic resides here (e.g., `lifecycle_scorer.py`, `anomaly_detector.py`, `deterministic_scorer.py`).
*   `scripts/`: Utility scripts for seeding data, generating mock traffic, and simulating attacks.

### Frontend (`/frontend`)
Built with **React 18** and **Vite**, using **Tailwind CSS** for styling.
*   `src/pages/`: Main views like Inventory, Security, Graph, Simulator, and Analytics.
*   `src/components/`: Reusable UI components.
*   `src/services/`: API client configurations (using Axios).
*   Data visualization is heavily driven by **D3.js** (for dependency graphs) and **Recharts** (for analytics dashboards).

---

## 3. Core Concepts to Understand

To work effectively on Styx, familiarize yourself with these key domain concepts:

*   **Zombie APIs:** Endpoints that are unused, outdated, or deprecated but are still exposed, posing security and maintenance risks.
*   **Blast Radius:** The scope of impact if an API is removed or fails. We use `NetworkX` in the backend and `D3.js` in the frontend to model and visualize these dependency graphs.
*   **Deterministic Scoring:** A multi-factor scoring model that uses statistical baselines (MAD, Z-Score) to detect anomalies and score zombie APIs based on 8 telemetry features.
*   **Log Tailing:** Currently, Styx simulates an enterprise eBPF agent by tailing Nginx access logs to generate real-time metrics and infer dependencies without code instrumentation.

---

## 4. Next Steps & Recommended Reading

Before picking up your first ticket, we recommend reviewing the following documentation located in the root directory:

1.  **`README.md`**: For a comprehensive overview of features, API endpoints, and the product roadmap.
2.  **`ARCHITECTURE.md`**: To understand the system design and component interactions.
3.  **`LOGIC.md`**: Deep dive into the scoring heuristics, deterministic scoring algorithms, and anomaly detection rules.
4.  **`WORKFLOW.md`**: To understand the expected development lifecycle.

### Contributing

When you're ready to write code:
1.  Create a feature branch from `main`: `git checkout -b feature/your-feature-name`
2.  Follow existing code styles and ensure backend tests pass (`pytest tests/`).
3.  Commit your changes using standard conventional commits (e.g., `feat: ...`, `fix: ...`).
4.  Open a Pull Request against `main` for review.

If you have any questions, check the [GitHub Issues](https://github.com/Rizzy1857/Styx/issues) or reach out to the maintainers. 

Welcome again to the team!
