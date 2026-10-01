/**
 * Tiny JSON file store so the project runs with zero setup.
 * Swap this module for Postgres, MySQL or MongoDB in production;
 * the rest of the API only uses the functions exported here.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data");
const file = path.join(dir, "db.json");
fs.mkdirSync(dir, { recursive: true });

let state = { plans: {}, leads: [] };
if (fs.existsSync(file)) {
  try { state = JSON.parse(fs.readFileSync(file, "utf8")); } catch { /* start fresh on a corrupt file */ }
}

let timer = null;
function persist() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const tmp = file + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
    fs.renameSync(tmp, file);
  }, 50);
}

export const db = {
  createPlan(record) { state.plans[record.id] = record; persist(); return record; },
  getPlan(id) { return state.plans[id] || null; },
  updatePlan(id, patch) {
    const rec = state.plans[id];
    if (!rec) return null;
    Object.assign(rec, patch, { updatedAt: new Date().toISOString() });
    persist();
    return rec;
  },
  listPlans() {
    return Object.values(state.plans)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(({ id, createdAt, updatedAt, plan, done }) => ({ id, createdAt, updatedAt, company: plan.input.company, frameworks: plan.input.frameworks, certificationDate: plan.summary.certificationDate, done: done.length, total: plan.summary.taskCount }));
  },
  addLead(lead) { state.leads.unshift(lead); persist(); return lead; },
  listLeads() { return state.leads; },
};
