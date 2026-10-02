// Workspace seed templates (Node) — mirrors backend/workspace_seed.py.
export const ALL_FRAMEWORKS = ["ISO/IEC 27001", "SOC 2", "DPDPA", "ISO/IEC 42001"];

export const CONTROL_TEMPLATES = [
  { id: "A.5.1", title: "Information security policy", domain: "Governance", frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "AS", status: "operational", automation: "Manual" },
  { id: "A.5.15", title: "Access control", domain: "Access & Identity", frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "PK", status: "operational", automation: "Automated" },
  { id: "A.5.16", title: "Identity management", domain: "Access & Identity", frameworks: ["ISO/IEC 27001"], owner: "PK", status: "attention", automation: "Semi-automated" },
  { id: "A.5.17", title: "Authentication information", domain: "Access & Identity", frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "RK", status: "operational", automation: "Automated" },
  { id: "A.8.9", title: "Configuration management", domain: "Engineering", frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "MT", status: "attention", automation: "Semi-automated" },
  { id: "A.8.16", title: "Monitoring activities", domain: "Engineering", frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "MT", status: "operational", automation: "Automated" },
  { id: "CC6.1", title: "Logical access security", domain: "Access & Identity", frameworks: ["SOC 2"], owner: "PK", status: "operational", automation: "Automated" },
  { id: "CC6.6", title: "Boundary protection", domain: "Engineering", frameworks: ["SOC 2"], owner: "RK", status: "missing", automation: "Manual" },
  { id: "CC7.2", title: "System monitoring & detection", domain: "Engineering", frameworks: ["SOC 2"], owner: "MT", status: "attention", automation: "Semi-automated" },
  { id: "CC8.1", title: "Change management", domain: "Engineering", frameworks: ["SOC 2"], owner: "RK", status: "operational", automation: "Automated" },
  { id: "DPDP-1", title: "Consent management", domain: "Privacy", frameworks: ["DPDPA"], owner: "AS", status: "attention", automation: "Manual" },
  { id: "DPDP-4", title: "Grievance redressal", domain: "Privacy", frameworks: ["DPDPA"], owner: "AS", status: "missing", automation: "Manual" },
  { id: "DPDP-7", title: "Data breach notification", domain: "Privacy", frameworks: ["DPDPA", "ISO/IEC 27001"], owner: "PK", status: "draft", automation: "Manual" },
  { id: "AI-4.2", title: "AI risk management process", domain: "AI Governance", frameworks: ["ISO/IEC 42001"], owner: "MT", status: "draft", automation: "Manual" },
  { id: "AI-6.1", title: "AI system documentation", domain: "AI Governance", frameworks: ["ISO/IEC 42001"], owner: "MT", status: "missing", automation: "Manual" },
  { id: "A.5.24", title: "Incident response planning", domain: "Resilience", frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "PK", status: "operational", automation: "Manual" },
  { id: "A.5.30", title: "ICT readiness for business continuity", domain: "Resilience", frameworks: ["ISO/IEC 27001"], owner: "RK", status: "attention", automation: "Semi-automated" },
  { id: "CC9.2", title: "Vendor risk management", domain: "Third parties", frameworks: ["SOC 2"], owner: "AS", status: "operational", automation: "Semi-automated" },
];

export const RISK_TEMPLATES = [
  { id: "R-001", title: "Unauthorized access to production systems", category: "Security", owner: "PK", likelihood: 3, impact: 5, status: "mitigating", controls: ["A.5.15", "CC6.1"] },
  { id: "R-002", title: "Personal data breach triggers DPDP penalties", category: "Privacy", owner: "AS", likelihood: 2, impact: 5, status: "mitigating", controls: ["DPDP-1", "DPDP-7"] },
  { id: "R-003", title: "Vendor compromise exposes customer data", category: "Third-party", owner: "AS", likelihood: 3, impact: 4, status: "open", controls: ["CC9.2"] },
  { id: "R-004", title: "Backup restore failure during an incident", category: "Resilience", owner: "RK", likelihood: 2, impact: 4, status: "mitigating", controls: ["A.5.30"] },
  { id: "R-005", title: "Unreviewed code reaches production", category: "Operational", owner: "RK", likelihood: 3, impact: 3, status: "closed", controls: ["CC8.1"] },
  { id: "R-006", title: "Undetected intrusion through logging gaps", category: "Security", owner: "MT", likelihood: 2, impact: 5, status: "mitigating", controls: ["A.8.16", "CC7.2"] },
  { id: "R-007", title: "AI model makes unsound decisions in production", category: "AI", owner: "MT", likelihood: 3, impact: 3, status: "open", controls: ["AI-4.2", "AI-6.1"] },
  { id: "R-008", title: "Late breach notification to the Data Protection Board", category: "Compliance", owner: "AS", likelihood: 1, impact: 4, status: "open", controls: ["DPDP-7"] },
  { id: "R-009", title: "Key-person dependency on infrastructure knowledge", category: "Operational", owner: "RK", likelihood: 3, impact: 2, status: "accepted", controls: [] },
  { id: "R-010", title: "Certificate expiry gaps at critical vendors", category: "Third-party", owner: "AS", likelihood: 4, impact: 3, status: "open", controls: ["CC9.2"] },
];

export const EVIDENCE_TEMPLATES = [
  { name: "InfoSec Policy v3.1.pdf", control: "A.5.1", owner: "AS", type: "PDF", size: "248 KB", updated: "Sep 12, 2026", freshness: "fresh" },
  { name: "Q3 access review export.csv", control: "A.5.15", owner: "PK", type: "CSV", size: "92 KB", updated: "Sep 28, 2026", freshness: "fresh" },
  { name: "MFA coverage report", control: "A.5.17", owner: "RK", type: "Config", size: "18 KB", updated: "Sep 25, 2026", freshness: "fresh" },
  { name: "IdP user export - August.csv", control: "A.5.16", owner: "PK", type: "CSV", size: "104 KB", updated: "Aug 30, 2026", freshness: "stale" },
  { name: "CIS baseline scan - August", control: "A.8.9", owner: "MT", type: "Report", size: "1.2 MB", updated: "Aug 18, 2026", freshness: "stale" },
  { name: "SIEM alert triage log - Sept", control: "A.8.16", owner: "MT", type: "Log", size: "640 KB", updated: "Sep 29, 2026", freshness: "fresh" },
  { name: "PR approval audit - Sept", control: "CC8.1", owner: "RK", type: "Report", size: "310 KB", updated: "Sep 27, 2026", freshness: "fresh" },
  { name: "Consent flow screenshots", control: "DPDP-1", owner: "AS", type: "Images", size: "4.8 MB", updated: "Sep 05, 2026", freshness: "stale" },
  { name: "Restore test report - July", control: "A.5.30", owner: "RK", type: "Report", size: "890 KB", updated: "Jul 30, 2026", freshness: "stale" },
  { name: "Vendor inventory v12.xlsx", control: "CC9.2", owner: "AS", type: "Sheet", size: "156 KB", updated: "Sep 18, 2026", freshness: "fresh" },
];

export const POLICY_TEMPLATES = [
  { id: "pol-infosec", name: "Information Security Policy", version: "v3.1", owner: "AS", status: "published", updated: "Sep 12, 2026", nextReview: "Dec 12, 2026", attestation: 98 },
  { id: "pol-acceptable", name: "Acceptable Use Policy", version: "v2.0", owner: "PK", status: "published", updated: "Aug 02, 2026", nextReview: "Aug 02, 2027", attestation: 96 },
  { id: "pol-ir", name: "Incident Response Plan", version: "v2.3", owner: "PK", status: "in-review", updated: "Sep 21, 2026", nextReview: "Mar 21, 2027", attestation: null },
  { id: "pol-privacy", name: "Data Protection & Privacy Policy", version: "v1.4", owner: "AS", status: "in-review", updated: "Sep 08, 2026", nextReview: "Nov 08, 2026", attestation: null },
  { id: "pol-access", name: "Access Control Policy", version: "v1.8", owner: "RK", status: "published", updated: "Jul 15, 2026", nextReview: "Jan 15, 2027", attestation: 92 },
  { id: "pol-vendor", name: "Vendor Management Policy", version: "v1.1", owner: "AS", status: "overdue", updated: "Mar 01, 2026", nextReview: "Sep 01, 2026", attestation: 84 },
  { id: "pol-ai", name: "AI Usage Policy", version: "v0.2", owner: "MT", status: "draft", updated: "Sep 22, 2026", nextReview: "-", attestation: null },
  { id: "pol-bcp", name: "Business Continuity Plan", version: "v1.5", owner: "RK", status: "published", updated: "Jun 20, 2026", nextReview: "Dec 20, 2026", attestation: 88 },
];

export const VENDOR_TEMPLATES = [
  { id: "v-aws", name: "Amazon Web Services", category: "Cloud infrastructure", tier: "critical", dataAccess: "Customer data", status: "active", cert: "SOC 2 Type II", certState: "valid", certExpiry: "Apr 2027", nextReview: "Jan 2027", owner: "RK" },
  { id: "v-github", name: "GitHub", category: "Source code hosting", tier: "critical", dataAccess: "Source code", status: "active", cert: "SOC 2 Type II", certState: "valid", certExpiry: "Mar 2027", nextReview: "Dec 2026", owner: "RK" },
  { id: "v-okta", name: "Okta", category: "Identity provider", tier: "critical", dataAccess: "Credentials", status: "active", cert: "ISO/IEC 27001", certState: "valid", certExpiry: "Jun 2027", nextReview: "Feb 2027", owner: "PK" },
  { id: "v-databridge", name: "DataBridge Analytics", category: "Product analytics", tier: "high", dataAccess: "PII", status: "review", cert: "SOC 2 Type I", certState: "expired", certExpiry: "Sep 19, 2026", nextReview: "Oct 9, 2026", owner: "AS" },
  { id: "v-cloudretain", name: "CloudRetain", category: "Backup storage", tier: "high", dataAccess: "Customer data", status: "active", cert: "SOC 2 Type II", certState: "expired", certExpiry: "Expired 12 days ago", nextReview: "Overdue", owner: "PK" },
  { id: "v-pagerduty", name: "PagerDuty", category: "Incident management", tier: "medium", dataAccess: "Metadata", status: "active", cert: "SOC 2 Type II", certState: "expiring", certExpiry: "Dec 2, 2026", nextReview: "Nov 2026", owner: "MT" },
  { id: "v-freshdesk", name: "Freshdesk", category: "Support tooling", tier: "medium", dataAccess: "PII", status: "active", cert: "ISO/IEC 27001", certState: "valid", certExpiry: "Nov 20, 2026", nextReview: "Oct 2026", owner: "AS" },
  { id: "v-mailchimp", name: "Mailchimp", category: "Marketing automation", tier: "low", dataAccess: "PII", status: "offboarding", cert: "-", certState: "none", certExpiry: "-", nextReview: "-", owner: "AS" },
];

export const AUDIT_META = {
  framework: "ISO/IEC 27001", stage: "Stage 2 certification audit", readiness: 86,
  auditor: "Sarah Menon - BSI", window: "Oct 24 - Oct 28, 2026", daysOut: 23,
  milestones: [
    { label: "Scope & Statement of Applicability agreed", done: true },
    { label: "Stage 1 documentation review passed", done: true },
    { label: "Evidence population uploaded", done: false },
    { label: "Internal audit completed", done: true },
    { label: "Management review held", done: false },
  ],
};

export const AUDITOR_REQUEST_TEMPLATES = [
  { id: "ar-1", label: "Access review population Q2-Q3", status: "in-progress", collected: 2, total: 5, due: "Oct 12" },
  { id: "ar-2", label: "Penetration test attestation letter", status: "open", collected: 0, total: 1, due: "Oct 20" },
  { id: "ar-3", label: "Incident ticket sample (10)", status: "in-progress", collected: 8, total: 10, due: "Oct 14" },
  { id: "ar-4", label: "Change management evidence (Sept)", status: "submitted", collected: 1, total: 1, due: "Oct 08" },
  { id: "ar-5", label: "Business continuity test report", status: "submitted", collected: 1, total: 1, due: "Oct 05" },
];

export const FINDING_TEMPLATES = [
  { id: "f-1", title: "Boundary protection review evidence missing", severity: "major", control: "CC6.6", status: "open" },
  { id: "f-2", title: "Grievance officer notice not published", severity: "major", control: "DPDP-4", status: "open" },
  { id: "f-3", title: "Backup restore test older than policy allows", severity: "minor", control: "A.5.30", status: "in-progress" },
  { id: "f-4", title: "Two detection rules without assigned owners", severity: "minor", control: "CC7.2", status: "in-progress" },
  { id: "f-5", title: "Emergency change runbook overdue for review", severity: "observation", control: "CC8.1", status: "closed" },
];

export const seedControls = (frameworks) => {
  const chosen = new Set(frameworks.length ? frameworks : ALL_FRAMEWORKS);
  return CONTROL_TEMPLATES.filter((c) => c.frameworks.some((f) => chosen.has(f))).map((c) => ({ ...c }));
};
export const seedRisks = (controlIds) =>
  RISK_TEMPLATES.filter((r) => !r.controls.length || r.controls.some((c) => controlIds.has(c))).map((r) => ({ ...r }));
export const seedEvidence = (controlIds) => EVIDENCE_TEMPLATES.filter((e) => controlIds.has(e.control)).map((e) => ({ ...e }));
export const seedFindings = (controlIds) => FINDING_TEMPLATES.filter((f) => controlIds.has(f.control)).map((f) => ({ ...f }));

export const computePulse = (controls) => {
  const total = controls.length || 1;
  const count = (s) => controls.filter((c) => c.status === s).length;
  const operational = count("operational"), attention = count("attention"), missing = count("missing"), draft = count("draft");
  const score = Math.max(0, Math.min(100, Math.round((operational * 100 + attention * 55 + draft * 35) / total)));
  return { score, operational, attention, missing, draft, total: controls.length };
};
