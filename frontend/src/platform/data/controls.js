export const CONTROL_STATUS = {
  operational: { label: "Operational", cls: "border-p-success/25 bg-p-success/10 text-p-success", dot: "bg-p-success" },
  attention: { label: "Needs attention", cls: "border-p-warning/25 bg-p-warning/10 text-p-warning", dot: "bg-p-warning" },
  missing: { label: "Missing evidence", cls: "border-p-danger/25 bg-p-danger/10 text-p-danger", dot: "bg-p-danger" },
  draft: { label: "Draft", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
};

export const FRESHNESS = {
  fresh: { label: "Fresh", cls: "text-p-success", dot: "bg-p-success" },
  stale: { label: "Stale", cls: "text-p-warning", dot: "bg-p-warning" },
  missing: { label: "Missing", cls: "text-p-danger", dot: "bg-p-danger" },
};

export const OWNERS = {
  PK: "Priya Kapoor",
  AS: "Arjun Sharma",
  RK: "Rahul Khanna",
  MT: "Meera Thomas",
  You: "You",
};

export const FRAMEWORK_FILTERS = ["ISO/IEC 27001", "SOC 2", "DPDPA", "ISO/IEC 42001"];

export const CONTROLS = [
  {
    id: "A.5.1", title: "Information security policy", domain: "Governance",
    frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "AS", status: "operational", automation: "Manual",
    lastTested: "Sep 12, 2026", nextReview: "Dec 12, 2026",
    description: "A top-level information security policy is defined, approved by leadership, published to all staff and reviewed at least annually.",
    evidence: [
      { name: "InfoSec Policy v3.1.pdf", updated: "Sep 12, 2026", freshness: "fresh" },
      { name: "Board approval minutes.pdf", updated: "Sep 10, 2026", freshness: "fresh" },
    ],
    risks: [{ label: "Unmanaged security obligations", severity: "high" }],
  },
  {
    id: "A.5.15", title: "Access control", domain: "Access & Identity",
    frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "PK", status: "operational", automation: "Automated",
    lastTested: "Sep 28, 2026", nextReview: "Oct 28, 2026",
    description: "Access to systems and data is granted on least-privilege and need-to-know principles, with joiner-mover-leaver workflows enforced.",
    evidence: [
      { name: "Q3 access review export.csv", updated: "Sep 28, 2026", freshness: "fresh" },
      { name: "IAM policy config snapshot", updated: "Sep 28, 2026", freshness: "fresh" },
    ],
    risks: [{ label: "Unauthorized access to production", severity: "critical" }],
  },
  {
    id: "A.5.16", title: "Identity management", domain: "Access & Identity",
    frameworks: ["ISO/IEC 27001"], owner: "PK", status: "attention", automation: "Semi-automated",
    lastTested: "Aug 30, 2026", nextReview: "Oct 15, 2026",
    description: "Unique identities are provisioned and de-provisioned across the full lifecycle, with quarterly recertification of privileged accounts.",
    evidence: [{ name: "IdP user export — August.csv", updated: "Aug 30, 2026", freshness: "stale" }],
    risks: [{ label: "Orphaned accounts after offboarding", severity: "high" }],
  },
  {
    id: "A.5.17", title: "Authentication information", domain: "Access & Identity",
    frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "RK", status: "operational", automation: "Automated",
    lastTested: "Sep 25, 2026", nextReview: "Dec 25, 2026",
    description: "MFA is enforced for all workforce accounts; secrets are stored in a managed vault and rotated on a defined schedule.",
    evidence: [
      { name: "MFA coverage report", updated: "Sep 25, 2026", freshness: "fresh" },
      { name: "Vault rotation log", updated: "Sep 20, 2026", freshness: "fresh" },
    ],
    risks: [{ label: "Credential stuffing on SSO", severity: "medium" }],
  },
  {
    id: "A.8.9", title: "Configuration management", domain: "Engineering",
    frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "MT", status: "attention", automation: "Semi-automated",
    lastTested: "Aug 18, 2026", nextReview: "Oct 18, 2026",
    description: "Hardened baseline configurations are defined, applied and monitored for drift across cloud and endpoint estates.",
    evidence: [{ name: "CIS baseline scan — August", updated: "Aug 18, 2026", freshness: "stale" }],
    risks: [{ label: "Configuration drift in cloud accounts", severity: "medium" }],
  },
  {
    id: "A.8.16", title: "Monitoring activities", domain: "Engineering",
    frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "MT", status: "operational", automation: "Automated",
    lastTested: "Sep 29, 2026", nextReview: "Oct 29, 2026",
    description: "Networks, systems and applications are monitored for anomalous behaviour, with alerts triaged on a defined SLA.",
    evidence: [
      { name: "SIEM alert triage log — Sept", updated: "Sep 29, 2026", freshness: "fresh" },
      { name: "Monitoring coverage matrix", updated: "Sep 15, 2026", freshness: "fresh" },
    ],
    risks: [{ label: "Undetected intrusion", severity: "critical" }],
  },
  {
    id: "CC6.1", title: "Logical access security", domain: "Access & Identity",
    frameworks: ["SOC 2"], owner: "PK", status: "operational", automation: "Automated",
    lastTested: "Sep 26, 2026", nextReview: "Dec 26, 2026",
    description: "Logical access to the system is restricted to authorised users through authentication, authorisation and quarterly reviews.",
    evidence: [{ name: "Access review sign-off Q3", updated: "Sep 26, 2026", freshness: "fresh" }],
    risks: [{ label: "Excessive privileges in production", severity: "high" }],
  },
  {
    id: "CC6.6", title: "Boundary protection", domain: "Engineering",
    frameworks: ["SOC 2"], owner: "RK", status: "missing", automation: "Manual",
    lastTested: "—", nextReview: "Overdue",
    description: "The system boundary is protected with firewalls, network segmentation and deny-by-default rules; evidence of the last review is outstanding.",
    evidence: [],
    risks: [{ label: "Unrestricted ingress to VPC", severity: "critical" }],
  },
  {
    id: "CC7.2", title: "System monitoring & detection", domain: "Engineering",
    frameworks: ["SOC 2"], owner: "MT", status: "attention", automation: "Semi-automated",
    lastTested: "Aug 22, 2026", nextReview: "Oct 22, 2026",
    description: "Detection controls identify configuration changes and susceptibilities; two detection rules are currently without owners.",
    evidence: [{ name: "Detection rule inventory", updated: "Aug 22, 2026", freshness: "stale" }],
    risks: [{ label: "Delayed incident detection", severity: "high" }],
  },
  {
    id: "CC8.1", title: "Change management", domain: "Engineering",
    frameworks: ["SOC 2"], owner: "RK", status: "operational", automation: "Automated",
    lastTested: "Sep 27, 2026", nextReview: "Dec 27, 2026",
    description: "Changes to infrastructure and software are authorised, tested and approved before deployment, with emergency change handling defined.",
    evidence: [
      { name: "PR approval audit — Sept", updated: "Sep 27, 2026", freshness: "fresh" },
      { name: "Emergency change runbook", updated: "Jul 02, 2026", freshness: "stale" },
    ],
    risks: [{ label: "Unreviewed code reaches production", severity: "medium" }],
  },
  {
    id: "DPDP-1", title: "Consent management", domain: "Privacy",
    frameworks: ["DPDPA"], owner: "AS", status: "attention", automation: "Manual",
    lastTested: "Sep 05, 2026", nextReview: "Nov 05, 2026",
    description: "Valid, free, specific and informed consent is captured before processing personal data, with withdrawal as easy as giving it.",
    evidence: [{ name: "Consent flow screenshots", updated: "Sep 05, 2026", freshness: "stale" }],
    risks: [{ label: "Invalid consent for marketing data", severity: "high" }],
  },
  {
    id: "DPDP-4", title: "Grievance redressal", domain: "Privacy",
    frameworks: ["DPDPA"], owner: "AS", status: "missing", automation: "Manual",
    lastTested: "—", nextReview: "Overdue",
    description: "A published grievance officer and an effective redressal mechanism must exist for data principals; the public notice is not yet live.",
    evidence: [],
    risks: [{ label: "DPDP non-compliance penalty", severity: "critical" }],
  },
  {
    id: "DPDP-7", title: "Data breach notification", domain: "Privacy",
    frameworks: ["DPDPA", "ISO/IEC 27001"], owner: "PK", status: "draft", automation: "Manual",
    lastTested: "—", nextReview: "Dec 01, 2026",
    description: "A process to notify the Data Protection Board and affected data principals of a personal data breach is being drafted with legal counsel.",
    evidence: [{ name: "Breach notification SOP — draft.docx", updated: "Sep 19, 2026", freshness: "fresh" }],
    risks: [{ label: "Late breach notification", severity: "high" }],
  },
  {
    id: "AI-4.2", title: "AI risk management process", domain: "AI Governance",
    frameworks: ["ISO/IEC 42001"], owner: "MT", status: "draft", automation: "Manual",
    lastTested: "—", nextReview: "Nov 15, 2026",
    description: "A repeatable process to identify, analyse and treat AI-specific risks across the model lifecycle, integrated with the enterprise risk register.",
    evidence: [{ name: "AI risk framework — outline", updated: "Sep 22, 2026", freshness: "fresh" }],
    risks: [{ label: "Unassessed model risk in production", severity: "medium" }],
  },
  {
    id: "AI-6.1", title: "AI system documentation", domain: "AI Governance",
    frameworks: ["ISO/IEC 42001"], owner: "MT", status: "missing", automation: "Manual",
    lastTested: "—", nextReview: "Overdue",
    description: "Each AI system requires documented intended purpose, data lineage, evaluation results and known limitations.",
    evidence: [],
    risks: [{ label: "Opaque AI decision-making", severity: "medium" }],
  },
  {
    id: "A.5.24", title: "Incident response planning", domain: "Resilience",
    frameworks: ["ISO/IEC 27001", "SOC 2"], owner: "PK", status: "operational", automation: "Manual",
    lastTested: "Sep 21, 2026", nextReview: "Mar 21, 2027",
    description: "An incident response plan is maintained, roles are assigned, and tabletop exercises validate the plan at least annually.",
    evidence: [
      { name: "IR plan v2.3 (approved)", updated: "Sep 21, 2026", freshness: "fresh" },
      { name: "Tabletop exercise notes — June", updated: "Jun 14, 2026", freshness: "stale" },
    ],
    risks: [{ label: "Slow containment during breach", severity: "critical" }],
  },
  {
    id: "A.5.30", title: "ICT readiness for business continuity", domain: "Resilience",
    frameworks: ["ISO/IEC 27001"], owner: "RK", status: "attention", automation: "Semi-automated",
    lastTested: "Jul 30, 2026", nextReview: "Oct 30, 2026",
    description: "Backup and recovery objectives (RPO/RTO) are defined and tested; the last restore test is approaching its validity window.",
    evidence: [{ name: "Restore test report — July", updated: "Jul 30, 2026", freshness: "stale" }],
    risks: [{ label: "Backup restore failure", severity: "high" }],
  },
  {
    id: "CC9.2", title: "Vendor risk management", domain: "Third parties",
    frameworks: ["SOC 2"], owner: "AS", status: "operational", automation: "Semi-automated",
    lastTested: "Sep 18, 2026", nextReview: "Dec 18, 2026",
    description: "Third-party vendors are assessed before onboarding and reviewed periodically, with current certificates on file.",
    evidence: [
      { name: "Vendor inventory v12.xlsx", updated: "Sep 18, 2026", freshness: "fresh" },
      { name: "AWS SOC 2 report", updated: "Apr 02, 2026", freshness: "stale" },
    ],
    risks: [{ label: "Vendor breach exposes customer data", severity: "high" }],
  },
];

export function evidenceState(control) {
  if (!control.evidence.length) return "missing";
  return control.evidence.some((e) => e.freshness === "stale") ? "stale" : "fresh";
}
