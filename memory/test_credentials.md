# DU-NZO Platform — Test Credentials

## Platform (JWT auth, Command 8)
Auth is self-signup (no admin seeding). Bearer token stored in localStorage key `dunzo.platform.token`.

- **Demo account**: `demo@dunzo.com` / `demo12345`
  - This account may already be onboarded. To test the onboarding wizard, register a NEW account from the /app sign-in screen (toggle "Create one").
- **Password rule**: min 6 chars.

### Auth endpoints (backend FastAPI, /app/backend/server.py)
- POST `/api/auth/register` {name,email,password} → {token, user}
- POST `/api/auth/login` {email,password} → {token, user}
- GET `/api/auth/me` (Bearer) → {user}
- POST `/api/onboarding` (Bearer) {company, frameworks[], size} → workspace (seeds controls+risks)
- GET `/api/workspace` (Bearer) → {profile, controls, risks, pulse}
- PATCH `/api/workspace/controls/{id}/review` (Bearer)
- PATCH `/api/workspace/risks/{id}/accept` (Bearer)
- POST `/api/copilot/chat` (Bearer optional — grounds answers in workspace when present)

## Admin (legacy marketing site)
- `/admin` protected by `ADMIN_TOKEN` env var (see backend/.env).

## Notes
- Frontend calls use relative `/api` via the Vite proxy to :8001; auth sends `Authorization: Bearer <token>`.
- The preview runs the FastAPI backend. The canonical Express app (`/app/server`) does NOT yet have the platform auth/workspace/copilot endpoints — needs porting for GitHub production deploy.
