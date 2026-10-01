import { test } from "node:test";
import assert from "node:assert/strict";
import { generatePlan, progressOf } from "./planEngine.js";

test("baseline ISO 27001 plan has ordered certification phases", () => {
  const plan = generatePlan({ startDate: "2026-10-05" });
  const ids = plan.phases.map((p) => p.id);
  assert.ok(ids.includes("stage1") && ids.includes("stage2"));
  const s1 = plan.phases.find((p) => p.id === "stage1");
  const s2 = plan.phases.find((p) => p.id === "stage2");
  assert.ok(s2.startWeek >= s1.endWeek, "stage 2 follows stage 1");
  assert.equal(plan.milestones.length, 9);
});

test("ISO 27701 adds privacy phases and a longer plan", () => {
  const a = generatePlan({ startDate: "2026-10-05" });
  const b = generatePlan({ startDate: "2026-10-05", frameworks: ["iso27701"] });
  assert.ok(b.phases.some((p) => p.id === "privacy_build"));
  assert.ok(b.summary.effortDays > a.summary.effortDays);
});

test("maturity changes duration", () => {
  const none = generatePlan({ maturity: "none", startDate: "2026-10-05" });
  const est = generatePlan({ maturity: "established", startDate: "2026-10-05" });
  assert.ok(none.summary.totalWeeks > est.summary.totalWeeks);
});

test("tight target date raises a high risk", () => {
  const plan = generatePlan({ startDate: "2026-10-05", targetDate: "2026-12-01" });
  assert.equal(plan.risks[0].level, "high");
});

test("progress is computed from done ids", () => {
  const plan = generatePlan({});
  const first = plan.phases[0].tasks.map((t) => t.id);
  const p = progressOf(plan, first);
  assert.equal(p.completed, first.length);
});

test("invalid input is normalised", () => {
  const plan = generatePlan({ employees: "x", sites: -4, startDate: "nope", frameworks: ["bad"] });
  assert.equal(plan.input.employees, "51-250");
  assert.equal(plan.input.sites, 1);
  assert.deepEqual(plan.input.frameworks, ["iso27001"]);
});
