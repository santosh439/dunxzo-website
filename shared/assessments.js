/**
 * DU-NZO readiness and maturity assessments.
 * Each assessment has domains, each domain has questions answered on a 0 to 3 scale.
 * Results map to the DU-NZO five level maturity model.
 */

export const SCALE = [
  { value: 0, label: "Not in place" },
  { value: 1, label: "Informal" },
  { value: 2, label: "Partly documented" },
  { value: 3, label: "Implemented with evidence" },
];

export const LEVELS = [
  { level: 1, name: "Foundation", min: 0 },
  { level: 2, name: "Defined", min: 25 },
  { level: 3, name: "Controlled", min: 50 },
  { level: 4, name: "Measured", min: 70 },
  { level: 5, name: "Continuously Improved", min: 88 },
];

const D = (id, name, gap, questions) => ({ id, name, gap, questions });

export const ASSESSMENTS = {
  "iso-27001": {
    title: "ISO/IEC 27001 Readiness Assessment",
    intro: "Assess readiness across the management system clauses and Annex A controls of ISO/IEC 27001:2022.",
    framework: "iso-27001",
    domains: [
      D("context", "Context and scope (clause 4)", "Define the ISMS scope, internal and external issues and interested party requirements.", [
        "The ISMS scope and boundaries are documented and approved",
        "Interested parties and their security requirements are identified",
      ]),
      D("leadership", "Leadership and policy (clause 5)", "Secure leadership commitment, approve the information security policy and assign roles.", [
        "Top management has approved an information security policy",
        "Security roles and responsibilities are assigned and communicated",
      ]),
      D("risk", "Risk management (clause 6)", "Adopt a risk method, maintain a risk register and produce a Statement of Applicability.", [
        "A documented risk assessment method with acceptance criteria exists",
        "Risks are assessed and a treatment plan is in place",
        "A Statement of Applicability covers all 93 Annex A controls",
      ]),
      D("support", "Support, competence and awareness (clause 7)", "Define competence requirements, run awareness training and control documents.", [
        "Staff complete security awareness training with records kept",
        "Documents and records are version controlled",
      ]),
      D("operations", "Operational controls (clause 8, Annex A)", "Implement key controls such as access, logging, vulnerability, supplier and incident management.", [
        "Access is granted on least privilege and reviewed periodically",
        "Security events are logged and monitored",
        "Vulnerabilities are scanned and patched within defined timelines",
        "Supplier security requirements are defined and reviewed",
        "An incident response procedure is documented and tested",
      ]),
      D("performance", "Performance evaluation (clause 9)", "Measure ISMS performance, run an internal audit and hold a management review.", [
        "ISMS metrics are measured and reported",
        "An internal audit has been completed by an independent auditor",
        "A management review has been held and minuted",
      ]),
      D("improvement", "Improvement (clause 10)", "Track nonconformities and corrective actions to closure.", [
        "Nonconformities and corrective actions are tracked to closure",
      ]),
    ],
  },
  "iso-27701": {
    title: "ISO/IEC 27701 Readiness Assessment",
    intro: "Assess readiness for a privacy information management system under ISO/IEC 27701:2025.",
    framework: "iso-27701",
    domains: [
      D("scope", "PIMS scope and roles", "Define the PIMS scope and whether you act as PII controller, processor or both.", [
        "The PIMS scope is defined and approved",
        "Controller and processor roles are determined for each processing activity",
      ]),
      D("inventory", "PII inventory and records", "Map personal data flows and maintain records of processing.", [
        "Personal data categories and flows are mapped",
        "Records of processing are maintained and current",
      ]),
      D("lawful", "Lawful basis, notice and consent", "Document lawful bases, publish clear notices and record consent where relied on.", [
        "A lawful basis is documented for each purpose",
        "Privacy notices are clear and up to date",
        "Consent is recorded and can be withdrawn",
      ]),
      D("rights", "Data subject rights", "Implement a process to handle access, correction, deletion and other requests on time.", [
        "A procedure handles data subject requests within legal timelines",
        "Requests are logged with evidence of response",
      ]),
      D("design", "Privacy by design and impact assessment", "Run privacy impact assessments and embed privacy in product changes.", [
        "Privacy impact assessments are performed for high risk processing",
        "New features are reviewed for privacy before release",
      ]),
      D("processors", "Processors and international transfers", "Put data processing agreements and transfer safeguards in place.", [
        "Processor agreements include required privacy clauses",
        "International transfers have documented safeguards",
      ]),
      D("breach", "Retention and breach management", "Set retention schedules and a breach notification process.", [
        "Retention periods are defined and deletion is performed",
        "A personal data breach procedure includes regulator and individual notification",
      ]),
    ],
  },
  "iso-42001": {
    title: "ISO/IEC 42001 AI Governance Assessment",
    intro: "Assess your AI management system against ISO/IEC 42001:2023.",
    framework: "iso-42001",
    domains: [
      D("policy", "AI policy and accountability", "Approve an AI policy and assign accountable roles for AI.", [
        "An AI policy is approved by leadership",
        "Roles and accountability for AI systems are assigned",
      ]),
      D("inventory", "AI system inventory", "Keep an inventory of AI systems you develop, provide or use, including third party models.", [
        "All AI systems in use or development are inventoried",
        "Third party AI services and models are identified",
      ]),
      D("risk", "AI risk assessment", "Assess AI specific risks such as bias, robustness, security and misuse.", [
        "AI risks are assessed with a documented method",
        "Risk treatments are defined and owned",
      ]),
      D("impact", "AI system impact assessment", "Assess impacts of AI systems on individuals, groups and society.", [
        "Impact assessments are completed for AI systems",
      ]),
      D("data", "Data for AI", "Govern training and input data quality, provenance and personal data.", [
        "Data provenance and quality for AI are documented",
        "Personal data used in AI has a lawful basis and minimisation",
      ]),
      D("lifecycle", "AI lifecycle, testing and monitoring", "Define verification, validation, release and monitoring for AI systems.", [
        "AI systems are tested and validated before release",
        "Performance and drift are monitored in production",
      ]),
      D("transparency", "Transparency and human oversight", "Inform users about AI and provide human oversight where needed.", [
        "Users are informed when interacting with AI",
        "Human oversight and escalation exist for significant decisions",
      ]),
    ],
  },
  "soc-2": {
    title: "SOC 2 Readiness Assessment",
    intro: "Assess readiness against the AICPA Trust Services Criteria common criteria.",
    framework: "soc-2",
    domains: [
      D("cc1", "Control environment (CC1)", "Establish governance, a code of conduct and background checks.", ["Security governance and a code of conduct are in place", "Background checks are performed where permitted"]),
      D("cc2", "Communication and information (CC2)", "Communicate security responsibilities internally and externally.", ["Security responsibilities are communicated to staff and customers"]),
      D("cc3", "Risk assessment (CC3)", "Perform and document an annual risk assessment including fraud risk.", ["A formal risk assessment is performed at least annually"]),
      D("cc4", "Monitoring activities (CC4)", "Monitor controls and track deficiencies.", ["Controls are monitored and deficiencies tracked"]),
      D("cc6", "Logical and physical access (CC6)", "Enforce MFA, least privilege and regular access reviews.", ["MFA is enforced on critical systems", "User access is reviewed at least quarterly", "Offboarding removes access promptly"]),
      D("cc7", "System operations (CC7)", "Detect, respond to and recover from security events.", ["Security events are logged and alerted", "Incidents are handled with a documented process"]),
      D("cc8", "Change management (CC8)", "Require review and approval for production changes.", ["Production changes are reviewed, tested and approved"]),
      D("cc9", "Risk mitigation and vendors (CC9)", "Assess vendors and maintain business continuity.", ["Vendors are assessed and monitored", "Backups and continuity plans are tested"]),
    ],
  },
  gcc: {
    title: "GCC Compliance Assessment",
    intro: "Score your Global Capability Center across the 15 domains of the DU-NZO GCC Compliance Command Center.",
    domains: [
      D("gov", "Governance", "Establish a local governance forum linked to group security and compliance.", ["A governance forum oversees security and compliance", "Group policies are adopted and localised"]),
      D("infosec", "Information Security", "Run an ISMS aligned with ISO/IEC 27001 and group standards.", ["An ISMS is operated with defined scope", "Security controls are mapped to group requirements"]),
      D("privacy", "Privacy", "Align privacy with DPDPA, GDPR and client obligations.", ["Personal data processing is mapped", "DPDPA and GDPR obligations are assessed"]),
      D("risk", "Risk", "Maintain a risk register reported to group risk.", ["A risk register is maintained and reviewed", "Risks are reported to group leadership"]),
      D("iam", "IAM", "Enforce joiner mover leaver process, MFA and privileged access controls.", ["MFA and least privilege are enforced", "Privileged access is controlled and reviewed"]),
      D("cloud", "Cloud Security", "Apply cloud security baselines and posture monitoring.", ["Cloud configurations follow a baseline", "Cloud posture is continuously monitored"]),
      D("endpoint", "Endpoint Security", "Manage and protect endpoints with MDM and EDR.", ["Devices are managed and encrypted", "Endpoint detection and response is deployed"]),
      D("vendor", "Vendor Risk", "Tier and assess local and global vendors.", ["Vendors are tiered by risk", "Critical vendors are assessed annually"]),
      D("hr", "HR Security", "Screen staff, sign agreements and train everyone.", ["Background verification is performed", "All staff complete security training"]),
      D("asset", "Asset Management", "Keep an accurate asset inventory with owners.", ["Hardware, software and data assets are inventoried with owners"]),
      D("bcm", "Business Continuity", "Maintain tested continuity plans for services delivered to group.", ["A business impact analysis is current", "Continuity plans are exercised"]),
      D("incident", "Incident Management", "Detect and report incidents including CERT-In and group timelines.", ["Incidents are reported within regulatory and group timelines", "Incident response is exercised"]),
      D("regulatory", "Regulatory Alignment", "Track applicable laws and client contractual obligations.", ["Applicable laws and regulations are tracked", "Client contractual obligations are mapped to controls"]),
      D("ai", "AI Governance", "Govern AI use and development across the center.", ["AI use is inventoried and governed by policy"]),
      D("audit", "Audit and Assurance", "Maintain an audit plan covering group, client and certification audits.", ["An internal audit plan is executed", "Client and certification audit findings are tracked to closure"]),
    ],
  },
  "security-maturity": {
    title: "Security Maturity Assessment",
    intro: "Benchmark your security program against the six functions of the NIST Cybersecurity Framework 2.0.",
    framework: "nist-csf",
    domains: [
      D("govern", "Govern", "Set cybersecurity strategy, roles, policy and supply chain risk management.", ["Cybersecurity strategy and risk appetite are defined", "Roles and policies are established", "Supply chain risk is managed"]),
      D("identify", "Identify", "Understand assets, risks and improvement opportunities.", ["Assets are inventoried", "Risks are assessed regularly"]),
      D("protect", "Protect", "Safeguard identity, data, platforms and people.", ["Identity and access are managed with MFA", "Data is protected at rest and in transit", "Staff receive security awareness training"]),
      D("detect", "Detect", "Continuously monitor and analyse security events.", ["Security events are monitored", "Anomalies are analysed and escalated"]),
      D("respond", "Respond", "Manage, analyse, communicate and contain incidents.", ["An incident response plan exists and is tested"]),
      D("recover", "Recover", "Restore operations and communicate during recovery.", ["Backups and recovery are tested", "Recovery communications are planned"]),
    ],
  },
  "audit-readiness": {
    title: "Audit Readiness Score",
    intro: "Find out how ready you are for an ISO certification audit or SOC 2 examination.",
    domains: [
      D("docs", "Documentation", "Complete mandatory documents and ensure they are approved and current.", ["All mandatory documents are complete and approved", "Documents show review dates and owners"]),
      D("evidence", "Evidence", "Collect operating evidence covering the audit period.", ["Evidence exists for each applicable control", "Evidence covers enough time to be sampled"]),
      D("internal", "Internal audit and review", "Complete internal audit and management review before the external audit.", ["The internal audit is complete", "The management review is complete"]),
      D("capa", "Corrective actions", "Close or plan all internal audit findings.", ["Internal audit findings have corrective actions with owners"]),
      D("people", "People readiness", "Brief control owners on audit interviews.", ["Control owners can explain their controls", "Staff know key policies"]),
      D("logistics", "Audit logistics", "Book auditor dates and prepare the audit plan.", ["Auditor dates and scope are confirmed", "An evidence room or repository is ready"]),
    ],
  },
};

export function levelFor(pct) {
  return [...LEVELS].reverse().find((l) => pct >= l.min) || LEVELS[0];
}

/** answers: { [domainId]: number[] } */
export function scoreAssessment(id, answers = {}) {
  const a = ASSESSMENTS[id];
  if (!a) throw new Error("Unknown assessment");
  const domains = a.domains.map((d) => {
    const vals = d.questions.map((_, i) => Math.max(0, Math.min(3, Number(answers[d.id]?.[i] ?? 0))));
    const pct = Math.round((vals.reduce((s, v) => s + v, 0) / (d.questions.length * 3)) * 100);
    return { id: d.id, name: d.name, pct, level: levelFor(pct), gap: d.gap, weakest: d.questions.filter((_, i) => vals[i] < 2) };
  });
  const overall = Math.round(domains.reduce((s, d) => s + d.pct, 0) / domains.length);
  const gaps = domains.filter((d) => d.pct < 67).sort((x, y) => x.pct - y.pct);
  return {
    id, title: a.title, overall, level: levelFor(overall), domains, gaps,
    nextActions: gaps.slice(0, 5).map((g) => g.gap),
    answered: a.domains.reduce((s, d) => s + (answers[d.id]?.filter((v) => v !== undefined && v !== null).length || 0), 0),
    total: a.domains.reduce((s, d) => s + d.questions.length, 0),
  };
}
