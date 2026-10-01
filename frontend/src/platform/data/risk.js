export function bandOf(score) {
  if (score >= 15) return "critical";
  if (score >= 10) return "high";
  if (score >= 5) return "medium";
  return "low";
}

export const BAND = {
  critical: { label: "Critical", cls: "border-p-danger/25 bg-p-danger/10 text-p-danger", dot: "bg-p-danger", cell: "bg-p-danger/15 border-p-danger/25 text-p-danger" },
  high: { label: "High", cls: "border-p-warning/25 bg-p-warning/10 text-p-warning", dot: "bg-p-warning", cell: "bg-p-warning/15 border-p-warning/25 text-p-warning" },
  medium: { label: "Medium", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info", cell: "bg-p-info/15 border-p-info/25 text-p-info" },
  low: { label: "Low", cls: "border-p-edge/15 bg-p-ink/5 text-p-mute", dot: "bg-p-faint", cell: "bg-p-ink/5 border-p-edge/15 text-p-mute" },
};

export const RISK_STATUS = {
  open: { label: "Open", cls: "border-p-danger/25 bg-p-danger/10 text-p-danger", dot: "bg-p-danger" },
  mitigating: { label: "Mitigating", cls: "border-p-warning/25 bg-p-warning/10 text-p-warning", dot: "bg-p-warning" },
  accepted: { label: "Accepted", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
  closed: { label: "Closed", cls: "border-p-success/25 bg-p-success/10 text-p-success", dot: "bg-p-success" },
};

export const RISKS = [
  { id: "R-001", title: "Unauthorized access to production systems", category: "Security", owner: "PK", likelihood: 3, impact: 5, status: "mitigating", controls: ["A.5.15", "CC6.1"], review: "Oct 15, 2026" },
  { id: "R-002", title: "Personal data breach triggers DPDP penalties", category: "Privacy", owner: "AS", likelihood: 2, impact: 5, status: "mitigating", controls: ["DPDP-1", "DPDP-7"], review: "Nov 05, 2026" },
  { id: "R-003", title: "Vendor compromise exposes customer data", category: "Third-party", owner: "AS", likelihood: 3, impact: 4, status: "open", controls: ["CC9.2"], review: "Oct 09, 2026" },
  { id: "R-004", title: "Backup restore failure during an incident", category: "Resilience", owner: "RK", likelihood: 2, impact: 4, status: "mitigating", controls: ["A.5.30"], review: "Oct 30, 2026" },
  { id: "R-005", title: "Unreviewed code reaches production", category: "Operational", owner: "RK", likelihood: 3, impact: 3, status: "closed", controls: ["CC8.1"], review: "Dec 27, 2026" },
  { id: "R-006", title: "Undetected intrusion through logging gaps", category: "Security", owner: "MT", likelihood: 2, impact: 5, status: "mitigating", controls: ["A.8.16", "CC7.2"], review: "Oct 22, 2026" },
  { id: "R-007", title: "AI model makes unsound decisions in production", category: "AI", owner: "MT", likelihood: 3, impact: 3, status: "open", controls: ["AI-4.2", "AI-6.1"], review: "Nov 15, 2026" },
  { id: "R-008", title: "Late breach notification to the Data Protection Board", category: "Compliance", owner: "AS", likelihood: 1, impact: 4, status: "open", controls: ["DPDP-7"], review: "Dec 01, 2026" },
  { id: "R-009", title: "Key-person dependency on infrastructure knowledge", category: "Operational", owner: "RK", likelihood: 3, impact: 2, status: "accepted", controls: [], review: "Jan 10, 2027" },
  { id: "R-010", title: "Certificate expiry gaps at critical vendors", category: "Third-party", owner: "AS", likelihood: 4, impact: 3, status: "open", controls: ["CC9.2"], review: "Oct 06, 2026" },
];

export const TIER = {
  critical: { label: "Critical", cls: "border-p-danger/25 bg-p-danger/10 text-p-danger", dot: "bg-p-danger" },
  high: { label: "High", cls: "border-p-warning/25 bg-p-warning/10 text-p-warning", dot: "bg-p-warning" },
  medium: { label: "Medium", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
  low: { label: "Low", cls: "border-p-edge/15 bg-p-ink/5 text-p-mute", dot: "bg-p-faint" },
};

export const VENDOR_STATUS = {
  active: { label: "Active", cls: "border-p-success/25 bg-p-success/10 text-p-success", dot: "bg-p-success" },
  review: { label: "Under review", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
  offboarding: { label: "Offboarding", cls: "border-p-edge/15 bg-p-ink/5 text-p-mute", dot: "bg-p-faint" },
};

export const CERT_STATE = {
  valid: { label: "Valid", cls: "text-p-success" },
  expiring: { label: "Expiring soon", cls: "text-p-warning" },
  expired: { label: "Expired", cls: "text-p-danger" },
  none: { label: "No certificate", cls: "text-p-faint" },
};

export const VENDORS = [
  { id: "v-aws", name: "Amazon Web Services", category: "Cloud infrastructure", tier: "critical", dataAccess: "Customer data", status: "active", cert: "SOC 2 Type II", certState: "valid", certExpiry: "Apr 2027", nextReview: "Jan 2027", owner: "RK" },
  { id: "v-github", name: "GitHub", category: "Source code hosting", tier: "critical", dataAccess: "Source code", status: "active", cert: "SOC 2 Type II", certState: "valid", certExpiry: "Mar 2027", nextReview: "Dec 2026", owner: "RK" },
  { id: "v-okta", name: "Okta", category: "Identity provider", tier: "critical", dataAccess: "Credentials", status: "active", cert: "ISO/IEC 27001", certState: "valid", certExpiry: "Jun 2027", nextReview: "Feb 2027", owner: "PK" },
  { id: "v-databridge", name: "DataBridge Analytics", category: "Product analytics", tier: "high", dataAccess: "PII", status: "review", cert: "SOC 2 Type I", certState: "expired", certExpiry: "Sep 19, 2026", nextReview: "Oct 9, 2026", owner: "AS" },
  { id: "v-cloudretain", name: "CloudRetain", category: "Backup storage", tier: "high", dataAccess: "Customer data", status: "active", cert: "SOC 2 Type II", certState: "expired", certExpiry: "Expired 12 days ago", nextReview: "Overdue", owner: "PK" },
  { id: "v-pagerduty", name: "PagerDuty", category: "Incident management", tier: "medium", dataAccess: "Metadata", status: "active", cert: "SOC 2 Type II", certState: "expiring", certExpiry: "Dec 2, 2026", nextReview: "Nov 2026", owner: "MT" },
  { id: "v-freshdesk", name: "Freshdesk", category: "Support tooling", tier: "medium", dataAccess: "PII", status: "active", cert: "ISO/IEC 27001", certState: "valid", certExpiry: "Nov 20, 2026", nextReview: "Oct 2026", owner: "AS" },
  { id: "v-mailchimp", name: "Mailchimp", category: "Marketing automation", tier: "low", dataAccess: "PII", status: "offboarding", cert: "—", certState: "none", certExpiry: "—", nextReview: "—", owner: "AS" },
];
