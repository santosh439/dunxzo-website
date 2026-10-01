import { test } from "node:test";
import assert from "node:assert/strict";
import { ASSESSMENTS, scoreAssessment } from "./assessments.js";
import { buildRoadmap, LP_QUESTIONS } from "./launchpad.js";
import { assessVendor, estimateCost, generateRisks, RISK_LIBRARY, checkPolicies } from "./tools.js";

test("every assessment scores 0 to 100 and maps levels", () => {
  for (const id of Object.keys(ASSESSMENTS)) {
    const low = scoreAssessment(id, {});
    assert.equal(low.overall, 0); assert.equal(low.level.level, 1);
    const full = Object.fromEntries(ASSESSMENTS[id].domains.map((d) => [d.id, d.questions.map(() => 3)]));
    const hi = scoreAssessment(id, full);
    assert.equal(hi.overall, 100); assert.equal(hi.level.name, "Continuously Improved"); assert.equal(hi.gaps.length, 0);
  }
});
test("GCC assessment covers 15 domains", () => assert.equal(ASSESSMENTS.gcc.domains.length, 15));
test("launchpad has 13 questions and recommends SOC 2 for North American enterprise", () => {
  assert.equal(LP_QUESTIONS.length, 13);
  const r = buildRoadmap({ country: "United States", markets: ["North America"], customers: ["Enterprises"], personal: "None", ai: "Not at all" });
  assert.equal(r.primary.slug, "soc-2");
  assert.ok(!r.frameworks.some((f) => f.slug === "gdpr"));
});
test("launchpad flags GDPR, DPDPA and ISO 42001 when relevant", () => {
  const r = buildRoadmap({ country: "India", markets: ["India", "Europe and UK"], ai: "We build or train our own models" });
  const s = r.frameworks.map((f) => f.slug);
  for (const x of ["gdpr", "dpdpa", "iso-42001", "iso-27001", "eu-ai-act"]) assert.ok(s.includes(x), x);
  assert.ok(r.phases.length === 6 && r.totalWeeks > 0);
});
test("launchpad marks held certifications and warns on tight timelines", () => {
  const r = buildRoadmap({ certs: ["ISO/IEC 27001"], timeline: "Within 3 months", controls: [] });
  assert.ok(r.frameworks.find((f) => f.slug === "iso-27001")?.held);
  assert.ok(r.timelineRisk);
});
test("vendor tiers range from Low to Critical", () => {
  assert.equal(assessVendor({}).tier, "Low");
  assert.equal(assessVendor({ data: 3, access: 3, critical: 2, assurance: 3, location: 2, subs: 2, history: 2 }).tier, "Critical");
});
test("cost estimate shares effort across frameworks", () => {
  const one = estimateCost({ frameworks: ["iso-27001"] });
  const two = estimateCost({ frameworks: ["iso-27001", "soc-2"], dayRate: 1000 });
  assert.ok(two.consultantDays[1] < one.consultantDays[1] * 2);
  assert.ok(two.savings > 0 && two.cost[0] > 0);
  assert.equal(estimateCost({ frameworks: [] }), null);
});
test("risk generator scores and rates", () => {
  const r = generateRisks([RISK_LIBRARY[0].asset]);
  assert.equal(r.length, RISK_LIBRARY[0].scenarios.length);
  assert.equal(r[0].score, r[0].likelihood * r[0].impact);
});
test("policy checker finds missing policies", () => {
  const r = checkPolicies(["iso42001"], ["AI policy"]);
  assert.equal(r.missing.length, r.expected - 1);
});
