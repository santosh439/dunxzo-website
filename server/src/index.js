import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { db, connectDb } from "./db.js";
import { notifyLead } from "./email.js";
import { generatePlan, progressOf } from "../../shared/planEngine.js";

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "100kb" }));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-7", legacyHeaders: false }));

const newId = () => crypto.randomBytes(6).toString("base64url");
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const PlanInput = z.object({
  company: z.string().max(120).optional(),
  employees: z.enum(["1-50", "51-250", "251-1000", "1000+"]).optional(),
  maturity: z.enum(["none", "basic", "established"]).optional(),
  hosting: z.enum(["cloud", "hybrid", "onprem"]).optional(),
  sites: z.coerce.number().int().min(1).max(50).optional(),
  frameworks: z.array(z.enum(["iso27001", "iso27701"])).max(2).optional(),
  alignments: z.array(z.enum(["gdpr", "soc2"])).max(2).optional(),
  startDate: date.optional(),
  targetDate: date.nullable().optional(),
});

const Lead = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(160).optional().default(""),
  size: z.string().max(40).optional().default(""),
  frameworks: z.array(z.string().max(40)).max(10).optional().default([]),
  message: z.string().max(4000).optional().default(""),
  planId: z.string().max(40).optional(),
  source: z.string().max(80).optional().default("contact"),
  summary: z.string().max(8000).optional().default(""),
  marketing: z.boolean().optional().default(false),
});

const validate = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) {
    return res.status(400).json({ error: "Invalid request", issues: r.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) });
  }
  req.valid = r.data;
  next();
};

const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const ok = ADMIN_TOKEN && token.length === ADMIN_TOKEN.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(ADMIN_TOKEN));
  if (!ok) return res.status(401).json({ error: "Admin token missing or incorrect" });
  next();
};

const view = (rec) => ({ id: rec.id, plan: rec.plan, done: rec.done, progress: progressOf(rec.plan, rec.done), createdAt: rec.createdAt, updatedAt: rec.updatedAt });

/* Public API */
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/plans/preview", validate(PlanInput), (req, res) => res.json({ plan: generatePlan(req.valid) }));

app.post("/api/plans", validate(PlanInput), async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const rec = await db.createPlan({ id: newId(), plan: generatePlan(req.valid), done: [], createdAt: now, updatedAt: now });
    res.status(201).json(view(rec));
  } catch (e) { next(e); }
});

app.get("/api/plans/:id", async (req, res, next) => {
  try {
    const rec = await db.getPlan(req.params.id);
    if (!rec) return res.status(404).json({ error: "Plan not found" });
    res.json(view(rec));
  } catch (e) { next(e); }
});

app.patch("/api/plans/:id/tasks", validate(z.object({ taskId: z.string().max(60), done: z.boolean() })), async (req, res, next) => {
  try {
    const rec = await db.getPlan(req.params.id);
    if (!rec) return res.status(404).json({ error: "Plan not found" });
    const known = rec.plan.phases.some((p) => p.tasks.some((t) => t.id === req.valid.taskId));
    if (!known) return res.status(400).json({ error: "Unknown task" });
    const set = new Set(rec.done);
    if (req.valid.done) set.add(req.valid.taskId); else set.delete(req.valid.taskId);
    res.json(view(await db.updatePlan(rec.id, { done: [...set] })));
  } catch (e) { next(e); }
});

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
app.get("/api/plans/:id/export.csv", async (req, res, next) => {
  try {
    const rec = await db.getPlan(req.params.id);
    if (!rec) return res.status(404).json({ error: "Plan not found" });
    const done = new Set(rec.done);
    const rows = [["Phase", "Task", "Owner", "Reference", "Deliverable", "Start", "End", "Status"]];
    for (const p of rec.plan.phases) for (const t of p.tasks) rows.push([p.name, t.title, t.owner, t.ref, t.deliverable, p.startDate, p.endDate, done.has(t.id) ? "Done" : "Open"]);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="iso-plan-${rec.id}.csv"`);
    res.send(rows.map((r) => r.map(csvCell).join(",")).join("\r\n"));
  } catch (e) { next(e); }
});

app.get("/api/plans/:id/milestones.ics", async (req, res, next) => {
  try {
    const rec = await db.getPlan(req.params.id);
    if (!rec) return res.status(404).json({ error: "Plan not found" });
    const d = (s) => s.replace(/-/g, "");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const events = rec.plan.milestones.map((m) => [
      "BEGIN:VEVENT", `UID:${rec.id}-${m.id}@du-nzo.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d(m.date)}`,
      `SUMMARY:${m.name}${m.estimate ? " (estimate)" : ""}`, "END:VEVENT",
    ].join("\r\n"));
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="iso-milestones-${rec.id}.ics"`);
    res.send(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DU-NZO//ISO Planner//EN", ...events, "END:VCALENDAR"].join("\r\n"));
  } catch (e) { next(e); }
});

app.post("/api/leads", rateLimit({ windowMs: 60_000, limit: 5 }), validate(Lead), async (req, res, next) => {
  try {
    const lead = await db.addLead({ id: newId(), ...req.valid, createdAt: new Date().toISOString() });
    // Email the lead to the DU-NZO inbox; never let a mail failure break the submission.
    notifyLead(lead).catch((err) => console.error("Lead notification failed:", err.message));
    res.status(201).json({ ok: true, id: lead.id });
  } catch (e) { next(e); }
});

/* Admin API */
app.get("/api/admin/leads", requireAdmin, async (_req, res, next) => {
  try { res.json(await db.listLeads()); } catch (e) { next(e); }
});
app.get("/api/admin/plans", requireAdmin, async (_req, res, next) => {
  try { res.json(await db.listPlans()); } catch (e) { next(e); }
});

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

/* Serve the built React app in production */
const dist = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { maxAge: "1h", index: false }));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

await connectDb();
app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
