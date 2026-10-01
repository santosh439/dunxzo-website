export const PULSE = {
  score: 82,
  delta: 4,
  period: "this week",
  pillars: [
    { id: "controls", label: "Controls health", value: 86 },
    { id: "evidence", label: "Evidence freshness", value: 74 },
    { id: "risk", label: "Risk coverage", value: 81 },
    { id: "vendors", label: "Vendor assurance", value: 68 },
  ],
  changes: [
    { text: "Quarterly access review completed for AWS production", delta: 2, when: "2d ago" },
    { text: "Incident response policy v2.3 approved and published", delta: 3, when: "3d ago" },
    { text: "2 vendor certificates expired without renewal", delta: -1, when: "4d ago" },
  ],
};

export const FRAMEWORKS = [
  { id: "iso-27001", name: "ISO/IEC 27001", status: "on-track", progress: 0.81, controls: "92 of 114 controls", meta: "Certification audit in 23 days" },
  { id: "soc-2", name: "SOC 2 Type II", status: "on-track", progress: 0.74, controls: "78 of 105 controls", meta: "Observation window ends Nov 30" },
  { id: "dpdpa", name: "DPDPA", status: "attention", progress: 0.58, controls: "31 of 54 controls", meta: "Grievance workflow not yet published" },
  { id: "iso-42001", name: "ISO/IEC 42001", status: "early", progress: 0.22, controls: "12 of 55 controls", meta: "Kickoff scheduled for next week" },
];

export const ACTIONS = [
  { id: 1, title: "Renew the expired SOC 2 certificate for CloudRetain", framework: "Vendors", impact: 3, owner: "PK", due: "Overdue by 2 days", tone: "danger" },
  { id: 2, title: "Publish the grievance officer notice on your website", framework: "DPDPA", impact: 4, owner: "AS", due: "Due in 2 days", tone: "warning" },
  { id: 3, title: "Upload Q3 access review evidence for production databases", framework: "SOC 2", impact: 2, owner: "RK", due: "Due in 5 days", tone: "neutral" },
  { id: 4, title: "Assign owners to 6 unowned ISO/IEC 27001 controls", framework: "ISO/IEC 27001", impact: 2, owner: "You", due: "This week", tone: "neutral" },
  { id: 5, title: "Run the tabletop exercise for the incident response plan", framework: "ISO/IEC 27001", impact: 3, owner: "MT", due: "Next week", tone: "neutral" },
];

export const UPCOMING = [
  { label: "Vendor review: DataBridge Analytics", date: "Oct 9", days: 8 },
  { label: "ISO/IEC 27001 certification audit", date: "Oct 24", days: 23 },
  { label: "SOC 2 observation window ends", date: "Nov 30", days: 60 },
];

export const ACTIVITY = [
  { text: "Priya K. uploaded the penetration test report", when: "2h ago" },
  { text: "Monitoring flagged stale evidence on CC6.1", when: "5h ago" },
  { text: "Arjun S. approved Incident Response Policy v2.3", when: "1d ago" },
  { text: "Weekly control sync completed — 3 drifts found", when: "1d ago" },
];
