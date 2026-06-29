FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Start the log ingestor in the background, run migrations, and start the FastAPI server
CMD python scripts/log_ingestor.py & alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
