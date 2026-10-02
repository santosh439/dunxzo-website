# DU-NZO · Compliance Platform & Marketing Site

**Compliance without the complexity.** A full-stack monorepo containing the DU-NZO marketing website and the DU-NZO Platform — a compliance SaaS product (controls, monitoring, evidence, risk register, audit hub, and an AI Copilot).

Contact: santosh@du-nzo.com · www.du-nzo.com

---

## Overview

The repository ships two things:

1. **Marketing site** — public pages (Home, Solutions, Compliance frameworks, Services, Platform, Trust Center, Startup Launchpad, free tools, resources, legal) plus a lead-capture + admin dashboard.
2. **DU-NZO Platform (SaaS)** — a gated app under the `/app/*` route tree: Home dashboard, Controls library, Monitoring, Evidence, Policies, Risk Register, Vendors, Audit Hub, GCC Command Center, Trust Center, Settings — with JWT auth, per-user MongoDB workspaces, evidence uploads, team invites, and a Claude-powered AI Copilot.

### Two backends (same API surface)

| Backend | Path | Role |
|---|---|---|
| **Express (canonical)** | `/app/server` | Source of truth; the GitHub/production deploy target. Serves the built React site **and** the `/api` endpoints. |
| **FastAPI (preview)** | `/app/backend` | Mirrors the Express API; used only by the Emergent live preview. |

The React frontend exists in two synced copies: `/app/client` (canonical, Vite dev on `:5173`) and `/app/frontend` (preview copy, served on `:3000`). Shared rule engines live in `/app/shared`.

---

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, lucide-react
- **Backend (canonical):** Node.js, Express, Zod, MongoDB driver, jsonwebtoken + bcryptjs, multer, `@anthropic-ai/sdk`
- **Backend (preview):** FastAPI, PyJWT, bcrypt, emergentintegrations
- **Database:** MongoDB
- **Integrations:** Claude Sonnet (AI Copilot), Emergent Object Storage (evidence uploads), Resend (lead emails), JWT auth

---

## Project structure

```
/
├── client/        # Canonical React + Vite frontend (source of truth)
│   └── src/platform/   # DU-NZO Platform SaaS UI
├── frontend/      # Preview copy of the frontend (Emergent)
├── server/        # Canonical Express API (production target)
│   └── src/            # index.js, db.js, email.js, platform.js, objectStorage.js, workspaceSeed.js
├── backend/       # FastAPI preview backend (mirrors Express API)
├── shared/        # Rule engines shared by client & server
└── memory/        # Project docs (PRD, credentials)
```

---

## Setup

### Prerequisites
- Node.js 18+
- Python 3.11+ (only for the FastAPI preview backend)
- A running MongoDB instance

### 1. Environment variables
Copy the example files and fill in real values:
```bash
cp .env.example .env                 # Express server + marketing
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env # only if running the FastAPI preview
```
See each `.env.example` for the full list of required variables (MongoDB, `JWT_SECRET`, `ADMIN_TOKEN`, `EMERGENT_LLM_KEY`, `ANTHROPIC_API_KEY`, email keys, etc.). **Never commit real `.env` files.**

### 2. Install dependencies
```bash
npm run install:all   # installs server + client
```

---

## Running

### Development (canonical stack)
```bash
npm run dev           # client on :5173, Express API on :4000
```

### Production (canonical stack)
```bash
npm run build         # builds the Vite client to client/dist
npm start             # Express serves the built site + /api on :4000
```

### Frontend only (preview copy)
```bash
cd frontend && yarn install && yarn dev   # Vite dev server on :3000
```

### FastAPI preview backend (optional)
```bash
cd backend && pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Tests
```bash
npm test              # shared engine tests
```

---

## Key API endpoints (under `/api`)

- **Auth:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- **Workspace:** `POST /onboarding`, `GET /workspace`, `PATCH /workspace/controls/:id/review`, `PATCH /workspace/controls/:id/owner`, `PATCH /workspace/risks/:id/accept`, `PATCH /workspace/audit/requests/:id/submit`
- **Evidence (object storage):** `POST /workspace/evidence`, `GET /workspace/evidence/:fileId/download`
- **Invites:** `POST /workspace/invites`, `GET /workspace/invites`, `GET /invites/:token`, `POST /invites/:token/accept`
- **Copilot:** `POST /copilot/chat` (SSE streaming; grounded in the user's workspace when authenticated)
- **Marketing:** `POST /leads` (Contact / Trust Center / Launchpad), admin dashboard at `/admin` (protected by `ADMIN_TOKEN`)

---

## Deploying (Railway / Render / DigitalOcean)

Pure Node Express + Vite app — single server serves frontend + API.
1. Push to GitHub (use the **Save to GitHub** button).
2. New service from the repo. Build: `npm install && npm run build`. Start: `npm start`.
3. Attach a MongoDB instance.
4. Set env vars from `.env.example` (`MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_TOKEN`, `EMERGENT_LLM_KEY`, `ANTHROPIC_API_KEY`, email keys, `PORT`, `NODE_ENV`).

> The Copilot in the Express backend requires `ANTHROPIC_API_KEY`; without it `/api/copilot/chat` returns a graceful 503.

---

## Before launch
Replace bracketed placeholders in the Trust Center, Company, and Legal pages. Have legal pages reviewed by counsel and verify every regulatory date/statement.
