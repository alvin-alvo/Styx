from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.router import api_router
from app.core.config import settings
from app.core.database import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.database_connected = False
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        app.state.database_connected = True
    except Exception:
        app.state.database_connected = False
    yield


tags_metadata = [
    {
        "name": "health",
        "description": "System health and database connectivity checks.",
    },
    {
        "name": "apis",
        "description": "API inventory, lifecycle states, and dependency maps.",
    },
    {
        "name": "scoring",
        "description": "Deterministic algorithms calculating Zombie and Shadow API risks.",
    },
    {
        "name": "simulator",
        "description": "Predictive blast radius simulation for API decommissioning.",
    },
    {
        "name": "alerts",
        "description": "Real-time security alerts based on Median Absolute Deviation (MAD).",
    },
    {
        "name": "assistant",
        "description": "Ollama LLM integration for executive summaries.",
    }
]

app = FastAPI(
    title="Styx Enterprise API",
    description="Backend services for the Styx API Security & Lifecycle Management Platform. Defensible, deterministic, and built for zero-trust.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",  # Default swagger endpoint
    redoc_url="/redoc",
    debug=settings.DEBUG,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
