# DU-NZO Platform — Project & Deployment Guide

## Status: Preview Running & Ready for External Deploy
- **Preview URL**: `https://c92d4991-7e6a-46a5-906e-ec749b4dce09.preview.emergentagent.com`
- **Codebase**: Node.js monorepo (React + Vite client in `/client`, Express API in `/server`, shared rule engines in `/shared`). Kept completely original with no design or content changes.

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
