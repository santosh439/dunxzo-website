// DU-NZO Platform API (Express port of the FastAPI preview backend).
import { Router } from "express";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import Anthropic from "@anthropic-ai/sdk";
import { ObjectId } from "mongodb";
import {
  seedControls, seedRisks, seedEvidence, seedFindings, computePulse, ALL_FRAMEWORKS,
  POLICY_TEMPLATES, VENDOR_TEMPLATES, AUDIT_META, AUDITOR_REQUEST_TEMPLATES,
} from "./workspaceSeed.js";
import { APP_NAME, putObject, getObject, mimeFor, humanSize } from "./objectStorage.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const uuid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const JWT_SECRET = () => process.env.JWT_SECRET;
const COPILOT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";
const COPILOT_SYSTEM =
  "You are the DU-NZO Copilot, an AI assistant embedded in the DU-NZO compliance platform covering " +
  "ISO/IEC 27001, SOC 2, DPDPA and ISO/IEC 42001. Help users understand their posture, draft policies, " +
  "explain controls, prioritise remediation and prepare for audits. Be concise and specific; cite control " +
  "IDs (e.g. A.5.15, CC6.1, DPDP-4). This is a sample workspace; do not invent private customer data.";

export function platformRouter(cols) {
  const { users, workspaces, invites, files, copilot } = cols;
  const r = Router();

  const signToken = (u) => jwt.sign({ sub: String(u._id), email: u.email, type: "access" }, JWT_SECRET(), { expiresIn: "7d" });
  const publicUser = (u) => ({ id: String(u._id), name: u.name || "", email: u.email || "", onboarded: !!u.onboarded });

  const auth = (req, res, next) => {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ detail: "Not authenticated" });
    try {
      const p = jwt.verify(token, JWT_SECRET());
      if (p.type !== "access") throw new Error("bad type");
      req.uid = p.sub;
      next();
    } catch {
      return res.status(401).json({ detail: "Invalid or expired session" });
    }
  };

  const optionalAuth = (req) => {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return null;
    try { return jwt.verify(token, JWT_SECRET()).sub; } catch { return null; }
  };

  const ObjectIdFn = ObjectId;
  const byId = (id) => ({ _id: new ObjectIdFn(id) });

  const workspaceView = (ws) => {
    const controls = ws.controls || [];
    const risks = (ws.risks || []).map((x) => ({ ...x, score: x.likelihood * x.impact }));
    return {
      profile: ws.profile || {}, controls, risks, pulse: computePulse(controls),
      evidence: ws.evidence || [], policies: ws.policies || [], vendors: ws.vendors || [],
      audit: ws.audit || {}, auditRequests: ws.auditRequests || [], findings: ws.findings || [],
      members: ws.members || [],
    };
  };
  const getWs = (uid) => workspaces.findOne({ userId: uid }, { projection: { _id: 0 } });
  const initials = (name, email) => {
    if (name && name.trim()) { const p = name.trim().split(/\s+/); return (p[0][0] + (p[1]?.[0] || "")).toUpperCase(); }
    return email.slice(0, 2).toUpperCase();
  };

  /* ---- Auth ---- */
  r.post("/auth/register", async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password || password.length < 6) return res.status(422).json({ detail: "Name, email and a 6+ char password are required" });
    const e = String(email).trim().toLowerCase();
    if (!e.includes("@")) return res.status(422).json({ detail: "Please enter a valid email address" });
    if (await users.findOne({ email: e })) return res.status(409).json({ detail: "An account with this email already exists" });
    const doc = { name: String(name).trim(), email: e, password_hash: await bcrypt.hash(password, 10), onboarded: false, createdAt: now() };
    const { insertedId } = await users.insertOne(doc);
    doc._id = insertedId;
    res.status(201).json({ token: signToken(doc), user: publicUser(doc) });
  });

  r.post("/auth/login", async (req, res) => {
    const { email, password } = req.body || {};
    const u = await users.findOne({ email: String(email || "").trim().toLowerCase() });
    if (!u || !(await bcrypt.compare(String(password || ""), u.password_hash || ""))) return res.status(401).json({ detail: "Incorrect email or password" });
    res.json({ token: signToken(u), user: publicUser(u) });
  });

  r.get("/auth/me", auth, async (req, res) => {
    const u = await users.findOne(byId(req.uid));
    if (!u) return res.status(401).json({ detail: "User not found" });
    res.json({ user: publicUser(u) });
  });

  /* ---- Workspace ---- */
  r.post("/onboarding", auth, async (req, res) => {
    const { company, frameworks = [], size = "" } = req.body || {};
    if (!company || !String(company).trim()) return res.status(422).json({ detail: "Company name is required" });
    const fw = frameworks.filter((f) => ALL_FRAMEWORKS.includes(f));
    const chosen = fw.length ? fw : ALL_FRAMEWORKS;
    const controls = seedControls(chosen);
    const ids = new Set(controls.map((c) => c.id));
    const ws = {
      userId: req.uid, profile: { company: String(company).trim(), frameworks: chosen, size },
      controls, risks: seedRisks(ids), evidence: seedEvidence(ids),
      policies: POLICY_TEMPLATES.map((p) => ({ ...p })), vendors: VENDOR_TEMPLATES.map((v) => ({ ...v })),
      audit: { ...AUDIT_META }, auditRequests: AUDITOR_REQUEST_TEMPLATES.map((a) => ({ ...a })),
      findings: seedFindings(ids), members: [], createdAt: now(),
    };
    await workspaces.replaceOne({ userId: req.uid }, ws, { upsert: true });
    await users.updateOne(byId(req.uid), { $set: { onboarded: true } });
    res.status(201).json(workspaceView(ws));
  });

  r.get("/workspace", auth, async (req, res) => {
    const ws = await getWs(req.uid);
    if (!ws) return res.status(404).json({ detail: "Workspace not set up yet" });
    res.json(workspaceView(ws));
  });

  r.patch("/workspace/controls/:id/review", auth, async (req, res) => {
    const ws = await getWs(req.uid);
    if (!ws) return res.status(404).json({ detail: "Workspace not found" });
    let found = false;
    ws.controls.forEach((c) => { if (c.id === req.params.id) { c.status = "operational"; c.lastTested = "Just now"; found = true; } });
    if (!found) return res.status(404).json({ detail: "Control not found" });
    await workspaces.updateOne({ userId: req.uid }, { $set: { controls: ws.controls } });
    res.json(workspaceView(ws));
  });

  r.patch("/workspace/controls/:id/owner", auth, async (req, res) => {
    const owner = String(req.body?.owner || "").trim().slice(0, 4).toUpperCase();
    if (!owner) return res.status(422).json({ detail: "Owner is required" });
    const ws = await getWs(req.uid);
    if (!ws) return res.status(404).json({ detail: "Workspace not found" });
    let found = false;
    ws.controls.forEach((c) => { if (c.id === req.params.id) { c.owner = owner; found = true; } });
    if (!found) return res.status(404).json({ detail: "Control not found" });
    await workspaces.updateOne({ userId: req.uid }, { $set: { controls: ws.controls } });
    res.json(workspaceView(ws));
  });

  r.patch("/workspace/risks/:id/accept", auth, async (req, res) => {
    const ws = await getWs(req.uid);
    if (!ws) return res.status(404).json({ detail: "Workspace not found" });
    let found = false;
    ws.risks.forEach((x) => { if (x.id === req.params.id) { x.status = "accepted"; found = true; } });
    if (!found) return res.status(404).json({ detail: "Risk not found" });
    await workspaces.updateOne({ userId: req.uid }, { $set: { risks: ws.risks } });
    res.json(workspaceView(ws));
  });

  r.patch("/workspace/audit/requests/:id/submit", auth, async (req, res) => {
    const ws = await getWs(req.uid);
    if (!ws) return res.status(404).json({ detail: "Workspace not found" });
    let found = false;
    (ws.auditRequests || []).forEach((a) => { if (a.id === req.params.id) { a.status = "submitted"; a.collected = a.total; found = true; } });
    if (!found) return res.status(404).json({ detail: "Request not found" });
    await workspaces.updateOne({ userId: req.uid }, { $set: { auditRequests: ws.auditRequests } });
    res.json(workspaceView(ws));
  });

  /* ---- Evidence uploads ---- */
  r.post("/workspace/evidence", auth, upload.single("file"), async (req, res) => {
    const ws = await getWs(req.uid);
    if (!ws) return res.status(404).json({ detail: "Workspace not found" });
    if (!req.file || !req.file.buffer.length) return res.status(400).json({ detail: "The file is empty" });
    const control = req.query.control || "—";
    const ext = (req.file.originalname.split(".").pop() || "bin").toLowerCase();
    const path = `${APP_NAME}/uploads/${req.uid}/${uuid()}.${ext}`;
    const contentType = req.file.mimetype || mimeFor(req.file.originalname);
    let result;
    try { result = await putObject(path, req.file.buffer, contentType); }
    catch { return res.status(502).json({ detail: "Upload failed, please try again" }); }
    const fileId = uuid();
    await files.insertOne({ id: fileId, userId: req.uid, storage_path: result.path || path, original_filename: req.file.originalname, content_type: contentType, size: req.file.size, is_deleted: false, created_at: now() });
    const entry = { name: req.file.originalname, control, owner: "You", type: ext.toUpperCase(), size: humanSize(req.file.size), updated: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), freshness: "fresh", fileId };
    const evidence = ws.evidence || [];
    evidence.unshift(entry);
    await workspaces.updateOne({ userId: req.uid }, { $set: { evidence } });
    res.status(201).json(workspaceView({ ...ws, evidence }));
  });

  r.get("/workspace/evidence/:fileId/download", auth, async (req, res) => {
    const rec = await files.findOne({ id: req.params.fileId, userId: req.uid, is_deleted: false });
    if (!rec) return res.status(404).json({ detail: "File not found" });
    let obj;
    try { obj = await getObject(rec.storage_path); } catch { return res.status(502).json({ detail: "Download failed" }); }
    res.setHeader("Content-Type", rec.content_type || obj.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${rec.original_filename}"`);
    res.send(obj.data);
  });

  /* ---- Team invites ---- */
  r.post("/workspace/invites", auth, async (req, res) => {
    const ws = await getWs(req.uid);
    if (!ws) return res.status(404).json({ detail: "Workspace not found" });
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email.includes("@")) return res.status(422).json({ detail: "Please enter a valid email address" });
    const token = crypto.randomBytes(16).toString("hex");
    const inv = { id: uuid(), token, ownerUserId: req.uid, email, role: req.body?.role || "member", status: "pending", createdAt: now() };
    await invites.insertOne(inv);
    res.status(201).json({ id: inv.id, email, role: inv.role, status: "pending", token, createdAt: inv.createdAt });
  });

  r.get("/workspace/invites", auth, async (req, res) => {
    const list = await invites.find({ ownerUserId: req.uid }, { projection: { _id: 0, ownerUserId: 0 } }).sort({ createdAt: -1 }).toArray();
    res.json(list);
  });

  r.get("/invites/:token", async (req, res) => {
    const inv = await invites.findOne({ token: req.params.token });
    if (!inv) return res.status(404).json({ detail: "This invite link is invalid or has expired" });
    const ws = await workspaces.findOne({ userId: inv.ownerUserId }, { projection: { profile: 1 } });
    res.json({ id: inv.id, email: inv.email, role: inv.role, status: inv.status, company: ws?.profile?.company || "a DU-NZO workspace" });
  });

  r.post("/invites/:token/accept", auth, async (req, res) => {
    const inv = await invites.findOne({ token: req.params.token });
    if (!inv) return res.status(404).json({ detail: "This invite link is invalid or has expired" });
    if (inv.status === "accepted") return res.status(409).json({ detail: "This invite has already been accepted" });
    const u = await users.findOne(byId(req.uid));
    const ws = await getWs(inv.ownerUserId);
    if (!ws) return res.status(404).json({ detail: "Workspace no longer exists" });
    const members = ws.members || [];
    if (!members.some((m) => m.userId === req.uid)) {
      members.push({ userId: req.uid, name: u.name || "", email: u.email || "", role: inv.role, initials: initials(u.name || "", u.email || ""), joinedAt: now() });
      await workspaces.updateOne({ userId: inv.ownerUserId }, { $set: { members } });
    }
    await invites.updateOne({ token: req.params.token }, { $set: { status: "accepted", acceptedBy: req.uid } });
    res.json({ ok: true, company: ws.profile?.company || "" });
  });

  /* ---- Copilot (Anthropic, production) ---- */
  r.post("/copilot/chat", async (req, res) => {
    const { session_id, message } = req.body || {};
    if (!session_id || !message) return res.status(422).json({ detail: "session_id and message are required" });
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ detail: "Copilot is not configured (set ANTHROPIC_API_KEY)" });

    let workspaceContext = "";
    const uid = optionalAuth(req);
    if (uid) {
      const ws = await getWs(uid);
      if (ws) {
        const pulse = computePulse(ws.controls || []);
        const needs = (ws.controls || []).filter((c) => ["missing", "attention", "draft"].includes(c.status));
        const top = [...(ws.risks || [])].sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact).slice(0, 5);
        workspaceContext = `\n\n=== THE USER'S LIVE WORKSPACE ===\nCompany: ${ws.profile?.company} | Frameworks: ${(ws.profile?.frameworks || []).join(", ")}\n` +
          `Trust Pulse: ${pulse.score}/100 (${pulse.operational} operational, ${pulse.attention} attention, ${pulse.missing} missing, ${pulse.draft} draft of ${pulse.total}).\n` +
          `Controls needing work: ${needs.map((c) => `${c.id} ${c.title} [${c.status}]`).join("; ")}\n` +
          `Top risks: ${top.map((rk) => `${rk.id} ${rk.title} (L${rk.likelihood}xI${rk.impact}, ${rk.status})`).join("; ")}\n`;
      }
    }

    await copilot.insertOne({ session_id, role: "user", content: message, createdAt: now() });
    const history = await copilot.find({ session_id }, { projection: { _id: 0, role: 1, content: 1 } }).sort({ createdAt: 1 }).limit(200).toArray();
    const msgs = history.slice(-9).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    let full = "";
    try {
      const stream = await client.messages.stream({ model: COPILOT_MODEL, max_tokens: 1024, system: COPILOT_SYSTEM + workspaceContext, messages: msgs });
      for await (const ev of stream) {
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
          full += ev.delta.text;
          res.write(`data: ${JSON.stringify({ delta: ev.delta.text })}\n\n`);
        }
      }
    } catch (e) {
      res.write(`data: ${JSON.stringify({ error: "Copilot ran into an issue. Please try again." })}\n\n`);
    }
    if (full) await copilot.insertOne({ session_id, role: "assistant", content: full, createdAt: now() });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  });

  return r;
}
