/**
 * API client with an offline fallback.
 * When the Express API is reachable, plans and leads are stored on the server.
 * When it is not (static hosting, demo build), the shared plan engine runs in the
 * browser and data is kept in localStorage, so every feature still works.
 */
import { generatePlan, progressOf } from "@shared/planEngine.js";

const BASE = import.meta.env.VITE_API_URL || "";
const FORCE_OFFLINE = import.meta.env.VITE_OFFLINE === "true";
const KEY = "dunzo.v1";

let online = null;
async function isOnline() {
  if (FORCE_OFFLINE) return false;
  if (online !== null) return online;
  try {
    const r = await fetch(`${BASE}/api/health`, { cache: "no-store" });
    online = r.ok && (await r.json()).ok === true;
  } catch { online = false; }
  return online;
}

function readStore() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { plans: {}, leads: [] }; } catch { return { plans: {}, leads: [] }; }
}
function writeStore(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable, keep in memory */ }
}
const memory = readStore();
const save = () => writeStore(memory);
const newId = () => Math.random().toString(36).slice(2, 10);
const view = (rec) => ({ ...rec, progress: progressOf(rec.plan, rec.done) });

async function request(path, options = {}) {
  const r = await fetch(`${BASE}${path}`, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || `Request failed (${r.status})`);
  return body;
}

export const api = {
  mode: async () => ((await isOnline()) ? "server" : "browser"),

  async createPlan(input) {
    if (await isOnline()) return request("/api/plans", { method: "POST", body: JSON.stringify(input) });
    const now = new Date().toISOString();
    const rec = { id: newId(), plan: generatePlan(input), done: [], createdAt: now, updatedAt: now };
    memory.plans[rec.id] = rec; save();
    return view(rec);
  },

  async getPlan(id) {
    if (await isOnline()) return request(`/api/plans/${encodeURIComponent(id)}`);
    const rec = memory.plans[id];
    if (!rec) throw new Error("Plan not found");
    return view(rec);
  },

  async setTask(id, taskId, done) {
    if (await isOnline()) return request(`/api/plans/${encodeURIComponent(id)}/tasks`, { method: "PATCH", body: JSON.stringify({ taskId, done }) });
    const rec = memory.plans[id];
    const set = new Set(rec.done);
    if (done) set.add(taskId); else set.delete(taskId);
    rec.done = [...set]; rec.updatedAt = new Date().toISOString(); save();
    return view(rec);
  },

  async sendLead(lead) {
    if (await isOnline()) return request("/api/leads", { method: "POST", body: JSON.stringify(lead) });
    memory.leads.unshift({ id: newId(), ...lead, createdAt: new Date().toISOString() }); save();
    return { ok: true };
  },

  async admin(kind, token) {
    if (await isOnline()) return request(`/api/admin/${kind}`, { headers: { Authorization: `Bearer ${token}` } });
    if (kind === "leads") return memory.leads;
    return Object.values(memory.plans).map(({ id, createdAt, plan, done }) => ({ id, createdAt, company: plan.input.company, frameworks: plan.input.frameworks, certificationDate: plan.summary.certificationDate, done: done.length, total: plan.summary.taskCount }));
  },
};

/* Client side exports work in every mode */
function download(name, type, text) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export function exportCsv(rec) {
  const done = new Set(rec.done);
  const rows = [["Phase", "Task", "Owner", "Reference", "Deliverable", "Start", "End", "Status"]];
  for (const p of rec.plan.phases) for (const t of p.tasks) rows.push([p.name, t.title, t.owner, t.ref, t.deliverable, p.startDate, p.endDate, done.has(t.id) ? "Done" : "Open"]);
  download(`iso-plan-${rec.id}.csv`, "text/csv;charset=utf-8", rows.map((r) => r.map(cell).join(",")).join("\r\n"));
}

export function exportIcs(rec) {
  const d = (s) => s.replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const ev = rec.plan.milestones.map((m) => ["BEGIN:VEVENT", `UID:${rec.id}-${m.id}@du-nzo.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d(m.date)}`, `SUMMARY:${m.name}${m.estimate ? " (estimate)" : ""}`, "END:VEVENT"].join("\r\n"));
  download(`iso-milestones-${rec.id}.ics`, "text/calendar;charset=utf-8", ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DU-NZO//ISO Planner//EN", ...ev, "END:VCALENDAR"].join("\r\n"));
}

export const fmtDate = (iso, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { timeZone: "UTC", ...opts });
