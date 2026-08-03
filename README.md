# Virtual Closet

A production-oriented foundation for a digital wardrobe application. The future product will let users catalogue garments and compose outfits on an interactive canvas.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query
- Backend: FastAPI, SQLAlchemy 2, Alembic, Pydantic Settings
- Data: PostgreSQL
- Tooling: Docker Compose, ESLint, Prettier, Ruff, Black, GitHub Actions

## Quick start

1. Copy the example environment files.
2. Run `docker compose up --build`.
3. Open `http://localhost:5173`; API documentation is at `http://localhost:8000/docs`.

The health check is `GET http://localhost:8000/api/v1/health`.

## Local development

Backend: `cd backend`, create and activate a Python 3.13 virtual environment, then run `pip install -e ".[dev]"` and `uvicorn app.main:app --reload`.

Frontend: `cd frontend && npm install && npm run dev`.

### Database migrations

Run `cd backend && alembic upgrade head` after configuring `backend/.env`. Docker Compose runs migrations automatically before starting the API.

## Authentication

Register a user and sign in from the frontend. The API returns a short-lived access token and writes the refresh token as an HTTP-only cookie. The browser client persists the access token and silently rotates it through the cookie when a protected request receives a 401 response.

Set `VIRTUAL_CLOSET_JWT_SECRET_KEY` to a strong, unique secret and set `VIRTUAL_CLOSET_COOKIE_SECURE=true` in production. Configure `VIRTUAL_CLOSET_CORS_ORIGINS` with the deployed frontend origin.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Create an account with a strong password. |
| POST | `/api/v1/auth/login` | Authenticate and set the refresh-token cookie. |
| POST | `/api/v1/auth/refresh` | Rotate the refresh token and receive a new access token. |
| POST | `/api/v1/auth/logout` | Revoke the active refresh token and clear its cookie. |
| GET | `/api/v1/users/me` | Retrieve the authenticated user's profile. |

Use `Authorization: Bearer <access_token>` for protected endpoints.

## Quality checks

Run `ruff check . && black --check .` in `backend`, and `npm run lint && npm run format:check` in `frontend`.

## Layout

`backend/app` contains layered FastAPI server modules; `frontend/src` contains React UI and client infrastructure; `docs` holds technical documentation.

## Roadmap

- Authentication and account management
- Garment uploads, image processing, and categorisation
- Digital wardrobe and outfit canvas
- AI-assisted garment tagging and outfit suggestions
