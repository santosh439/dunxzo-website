# DU-NZO Website — PRD / Run Log

## Original problem statement
Clone https://github.com/santosh439/dunxzo-website (branch main) and run it unchanged: React+Vite client, Express API server, shared engines. npm install → npm run build → npm start. Set strong ADMIN_TOKEN for /admin. Keep lead storage persistent. Show a preview.

## Architecture (as run on this platform)
- Repo lives at /app (already the cloned repo, commit 365c193).
- Express server (server/src/index.js) serves built client (client/dist) + /api routes.
- Platform ingress: non-/api → port 3000, /api → port 8001. Two supervisor programs run the same server:
  - dunzo-web (PORT=3000, serves static site)
  - dunzo-api (PORT=8001, serves /api)
  Config: /etc/supervisor/conf.d/dunzo.conf (old frontend/backend template programs stopped/FATAL, harmless).
- Env: /app/.env (ADMIN_TOKEN, NODE_ENV=production). Server loads via --env-file-if-exists.
- Storage: MongoDB (local pod mongod, MONGO_URL=mongodb://localhost:27017, DB_NAME=dunzo). server/src/db.js rewritten to async MongoDB driver, same interface (createPlan/getPlan/updatePlan/listPlans/addLead/listLeads). Old JSON file store retired.
- Email: Emergent-managed Resend via server/src/email.js (proxy https://integrations.emergentagent.com, EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME=DU-NZO). notifyLead() emails every /api/leads submission (contact, trust-center, launchpad) to LEAD_NOTIFY_EMAIL=santosh@du-nzo.com. Fire-and-forget: mail failure never breaks submission.
- Env: /app/.env (ADMIN_TOKEN, NODE_ENV, MONGO_URL, DB_NAME, EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, EMAIL_REPLY_TO, LEAD_NOTIFY_EMAIL).

## Implemented / verified (2026-10-01)
- npm install (root + install:all) ✔, npm run build ✔ (client/dist built)
- /api/health OK via external URL; homepage 200 and renders ✔
- POST /api/leads, POST /api/plans ✔; /api/admin/leads with Bearer token ✔, wrong token → 401 ✔
- Persistence across server restart ✔
- /admin dashboard login with token shows leads/plans ✔ (screenshot verified)

## Backlog
- P1: Deploy to production if requested (deployer pipeline).
- P2: Optional MongoDB migration of db.js if multi-instance scaling is ever needed.
- P2: Repo owner's "Before launch" items (placeholders in Trust Center/Legal, analytics) — out of scope unless asked.
