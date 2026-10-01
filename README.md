# DU-NZO · www.du-nzo.com

Compliance without the complexity. Full stack website and platform for DU-NZO (contact: santosh@du-nzo.com).

## Stack
React 18, Vite, Tailwind, Framer Motion, React Router (client) · Express, Zod, JSON file store (server) · shared rule engines in `/shared` used by both.

## Run
```
npm install            # installs root, client and server
npm run dev            # client on :5173, API on :4000
npm test               # engine tests
npm run build && npm start   # production: Express serves the built site on :4000
```
Set `ADMIN_TOKEN` to view leads and plans at `/admin`.
Single file demo: `cd client && npx vite build --mode demo` (output in `client/dist-demo/index.html`).

## Site map
Home · Solutions (Startups, GCCs, SaaS, AI Companies, Enterprises) · Compliance (12 framework pages grouped by type) · Services (13) · Platform (12 modules) · GCC Compliance Command Center · Trust Center · Startup Compliance Launchpad · 14 Free Tools · Resources (Startup Hub, GCC Hub, Guides, Checklists, Glossary) · Company (About, Experts, Partners, Contact) · Legal.

## Content
All copy lives in `client/src/content/site.js`. Engines: `shared/launchpad.js`, `shared/assessments.js`, `shared/tools.js`, `shared/planEngine.js`.

## Before launch
Replace bracketed placeholders in the Trust Center, Company pages and Legal pages. Have legal pages reviewed by counsel. Verify every regulatory date and statement. Add analytics and a consent banner if required.
