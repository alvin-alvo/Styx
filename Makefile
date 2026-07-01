.PHONY: help setup setup-backend setup-frontend docker backend ebpf frontend ollama start stop clean run all

help:
	@echo "Styx Makefile"
	@echo "-----------------------"
	@echo "Available commands:"
	@echo "  make setup         - Install backend and frontend dependencies, run DB migrations"
	@echo "  make docker        - Start Postgres and Mock Services via docker-compose"
	@echo "  make ollama        - Start Ollama via Homebrew"
	@echo "  make backend       - Start FastAPI backend server"
	@echo "  make ebpf          - Start eBPF Replay Engine"
	@echo "  make frontend      - Start React frontend server"
	@echo "  make start         - Start all services concurrently (docker, ollama, backend, ebpf, frontend)"
	@echo "  make run           - Same as 'make start'"
	@echo "  make all           - Run 'setup' and then 'start'"
	@echo "  make stop          - Stop docker services and ollama"
	@echo "  make clean         - Remove virtualenv, node_modules, and __pycache__"

setup: setup-backend setup-frontend

setup-backend:
	cd backend && python3 -m venv .venv
	backend/.venv/bin/pip install -r backend/requirements.txt
	cd backend && .venv/bin/alembic upgrade head

setup-frontend:
	cd frontend && npm install

docker:
	docker-compose up -d

ollama:
	brew services start ollama

backend:
	cd backend && .venv/bin/uvicorn main:app --reload --port 8000

ebpf:
	cd backend && .venv/bin/python scripts/ebpf_replay.py

frontend:
	cd frontend && npm run dev

start:
	$(MAKE) -j5 docker ollama backend ebpf frontend

run: start

all: setup start

stop:
	docker-compose down
	brew services stop ollama || true

clean: stop
	rm -rf backend/.venv
	rm -rf frontend/node_modules
	find . -type d -name "__pycache__" -exec rm -r {} +
