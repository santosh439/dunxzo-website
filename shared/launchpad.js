/**
 * DU-NZO Startup Compliance Launchpad.
 * Rules based engine that turns 12 answers into a personalised compliance roadmap.
 * Applicability statements are indicative and must be confirmed during assessment.
 */

export const LP_QUESTIONS = [
  { id: "country", label: "Where is your company headquartered?", type: "single", options: ["India", "United States", "United Kingdom", "European Union", "United Arab Emirates", "Saudi Arabia", "Singapore", "Australia", "Canada", "Other"] },
  { id: "industry", label: "What is your industry?", type: "single", options: ["SaaS", "Fintech", "Healthtech", "AI and ML", "Ecommerce", "IT services or GCC", "Other"] },
  { id: "employees", label: "How many employees do you have?", type: "single", options: ["1 to 10", "11 to 50", "51 to 200", "201 to 500", "More than 500"] },
  { id: "customers", label: "Who are your customers?", type: "multi", options: ["Enterprises", "SMBs", "Consumers", "Public sector"] },
  { id: "markets", label: "Where are your customers located?", type: "multi", options: ["North America", "Europe and UK", "India", "Middle East", "Asia Pacific"] },
  { id: "cloud", label: "Where do your systems run?", type: "single", options: ["AWS", "Microsoft Azure", "Google Cloud", "Multi cloud", "On premises or hybrid"] },
  { id: "controls", label: "Which controls do you already have?", type: "multi", options: ["MFA everywhere", "Single sign on", "Device management", "Centralised logging", "Tested backups", "Vulnerability scanning", "Written security policies", "Security training", "Incident response plan", "Vendor reviews"] },
  { id: "certs", label: "Which certifications or reports do you hold?", type: "multi", options: ["None yet", "ISO/IEC 27001", "SOC 2", "ISO/IEC 27701", "ISO 9001", "PCI DSS"] },
  { id: "personal", label: "What personal data do you process?", type: "single", options: ["None", "Business contact details only", "Customer or user personal data", "Sensitive data such as health, financial or children's data"] },
  { id: "ai", label: "How do you use AI?", type: "single", options: ["Not at all", "AI tools used internally", "AI features in our product", "We build or train our own models"] },
  { id: "requirements", label: "What are enterprise customers asking for?", type: "multi", options: ["Security questionnaires", "SOC 2 report", "ISO/IEC 27001 certificate", "Data processing agreement", "Penetration test report", "AI governance answers", "Payment card compliance", "Nothing yet"] },
  { id: "desired", label: "Do you already have a target framework?", type: "single", options: ["Not sure, recommend one", "ISO/IEC 27001", "SOC 2", "ISO/IEC 27701", "ISO/IEC 42001", "GDPR", "DPDPA"] },
  { id: "timeline", label: "When do you need to be ready?", type: "single", options: ["Within 3 months", "3 to 6 months", "6 to 12 months", "More than 12 months"] },
];

export const LP_DEFAULTS = {
  country: "India", industry: "SaaS", employees: "11 to 50", customers: ["Enterprises"], markets: ["India", "North America"],
  cloud: "AWS", controls: ["MFA everywhere"], certs: ["None yet"], personal: "Customer or user personal data", ai: "AI features in our product",
  requirements: ["Security questionnaires"], desired: "Not sure, recommend one", timeline: "6 to 12 months",
};

const CONTROL_META = {
  "MFA everywhere": { cat: "Identity and access", fix: "Enforce MFA on email, cloud consoles, code repositories and admin tools.", weight: 10 },
  "Single sign on": { cat: "Identity and access", fix: "Centralise access through single sign on to simplify joiners, movers and leavers.", weight: 6 },
  "Device management": { cat: "Endpoint security", fix: "Enrol laptops in device management with encryption, screen lock and updates.", weight: 7 },
  "Centralised logging": { cat: "Monitoring and detection", fix: "Centralise cloud, identity and application logs with alerting on key events.", weight: 7 },
  "Tested backups": { cat: "Resilience", fix: "Back up critical data and prove restores work on a schedule.", weight: 8 },
  "Vulnerability scanning": { cat: "Vulnerability management", fix: "Scan cloud and code dependencies and patch within defined timelines.", weight: 7 },
  "Written security policies": { cat: "Governance", fix: "Approve a core policy set: security, access, acceptable use, incident and vendor.", weight: 9 },
  "Security training": { cat: "People", fix: "Run onboarding and annual security awareness training with records.", weight: 5 },
  "Incident response plan": { cat: "Incident management", fix: "Write and test an incident response plan, including regulatory notification timelines.", weight: 8 },
  "Vendor reviews": { cat: "Third party risk", fix: "List vendors with access to data and review the critical ones.", weight: 6 },
};

const LOCAL_LAW = {
  "United Arab Emirates": "UAE Federal PDPL, and DIFC or ADGM rules if based in those free zones",
  "Saudi Arabia": "Saudi Personal Data Protection Law",
  Singapore: "Singapore PDPA",
  Australia: "Australian Privacy Act 1988",
  Canada: "PIPEDA and provincial privacy laws",
  "United Kingdom": "UK GDPR and the Data Protection Act 2018",
  "United States": "US state privacy laws such as CCPA and CPRA, where thresholds are met",
};

const EVIDENCE = {
  "iso-27001": ["ISMS scope", "Risk register and treatment plan", "Statement of Applicability", "Approved policies", "Access review records", "Internal audit report", "Management review minutes"],
  "soc-2": ["System description", "Control matrix", "Quarterly access reviews", "Change approval tickets", "Vendor assessments", "Incident log"],
  gdpr: ["Records of processing", "Privacy notice", "Lawful basis register", "DPIAs where required", "Processor agreements", "Breach log"],
  dpdpa: ["Personal data inventory", "Notice and consent records", "Data Principal request log", "Breach response plan", "Retention schedule"],
  "iso-27701": ["PIMS scope and roles", "Records of processing", "Privacy impact assessments", "Rights request log"],
  "iso-42001": ["AI policy", "AI system inventory", "AI risk and impact assessments", "Model testing and monitoring records"],
  hipaa: ["Security risk analysis", "Business associate agreements", "Workforce training records"],
  "pci-dss": ["Cardholder data flow diagram", "Scope documentation", "Quarterly scans", "SAQ or ROC"],
};

const has = (arr, v) => Array.isArray(arr) && arr.includes(v);

export function buildRoadmap(raw = {}) {
  const a = { ...LP_DEFAULTS, ...raw };
  const controls = (a.controls || []).filter((c) => CONTROL_META[c]);
  const certs = (a.certs || []).filter((c) => c !== "None yet");
  const personal = a.personal !== "None";
  const na = has(a.markets, "North America");
  const eu = has(a.markets, "Europe and UK") || ["European Union", "United Kingdom"].includes(a.country);
  const india = has(a.markets, "India") || a.country === "India";
  const enterprise = has(a.customers, "Enterprises") || has(a.customers, "Public sector");
  const aiProduct = ["AI features in our product", "We build or train our own models"].includes(a.ai);

  /* Maturity */
  const ctrlPct = (controls.length / Object.keys(CONTROL_META).length) * 100;
  const certBonus = Math.min(20, certs.length * 10);
  const maturityPct = Math.min(100, Math.round(ctrlPct * 0.85 + certBonus));
  const levels = ["Foundation", "Defined", "Controlled", "Measured", "Continuously Improved"];
  const level = maturityPct >= 88 ? 5 : maturityPct >= 70 ? 4 : maturityPct >= 50 ? 3 : maturityPct >= 25 ? 2 : 1;

  /* Frameworks */
  const fw = [];
  const add = (slug, name, kind, priority, reason) => {
    const ex = fw.find((f) => f.slug === slug);
    if (ex) { if (priority < ex.priority) ex.priority = priority; ex.reasons.push(reason); return; }
    fw.push({ slug, name, kind, priority, reasons: [reason], held: false });
  };

  if (na && enterprise) add("soc-2", "SOC 2", "Attestation", 1, "Enterprise customers in North America usually request a SOC 2 report.");
  if (has(a.requirements, "SOC 2 report")) add("soc-2", "SOC 2", "Attestation", 1, "Customers are already asking for a SOC 2 report.");
  if (enterprise && (eu || india || has(a.markets, "Middle East") || has(a.markets, "Asia Pacific"))) add("iso-27001", "ISO/IEC 27001", "Certification", 1, "Enterprise buyers outside North America commonly require ISO/IEC 27001.");
  if (has(a.requirements, "ISO/IEC 27001 certificate")) add("iso-27001", "ISO/IEC 27001", "Certification", 1, "Customers are already asking for an ISO/IEC 27001 certificate.");
  if (a.industry === "IT services or GCC") add("iso-27001", "ISO/IEC 27001", "Certification", 1, "IT services providers and GCCs are routinely audited against ISO/IEC 27001.");
  if (has(a.requirements, "Security questionnaires") && !fw.some((f) => f.priority === 1)) add("iso-27001", "ISO/IEC 27001", "Certification", 2, "A recognised certification answers most security questionnaire sections at once.");
  if (personal && eu) add("gdpr", "GDPR", "Regulation", 1, "You process personal data of people in the EU or UK, so GDPR or UK GDPR is likely to apply.");
  if (personal && india) add("dpdpa", "DPDPA", "Regulation", 1, "You process digital personal data in India, so the DPDP Act and Rules are likely to apply.");
  if (LOCAL_LAW[a.country] && personal && !["United Kingdom"].includes(a.country)) add("local", LOCAL_LAW[a.country], "Regulation", 2, `Your headquarters location brings local privacy law into scope.`);
  if (personal && (a.personal.startsWith("Sensitive") || has(a.requirements, "Data processing agreement")) && (eu || india)) add("iso-27701", "ISO/IEC 27701", "Certification", 2, "A certified privacy management system strengthens your answers on personal data.");
  if (aiProduct) add("iso-42001", "ISO/IEC 42001", "Certification", a.ai === "We build or train our own models" || has(a.requirements, "AI governance answers") ? 2 : 3, "AI in your product brings AI governance questions from customers and regulators.");
  if (aiProduct && eu) add("eu-ai-act", "EU AI Act", "Regulation", 2, "AI systems placed on the EU market may fall under the EU AI Act depending on risk category.");
  if (a.industry === "Healthtech" && na) add("hipaa", "HIPAA", "Regulation", 1, "Handling protected health information for US healthcare organisations brings HIPAA obligations.");
  if (["Fintech", "Ecommerce"].includes(a.industry) || has(a.requirements, "Payment card compliance")) add("pci-dss", "PCI DSS", "Industry standard", 2, "PCI DSS applies if you store, process or transmit payment card data.");
  if (!fw.some((f) => ["iso-27001", "soc-2"].includes(f.slug))) add(na ? "soc-2" : "iso-27001", na ? "SOC 2" : "ISO/IEC 27001", na ? "Attestation" : "Certification", 2, "A recognised security baseline prepares you for your first enterprise customers.");

  const desiredMap = { "ISO/IEC 27001": ["iso-27001", "Certification"], "SOC 2": ["soc-2", "Attestation"], "ISO/IEC 27701": ["iso-27701", "Certification"], "ISO/IEC 42001": ["iso-42001", "Certification"], GDPR: ["gdpr", "Regulation"], DPDPA: ["dpdpa", "Regulation"] };
  if (desiredMap[a.desired]) add(desiredMap[a.desired][0], a.desired, desiredMap[a.desired][1], 1, "You selected this as your target framework.");

  const certSlug = { "ISO/IEC 27001": "iso-27001", "SOC 2": "soc-2", "ISO/IEC 27701": "iso-27701", "PCI DSS": "pci-dss" };
  for (const c of certs) { const f = fw.find((x) => x.slug === certSlug[c]); if (f) f.held = true; }
  fw.sort((x, y) => x.priority - y.priority);
  const primary = fw.find((f) => f.priority === 1 && !f.held && ["iso-27001", "soc-2", "iso-27701", "iso-42001"].includes(f.slug)) || fw.find((f) => !f.held);

  /* Gaps and categories */
  const missing = Object.entries(CONTROL_META).filter(([k]) => !controls.includes(k)).sort((x, y) => y[1].weight - x[1].weight);
  const gaps = missing.map(([name, m]) => ({ control: name, category: m.cat, fix: m.fix, severity: m.weight >= 8 ? "High" : m.weight >= 6 ? "Medium" : "Low" }));
  const catNames = [...new Set(Object.values(CONTROL_META).map((m) => m.cat))];
  const categories = catNames.map((cat) => {
    const all = Object.entries(CONTROL_META).filter(([, m]) => m.cat === cat).map(([k]) => k);
    const got = all.filter((k) => controls.includes(k)).length;
    return { name: cat, status: got === all.length ? "In place" : got > 0 ? "Partial" : "Missing" };
  });
  if (personal) categories.push({ name: "Privacy", status: certs.includes("ISO/IEC 27701") ? "In place" : "Missing" });
  if (aiProduct) categories.push({ name: "AI governance", status: "Missing" });

  /* Evidence */
  const evidence = fw.filter((f) => EVIDENCE[f.slug] && !f.held).slice(0, 4).map((f) => ({ framework: f.name, items: EVIDENCE[f.slug] }));

  /* Phases */
  const size = { "1 to 10": 0.7, "11 to 50": 0.85, "51 to 200": 1, "201 to 500": 1.25, "More than 500": 1.5 }[a.employees] || 1;
  const mat = [1.35, 1.15, 1, 0.85, 0.75][level - 1];
  const w = (base) => Math.max(1, Math.round(base * size * mat));
  const phases = [
    { name: "Launch", weeks: w(2), focus: "Confirm scope, owners and applicable requirements. Close the highest risk gaps first.", items: gaps.filter((g) => g.severity === "High").slice(0, 3).map((g) => g.fix).concat(["Appoint a compliance owner and executive sponsor"]) },
    { name: "Secure", weeks: w(4), focus: "Implement baseline technical controls across identity, devices, cloud and monitoring.", items: gaps.filter((g) => g.severity !== "High").slice(0, 4).map((g) => g.fix) },
    { name: "Comply", weeks: w(5), focus: "Approve policies, run the risk assessment and build privacy and AI governance where relevant.", items: ["Approve the core policy set", "Complete the risk assessment and treatment plan", ...(personal ? ["Map personal data and publish privacy notices"] : []), ...fw.filter((f) => f.kind === "Regulation" && !f.held).map((f) => `Align with ${f.name} obligations`), ...(aiProduct ? ["Inventory AI systems and assess AI risk"] : [])] },
    { name: primary?.slug === "soc-2" ? "Assure" : "Certify", weeks: primary?.slug === "soc-2" ? w(10) : w(9), focus: primary?.slug === "soc-2" ? "Operate controls, complete readiness and move through the SOC 2 examination." : "Operate controls, complete internal audit and management review, then Stage 1 and Stage 2.", items: primary?.slug === "soc-2" ? ["Collect evidence for every control", "Complete a readiness review", "Engage a licensed CPA firm for Type I or Type II"] : ["Collect operating evidence", "Complete internal audit and management review", "Complete Stage 1 and Stage 2 with an accredited certification body"] },
    { name: "Build trust", weeks: w(2), focus: "Publish a Trust Center and reuse evidence to answer questionnaires quickly.", items: ["Publish a Trust Center page", "Build a reusable security questionnaire answer library", "Share reports under NDA"] },
    { name: "Scale", weeks: 0, focus: "Extend to the next framework and move to continuous compliance.", items: fw.filter((f) => f !== primary && !f.held && f.kind !== "Regulation").slice(0, 3).map((f) => `Plan for ${f.name}`).concat(["Automate evidence collection and monitoring"]) },
  ];
  const totalWeeks = phases.reduce((s, p) => s + p.weeks, 0);
  const deadline = { "Within 3 months": 13, "3 to 6 months": 26, "6 to 12 months": 52, "More than 12 months": 78 }[a.timeline] || 52;
  const timelineRisk = totalWeeks > deadline
    ? `Your target timeline is shorter than the typical ${totalWeeks} week path. Narrow the initial scope, add capacity or start with a Type I report or a readiness milestone.`
    : null;

  const nextActions = [
    ...gaps.slice(0, 2).map((g) => g.fix),
    primary ? `Run a gap assessment against ${primary.name}` : null,
    personal ? "Map where personal data is collected, stored and shared" : null,
    "Book a 30 minute roadmap review with a DU-NZO expert",
  ].filter(Boolean).slice(0, 5);

  return {
    input: a,
    maturity: { pct: maturityPct, level, name: levels[level - 1] },
    primary: primary ? { slug: primary.slug, name: primary.name } : null,
    frameworks: fw,
    gaps, categories, evidence, phases, totalWeeks, deadline, timelineRisk, nextActions,
    generatedAt: new Date().toISOString(),
  };
}
