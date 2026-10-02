# DU-NZO Platform — Test Credentials & Env

## Platform auth (JWT, self-signup)
- Bearer token in localStorage key `dunzo.platform.token`.
- Demo account: `demo@dunzo.com` / `demo12345` (may already be onboarded; register a new email to test onboarding).
- Password rule: min 6 chars.

## Preview backend (FastAPI, /app/backend) — what the preview runs
Endpoints (all under /api):
- auth: POST /auth/register, /auth/login, GET /auth/me
- workspace: POST /onboarding, GET /workspace, PATCH /workspace/controls/{id}/review, /workspace/controls/{id}/owner, /workspace/risks/{id}/accept, /workspace/audit/requests/{id}/submit
- evidence (object storage): POST /workspace/evidence (multipart, ?control=), GET /workspace/evidence/{fileId}/download
- invites: POST/GET /workspace/invites, GET /invites/{token}, POST /invites/{token}/accept
- copilot: POST /copilot/chat (SSE; grounded in workspace when Bearer present)
Env in /app/backend/.env: MONGO_URL, DB_NAME, JWT_SECRET, EMERGENT_LLM_KEY, INTEGRATION_PROXY_URL (object storage + Copilot).

## Canonical Express app (/app/server) — GitHub production target
Full parity port in src/platform.js (+ objectStorage.js, workspaceSeed.js), mounted in src/index.js.
Verified on a spare port: register/login/me, onboarding (framework-filtered seed), review/owner/accept/submit,
evidence upload+download via object storage, invites — all pass.
REQUIRED PRODUCTION ENV (set these in your host, e.g. Railway/Render/Vercel):
- MONGO_URL, DB_NAME  (already used)
- JWT_SECRET          (random 64-hex string)
- EMERGENT_LLM_KEY    (for object storage) + INTEGRATION_PROXY_URL (optional; defaults to https://integrations.emergentagent.com)
- ANTHROPIC_API_KEY   (REQUIRED for the Copilot in Express — user is providing this)
- ANTHROPIC_MODEL     (optional; defaults to claude-sonnet-4-5-20250929 — set to your chosen Claude Sonnet model id)
Without ANTHROPIC_API_KEY the Express /api/copilot/chat returns 503 (graceful).

## Admin (legacy marketing site)
- /admin protected by ADMIN_TOKEN env var.
