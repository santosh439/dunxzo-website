/**
 * ISO certification journey plan engine.
 * Pure functions, no dependencies. Used by the API (authoritative) and by the
 * web client as an offline fallback, so both always produce identical plans.
 *
 * Planning figures are consultancy estimates, not certification body rules.
 * Review and adjust the constants below to match your own delivery method.
 */

export const OPTIONS = {
  employees: [
    { value: "1-50", label: "1 to 50", factor: 0.8 },
    { value: "51-250", label: "51 to 250", factor: 1.0 },
    { value: "251-1000", label: "251 to 1,000", factor: 1.3 },
    { value: "1000+", label: "More than 1,000", factor: 1.6 },
  ],
  maturity: [
    { value: "none", label: "Starting from scratch", hint: "Few written policies, controls are informal", factor: 1.3, operateWeeks: 12 },
    { value: "basic", label: "Some foundations", hint: "Core policies exist, controls partly in place", factor: 1.0, operateWeeks: 8 },
    { value: "established", label: "Well established", hint: "Documented controls, need formal ISMS and audit", factor: 0.7, operateWeeks: 6 },
  ],
  hosting: [
    { value: "cloud", label: "Cloud native", factor: 0.9 },
    { value: "hybrid", label: "Hybrid", factor: 1.0 },
    { value: "onprem", label: "Mostly on premises", factor: 1.15 },
  ],
  frameworks: [
    { value: "iso27001", label: "ISO/IEC 27001", required: true },
    { value: "iso27701", label: "ISO/IEC 27701:2025" },
  ],
  alignments: [
    { value: "gdpr", label: "GDPR alignment" },
    { value: "soc2", label: "SOC 2 bridge" },
  ],
};

const T = (id, title, owner, ref, deliverable) => ({ id, title, owner, ref, deliverable });

/** Phase library. baseWeeks and baseEffort (person days) assume 51 to 250 staff with some foundations. */
const PHASES = [
  {
    id: "mobilise", name: "Mobilise and scope", group: "Plan", baseWeeks: 2, baseEffort: 6,
    deps: [], refs: "Clauses 4, 5",
    tasks: [
      T("m1", "Appoint the ISMS owner and a steering group", "Leadership", "5.1, 5.3", "Roles and responsibilities record"),
      T("m2", "Document internal and external issues", "ISMS owner", "4.1", "Context of the organisation"),
      T("m3", "Identify interested parties and their requirements", "ISMS owner", "4.2", "Interested parties register"),
      T("m4", "Define the ISMS scope and boundaries", "ISMS owner", "4.3", "Scope statement"),
      T("m5", "Shortlist accredited certification bodies and request quotes", "ISMS owner", "", "Certification body selected"),
    ],
  },
  {
    id: "gap", name: "Gap assessment", group: "Plan", baseWeeks: 2, baseEffort: 8,
    deps: ["mobilise"], refs: "Clauses 4 to 10, Annex A",
    tasks: [
      T("g1", "Assess the management system clauses 4 to 10", "Consultant", "4 to 10", "Clause gap report"),
      T("g2", "Assess all 93 Annex A controls", "Consultant", "Annex A", "Control gap report"),
      T("g3", "Build an information asset inventory", "IT lead", "A.5.9", "Asset register"),
      T("g4", "Prioritise gaps into a remediation roadmap", "ISMS owner", "", "Gap register and roadmap"),
    ],
  },
  {
    id: "risk", name: "Risk assessment and treatment", group: "Plan", baseWeeks: 3, baseEffort: 10,
    deps: ["gap"], refs: "Clause 6",
    tasks: [
      T("r1", "Define risk method and acceptance criteria", "ISMS owner", "6.1.2", "Risk methodology"),
      T("r2", "Identify, analyse and evaluate information security risks", "Risk owners", "6.1.2, 8.2", "Risk register"),
      T("r3", "Prepare the risk treatment plan", "ISMS owner", "6.1.3, 8.3", "Risk treatment plan"),
      T("r4", "Produce the Statement of Applicability", "ISMS owner", "6.1.3 d", "Statement of Applicability"),
      T("r5", "Obtain risk owner approval of residual risk", "Risk owners", "6.1.3 f", "Signed approval"),
      T("r6", "Set measurable information security objectives", "Leadership", "6.2", "Objectives and plan"),
    ],
  },
  {
    id: "policy", name: "Policies and documentation", group: "Build", baseWeeks: 4, baseEffort: 12,
    deps: ["risk"], overlap: 1, refs: "Clauses 5.2, 7.5, Annex A.5",
    tasks: [
      T("p1", "Approve the information security policy", "Leadership", "5.2", "Information security policy"),
      T("p2", "Write topic specific policies", "ISMS owner", "A.5.1", "Policy set"),
      T("p3", "Set up document and record control", "ISMS owner", "7.5", "Document control procedure"),
      T("p4", "Define incident management procedure", "Security lead", "A.5.24 to A.5.28", "Incident procedure"),
      T("p5", "Plan information security during disruption", "IT lead", "A.5.29, A.5.30", "Continuity plan"),
      T("p6", "Define supplier security requirements", "Procurement", "A.5.19 to A.5.22", "Supplier policy and register"),
    ],
  },
  {
    id: "implement", name: "Control implementation", group: "Build", baseWeeks: 8, baseEffort: 30,
    deps: ["risk"], refs: "Clause 8, Annex A",
    tasks: [
      T("i1", "Enforce access control, MFA and joiner mover leaver process", "IT lead", "A.5.15 to A.5.18, A.8.5", "Access control records"),
      T("i2", "Harden and baseline system configuration", "IT lead", "A.8.9", "Configuration baselines"),
      T("i3", "Enable logging and security monitoring", "Security lead", "A.8.15, A.8.16", "Logging standard and alerts"),
      T("i4", "Implement and test backups", "IT lead", "A.8.13", "Backup test records"),
      T("i5", "Run vulnerability management", "Security lead", "A.8.8", "Scan and patch records"),
      T("i6", "Embed secure development practices", "Engineering", "A.8.25 to A.8.29", "SDLC standard"),
      T("i7", "Apply cryptography standard", "Engineering", "A.8.24", "Cryptography standard"),
      T("i8", "Screening and security terms in employment", "HR", "A.6.1, A.6.2", "HR security records"),
      T("i9", "Secure offices and equipment", "Facilities", "A.7", "Physical security checklist"),
    ],
  },
  {
    id: "people", name: "Awareness and competence", group: "Build", baseWeeks: 2, baseEffort: 5,
    deps: ["policy"], refs: "Clause 7",
    tasks: [
      T("a1", "Define required competence for key roles", "HR", "7.2", "Competence matrix"),
      T("a2", "Deliver security awareness training to all staff", "Security lead", "7.3, A.6.3", "Training records"),
      T("a3", "Agree the internal and external communication plan", "ISMS owner", "7.4", "Communication plan"),
    ],
  },
  {
    id: "operate", name: "Operate and collect evidence", group: "Run", fixedByMaturity: true, baseEffort: 12,
    deps: ["implement", "people", "privacy_build"], refs: "Clauses 8, 9.1",
    tasks: [
      T("o1", "Operate controls and retain records", "Control owners", "8.1", "Operational records"),
      T("o2", "Measure and report ISMS performance", "ISMS owner", "9.1", "Metrics dashboard"),
      T("o3", "Run a quarterly access review", "IT lead", "A.5.18", "Access review evidence"),
      T("o4", "Run an incident response exercise", "Security lead", "A.5.24", "Exercise report"),
      T("o5", "Review key suppliers", "Procurement", "A.5.22", "Supplier review records"),
    ],
  },
  {
    id: "internal_audit", name: "Internal audit", group: "Run", baseWeeks: 2, baseEffort: 6,
    deps: ["operate"], overlap: 2, refs: "Clause 9.2",
    tasks: [
      T("ia1", "Plan the internal audit programme", "ISMS owner", "9.2.2", "Audit programme"),
      T("ia2", "Conduct the audit with an independent auditor", "Consultant", "9.2", "Internal audit report"),
      T("ia3", "Log nonconformities and observations", "ISMS owner", "10.2", "Findings register"),
    ],
  },
  {
    id: "review", name: "Management review and corrective action", group: "Run", baseWeeks: 2, baseEffort: 4,
    deps: ["internal_audit"], refs: "Clauses 9.3, 10",
    tasks: [
      T("mr1", "Hold the management review", "Leadership", "9.3", "Management review minutes"),
      T("mr2", "Close corrective actions", "Control owners", "10.2", "Corrective action evidence"),
      T("mr3", "Record improvement opportunities", "ISMS owner", "10.1", "Improvement log"),
    ],
  },
  {
    id: "stage1", name: "Stage 1 audit", group: "Certify", baseWeeks: 1, fixed: true, baseEffort: 3,
    deps: ["review"], refs: "Certification body",
    tasks: [
      T("s1a", "Submit ISMS documentation to the certification body", "ISMS owner", "", "Document pack"),
      T("s1b", "Stage 1 readiness review by the auditor", "Certification body", "", "Stage 1 report"),
      T("s1c", "Resolve Stage 1 areas of concern", "ISMS owner", "", "Action evidence"),
    ],
  },
  {
    id: "stage2", name: "Stage 2 certification audit", group: "Certify", baseWeeks: 1, fixed: true, lag: 4, baseEffort: 4,
    deps: ["stage1"], refs: "Certification body",
    tasks: [
      T("s2a", "Stage 2 audit of implementation and effectiveness", "Certification body", "", "Stage 2 report"),
      T("s2b", "Submit corrective action plans for any findings", "ISMS owner", "10.2", "Corrective action plan"),
      T("s2c", "Certification decision and certificate issued", "Certification body", "", "ISO/IEC 27001 certificate"),
    ],
  },
];

const PRIVACY_PHASES = [
  {
    id: "privacy_scope", name: "Privacy scoping and PII inventory", group: "Plan", baseWeeks: 3, baseEffort: 9,
    deps: ["gap"], refs: "ISO/IEC 27701",
    tasks: [
      T("x1", "Determine controller and processor roles", "Privacy lead", "ISO/IEC 27701", "Role determination"),
      T("x2", "Map PII flows and create records of processing", "Privacy lead", "ISO/IEC 27701", "Records of processing"),
      T("x3", "Extend the risk assessment to privacy risks", "Privacy lead", "ISO/IEC 27701", "Privacy risk register"),
    ],
  },
  {
    id: "privacy_build", name: "Privacy controls implementation", group: "Build", baseWeeks: 4, baseEffort: 12,
    deps: ["privacy_scope", "risk"], refs: "ISO/IEC 27701",
    tasks: [
      T("x4", "Publish privacy notices and consent handling", "Privacy lead", "ISO/IEC 27701", "Privacy notices"),
      T("x5", "Implement data subject request process", "Privacy lead", "ISO/IEC 27701", "Request procedure and log"),
      T("x6", "Update processor agreements with PII clauses", "Legal", "ISO/IEC 27701", "Signed agreements"),
      T("x7", "Define retention and disposal of PII", "Privacy lead", "ISO/IEC 27701", "Retention schedule"),
    ],
  },
];

const ALIGNMENT_PHASES = {
  gdpr: {
    id: "gdpr", name: "GDPR alignment", group: "Build", baseWeeks: 3, baseEffort: 8,
    deps: ["gap"], refs: "GDPR",
    tasks: [
      T("gd1", "Maintain records of processing activities", "Privacy lead", "GDPR Art. 30", "RoPA"),
      T("gd2", "Run DPIAs for high risk processing", "Privacy lead", "GDPR Art. 35", "DPIA reports"),
      T("gd3", "Set up 72 hour breach notification process", "Security lead", "GDPR Art. 33", "Breach procedure"),
      T("gd4", "Assess whether a DPO is required", "Legal", "GDPR Art. 37", "DPO assessment"),
      T("gd5", "Assess international data transfers", "Legal", "GDPR Chapter V", "Transfer assessments"),
    ],
  },
  soc2: {
    id: "soc2", name: "SOC 2 bridge", group: "Run", baseWeeks: 3, baseEffort: 8,
    deps: ["implement"], refs: "AICPA Trust Services Criteria",
    tasks: [
      T("sc1", "Map ISMS controls to the Trust Services Criteria", "Consultant", "TSC", "Control mapping"),
      T("sc2", "Draft the system description", "ISMS owner", "SOC 2", "System description"),
      T("sc3", "Select a licensed CPA firm", "ISMS owner", "SOC 2", "Auditor engagement letter"),
      T("sc4", "Complete Type I readiness review", "Consultant", "SOC 2", "Readiness report"),
    ],
  },
};

export const MANDATORY_DOCUMENTS = [
  ["ISMS scope", "4.3"],
  ["Information security policy", "5.2"],
  ["Risk assessment process", "6.1.2"],
  ["Risk treatment process", "6.1.3"],
  ["Statement of Applicability", "6.1.3 d"],
  ["Information security objectives", "6.2"],
  ["Evidence of competence", "7.2"],
  ["Documented information required by the ISMS", "7.5.1 b"],
  ["Operational planning and control", "8.1"],
  ["Risk assessment results", "8.2"],
  ["Risk treatment results", "8.3"],
  ["Monitoring and measurement results", "9.1"],
  ["Internal audit programme and results", "9.2"],
  ["Management review results", "9.3"],
  ["Nonconformities and corrective actions", "10.2"],
];

export const ANNEX_A_THEMES = [
  { theme: "Organisational", clause: "A.5", controls: 37 },
  { theme: "People", clause: "A.6", controls: 8 },
  { theme: "Physical", clause: "A.7", controls: 14 },
  { theme: "Technological", clause: "A.8", controls: 34 },
];

const pick = (list, value, fallbackIndex = 1) => list.find((o) => o.value === value) || list[fallbackIndex];

const addDays = (iso, days) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const addMonths = (iso, months) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
};
const weeksBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / (7 * 864e5));

export function normaliseInput(raw = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const frameworks = Array.from(new Set(["iso27001", ...(raw.frameworks || [])])).filter((f) => ["iso27001", "iso27701"].includes(f));
  const alignments = (raw.alignments || []).filter((a) => ALIGNMENT_PHASES[a]);
  const validDate = (s) => (typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s)) ? s : null);
  return {
    company: String(raw.company || "Your organisation").slice(0, 120),
    employees: pick(OPTIONS.employees, raw.employees).value,
    maturity: pick(OPTIONS.maturity, raw.maturity).value,
    hosting: pick(OPTIONS.hosting, raw.hosting).value,
    sites: Math.min(50, Math.max(1, parseInt(raw.sites, 10) || 1)),
    frameworks,
    alignments,
    startDate: validDate(raw.startDate) || today,
    targetDate: validDate(raw.targetDate),
  };
}

export function generatePlan(rawInput) {
  const input = normaliseInput(rawInput);
  const size = pick(OPTIONS.employees, input.employees);
  const mat = pick(OPTIONS.maturity, input.maturity);
  const host = pick(OPTIONS.hosting, input.hosting);
  const siteFactor = Math.min(1.3, 1 + 0.05 * (input.sites - 1));
  const durFactor = size.factor * mat.factor * host.factor * siteFactor;
  const effortFactor = durFactor * (0.85 + 0.15 * size.factor);

  let library = [...PHASES];
  const withPrivacy = input.frameworks.includes("iso27701");
  if (withPrivacy) library.splice(3, 0, ...PRIVACY_PHASES);
  for (const a of input.alignments) {
    if (a === "gdpr" && withPrivacy) {
      // GDPR tasks fold into the privacy workstream instead of a separate phase.
      const scope = library.find((p) => p.id === "privacy_scope");
      library = library.map((p) => (p === scope ? { ...p, name: "Privacy scoping, PII inventory and GDPR", tasks: [...p.tasks, ...ALIGNMENT_PHASES.gdpr.tasks.filter((t) => t.id !== "gd1")] } : p));
    } else {
      library.splice(library.findIndex((p) => p.id === "operate"), 0, ALIGNMENT_PHASES[a]);
    }
  }
  if (!withPrivacy && input.hosting === "cloud") {
    library = library.map((p) => (p.id === "implement" ? { ...p, tasks: p.tasks.map((t) => (t.id === "i9" ? { ...t, title: "Secure offices and devices, rely on provider for data centres" } : t)) } : p));
  }

  const ids = new Set(library.map((p) => p.id));
  const end = {};
  const phases = [];
  for (const p of library) {
    const weeks = p.fixed ? p.baseWeeks : p.fixedByMaturity ? mat.operateWeeks : Math.max(1, Math.round(p.baseWeeks * durFactor));
    const depEnds = p.deps.filter((d) => ids.has(d)).map((d) => end[d] ?? 0);
    const startWeek = Math.max(0, (depEnds.length ? Math.max(...depEnds) : 0) - (p.overlap || 0) + (p.lag || 0));
    const endWeek = startWeek + weeks;
    end[p.id] = endWeek;
    phases.push({
      id: p.id, name: p.name, group: p.group, refs: p.refs,
      startWeek, endWeek, weeks,
      startDate: addDays(input.startDate, startWeek * 7),
      endDate: addDays(input.startDate, endWeek * 7 - 1),
      effortDays: Math.round(p.baseEffort * (p.fixed ? 1 : effortFactor)),
      tasks: p.tasks.map((t) => ({ ...t, id: `${p.id}.${t.id}`, done: false })),
    });
  }

  const totalWeeks = Math.max(...phases.map((p) => p.endWeek));
  const stage1 = phases.find((p) => p.id === "stage1");
  const stage2 = phases.find((p) => p.id === "stage2");
  const certificationDate = addDays(stage2.endDate, 28);
  const effortDays = phases.reduce((s, p) => s + p.effortDays, 0);

  const milestones = [
    { id: "kickoff", name: "Project kickoff", date: input.startDate },
    { id: "soa", name: "Statement of Applicability approved", date: phases.find((p) => p.id === "risk").endDate },
    { id: "ia", name: "Internal audit complete", date: phases.find((p) => p.id === "internal_audit").endDate },
    { id: "stage1", name: "Stage 1 audit", date: stage1.startDate },
    { id: "stage2", name: "Stage 2 audit", date: stage2.startDate },
    { id: "cert", name: "Expected certification", date: certificationDate, estimate: true },
    { id: "surv1", name: "First surveillance audit", date: addMonths(certificationDate, 12), estimate: true },
    { id: "surv2", name: "Second surveillance audit", date: addMonths(certificationDate, 24), estimate: true },
    { id: "recert", name: "Recertification audit", date: addMonths(certificationDate, 34), estimate: true },
  ];

  const risks = [];
  if (input.targetDate) {
    const gap = weeksBetween(input.targetDate, stage2.endDate);
    if (gap > 0) {
      risks.push({ level: "high", title: `Target date is about ${gap} weeks earlier than this plan`, detail: "Consider narrowing the scope, adding internal capacity, or booking the certification body early to protect audit dates." });
    } else {
      risks.push({ level: "ok", title: "Target date is achievable", detail: `This plan finishes Stage 2 about ${Math.abs(gap)} weeks before your target, leaving contingency for findings.` });
    }
  }
  if (input.maturity === "none") risks.push({ level: "medium", title: "Longer operating period recommended", detail: "Auditors look for records showing controls have operated over time. Starting from scratch means building that history before Stage 1." });
  if (input.employees === "1000+" || input.sites > 5) risks.push({ level: "medium", title: "Complex scope", detail: "Large or multi site scopes usually need phased rollout and sampling. Agree the sampling approach with your certification body early." });
  if (withPrivacy) risks.push({ level: "info", title: "ISO/IEC 27701:2025 is now a standalone standard", detail: "The 2025 edition can be certified on its own. This plan certifies it alongside ISO/IEC 27001 in one integrated audit. Confirm transition arrangements with your certification body if you hold a 2019 certificate." });

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    input,
    summary: {
      totalWeeks,
      months: Math.round((totalWeeks / 4.345) * 10) / 10,
      startDate: input.startDate,
      stage2Date: stage2.startDate,
      certificationDate,
      effortDays,
      internalDays: Math.round(effortDays * 0.6),
      consultantDays: Math.round(effortDays * 0.4),
      taskCount: phases.reduce((s, p) => s + p.tasks.length, 0),
    },
    phases,
    milestones,
    risks,
    documents: MANDATORY_DOCUMENTS.map(([name, ref]) => ({ name, ref })),
    annexA: ANNEX_A_THEMES,
  };
}

export function progressOf(plan, doneIds = []) {
  const done = new Set(doneIds);
  const all = plan.phases.flatMap((p) => p.tasks);
  const completed = all.filter((t) => done.has(t.id)).length;
  return { completed, total: all.length, percent: all.length ? Math.round((completed / all.length) * 100) : 0 };
}
