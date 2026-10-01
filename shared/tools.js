/* DU-NZO free tools: pure logic used by the web app and available to the API. */

/* ---------------- Vendor risk questionnaire ---------------- */
export const VENDOR_QUESTIONS = [
  { id: "data", label: "What data will the vendor access?", options: [["No company data", 0], ["Internal business data", 2], ["Customer personal data", 4], ["Sensitive personal, financial or health data", 6]] },
  { id: "access", label: "What system access will the vendor have?", options: [["None", 0], ["Read only access", 2], ["Write access to business systems", 3], ["Administrative or production access", 5]] },
  { id: "critical", label: "How critical is the service to your operations?", options: [["Low, easy to replace", 0], ["Medium", 2], ["High, disruption affects customers", 4]] },
  { id: "assurance", label: "What independent assurance does the vendor hold?", options: [["ISO/IEC 27001 certificate and SOC 2 Type II", 0], ["One of ISO/IEC 27001 or SOC 2 Type II", 1], ["Self assessment only", 3], ["None", 4]] },
  { id: "location", label: "Where will data be processed?", options: [["Same country as you", 0], ["Another country with safeguards", 2], ["Unknown", 4]] },
  { id: "subs", label: "Does the vendor use subprocessors?", options: [["No", 0], ["Yes, disclosed list", 1], ["Unknown", 3]] },
  { id: "history", label: "Any known security incidents?", options: [["None known", 0], ["Past incident, resolved and disclosed", 1], ["Recent or undisclosed incident", 4]] },
];

export function assessVendor(answers = {}) {
  const max = VENDOR_QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map((o) => o[1])), 0);
  const score = VENDOR_QUESTIONS.reduce((s, q) => s + (q.options[answers[q.id] ?? 0]?.[1] ?? 0), 0);
  const pct = Math.round((score / max) * 100);
  const tier = pct >= 65 ? "Critical" : pct >= 45 ? "High" : pct >= 25 ? "Medium" : "Low";
  const base = ["Record the vendor, owner and data shared in the vendor register"];
  const steps = {
    Low: [...base, "Accept standard terms", "Review every 24 months"],
    Medium: [...base, "Collect a security questionnaire", "Sign a data processing agreement if personal data is involved", "Review annually"],
    High: [...base, "Collect ISO/IEC 27001 certificate or SOC 2 Type II report", "Complete a detailed security questionnaire", "Include security, breach notification and audit clauses in the contract", "Review annually with owner sign off"],
    Critical: [...base, "Collect and review ISO/IEC 27001 and SOC 2 Type II, including exceptions", "Perform a detailed assessment or on site review", "Contract for breach notification, audit rights, subprocessor approval and exit support", "Confirm business continuity and exit plans", "Review every 6 months and monitor continuously"],
  }[tier];
  const flags = [];
  if ((answers.assurance ?? 0) >= 2) flags.push("No independent assurance. Rely on a detailed questionnaire and contract controls.");
  if ((answers.location ?? 0) === 2) flags.push("Unknown processing location. Confirm data residency and transfer safeguards.");
  if ((answers.history ?? 0) === 2) flags.push("Recent or undisclosed incident. Escalate to the security owner before onboarding.");
  if ((answers.subs ?? 0) === 2) flags.push("Unknown subprocessors. Request the full subprocessor list.");
  return { score, max, pct, tier, steps, flags };
}

/* ---------------- Compliance cost estimator ---------------- */
export const COST_FRAMEWORKS = [
  { id: "iso-27001", name: "ISO/IEC 27001", days: 35 },
  { id: "soc-2", name: "SOC 2", days: 30 },
  { id: "iso-27701", name: "ISO/IEC 27701", days: 22 },
  { id: "iso-42001", name: "ISO/IEC 42001", days: 25 },
  { id: "iso-9001", name: "ISO 9001", days: 20 },
  { id: "iso-22301", name: "ISO 22301", days: 22 },
  { id: "gdpr", name: "GDPR", days: 15 },
  { id: "dpdpa", name: "DPDPA", days: 15 },
];
export const COST_SIZES = [["1 to 50", 0.75], ["51 to 250", 1], ["251 to 1,000", 1.35], ["More than 1,000", 1.8]];
export const COST_MATURITY = [["Starting from scratch", 1.3], ["Some foundations", 1], ["Well established", 0.7]];
export const COST_MODELS = [
  ["Guided", 0.55, 1.4, "DU-NZO advises and reviews, your team implements"],
  ["Co delivered", 1, 0.9, "DU-NZO and your team implement together"],
  ["Fully managed", 1.45, 0.5, "DU-NZO runs the program end to end"],
];

export function estimateCost({ frameworks = ["iso-27001"], size = 1, maturity = 1, model = 1, dayRate = 0, sites = 1 } = {}) {
  const sel = COST_FRAMEWORKS.filter((f) => frameworks.includes(f.id)).sort((a, b) => b.days - a.days);
  if (!sel.length) return null;
  const [, sf] = COST_SIZES[size] || COST_SIZES[1];
  const [, mf] = COST_MATURITY[maturity] || COST_MATURITY[1];
  const [mName, cf, inf] = COST_MODELS[model] || COST_MODELS[1];
  const siteF = Math.min(1.4, 1 + 0.06 * (Math.max(1, sites) - 1));
  // Each additional framework reuses the shared control set, so it costs less.
  const baseDays = sel.reduce((s, f, i) => s + f.days * (i === 0 ? 1 : 0.55), 0);
  const consultant = baseDays * sf * mf * cf * siteF;
  const internal = baseDays * sf * mf * inf * siteF;
  const r = (v) => [Math.round(v * 0.8), Math.round(v * 1.2)];
  return {
    model: mName,
    frameworks: sel.map((f) => f.name),
    consultantDays: r(consultant),
    internalDays: r(internal),
    cost: dayRate > 0 ? r(consultant * dayRate) : null,
    savings: sel.length > 1 ? Math.round((1 - baseDays / sel.reduce((s, f) => s + f.days, 0)) * 100) : 0,
    excluded: ["Certification body or CPA firm audit fees, quoted separately", "Security tooling licences", "Penetration testing"],
  };
}

/* ---------------- Risk assessment generator ---------------- */
export const RISK_LIBRARY = [
  { asset: "Customer data in cloud databases", scenarios: [
    ["Unauthorised access through compromised credentials", 3, 5, "A.5.15, A.5.17, A.8.5"],
    ["Data exposure through cloud misconfiguration", 3, 5, "A.8.9, A.8.20"],
    ["Ransomware or destructive attack", 2, 5, "A.8.7, A.8.13"],
  ] },
  { asset: "Source code and CI/CD pipeline", scenarios: [
    ["Secrets leaked in code repositories", 3, 4, "A.8.4, A.8.24"],
    ["Malicious or vulnerable dependency introduced", 3, 4, "A.8.8, A.8.28"],
    ["Unauthorised change deployed to production", 2, 4, "A.8.32, A.8.31"],
  ] },
  { asset: "Employee laptops", scenarios: [
    ["Lost or stolen device with unencrypted data", 3, 3, "A.7.9, A.8.1"],
    ["Malware infection through phishing", 4, 3, "A.6.3, A.8.7"],
  ] },
  { asset: "Email and collaboration tools", scenarios: [
    ["Business email compromise and payment fraud", 3, 4, "A.5.14, A.6.3, A.8.5"],
    ["Sensitive data shared externally by mistake", 3, 3, "A.5.12, A.5.14"],
  ] },
  { asset: "Identity provider and admin accounts", scenarios: [
    ["Privileged account takeover", 2, 5, "A.8.2, A.8.5"],
    ["Leavers retain access after exit", 3, 4, "A.5.18, A.6.5"],
  ] },
  { asset: "Critical SaaS vendors", scenarios: [
    ["Vendor breach exposes company data", 2, 4, "A.5.19, A.5.21, A.5.22"],
    ["Vendor outage disrupts service delivery", 3, 3, "A.5.23, A.5.30"],
  ] },
  { asset: "Production application", scenarios: [
    ["Web application vulnerability exploited", 3, 5, "A.8.25, A.8.26, A.8.29"],
    ["Denial of service affects availability", 2, 4, "A.8.6, A.8.14"],
  ] },
  { asset: "Backups", scenarios: [["Backups fail to restore when needed", 2, 5, "A.8.13"]] },
  { asset: "Personal data of employees", scenarios: [["HR data accessed without authorisation", 2, 4, "A.5.34, A.8.3"]] },
  { asset: "AI models and training data", scenarios: [
    ["Personal or confidential data leaks through model outputs", 2, 4, "A.5.34, A.8.11 and ISO/IEC 42001 controls"],
    ["Model produces biased or unsafe outcomes", 2, 4, "ISO/IEC 42001 impact assessment and monitoring"],
  ] },
  { asset: "Office premises", scenarios: [["Unauthorised physical access", 2, 3, "A.7.1, A.7.2"]] },
];

export const rating = (score) => (score >= 20 ? "Critical" : score >= 13 ? "High" : score >= 7 ? "Medium" : "Low");

export function generateRisks(assets = []) {
  let n = 0;
  return RISK_LIBRARY.filter((r) => assets.includes(r.asset)).flatMap((r) => r.scenarios.map(([threat, likelihood, impact, controls]) => {
    n += 1;
    const score = likelihood * impact;
    return { id: `R${String(n).padStart(3, "0")}`, asset: r.asset, threat, likelihood, impact, score, rating: rating(score), treatment: score >= 13 ? "Modify: implement controls" : score >= 7 ? "Modify or retain with monitoring" : "Retain and monitor", controls, owner: "" };
  }));
}

/* ---------------- Policy gap checker ---------------- */
export const POLICY_FRAMEWORKS = [
  ["iso27001", "ISO/IEC 27001"], ["soc2", "SOC 2"], ["iso27701", "ISO/IEC 27701"], ["gdpr", "GDPR"], ["dpdpa", "DPDPA"], ["iso42001", "ISO/IEC 42001"], ["pci", "PCI DSS"],
];
export const POLICIES = [
  ["Information security policy", ["iso27001", "soc2", "pci", "iso27701"], "Required by ISO/IEC 27001 clause 5.2"],
  ["Risk management methodology", ["iso27001", "soc2", "iso27701", "iso42001", "pci"], "Required by ISO/IEC 27001 clause 6.1"],
  ["Acceptable use policy", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.5.10"],
  ["Access control policy", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.5.15"],
  ["Authentication and password standard", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.5.17"],
  ["Asset management policy", ["iso27001", "pci"], "ISO/IEC 27001 A.5.9"],
  ["Data classification and handling", ["iso27001", "soc2", "iso27701"], "ISO/IEC 27001 A.5.12, A.5.13"],
  ["Cryptography policy", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.8.24"],
  ["Backup policy", ["iso27001", "soc2"], "ISO/IEC 27001 A.8.13"],
  ["Logging and monitoring standard", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.8.15, A.8.16"],
  ["Vulnerability and patch management", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.8.8"],
  ["Change management procedure", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.8.32"],
  ["Secure development policy", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.8.25"],
  ["Supplier security policy", ["iso27001", "soc2", "pci", "iso27701", "gdpr", "dpdpa"], "ISO/IEC 27001 A.5.19"],
  ["Incident response plan", ["iso27001", "soc2", "pci", "iso27701", "iso42001"], "ISO/IEC 27001 A.5.24"],
  ["Business continuity plan", ["iso27001", "soc2"], "ISO/IEC 27001 A.5.29, A.5.30"],
  ["HR security and screening", ["iso27001", "soc2", "pci"], "ISO/IEC 27001 A.6.1, A.6.2"],
  ["Remote working policy", ["iso27001"], "ISO/IEC 27001 A.6.7"],
  ["Privacy notice", ["gdpr", "dpdpa", "iso27701"], "GDPR Articles 13 and 14, DPDPA notice duties"],
  ["Data retention and deletion schedule", ["gdpr", "dpdpa", "iso27701", "pci"], "Storage limitation duties"],
  ["Data subject rights procedure", ["gdpr", "dpdpa", "iso27701"], "GDPR Chapter III, DPDPA rights of Data Principals"],
  ["DPIA procedure", ["gdpr", "iso27701"], "GDPR Article 35"],
  ["Personal data breach procedure", ["gdpr", "dpdpa", "iso27701"], "GDPR Articles 33 and 34, DPDPA breach intimation"],
  ["AI policy", ["iso42001"], "ISO/IEC 42001 AI policy requirement"],
  ["AI system impact assessment procedure", ["iso42001"], "ISO/IEC 42001 impact assessment"],
];

export function checkPolicies(frameworks = [], have = []) {
  const expected = POLICIES.filter(([, fws]) => fws.some((f) => frameworks.includes(f)));
  const missing = expected.filter(([name]) => !have.includes(name));
  return { expected: expected.length, present: expected.length - missing.length, missing: missing.map(([name, fws, ref]) => ({ name, ref, frameworks: fws.filter((f) => frameworks.includes(f)) })), pct: expected.length ? Math.round(((expected.length - missing.length) / expected.length) * 100) : 0 };
}
