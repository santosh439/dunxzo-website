# DU-NZO Platform — Project & Deployment Guide

## Status: Preview Running (FARM) + Phase 1 (service categories) Done
- **Preview URL**: `https://c92d4991-7e6a-46a5-906e-ec749b4dce09.preview.emergentagent.com`
- **Canonical codebase (user decision)**: the ORIGINAL Node monorepo at `/app/client` (React+Vite), `/app/server` (Express), `/app/shared`. This is the source of truth.
- **Deployed/Emergent-preview copy**: FARM structure at `/app/frontend` (React+Vite, runs via Vite dev server on :3000) + `/app/backend` (FastAPI `server.py` on :8001, mirrors the Express API). `/app/frontend/src` is kept in sync from `/app/client/src` (only `src/lib/api.js` and config differ intentionally). After editing `client/`, run: `rsync -a --exclude 'lib/api.js' client/src/ frontend/src/ && cp client/public/sitemap.xml frontend/public/sitemap.xml && cd frontend && yarn build`.

## Phase 1 (DONE, 2026-10-01): Cybersecurity + IT Infrastructure service categories
- `client/src/content/site.js`: added `category` to all services ("Compliance and GRC" for the existing 13; "Cybersecurity" x9; "IT Infrastructure" x8). Added `SERVICE_CATEGORIES` registry. Added 17 new SERVICES entries (slug, name, icon, summary, outcomes, duration, category).
- New service slugs — Cybersecurity: vapt, cloud-security-assessment, soc-monitoring, incident-response, security-architecture-review, iam, endpoint-email-security, application-security, security-awareness-training. IT Infrastructure: cloud-migration-management, network-design-security, m365-google-workspace, device-management, backup-disaster-recovery, managed-it-support, server-datacenter-management, it-asset-management.
- Framework cross-links: added new service slugs into relevant `FRAMEWORKS[].services` (e.g. vapt + cloud-security-assessment → iso-27001, soc-2, pci-dss). Service pages auto-show "Frameworks covered"; framework pages auto-list the services (via svcBySlug).
- Navbar: Services mega menu now 3 category columns (Compliance and GRC / Cybersecurity / IT Infrastructure) via NAV `variant:"services"` + MenuPanel branch; mobile menu shows category subheadings.
- `/services` index: three category sections with headings, intros and anchors (#compliance-and-grc, #cybersecurity, #it-infrastructure).
- Homepage: new "Beyond compliance: Cybersecurity and IT Infrastructure" section (two cards) inserted after Platform.
- Footer: three service columns (Compliance and GRC / Cybersecurity / IT Infrastructure).
- Contact: topic dropdown adds "Cybersecurity services" and "IT infrastructure".
- `public/sitemap.xml`: 17 new service URLs added.
- SEO: each new service page gets title/description via existing Service.jsx `useSeo(s.name, s.summary)`. Verified `document.title` = "Security Architecture Review | DU-NZO".
- Icons: extended `components/Icon.jsx` lucide map (ScanSearch, CloudCog, Radar, Waypoints, Code2, CloudUpload, Router, LayoutGrid, MonitorSmartphone, DatabaseBackup, Headset, Server).
- Verified in preview (desktop + 390px mobile): services index, vapt detail (frameworks covered), homepage section, 3-col mega menu, footer, contact topics. `yarn build` passes.

## Phase 2 (NEXT, user-approved): design overhaul prompts 1-7
Bold/distinctive hero; include light/dark toggle. Prompts: 1 overall premium polish (violet #8B7CFF + aqua #3EE0CF, 8px grid, refined cards), 2 world-class hero (animated gradient mesh, particle grid, 3D-tilt dashboard, trust points row), 3 custom SVG visuals (startup journey timeline, GCC 15-domain hub diagram, maturity staircase, framework icons), 4 motion (scroll reveal, hover lift, counters, glass sticky header, respect prefers-reduced-motion), 5 polish Launchpad/Platform/Framework pages, 6 mobile 390px + Lighthouse >90 + lazy load, 7 light/dark toggle with persistence. Rule: keep all text/pages/features identical; no fake claims/logos/stats.

## Earlier (kept for reference)
- **Codebase note**: Originally cloned Node monorepo; kept original design/content.

## Implemented Features
1. **Full-stack Build & Run**:
   - `npm install` (root, client, server)
   - `npm run build` (builds Vite client to `client/dist`)
   - `npm start` (Express server serves both the built static React site and the `/api` endpoints)
2. **MongoDB Storage**:
   - Swapped the former JSON file store in `server/src/db.js` for MongoDB (`mongodb` Node.js driver).
   - Persists leads (`leads` collection) and compliance plans (`plans` collection).
   - Keeps identical interface: `createPlan`, `getPlan`, `updatePlan`, `listPlans`, `addLead`, `listLeads`.
3. **Email Notifications**:
   - Implemented in `server/src/email.js`.
   - Every lead submission through `/api/leads` (Contact Form, Trust Center request, and Startup Compliance Launchpad roadmap request) is emailed to `santosh@du-nzo.com`.
   - Fire-and-forget: email issues will never block form submissions.
4. **Admin Dashboard**:
   - Route `/admin` is protected by `ADMIN_TOKEN`.
   - Lists all captured leads and generated plans.

---

## Deploying to Railway / Render / DigitalOcean (Recommended)

Because this is a pure Node.js Express + Vite app (single server serving frontend + API), it deploys in 1 click on platforms like **Railway** or **Render**.

### Step 1: Push / Save to GitHub
Click the **"Save to GitHub"** button in the top-right / chat input of your Emergent workspace to sync this repository to your GitHub account.

### Step 2: Deploy on Railway (Fastest) or Render
1. Create a new service from your GitHub repo.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Connect a MongoDB instance (e.g. Railway MongoDB plugin or MongoDB Atlas).

### Step 3: Required Environment Variables
Set these environment variables in your hosting provider's dashboard:
- `ADMIN_TOKEN`: A strong secret string for accessing `/admin` (e.g., `8c6fc9942fc7f436da7e6b5a20afb7c2a912753da1c754e1`)
- `NODE_ENV`: `production`
- `PORT`: e.g. `4000` (or leave default assigned by host)
- `MONGO_URL`: Your MongoDB connection URI (e.g., from MongoDB Atlas or Railway MongoDB)
- `DB_NAME`: `dunzo`
- `LEAD_NOTIFY_EMAIL`: `santosh@du-nzo.com`
- `EMAIL_FROM_NAME`: `DU-NZO`
- `EMAIL_REPLY_TO`: `santosh@du-nzo.com`
- `EMERGENT_EMAIL_KEY`: `ek_1d2205c44988e39013fab34201dcc27d` (or replace with your own Resend/SendGrid key if self-hosting without the Emergent proxy)
