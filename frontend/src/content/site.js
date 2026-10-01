/* DU-NZO content model. All page templates render from this file. */

export const BRAND = {
  name: "DU-NZO",
  url: "https://www.du-nzo.com",
  domain: "www.du-nzo.com",
  email: "santosh@du-nzo.com",
  tagline: "Compliance without the complexity.",
  description: "DU-NZO helps startups and GCCs navigate security, privacy, ISO, SOC 2 and AI governance through structured assessments, practical roadmaps and continuous compliance.",
};

export const mailto = (subject = "Enquiry from www.du-nzo.com", body = "") =>
  `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

/* Framework types, used to clearly separate what each requirement is */
export const TYPES = {
  certification: { label: "Certification standard", short: "Certification", color: "text-violet-soft", bg: "bg-violet/15", dot: "bg-violet", note: "Audited by an accredited certification body. A certificate is issued on a positive decision." },
  attestation: { label: "Assurance and attestation", short: "Attestation", color: "text-aqua", bg: "bg-aqua/15", dot: "bg-aqua", note: "An independent auditor issues a report on your controls. There is no certificate." },
  regulation: { label: "Law and regulation", short: "Regulation", color: "text-amber", bg: "bg-amber/15", dot: "bg-amber", note: "Legally binding where it applies. Compliance is demonstrated, not certified." },
  framework: { label: "Voluntary framework", short: "Framework", color: "text-rose", bg: "bg-rose/15", dot: "bg-rose", note: "Best practice guidance adopted voluntarily. No formal certification." },
  industry: { label: "Industry standard", short: "Industry standard", color: "text-aqua-soft", bg: "bg-aqua/10", dot: "bg-aqua-soft", note: "Contractually required by an industry body. Validated by an assessor or self assessment." },
};

export const FRAMEWORKS = [
  {
    slug: "iso-27001", code: "ISO/IEC 27001", name: "ISO/IEC 27001:2022", type: "certification", family: "ISO",
    title: "Information security management system",
    summary: "The most widely recognised international standard for managing information security. Certification shows customers you run a risk based, audited security program.",
    who: "Startups selling to enterprise, GCCs, SaaS and technology companies, and any organisation asked for proof of security in procurement.",
    issuer: "ISO and IEC", assessor: "Accredited certification body", output: "Certificate", cycle: "3 year certificate with annual surveillance audits", region: "Global",
    structure: ["Clauses 4 to 10 define the management system", "Annex A lists 93 controls in 4 themes: Organisational 37, People 8, Physical 14, Technological 34", "Statement of Applicability justifies which controls apply"],
    evidence: ["ISMS scope", "Information security policy", "Risk assessment and treatment plan", "Statement of Applicability", "Internal audit report", "Management review minutes", "Operational records for applicable controls"],
    services: ["gap-assessment", "iso-readiness", "isms-implementation", "risk-assessment", "internal-audit", "audit-preparation"],
    tool: "iso-27001",
  },
  {
    slug: "iso-27701", code: "ISO/IEC 27701", name: "ISO/IEC 27701:2025", type: "certification", family: "ISO",
    title: "Privacy information management system",
    summary: "The international standard for a privacy information management system (PIMS). The 2025 edition is a standalone standard, so it can be certified without ISO/IEC 27001, while still integrating with it.",
    who: "Organisations processing personal data as a PII controller or processor, especially those serving customers under GDPR, DPDPA or similar laws.",
    issuer: "ISO and IEC", assessor: "Accredited certification body", output: "Certificate", cycle: "3 year certificate with annual surveillance audits", region: "Global",
    structure: ["Management system requirements for a PIMS", "Controls for PII controllers", "Controls for PII processors", "Mappings that support alignment with privacy laws"],
    evidence: ["PIMS scope and roles", "Records of processing", "Privacy risk and impact assessments", "Privacy notices and consent records", "Data subject request log", "Processor agreements"],
    services: ["pims-implementation", "privacy-advisory", "gap-assessment", "internal-audit"],
    tool: "iso-27701",
    notice: "If you hold a 2019 edition certificate, ask your certification body about transition timelines to the 2025 edition.",
  },
  {
    slug: "iso-9001", code: "ISO 9001", name: "ISO 9001:2015", type: "certification", family: "ISO",
    title: "Quality management system",
    summary: "The global standard for quality management. It helps you deliver consistent services, satisfy customers and improve processes, and is often requested in enterprise and public sector tenders.",
    who: "Service providers, GCCs delivering shared services, and product companies that need proof of consistent quality.",
    issuer: "ISO", assessor: "Accredited certification body", output: "Certificate", cycle: "3 year certificate with annual surveillance audits", region: "Global",
    structure: ["Clauses 4 to 10 in the harmonised management system structure", "Process approach and risk based thinking", "Customer focus and continual improvement"],
    evidence: ["QMS scope", "Quality policy and objectives", "Process documentation", "Customer feedback records", "Internal audit and management review"],
    services: ["gap-assessment", "internal-audit", "audit-preparation", "policy-development"],
  },
  {
    slug: "iso-22301", code: "ISO 22301", name: "ISO 22301:2019", type: "certification", family: "ISO",
    title: "Business continuity management system",
    summary: "The international standard for business continuity. It proves you can keep critical services running and recover quickly from disruption.",
    who: "GCCs supporting global operations, critical service providers and regulated organisations.",
    issuer: "ISO", assessor: "Accredited certification body", output: "Certificate", cycle: "3 year certificate with annual surveillance audits", region: "Global",
    structure: ["Business impact analysis", "Risk assessment for disruption", "Business continuity strategies and plans", "Exercising and testing"],
    evidence: ["BCMS scope", "Business impact analysis", "Continuity plans", "Exercise reports", "Management review"],
    services: ["bcp-dr", "risk-assessment", "internal-audit"],
  },
  {
    slug: "iso-42001", code: "ISO/IEC 42001", name: "ISO/IEC 42001:2023", type: "certification", family: "ISO",
    title: "Artificial intelligence management system",
    summary: "The first international management system standard for AI. It sets out how to govern the responsible development, provision and use of AI systems.",
    who: "AI companies, SaaS products with AI features, and enterprises deploying AI internally or for customers.",
    issuer: "ISO and IEC", assessor: "Accredited certification body", output: "Certificate", cycle: "3 year certificate with annual surveillance audits", region: "Global",
    structure: ["AI management system clauses 4 to 10", "AI risk assessment and AI system impact assessment", "Annex A controls for AI governance", "Supports alignment with the EU AI Act and similar regulations"],
    evidence: ["AI policy", "AI system inventory", "AI risk assessments", "AI impact assessments", "Data governance records", "Monitoring and incident records"],
    services: ["ai-governance", "risk-assessment", "gap-assessment", "internal-audit"],
    tool: "iso-42001",
  },
  {
    slug: "soc-2", code: "SOC 2", name: "SOC 2", type: "attestation", family: "Assurance",
    title: "Service organisation controls report",
    summary: "An independent attestation report on your controls, based on the AICPA Trust Services Criteria. It is the report most North American customers request during security review.",
    who: "SaaS, cloud and technology service providers selling to North American customers.",
    issuer: "AICPA", assessor: "Licensed CPA firm", output: "Type I or Type II report", cycle: "Type II covers an observation period, usually renewed annually", region: "Primarily North America, recognised globally",
    structure: ["Security (common criteria) is always included", "Optional: Availability, Processing Integrity, Confidentiality, Privacy", "Type I tests design at a point in time", "Type II tests operating effectiveness over a period"],
    evidence: ["System description", "Control matrix mapped to criteria", "Access reviews", "Change management records", "Vendor reviews", "Incident records"],
    services: ["gap-assessment", "audit-preparation", "vendor-risk", "vciso"],
    tool: "soc-2",
  },
  {
    slug: "gdpr", code: "GDPR", name: "EU GDPR (Regulation 2016/679)", type: "regulation", family: "Privacy law",
    title: "EU General Data Protection Regulation",
    summary: "The EU regulation governing personal data. It applies to organisations in the EU and to those outside it that offer goods or services to, or monitor, people in the EU.",
    who: "Any organisation with EU customers, users or employees, including GCCs processing data for EU parent companies.",
    issuer: "European Union", assessor: "Supervisory authorities enforce it", output: "Demonstrated accountability, no general certificate", cycle: "Ongoing obligation", region: "European Union and EEA, extraterritorial reach",
    structure: ["Principles and lawful bases", "Data subject rights", "Accountability, records of processing and DPIAs", "Security and breach notification", "International transfers"],
    evidence: ["Records of processing", "Lawful basis assessments", "DPIAs", "Privacy notices", "Breach log", "Transfer assessments", "Processor agreements"],
    services: ["privacy-advisory", "pims-implementation", "vendor-risk"],
  },
  {
    slug: "dpdpa", code: "DPDPA", name: "India Digital Personal Data Protection Act, 2023", type: "regulation", family: "Privacy law",
    title: "India's data protection law",
    summary: "India's comprehensive data protection law, operationalised by the DPDP Rules notified in November 2025. Obligations take effect in phases, with the main duties for Data Fiduciaries applying 18 months after notification.",
    who: "Organisations processing digital personal data in India, including Indian startups, GCCs and global companies with Indian users.",
    issuer: "Government of India (MeitY)", assessor: "Data Protection Board of India enforces it", output: "Demonstrated compliance, no certificate", cycle: "Ongoing obligation", region: "India, with reach to processing linked to offering services in India",
    structure: ["Notice and consent", "Rights of Data Principals", "Reasonable security safeguards", "Personal data breach intimation", "Additional duties for Significant Data Fiduciaries", "Consent Managers"],
    evidence: ["Data inventory", "Notices and consent records", "Rights request procedure", "Security safeguards", "Breach response plan", "Retention schedule"],
    services: ["privacy-advisory", "gap-assessment", "pims-implementation"],
    notice: "Check the current commencement dates for each obligation. DU-NZO confirms the timeline that applies to you during assessment.",
  },
  {
    slug: "nist-csf", code: "NIST CSF", name: "NIST Cybersecurity Framework 2.0", type: "framework", family: "Framework",
    title: "Cybersecurity outcomes framework",
    summary: "A voluntary framework from the US National Institute of Standards and Technology. Version 2.0 organises cybersecurity outcomes into six functions: Govern, Identify, Protect, Detect, Respond and Recover.",
    who: "Organisations that want a common language for cyber risk, often US linked enterprises and their GCCs.",
    issuer: "NIST (United States)", assessor: "Self assessment or independent review", output: "Current and target profiles", cycle: "Periodic reassessment", region: "Global use, US origin",
    structure: ["Six functions including the new Govern function", "Categories and subcategories of outcomes", "Profiles and implementation tiers"],
    evidence: ["Current profile", "Target profile", "Gap analysis", "Improvement roadmap"],
    services: ["gap-assessment", "risk-assessment", "vciso"],
    tool: "security-maturity",
  },
  {
    slug: "cis-controls", code: "CIS Controls", name: "CIS Critical Security Controls v8.1", type: "framework", family: "Framework",
    title: "Prioritised technical safeguards",
    summary: "A prioritised set of 18 security controls from the Center for Internet Security, grouped into Implementation Groups IG1, IG2 and IG3. IG1 is a practical baseline for smaller organisations.",
    who: "Startups building a baseline and IT teams wanting concrete technical safeguards.",
    issuer: "Center for Internet Security", assessor: "Self assessment or independent review", output: "Implementation group coverage", cycle: "Periodic reassessment", region: "Global",
    structure: ["18 controls with safeguards", "Implementation Groups IG1, IG2, IG3", "Mappings to other frameworks"],
    evidence: ["Asset and software inventories", "Configuration standards", "Vulnerability management records", "Access control records"],
    services: ["gap-assessment", "vciso"],
  },
  {
    slug: "pci-dss", code: "PCI DSS", name: "PCI DSS v4.0.1", type: "industry", family: "Industry",
    title: "Payment card data security",
    summary: "The Payment Card Industry Data Security Standard for any organisation that stores, processes or transmits cardholder data. Validation is through a Qualified Security Assessor or a Self Assessment Questionnaire.",
    who: "Fintech, ecommerce and service providers that handle payment card data.",
    issuer: "PCI Security Standards Council", assessor: "QSA or self assessment, depending on level", output: "Report on Compliance or SAQ with Attestation of Compliance", cycle: "Annual validation", region: "Global",
    structure: ["12 principal requirements", "Scoping of the cardholder data environment", "Customised and defined approaches"],
    evidence: ["Network diagrams and data flows", "Scope documentation", "Vulnerability scans", "Penetration tests", "Access and logging records"],
    services: ["gap-assessment", "audit-preparation", "risk-assessment"],
  },
  {
    slug: "hipaa", code: "HIPAA", name: "HIPAA Privacy and Security Rules", type: "regulation", family: "Privacy law",
    title: "US health information protection",
    summary: "US federal law protecting health information. It applies to covered entities and their business associates, including technology vendors that handle protected health information.",
    who: "Health tech, SaaS vendors and GCCs handling protected health information for US healthcare organisations.",
    issuer: "US Department of Health and Human Services", assessor: "HHS Office for Civil Rights enforces it", output: "Demonstrated compliance, no official certification", cycle: "Ongoing obligation", region: "United States",
    structure: ["Privacy Rule", "Security Rule safeguards: administrative, physical, technical", "Breach Notification Rule", "Business associate agreements"],
    evidence: ["Security risk analysis", "Policies and procedures", "Business associate agreements", "Workforce training records", "Breach log"],
    services: ["privacy-advisory", "risk-assessment", "gap-assessment"],
  },
];

export const SERVICES = [
  { slug: "gap-assessment", name: "Gap Assessment", icon: "FileSearch", summary: "A structured review of where you stand against your target framework, with a prioritised gap register and a realistic timeline.", outcomes: ["Scored gap register", "Prioritised remediation roadmap", "Effort and timeline estimate", "Executive summary for leadership"], duration: "Typically 1 to 3 weeks" },
  { slug: "iso-readiness", name: "ISO Readiness", icon: "Target", summary: "Get certification ready for ISO/IEC 27001, 27701, 42001, 9001 or 22301 with a clear path from gap to Stage 2.", outcomes: ["Readiness score", "Stage 1 document pack", "Certification body selection support", "Audit day preparation"], duration: "Scoped to your standard" },
  { slug: "isms-implementation", name: "ISMS Implementation", icon: "Lock", summary: "Design and embed an ISO/IEC 27001 information security management system around how your teams actually work.", outcomes: ["ISMS scope and context", "Risk method and register", "Statement of Applicability", "Policies and operating procedures"], duration: "Typically 3 to 9 months" },
  { slug: "pims-implementation", name: "PIMS Implementation", icon: "Fingerprint", summary: "Build an ISO/IEC 27701 privacy information management system aligned with GDPR, DPDPA and other privacy laws.", outcomes: ["Controller and processor role mapping", "Records of processing", "Privacy impact assessments", "Rights and consent processes"], duration: "Scoped to your processing" },
  { slug: "risk-assessment", name: "Risk Assessment", icon: "Gauge", summary: "Identify, analyse and treat information security, privacy and AI risks with a method your auditors will accept.", outcomes: ["Risk methodology", "Risk register", "Treatment plan", "Risk owner sign off"], duration: "Typically 2 to 4 weeks" },
  { slug: "policy-development", name: "Policy Development", icon: "ScrollText", summary: "Clear, right sized policies and procedures that satisfy auditors and that your people can follow.", outcomes: ["Policy set mapped to controls", "Procedures and standards", "Approval and review workflow", "Acknowledgement tracking"], duration: "Typically 2 to 6 weeks" },
  { slug: "internal-audit", name: "Internal Audit", icon: "ClipboardCheck", summary: "Independent internal audits and management reviews that meet ISO clause 9 requirements and find issues before the external auditor does.", outcomes: ["Audit programme", "Audit report and findings", "Nonconformity register", "Management review support"], duration: "Typically 1 to 3 weeks" },
  { slug: "audit-preparation", name: "Audit Preparation", icon: "BadgeCheck", summary: "Preparation for certification audits and SOC 2 examinations: evidence readiness, mock interviews and auditor liaison.", outcomes: ["Evidence readiness review", "Mock audit and interviews", "Auditor liaison", "Finding response support"], duration: "Typically 2 to 6 weeks" },
  { slug: "vendor-risk", name: "Vendor Risk", icon: "Network", summary: "Third party risk management that scales: tiering, due diligence, contract clauses and ongoing monitoring.", outcomes: ["Vendor inventory and tiering", "Due diligence questionnaires", "Contract security clauses", "Monitoring cadence"], duration: "Setup plus ongoing" },
  { slug: "bcp-dr", name: "BCP and DR", icon: "LifeBuoy", summary: "Business continuity and disaster recovery planning aligned with ISO 22301 and ISO/IEC 27001 continuity controls.", outcomes: ["Business impact analysis", "Continuity and recovery plans", "Tabletop exercises", "Recovery test reports"], duration: "Typically 4 to 10 weeks" },
  { slug: "vciso", name: "vCISO", icon: "UserRound", summary: "Senior security leadership on demand: strategy, board reporting, customer security reviews and program ownership.", outcomes: ["Security strategy and roadmap", "Board and investor reporting", "Customer questionnaire support", "Program governance"], duration: "Monthly retainer" },
  { slug: "privacy-advisory", name: "Privacy Advisory", icon: "Scale", summary: "Practical privacy guidance across GDPR, DPDPA, HIPAA and global laws, including outsourced DPO support.", outcomes: ["Applicability assessment", "Privacy program design", "DPIAs", "Outsourced DPO support"], duration: "Project or retainer" },
  { slug: "ai-governance", name: "AI Governance", icon: "Sparkles", summary: "Responsible AI governance aligned with ISO/IEC 42001, covering AI inventory, risk and impact assessments, and controls.", outcomes: ["AI system inventory", "AI risk and impact assessments", "AI policy and roles", "ISO/IEC 42001 readiness"], duration: "Scoped to your AI systems" },
];

export const SOLUTIONS = [
  {
    slug: "startups", name: "Startups", icon: "Rocket", headline: "Win enterprise deals without building a compliance team.",
    summary: "From first security questionnaire to ISO/IEC 27001 or SOC 2, DU-NZO gives founders a clear roadmap and does the heavy lifting.",
    pains: ["Enterprise buyers send long security questionnaires", "No budget for a full time security leader", "Unclear whether to choose SOC 2 or ISO/IEC 27001", "Investors ask about data protection and AI risk"],
    journey: ["Launch", "Secure", "Comply", "Certify or assure", "Build trust", "Scale"],
    frameworks: ["iso-27001", "soc-2", "gdpr", "dpdpa", "iso-42001"],
    cta: { label: "Open the Startup Launchpad", to: "/launchpad" },
  },
  {
    slug: "gcc", name: "GCCs", icon: "Building2", headline: "One command center for every compliance obligation your parent expects.",
    summary: "Global Capability Centers inherit requirements from headquarters, clients and local law. DU-NZO unifies them into one governed program.",
    pains: ["Group policies must be localised and evidenced", "Client audits arrive with little notice", "Indian DPDPA obligations sit beside GDPR and US requirements", "Hard to show maturity to global leadership"],
    journey: ["Baseline", "Align with group", "Localise", "Control", "Measure", "Continuously improve"],
    frameworks: ["iso-27001", "iso-27701", "iso-22301", "dpdpa", "gdpr", "nist-csf"],
    cta: { label: "Explore the GCC Command Center", to: "/gcc" },
  },
  {
    slug: "saas", name: "SaaS", icon: "Cloud", headline: "Shorten security reviews and close deals faster.",
    summary: "Show buyers a credible security program with the right certification, a public Trust Center and clean answers to every questionnaire.",
    pains: ["Security reviews slow down sales cycles", "Customers want SOC 2, ISO/IEC 27001 or both", "Multi tenant cloud architecture must be evidenced", "Subprocessor and data residency questions"],
    journey: ["Assess", "Harden cloud", "Certify", "Publish Trust Center", "Automate evidence", "Expand markets"],
    frameworks: ["soc-2", "iso-27001", "gdpr", "iso-27701", "cis-controls"],
    cta: { label: "Check SOC 2 readiness", to: "/tools/soc-2" },
  },
  {
    slug: "ai", name: "AI Companies", icon: "Sparkles", headline: "Govern AI responsibly and prove it.",
    summary: "Build an AI management system aligned with ISO/IEC 42001 and prepare for the EU AI Act and customer AI due diligence.",
    pains: ["Customers ask how models are trained, tested and monitored", "Unclear obligations under emerging AI laws", "Training data may include personal data", "Third party model and API risk"],
    journey: ["Inventory AI", "Assess risk and impact", "Set policy", "Control lifecycle", "Monitor", "Certify"],
    frameworks: ["iso-42001", "iso-27001", "iso-27701", "gdpr"],
    cta: { label: "Take the ISO/IEC 42001 assessment", to: "/tools/iso-42001" },
  },
  {
    slug: "enterprise", name: "Enterprises", icon: "Landmark", headline: "Integrated governance, risk and compliance at scale.",
    summary: "Rationalise overlapping frameworks into one control set, strengthen third party risk and give the board a measurable view of maturity.",
    pains: ["Duplicated controls across many frameworks", "Hundreds of vendors to assess", "Inconsistent evidence across business units", "Board wants measurable risk reporting"],
    journey: ["Rationalise", "Unify controls", "Automate evidence", "Assure", "Report", "Improve"],
    frameworks: ["iso-27001", "iso-22301", "iso-9001", "nist-csf", "pci-dss", "hipaa"],
    cta: { label: "Measure security maturity", to: "/tools/security-maturity" },
  },
];

export const PLATFORM_MODULES = [
  { id: "dashboard", name: "Compliance Dashboard", icon: "LayoutDashboard", summary: "Real time readiness across every framework, with owners and due dates." },
  { id: "controls", name: "Control Management", icon: "ShieldCheck", summary: "One unified control library mapped to every framework in scope." },
  { id: "evidence", name: "Evidence Management", icon: "FolderCheck", summary: "Collect, review and reuse evidence with expiry reminders." },
  { id: "risks", name: "Risk Register", icon: "Gauge", summary: "Likelihood and impact scoring, treatment plans and risk owner sign off." },
  { id: "assets", name: "Asset Register", icon: "Boxes", summary: "Information assets, owners and classification in one place." },
  { id: "policies", name: "Policy Center", icon: "ScrollText", summary: "Versioned policies with approval workflow and staff acknowledgement." },
  { id: "vendors", name: "Vendor Management", icon: "Network", summary: "Tiering, questionnaires, documents and review cadence." },
  { id: "audits", name: "Audit Management", icon: "ClipboardCheck", summary: "Internal and external audits, samples, requests and findings." },
  { id: "capa", name: "CAPA", icon: "Wrench", summary: "Corrective and preventive actions with root cause and verification." },
  { id: "training", name: "Training", icon: "GraduationCap", summary: "Awareness campaigns and completion tracking for every employee." },
  { id: "ai", name: "AI Governance", icon: "Sparkles", summary: "AI system inventory, risk and impact assessments aligned with ISO/IEC 42001." },
  { id: "trust", name: "Trust Center", icon: "Globe2", summary: "A public security page with gated documents for customers." },
];

export const GCC_DOMAINS = [
  ["Governance", "Landmark"], ["Information Security", "Lock"], ["Privacy", "Fingerprint"], ["Risk", "Gauge"], ["IAM", "KeyRound"],
  ["Cloud Security", "Cloud"], ["Endpoint Security", "Laptop"], ["Vendor Risk", "Network"], ["HR Security", "Users"], ["Asset Management", "Boxes"],
  ["Business Continuity", "LifeBuoy"], ["Incident Management", "Siren"], ["Regulatory Alignment", "Scale"], ["AI Governance", "Sparkles"], ["Audit and Assurance", "BadgeCheck"],
];

export const MATURITY_LEVELS = [
  { level: 1, name: "Foundation", body: "Security depends on individuals. Few written policies, controls are ad hoc and evidence is hard to find." },
  { level: 2, name: "Defined", body: "Policies and roles are documented and approved. Group requirements are understood and localised." },
  { level: 3, name: "Controlled", body: "Controls operate consistently with owners and evidence. Ready for certification and client audits." },
  { level: 4, name: "Measured", body: "Metrics, key risk indicators and internal audits show control effectiveness to leadership." },
  { level: 5, name: "Continuously Improved", body: "Automated monitoring, lessons learned and benchmarking drive ongoing improvement." },
];

export const REGIONS = [
  { name: "United States", items: ["SOC 2", "HIPAA", "NIST CSF", "State privacy laws such as CCPA and CPRA"] },
  { name: "Canada", items: ["PIPEDA", "Provincial privacy laws", "SOC 2"] },
  { name: "United Kingdom", items: ["UK GDPR", "Data Protection Act 2018", "Cyber Essentials"] },
  { name: "European Union", items: ["GDPR", "NIS2 Directive", "DORA for financial entities", "EU AI Act"] },
  { name: "India", items: ["DPDP Act 2023 and DPDP Rules 2025", "CERT-In Directions 2022", "Sector rules from RBI, SEBI and IRDAI"] },
  { name: "United Arab Emirates", items: ["Federal PDPL", "DIFC Data Protection Law", "ADGM Data Protection Regulations"] },
  { name: "Saudi Arabia", items: ["Personal Data Protection Law", "NCA Essential Cybersecurity Controls"] },
  { name: "Singapore", items: ["PDPA", "MAS Technology Risk Management Guidelines"] },
  { name: "Australia", items: ["Privacy Act 1988", "Essential Eight", "SOCI Act for critical infrastructure"] },
];

export const GLOSSARY = [
  ["Annex A", "The list of reference controls in ISO/IEC 27001. The 2022 edition has 93 controls in four themes."],
  ["Attestation", "An independent auditor's report on an organisation's controls, such as a SOC 2 report. It is not a certificate."],
  ["Business impact analysis", "An analysis of how disruption would affect critical activities over time, used to set recovery priorities."],
  ["CAPA", "Corrective and preventive action. The process of fixing a nonconformity, addressing its root cause and preventing recurrence."],
  ["Certification body", "An organisation accredited to audit management systems and issue certificates, for example against ISO/IEC 27001."],
  ["Consent Manager", "Under India's DPDPA, a registered entity that lets Data Principals give, manage and withdraw consent through an interoperable platform."],
  ["Data Fiduciary", "Under India's DPDPA, the person or organisation that determines the purpose and means of processing personal data."],
  ["Data Principal", "Under India's DPDPA, the individual to whom the personal data relates."],
  ["DPIA", "Data protection impact assessment. Required under GDPR for processing likely to result in high risk to individuals."],
  ["DPO", "Data protection officer. A role required in certain circumstances under GDPR, and for Significant Data Fiduciaries under DPDPA."],
  ["Evidence", "Records that show a control operates, such as logs, tickets, approvals, screenshots or reports."],
  ["GCC", "Global Capability Center. An offshore or nearshore center owned by a multinational that delivers technology, operations or specialist services."],
  ["Internal audit", "An audit conducted by or for the organisation itself to check the management system conforms and is effective."],
  ["ISMS", "Information security management system, as defined in ISO/IEC 27001."],
  ["Management review", "A periodic review by top management of the management system's performance, required by ISO standards."],
  ["Nonconformity", "A failure to meet a requirement. Major nonconformities can prevent certification until corrected."],
  ["PII controller", "The organisation that decides why and how personally identifiable information is processed."],
  ["PII processor", "An organisation that processes personally identifiable information on behalf of a controller."],
  ["PIMS", "Privacy information management system, as defined in ISO/IEC 27701."],
  ["Records of processing", "A record of processing activities, required by GDPR Article 30 for most organisations."],
  ["Residual risk", "The risk remaining after treatment. Risk owners formally accept residual risk in ISO/IEC 27001."],
  ["Risk treatment plan", "The plan describing how identified risks will be modified, retained, avoided or shared."],
  ["Stage 1 audit", "The first part of an ISO certification audit, reviewing documentation and readiness for Stage 2."],
  ["Stage 2 audit", "The main certification audit, assessing implementation and effectiveness of the management system."],
  ["Statement of Applicability", "An ISO/IEC 27001 document listing the Annex A controls, whether each applies, and the justification."],
  ["Surveillance audit", "An annual audit by the certification body during the three year certificate cycle."],
  ["Trust Center", "A public page that shares an organisation's security, privacy and compliance posture with customers."],
  ["Trust Services Criteria", "The AICPA criteria used in SOC 2: Security, Availability, Processing Integrity, Confidentiality and Privacy."],
  ["Type I and Type II", "SOC 2 report types. Type I covers control design at a point in time. Type II also covers operating effectiveness over a period."],
  ["vCISO", "Virtual chief information security officer. Part time or fractional security leadership provided as a service."],
];

export const GUIDES = [
  {
    slug: "soc-2-vs-iso-27001", title: "SOC 2 or ISO/IEC 27001: which should a startup choose first?", read: "6 min read", tag: "Guide",
    body: [
      ["The short answer", "Follow your customers. If most of your pipeline is North American, buyers usually ask for a SOC 2 report. If you sell to Europe, the Middle East, India or Asia Pacific, or into regulated enterprises, ISO/IEC 27001 is more often requested. Many companies eventually hold both."],
      ["How they differ", "ISO/IEC 27001 is a certifiable management system standard. An accredited certification body audits you and issues a certificate valid for three years with annual surveillance. SOC 2 is an attestation: a licensed CPA firm reports on your controls against the AICPA Trust Services Criteria. There is no certificate, and a Type II report covers a defined observation period."],
      ["Why doing one helps the other", "The controls overlap heavily: access control, change management, logging, vendor management, incident response and risk assessment all appear in both. Building one unified control set means the second framework reuses most of the evidence."],
      ["A practical sequence", "Start with a gap assessment against the framework your customers ask for most. Implement controls once, mapped to both. Complete your first certification or report, publish a Trust Center, then extend to the second framework when the pipeline justifies it."],
    ],
  },
  {
    slug: "iso-27001-certification-steps", title: "The ISO/IEC 27001 certification journey, step by step", read: "8 min read", tag: "Guide",
    body: [
      ["1. Scope and commitment", "Leadership appoints an owner, defines the scope of the ISMS and identifies interested parties and their requirements (clauses 4 and 5)."],
      ["2. Gap assessment", "Every clause and each of the 93 Annex A controls is assessed so you know exactly what to build."],
      ["3. Risk assessment and treatment", "You define a risk method, assess risks, prepare a treatment plan and produce the Statement of Applicability (clause 6)."],
      ["4. Build and operate", "Policies, procedures and technical controls are implemented and run long enough to produce records auditors can sample."],
      ["5. Internal audit and management review", "An independent internal audit and a management review are required before certification (clause 9)."],
      ["6. Stage 1 and Stage 2", "The certification body reviews documentation and readiness in Stage 1, then assesses implementation and effectiveness in Stage 2."],
      ["7. Surveillance and recertification", "Certificates run for three years, with surveillance audits in years one and two and recertification before expiry."],
    ],
  },
  {
    slug: "dpdpa-for-gccs", title: "What India's DPDPA means for Global Capability Centers", read: "7 min read", tag: "GCC",
    body: [
      ["Why GCCs are affected", "GCCs in India process personal data of employees, and often of customers of the parent company. Depending on their role, they may act as a Data Fiduciary for some processing and as a processor for other processing."],
      ["The timeline", "The DPDP Rules were notified in November 2025 with a phased commencement. The Data Protection Board provisions started immediately, Consent Manager provisions follow after one year, and most substantive obligations apply 18 months after notification. Confirm current dates before planning."],
      ["Where to start", "Map personal data flows, confirm your role for each processing activity, review notices and consent, update contracts with the parent and vendors, and test breach response. Many of these activities overlap with GDPR and ISO/IEC 27701, so align them in one privacy program."],
      ["How DU-NZO helps", "We assess applicability, build a DPDPA and GDPR aligned privacy program, and integrate it with your ISO/IEC 27001 ISMS so group and local requirements are evidenced once."],
    ],
  },
];

export const CHECKLISTS = [
  { slug: "iso-27001-mandatory-documents", title: "ISO/IEC 27001 mandatory documents", items: ["ISMS scope (4.3)", "Information security policy (5.2)", "Risk assessment process (6.1.2)", "Risk treatment process (6.1.3)", "Statement of Applicability (6.1.3 d)", "Information security objectives (6.2)", "Evidence of competence (7.2)", "Documented information determined as necessary (7.5.1 b)", "Operational planning and control (8.1)", "Risk assessment results (8.2)", "Risk treatment results (8.3)", "Monitoring and measurement results (9.1)", "Internal audit programme and results (9.2)", "Management review results (9.3)", "Nonconformities and corrective actions (10.2)"] },
  { slug: "soc-2-readiness", title: "SOC 2 readiness checklist", items: ["Choose Trust Services Criteria in scope", "Define the system boundary and description", "Assign control owners", "Enforce MFA and least privilege", "Run and document access reviews", "Formalise change management with approvals", "Centralise logging and alerting", "Document incident response and test it", "Assess and monitor vendors", "Complete security awareness training", "Perform a risk assessment", "Select a licensed CPA firm", "Decide Type I first or go straight to Type II"] },
  { slug: "startup-security-baseline", title: "Startup security baseline", items: ["MFA on email, cloud and code repositories", "Password manager for all staff", "Device encryption and screen lock", "Automatic OS and browser updates", "Least privilege cloud IAM roles", "Backups tested for restore", "Offboarding checklist that removes access", "Security contact and incident process", "Vendor list with data shared", "Privacy notice on your website"] },
];

export const TOOLS = [
  { id: "launchpad", name: "Startup Compliance Launchpad", to: "/launchpad", icon: "Rocket", summary: "Answer 13 questions and get a personalised compliance roadmap.", tag: "Roadmap", featured: true },
  { id: "gcc", name: "GCC Compliance Assessment", to: "/tools/gcc", icon: "Building2", summary: "Score your center across 15 domains on the DU-NZO maturity model.", tag: "Assessment", featured: true },
  { id: "iso-27001", name: "ISO/IEC 27001 Readiness", to: "/tools/iso-27001", icon: "Lock", summary: "Check readiness across clauses 4 to 10 and Annex A.", tag: "Assessment" },
  { id: "iso-27701", name: "ISO/IEC 27701 Readiness", to: "/tools/iso-27701", icon: "Fingerprint", summary: "Assess your privacy information management system.", tag: "Assessment" },
  { id: "iso-42001", name: "ISO/IEC 42001 Assessment", to: "/tools/iso-42001", icon: "Sparkles", summary: "Assess AI governance maturity.", tag: "Assessment" },
  { id: "soc-2", name: "SOC 2 Readiness", to: "/tools/soc-2", icon: "BadgeCheck", summary: "Check readiness against the Trust Services Criteria.", tag: "Assessment" },
  { id: "security-maturity", name: "Security Maturity Assessment", to: "/tools/security-maturity", icon: "Activity", summary: "Benchmark against the six NIST CSF 2.0 functions.", tag: "Assessment" },
  { id: "audit-readiness", name: "Audit Readiness Score", to: "/tools/audit-readiness", icon: "ClipboardCheck", summary: "Find out if you are ready for your certification audit.", tag: "Score" },
  { id: "planner", name: "ISO Certification Planner", to: "/planner", icon: "CalendarRange", summary: "Generate a dated certification plan with owners and milestones.", tag: "Planner" },
  { id: "risk", name: "Risk Assessment Generator", to: "/tools/risk-generator", icon: "Gauge", summary: "Build a starter risk register mapped to ISO/IEC 27001 controls.", tag: "Generator" },
  { id: "vendor", name: "Vendor Risk Questionnaire", to: "/tools/vendor-risk", icon: "Network", summary: "Tier a vendor and see the due diligence it needs.", tag: "Questionnaire" },
  { id: "policy", name: "Policy Gap Checker", to: "/tools/policy-gap", icon: "ScrollText", summary: "See which policies your frameworks expect and which are missing.", tag: "Checker" },
  { id: "cost", name: "Compliance Cost Estimator", to: "/tools/cost-estimator", icon: "Calculator", summary: "Estimate effort and budget for your compliance program.", tag: "Estimator" },
  { id: "compare", name: "Framework Comparison", to: "/tools/compare", icon: "Columns3", summary: "Compare frameworks side by side.", tag: "Comparison" },
];

export const NAV = [
  { label: "Solutions", items: SOLUTIONS.map((s) => ({ label: s.name, to: `/solutions/${s.slug}`, icon: s.icon, desc: s.headline })) },
  { label: "Compliance", columns: [
    { title: "ISO standards", items: FRAMEWORKS.filter((f) => f.family === "ISO").map((f) => ({ label: f.code, to: `/compliance/${f.slug}`, desc: f.title })) },
    { title: "Assurance, laws and frameworks", items: FRAMEWORKS.filter((f) => f.family !== "ISO").map((f) => ({ label: f.code, to: `/compliance/${f.slug}`, desc: f.title })) },
  ] },
  { label: "Services", items: SERVICES.map((s) => ({ label: s.name, to: `/services/${s.slug}`, icon: s.icon })) , grid: true },
  { label: "Platform", to: "/platform" },
  { label: "Resources", items: [
    { label: "Free Tools", to: "/tools", icon: "Wrench", desc: "14 assessments, generators and planners" },
    { label: "Startup Compliance Hub", to: "/resources/startup-hub", icon: "Rocket", desc: "Everything a founder needs" },
    { label: "GCC Compliance Hub", to: "/resources/gcc-hub", icon: "Building2", desc: "For Global Capability Centers" },
    { label: "Framework Comparison", to: "/tools/compare", icon: "Columns3", desc: "Side by side comparison" },
    { label: "Guides and Blog", to: "/resources/guides", icon: "BookOpen", desc: "Practical, plain language guidance" },
    { label: "Checklists and Templates", to: "/resources/checklists", icon: "ListChecks", desc: "Interactive checklists" },
    { label: "Glossary", to: "/resources/glossary", icon: "BookA", desc: "Compliance terms explained" },
    { label: "Trust Center", to: "/trust-center", icon: "Globe2", desc: "How DU-NZO handles your data" },
  ] },
  { label: "Company", items: [
    { label: "About DU-NZO", to: "/company/about", icon: "Info" },
    { label: "Experts", to: "/company/experts", icon: "Users" },
    { label: "Partners", to: "/company/partners", icon: "Handshake" },
    { label: "Contact", to: "/contact", icon: "Mail" },
  ] },
];

export const fwBySlug = (s) => FRAMEWORKS.find((f) => f.slug === s);
export const svcBySlug = (s) => SERVICES.find((f) => f.slug === s);
