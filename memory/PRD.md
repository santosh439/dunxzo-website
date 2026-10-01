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

## Phase 2 (user-approved): design overhaul prompts 1-7 — IN PROGRESS
Progress: **Prompt 2 (world-class hero) DONE 2026-10-01** — in `client/src/pages/Home.jsx` + `index.css`: animated conic gradient mesh + 3 drifting blobs, panning dot-grid, 8 floating particles, larger dashboard preview with macOS chrome, left icon rail, top reflection, deep shadow, pointer 3D tilt (gated by useReducedMotion), and a trust-points row (ISO/IEC 27001, SOC 2, DPDPA, ISO/IEC 42001) under the buttons. Headline/supporting text/buttons unchanged. Verified desktop tilt + 390px mobile.
Remaining prompts: 1 overall premium polish (violet #8B7CFF + aqua #3EE0CF, 8px grid, refined cards), 3 custom SVG visuals (startup journey timeline, GCC 15-domain hub diagram, maturity staircase, framework icons), 4 motion (scroll reveal, hover lift, counters, glass sticky header, prefers-reduced-motion), 5 polish Launchpad/Platform/Framework pages, 6 mobile 390px + Lighthouse >90 + lazy load, 7 light/dark toggle with persistence. Rule: keep all text/pages/features identical; no fake claims/logos/stats.

## Legal pages + cookie consent + form consent (DONE, 2026-10-01)
- Rebuilt the four legal pages in `client/src/content/legal.js` (structured content) + rewrote `client/src/pages/Legal.jsx`: sticky TOC (desktop) / collapsible (mobile), per-section anchor links, Print button, "Version" + "Last updated: [Effective date]" line, amber-highlighted `[placeholders]`, and a top review notice removable via the single `LEGAL_REVIEW_NOTICE` flag in legal.js. SEO title+description per page. Content: Privacy (17 sections: who we are, scope, data, browser-only tool data, purposes+GDPR/DPDPA table, DPDP Act 2023, IT Act/SPDI, EU/UK GDPR, US state, sharing, transfers, retention table, security, children, automated processing, changes, contact), Terms (12), Cookies (categories + cookie/storage table + manage consent), Disclaimer (6).
- `client/src/components/CookieConsent.jsx` (new, mounted in App.jsx): first-visit bottom banner (Accept all / Reject all / Manage preferences, equal prominence), preferences panel with per-category switches (Strictly necessary locked on), stores choice+date in `dunzo.consent`, re-asks after 12 months or CONSENT_VERSION bump, accessible (dialog semantics, Escape, switches), doesn't block page content. No analytics/marketing scripts load until consent (none installed yet). Footer "Cookie settings" link reopens via `dunzo:open-cookie-settings` event.
- Forms (Contact, TrustCenter, Launchpad): added "By submitting, you agree to our Privacy Policy" link + optional unticked "Send me DU-NZO updates..." checkbox; the `marketing` boolean is sent with the lead and stored. Backend: added `marketing` to lead schema in BOTH `server/src/index.js` (zod, canonical) and `backend/server.py` (pydantic, deployed) + "Updates consent" row in both email notifications. Verified stored (marketing:true).
- Fonts now self-hosted: Geist woff2 (300-700) in `client/public/fonts` + `frontend/public/fonts`, `@font-face` in index.css, Google Fonts links removed from both index.html. No third-party font request before consent. (User asked to be told — DONE.)
- Verified desktop + 390px mobile (no horizontal overflow), cookie banner/prefs, amber placeholders, SEO title "Privacy Policy | DU-NZO".

## DU-NZO Platform (SaaS) — 8-Command build — IN PROGRESS
User decisions (2026-10-01): platform lives under `/app/*` route tree, isolated from marketing chrome; preview + STOP for approval after every Command; JWT custom auth (Command 8); Claude Sonnet 5 Copilot (Command 7); dark theme default with light/dark toggle; flat sidebar with exact section names.

### Command 1 (DONE, 2026-10-01): Design system + app shell
- Design tokens: `client/src/index.css` gains a `.dz-app`-scoped token block (dark default + `[data-theme="light"]` override): rgb-channel CSS vars `--p-bg/surface/elevated/edge/ink/mute/faint`, accents `--p-violet/-soft/-aqua`, semantic success/warning/danger/info, signature gradient `--p-grad`, card/pop shadows. Tailwind (`client/tailwind.config.js`): `p-*` colors via `rgb(var() / <alpha-value>)`, `p-sm/md/lg/xl` radius, `p-card/p-pop` shadows. Component classes: `.p-panel`, `.p-icon-btn`, `.p-chip`, `.p-text-gradient`. Marketing tokens untouched.
- Routing: `App.jsx` early-returns `<PlatformApp />` (lazy) for `/app` or `/app/*`; marketing layout/footer/cookie banner never render inside the platform. PlatformApp uses its own `<Routes>` with ABSOLUTE paths (`/app`, `/app/controls`, …) — a standalone descendant Routes does not match `index`/relative paths without a parent `<Route>` (learned the hard way).
- Shell (`client/src/platform/`): `PlatformApp.jsx` (theme state persisted to localStorage `dunzo.platform.theme`, default dark; mobile drawer state; collapsed state; footer status line "DU-NZO Platform · Preview v0.1 / Environment: Demo · Sample data"), `components/Sidebar.jsx` (fixed left, 264px, collapsible to 84px icon rail on lg, off-canvas + backdrop on mobile, Settings pinned at bottom), `components/Topbar.jsx` (sticky, global search with ⌘K focus shortcut, Demo Organization chip, theme toggle, bell, avatar), `components/SectionPage.jsx` (placeholder per section: command chip, H1, blurb, 3 skeleton stat cards, "ships in Command N" panel; sets `document.title = "<name> · DU-NZO Platform"`).
- Nav (`platform/nav.js`): Home /app, Controls, Monitoring, Evidence, Policies, Risk register, Vendors, Audit hub, GCC command center, Trust Center + Settings — flat list, exact names, each with `command` number for the placeholder.
- Verified: desktop dark + light, collapsed rail, mobile 390px off-canvas nav (no h-overflow), marketing site unchanged, `yarn build` passes. data-testids: platform-app, platform-sidebar/topbar/footer, nav-*, theme-toggle, global-search, org-switcher, notifications-button, user-menu-button, sidebar-collapse-toggle, mobile-menu-button, platform-page-*, command-chip-*, stat-card-*.
- KNOWN ARTIFACT (not a bug): headless mobile screenshots paint the sticky topbar white despite correct computed styles (verified via elementFromPoint + inline-style test); desktop screenshots and real browsers render correctly.
- GOTCHA: changing `frontend/tailwind.config.js` requires `sudo supervisorctl restart frontend` — the Vite dev server caches the Tailwind config (CSS @apply errors otherwise).

### Command 2 (DONE, 2026-10-01): Home dashboard
- `platform/data/home.js`: MOCK data module (PULSE score 82/+4, 4 pillars, FRAMEWORKS x4 with status/progress/controls/meta, ACTIONS x5 ranked, UPCOMING x3, ACTIVITY x4). Replaced by real API in Command 8.
- `platform/pages/HomePage.jsx`: greeting header (time-aware + date), staggered framer-motion reveals. Components in `platform/components/home/`: `PulseGauge.jsx` (SVG radial gauge, gradient stroke, animated strokeDashoffset, glow), `TrustPulse.jsx` (gauge + +4 delta chip + 4 animated pillar bars + "What moved your score" delta list), `PostureSnapshot.jsx` (4 framework cards: status chip on-track/attention/early, animated gradient progress, controls count, meta), `NextActions.jsx` (ranked rows: rank, title, framework chip, due tone danger/warning/neutral, +N Pulse impact chip, owner avatar, Start button), `SideColumn.jsx` (Upcoming deadlines + Recent activity timeline).
- Marketing navbar: subtle "Platform login" text link → /app (desktop right cluster + mobile menu, `navbar-platform-login` / `mobile-platform-login`; `shrink-0 whitespace-nowrap` to prevent wrap).
- Verified: all testids present, dark + light, bottom row scroll, navbar desktop/mobile, `yarn build` clean.

### Command 3 (DONE, 2026-10-01): Controls library + detail drawer
- `platform/data/controls.js`: 18 MOCK controls across ISO 27001 (A.x), SOC 2 (CCx.x), DPDPA, ISO 42001 with id/title/domain/frameworks/owner/status/automation/lastTested/nextReview/description/evidence[]/risks[]; registries CONTROL_STATUS (operational/attention/missing/draft), FRESHNESS (fresh/stale/missing), OWNERS; `evidenceState()` derives worst freshness.
- `platform/pages/ControlsPage.jsx`: header + 4 clickable stat cards (toggle status filter), search (id/title/domain), framework + status filter chips, empty state with clear-filters; `markReviewed` updates local mock state (status → operational, lastTested "Just now").
- `platform/components/controls/ControlsTable.jsx`: grid table (Control ID chip + title + domain, framework chips, owner avatar, evidence count + freshness dot, status chip, chevron); min-w 820px with horizontal scroll.
- `platform/components/controls/ControlDrawer.jsx`: right slide-in drawer (framer-motion, backdrop, Escape, role=dialog): status + description, meta grid (owner/automation/last tested/next review), frameworks chips, evidence list with freshness + dashed Upload evidence button, related risks with severity dots, footer "Mark as reviewed" (gradient) + Edit.
- Verified: DPDPA filter → 3 rows, search narrows to 1, drawer open/mark-reviewed/Escape close, light theme. `yarn build` clean.

### Remaining Commands (sequential, preview + approval gate after each)
- C4: Monitoring, Evidence, Policies screens
- C5: Risk register + Vendors
- C6: Audit hub, GCC command center, Trust Center screens
- C7: Copilot panel + command menu (Claude Sonnet 5 via Emergent LLM key — call integration_expert first)
- C8: Real data — JWT auth, Mongo schemas, onboarding wizard (call integration_expert for auth before writing code)

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
