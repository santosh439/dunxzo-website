export const CHECK_STATUS = {
  passing: { label: "Passing", cls: "border-p-success/25 bg-p-success/10 text-p-success", dot: "bg-p-success" },
  drifting: { label: "Drifting", cls: "border-p-warning/25 bg-p-warning/10 text-p-warning", dot: "bg-p-warning" },
  failing: { label: "Failing", cls: "border-p-danger/25 bg-p-danger/10 text-p-danger", dot: "bg-p-danger" },
};

export const SEVERITY = {
  critical: { label: "Critical", dot: "bg-p-danger", cls: "text-p-danger" },
  high: { label: "High", dot: "bg-p-warning", cls: "text-p-warning" },
  medium: { label: "Medium", dot: "bg-p-info", cls: "text-p-info" },
  low: { label: "Low", dot: "bg-p-faint", cls: "text-p-faint" },
};

export const POLICY_STATUS = {
  published: { label: "Published", cls: "border-p-success/25 bg-p-success/10 text-p-success", dot: "bg-p-success" },
  "in-review": { label: "In review", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
  draft: { label: "Draft", cls: "border-p-edge/15 bg-p-ink/5 text-p-mute", dot: "bg-p-faint" },
  overdue: { label: "Review overdue", cls: "border-p-danger/25 bg-p-danger/10 text-p-danger", dot: "bg-p-danger" },
};

export const CHECKS = [
  { id: "mfa-coverage", name: "MFA coverage across workforce", source: "Okta", cadence: "Hourly", control: "A.5.17", status: "passing", lastRun: "12 min ago" },
  { id: "s3-public", name: "Public S3 bucket detection", source: "AWS", cadence: "Continuous", control: "CC6.6", status: "failing", lastRun: "4 min ago" },
  { id: "encryption-rest", name: "Encryption at rest (RDS/S3)", source: "AWS", cadence: "Hourly", control: "CC6.6", status: "drifting", lastRun: "1h ago" },
  { id: "branch-protection", name: "Branch protection on main", source: "GitHub", cadence: "Hourly", control: "CC8.1", status: "passing", lastRun: "21 min ago" },
  { id: "log-retention", name: "Central log retention ≥ 1 year", source: "AWS", cadence: "Daily", control: "A.8.16", status: "passing", lastRun: "1h ago" },
  { id: "backup-success", name: "Nightly backup success rate", source: "AWS Backup", cadence: "Daily", control: "A.5.30", status: "drifting", lastRun: "3h ago" },
  { id: "incident-drill", name: "Incident drill within 12 months", source: "Internal", cadence: "Weekly", control: "A.5.24", status: "passing", lastRun: "1d ago" },
  { id: "access-recert", name: "Quarterly access recertification on time", source: "Okta", cadence: "Daily", control: "A.5.15", status: "passing", lastRun: "2h ago" },
  { id: "alert-sla", name: "Alert triage within SLA", source: "PagerDuty", cadence: "Hourly", control: "A.8.16", status: "failing", lastRun: "35 min ago" },
];

export const DRIFT_ALERTS = [
  { id: "al-1", title: "S3 bucket “customer-exports” became publicly readable", severity: "critical", control: "CC6.6", source: "AWS", detected: "18 min ago" },
  { id: "al-2", title: "Triage SLA breached on 3 detection rules", severity: "high", control: "A.8.16", source: "PagerDuty", detected: "2h ago" },
  { id: "al-3", title: "Backup success rate dropped to 93% (target 99%)", severity: "medium", control: "A.5.30", source: "AWS Backup", detected: "5h ago" },
  { id: "al-4", title: "RDS instance provisioned without encryption at rest", severity: "high", control: "CC6.6", source: "AWS", detected: "1d ago" },
];

export const EVIDENCE_ITEMS = [
  { name: "InfoSec Policy v3.1.pdf", control: "A.5.1", owner: "AS", type: "PDF", size: "248 KB", updated: "Sep 12, 2026", freshness: "fresh" },
  { name: "Q3 access review export.csv", control: "A.5.15", owner: "PK", type: "CSV", size: "92 KB", updated: "Sep 28, 2026", freshness: "fresh" },
  { name: "MFA coverage report", control: "A.5.17", owner: "RK", type: "Config", size: "18 KB", updated: "Sep 25, 2026", freshness: "fresh" },
  { name: "IdP user export — August.csv", control: "A.5.16", owner: "PK", type: "CSV", size: "104 KB", updated: "Aug 30, 2026", freshness: "stale" },
  { name: "CIS baseline scan — August", control: "A.8.9", owner: "MT", type: "Report", size: "1.2 MB", updated: "Aug 18, 2026", freshness: "stale" },
  { name: "SIEM alert triage log — Sept", control: "A.8.16", owner: "MT", type: "Log", size: "640 KB", updated: "Sep 29, 2026", freshness: "fresh" },
  { name: "PR approval audit — Sept", control: "CC8.1", owner: "RK", type: "Report", size: "310 KB", updated: "Sep 27, 2026", freshness: "fresh" },
  { name: "Consent flow screenshots", control: "DPDP-1", owner: "AS", type: "Images", size: "4.8 MB", updated: "Sep 05, 2026", freshness: "stale" },
  { name: "Restore test report — July", control: "A.5.30", owner: "RK", type: "Report", size: "890 KB", updated: "Jul 30, 2026", freshness: "stale" },
  { name: "Vendor inventory v12.xlsx", control: "CC9.2", owner: "AS", type: "Sheet", size: "156 KB", updated: "Sep 18, 2026", freshness: "fresh" },
];

export const EVIDENCE_REQUESTS = [
  { id: "req-1", label: "Population of access reviews for Q2–Q3", requester: "Sarah · External auditor", due: "Oct 12", collected: 2, total: 5 },
  { id: "req-2", label: "Penetration test attestation letter", requester: "Sarah · External auditor", due: "Oct 20", collected: 0, total: 1 },
  { id: "req-3", label: "Incident tickets sample (10)", requester: "Sarah · External auditor", due: "Oct 14", collected: 8, total: 10 },
];

export const POLICIES = [
  { id: "pol-infosec", name: "Information Security Policy", version: "v3.1", owner: "AS", status: "published", updated: "Sep 12, 2026", nextReview: "Dec 12, 2026", attestation: 98 },
  { id: "pol-acceptable", name: "Acceptable Use Policy", version: "v2.0", owner: "PK", status: "published", updated: "Aug 02, 2026", nextReview: "Aug 02, 2027", attestation: 96 },
  { id: "pol-ir", name: "Incident Response Plan", version: "v2.3", owner: "PK", status: "in-review", updated: "Sep 21, 2026", nextReview: "Mar 21, 2027", attestation: null },
  { id: "pol-privacy", name: "Data Protection & Privacy Policy", version: "v1.4", owner: "AS", status: "in-review", updated: "Sep 08, 2026", nextReview: "Nov 08, 2026", attestation: null },
  { id: "pol-access", name: "Access Control Policy", version: "v1.8", owner: "RK", status: "published", updated: "Jul 15, 2026", nextReview: "Jan 15, 2027", attestation: 92 },
  { id: "pol-vendor", name: "Vendor Management Policy", version: "v1.1", owner: "AS", status: "overdue", updated: "Mar 01, 2026", nextReview: "Sep 01, 2026", attestation: 84 },
  { id: "pol-ai", name: "AI Usage Policy", version: "v0.2", owner: "MT", status: "draft", updated: "Sep 22, 2026", nextReview: "—", attestation: null },
  { id: "pol-bcp", name: "Business Continuity Plan", version: "v1.5", owner: "RK", status: "published", updated: "Jun 20, 2026", nextReview: "Dec 20, 2026", attestation: 88 },
];
