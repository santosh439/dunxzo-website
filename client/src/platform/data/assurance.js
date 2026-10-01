// ---------- Audit hub ----------
export const AUDIT = {
  framework: "ISO/IEC 27001",
  stage: "Stage 2 certification audit",
  readiness: 86,
  auditor: "Sarah Menon · BSI",
  window: "Oct 24 – Oct 28, 2026",
  daysOut: 23,
  milestones: [
    { label: "Scope & Statement of Applicability agreed", done: true },
    { label: "Stage 1 documentation review passed", done: true },
    { label: "Evidence population uploaded", done: false },
    { label: "Internal audit completed", done: true },
    { label: "Management review held", done: false },
  ],
};

export const AUDITOR_REQUESTS = [
  { id: "ar-1", label: "Access review population Q2–Q3", status: "in-progress", collected: 2, total: 5, due: "Oct 12" },
  { id: "ar-2", label: "Penetration test attestation letter", status: "open", collected: 0, total: 1, due: "Oct 20" },
  { id: "ar-3", label: "Incident ticket sample (10)", status: "in-progress", collected: 8, total: 10, due: "Oct 14" },
  { id: "ar-4", label: "Change management evidence (Sept)", status: "submitted", collected: 1, total: 1, due: "Oct 08" },
  { id: "ar-5", label: "Business continuity test report", status: "submitted", collected: 1, total: 1, due: "Oct 05" },
];

export const FINDINGS = [
  { id: "f-1", title: "Boundary protection review evidence missing", severity: "major", control: "CC6.6", status: "open" },
  { id: "f-2", title: "Grievance officer notice not published", severity: "major", control: "DPDP-4", status: "open" },
  { id: "f-3", title: "Backup restore test older than policy allows", severity: "minor", control: "A.5.30", status: "in-progress" },
  { id: "f-4", title: "Two detection rules without assigned owners", severity: "minor", control: "CC7.2", status: "in-progress" },
  { id: "f-5", title: "Emergency change runbook overdue for review", severity: "observation", control: "CC8.1", status: "closed" },
];

export const FINDING_SEVERITY = {
  major: { label: "Major NC", cls: "border-p-danger/25 bg-p-danger/10 text-p-danger", dot: "bg-p-danger" },
  minor: { label: "Minor NC", cls: "border-p-warning/25 bg-p-warning/10 text-p-warning", dot: "bg-p-warning" },
  observation: { label: "Observation", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
};

export const REQUEST_STATUS = {
  open: { label: "Not started", cls: "text-p-danger" },
  "in-progress": { label: "In progress", cls: "text-p-warning" },
  submitted: { label: "Submitted", cls: "text-p-success" },
};

// ---------- GCC command center ----------
export const GCC_ENTITIES = [
  { id: "e-in", name: "India GCC — Bengaluru", region: "APAC", headcount: 420, maturity: 84 },
  { id: "e-ph", name: "Philippines GCC — Manila", region: "APAC", headcount: 180, maturity: 71 },
  { id: "e-pl", name: "Poland GCC — Kraków", region: "EMEA", headcount: 95, maturity: 78 },
  { id: "e-mx", name: "Mexico GCC — Guadalajara", region: "AMER", headcount: 60, maturity: 63 },
];

export const GCC_DOMAINS = [
  { id: 1, name: "Governance & leadership", score: 88 },
  { id: 2, name: "Risk management", score: 82 },
  { id: 3, name: "Information security", score: 86 },
  { id: 4, name: "Data privacy", score: 74 },
  { id: 5, name: "Identity & access", score: 90 },
  { id: 6, name: "Third-party risk", score: 68 },
  { id: 7, name: "Business continuity", score: 72 },
  { id: 8, name: "Incident management", score: 80 },
  { id: 9, name: "Change management", score: 85 },
  { id: 10, name: "Asset management", score: 77 },
  { id: 11, name: "HR security", score: 83 },
  { id: 12, name: "Physical security", score: 79 },
  { id: 13, name: "Secure engineering", score: 81 },
  { id: 14, name: "Compliance & legal", score: 70 },
  { id: 15, name: "AI governance", score: 48 },
];

// ---------- Trust Center ----------
export const TRUST = {
  url: "trust.du-nzo.com",
  published: true,
  views: 1284,
  requests: 7,
};

export const TRUST_CERTS = [
  { name: "ISO/IEC 27001", state: "certified", detail: "Valid to Apr 2027" },
  { name: "SOC 2 Type II", state: "certified", detail: "Report dated Aug 2026" },
  { name: "DPDPA", state: "in-progress", detail: "Readiness 58%" },
  { name: "ISO/IEC 42001", state: "in-progress", detail: "Readiness 22%" },
];

export const TRUST_DOCS = [
  { name: "SOC 2 Type II report", access: "On request (NDA)", icon: "lock" },
  { name: "ISO/IEC 27001 certificate", access: "Public", icon: "globe" },
  { name: "Penetration test summary", access: "On request (NDA)", icon: "lock" },
  { name: "Data processing agreement", access: "Public", icon: "globe" },
  { name: "Sub-processor list", access: "Public", icon: "globe" },
  { name: "Security whitepaper", access: "Public", icon: "globe" },
];

export const TRUST_REQUESTS = [
  { id: "tr-1", company: "Northwind Corp", doc: "SOC 2 Type II report", when: "2h ago", status: "pending" },
  { id: "tr-2", company: "Acme Financial", doc: "Penetration test summary", when: "1d ago", status: "approved" },
  { id: "tr-3", company: "Vertex Health", doc: "SOC 2 Type II report", when: "2d ago", status: "approved" },
];

export const CERT_BADGE = {
  certified: { label: "Certified", cls: "border-p-success/25 bg-p-success/10 text-p-success", dot: "bg-p-success" },
  "in-progress": { label: "In progress", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
};
