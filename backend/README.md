# NexChat Marketplace Backend (Python)

This backend provides marketplace data for the NexChat frontend.

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health`
- `GET /api/marketplace/listings?q=<search>&category=<name>`
- `GET /api/marketplace/requests`
