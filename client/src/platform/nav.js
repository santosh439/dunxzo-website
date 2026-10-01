import {
  LayoutDashboard,
  ShieldCheck,
  Radar,
  FolderCheck,
  FileText,
  AlertTriangle,
  Building2,
  ClipboardCheck,
  Globe2,
  BadgeCheck,
  Settings,
} from "lucide-react";

export const SECTIONS = [
  { slug: "", name: "Home", path: "/app", icon: LayoutDashboard, command: 2, blurb: "Trust Pulse, posture snapshot and your next best actions across every framework." },
  { slug: "controls", name: "Controls", path: "/app/controls", icon: ShieldCheck, command: 3, blurb: "The control library mapped to every framework, with owners, status and a detail drawer." },
  { slug: "monitoring", name: "Monitoring", path: "/app/monitoring", icon: Radar, command: 4, blurb: "Continuous control monitoring, drift detection and alert triage." },
  { slug: "evidence", name: "Evidence", path: "/app/evidence", icon: FolderCheck, command: 4, blurb: "Evidence collection, freshness tracking and auditor-ready exports." },
  { slug: "policies", name: "Policies", path: "/app/policies", icon: FileText, command: 4, blurb: "Policy lifecycle: drafts, reviews, approvals and employee attestations." },
  { slug: "risk", name: "Risk register", path: "/app/risk", icon: AlertTriangle, command: 5, blurb: "Risks scored by likelihood and impact, linked to the controls that treat them." },
  { slug: "vendors", name: "Vendors", path: "/app/vendors", icon: Building2, command: 5, blurb: "Third-party risk: vendor inventory, reviews, certificates and renewals." },
  { slug: "audit", name: "Audit hub", path: "/app/audit", icon: ClipboardCheck, command: 6, blurb: "Audit readiness, auditor requests and findings in one command center." },
  { slug: "gcc", name: "GCC command center", path: "/app/gcc", icon: Globe2, command: 6, blurb: "Multi-entity oversight for global capability centers, across 15 domains." },
  { slug: "trust-center", name: "Trust Center", path: "/app/trust-center", icon: BadgeCheck, command: 6, blurb: "Your public trust portal: certifications, documents and inbound requests." },
];

export const SETTINGS_SECTION = { slug: "settings", name: "Settings", path: "/app/settings", icon: Settings, command: 8, blurb: "Workspace, members, integrations and platform preferences." };
