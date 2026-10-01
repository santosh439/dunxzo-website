import { motion } from "framer-motion";
import { Check, Clock, AlertTriangle, FileText, Upload } from "lucide-react";

const Ring = ({ pct, label, color = "#8B7CFF" }) => {
  const r = 30, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
        <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <motion.circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" transform="rotate(-90 38 38)"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }} />
        <text x="38" y="43" textAnchor="middle" fontSize="15" fontWeight="600" fill="#F4F5FB">{pct}%</text>
      </svg>
      <span className="text-xs text-mute">{label}</span>
    </div>
  );
};

const Row = ({ children }) => <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] py-2.5 text-sm last:border-0">{children}</div>;
const Tag = ({ tone = "mute", children }) => {
  const t = { ok: "bg-aqua/15 text-aqua", warn: "bg-amber/15 text-amber", bad: "bg-rose/15 text-rose", mute: "bg-white/[0.06] text-mute", violet: "bg-violet/15 text-violet-soft" }[tone];
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${t}`}>{children}</span>;
};

const VIEWS = {
  dashboard: () => (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="rounded-2xl border border-edge bg-white/[0.02] p-4 md:col-span-3">
        <p className="text-xs text-mute">Framework readiness</p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <Ring pct={82} label="ISO 27001" /><Ring pct={64} label="SOC 2" color="#3EE0CF" /><Ring pct={47} label="DPDPA" color="#FFB547" /><Ring pct={28} label="ISO 42001" color="#FF6B8B" />
        </div>
      </div>
      <div className="rounded-2xl border border-edge bg-white/[0.02] p-4 md:col-span-2">
        <p className="mb-2 text-xs text-mute">Due this week</p>
        <Row><span>Quarterly access review</span><Tag tone="warn">2 days</Tag></Row>
        <Row><span>Backup restore test</span><Tag tone="ok">Done</Tag></Row>
        <Row><span>Vendor review: payroll</span><Tag tone="bad">Overdue</Tag></Row>
        <Row><span>Policy acknowledgement</span><Tag>87%</Tag></Row>
      </div>
    </div>
  ),
  controls: () => (
    <div className="rounded-2xl border border-edge bg-white/[0.02] p-4">
      <div className="mb-2 grid grid-cols-12 gap-2 text-xs text-mute"><span className="col-span-6">Control</span><span className="col-span-4">Mapped to</span><span className="col-span-2 text-right">Status</span></div>
      {[["Multi factor authentication", "27001 A.8.5 · SOC 2 CC6.1", "ok"], ["Change approval", "27001 A.8.32 · SOC 2 CC8.1", "ok"], ["Security logging", "27001 A.8.15 · SOC 2 CC7.2", "warn"], ["Data subject requests", "27701 · GDPR · DPDPA", "warn"], ["AI impact assessment", "ISO/IEC 42001", "bad"]].map(([c, m, s]) => (
        <div key={c} className="grid grid-cols-12 items-center gap-2 border-b border-white/[0.05] py-2.5 text-sm last:border-0"><span className="col-span-6">{c}</span><span className="col-span-4 truncate text-xs text-mute">{m}</span><span className="col-span-2 text-right"><Tag tone={s}>{s === "ok" ? "Passing" : s === "warn" ? "Partial" : "Gap"}</Tag></span></div>
      ))}
    </div>
  ),
  evidence: () => (
    <div className="grid gap-3 sm:grid-cols-2">
      {[["Access review Q3", "Uploaded by IT lead", "ok"], ["Pen test report", "Expires in 41 days", "warn"], ["Board minutes", "Awaiting upload", "mute"], ["Backup test log", "Collected automatically", "ok"]].map(([t, s, tone]) => (
        <div key={t} className="flex items-center gap-3 rounded-2xl border border-edge bg-white/[0.02] p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">{tone === "mute" ? <Upload size={17} /> : <FileText size={17} />}</span><span className="flex-1"><span className="block text-sm font-medium">{t}</span><span className="text-xs text-mute">{s}</span></span><Tag tone={tone}>{tone === "ok" ? "Valid" : tone === "warn" ? "Expiring" : "Missing"}</Tag></div>
      ))}
    </div>
  ),
  risks: () => (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="rounded-2xl border border-edge bg-white/[0.02] p-4 md:col-span-2">
        <p className="mb-3 text-xs text-mute">Heat map</p>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 25 }).map((_, i) => { const l = 5 - Math.floor(i / 5), im = (i % 5) + 1, s = l * im; const bg = s >= 20 ? "bg-rose/70" : s >= 13 ? "bg-amber/60" : s >= 7 ? "bg-violet/50" : "bg-aqua/30"; return <div key={i} className={`aspect-square rounded ${bg} flex items-center justify-center text-[10px] font-semibold text-void`}>{[3, 7, 12, 18].includes(i) ? "●" : ""}</div>; })}
        </div>
      </div>
      <div className="rounded-2xl border border-edge bg-white/[0.02] p-4 md:col-span-3">
        <Row><span>Cloud misconfiguration exposure</span><Tag tone="bad">15 High</Tag></Row>
        <Row><span>Leaver retains access</span><Tag tone="warn">12 Medium</Tag></Row>
        <Row><span>Vendor outage</span><Tag tone="violet">9 Medium</Tag></Row>
        <Row><span>Lost laptop</span><Tag tone="ok">6 Low</Tag></Row>
      </div>
    </div>
  ),
};

const generic = (title, rows) => () => (
  <div className="rounded-2xl border border-edge bg-white/[0.02] p-4">
    <p className="mb-2 text-xs text-mute">{title}</p>
    {rows.map(([a, b, tone]) => <Row key={a}><span>{a}</span><Tag tone={tone}>{b}</Tag></Row>)}
  </div>
);
Object.assign(VIEWS, {
  assets: generic("Asset register", [["Production database", "Confidential", "bad"], ["Marketing site", "Public", "ok"], ["HR system", "Restricted", "warn"], ["Source code", "Confidential", "bad"]]),
  policies: generic("Policy center", [["Information security policy v3.1", "Approved", "ok"], ["Access control policy", "In review", "warn"], ["AI policy", "Draft", "mute"], ["Acceptable use", "92% acknowledged", "violet"]]),
  vendors: generic("Vendors by tier", [["Cloud hosting provider", "Critical", "bad"], ["Payroll platform", "High", "warn"], ["Design tool", "Medium", "violet"], ["Stock images", "Low", "ok"]]),
  audits: generic("Audit management", [["ISO 27001 Stage 2", "Scheduled", "violet"], ["Internal audit 2026", "Complete", "ok"], ["Client audit: parent group", "Requests open: 6", "warn"]]),
  capa: generic("Corrective actions", [["NC-014 Access review evidence", "Verified", "ok"], ["NC-015 Supplier contract clause", "In progress", "warn"], ["OBS-021 Log retention", "Open", "mute"]]),
  training: generic("Training", [["Security awareness 2026", "94% complete", "ok"], ["Secure coding", "71% complete", "warn"], ["Privacy for support teams", "Launching", "mute"]]),
  ai: generic("AI system inventory", [["Support chatbot", "Impact assessed", "ok"], ["Resume screening model", "High impact", "bad"], ["Code assistant", "Policy applied", "violet"]]),
  trust: generic("Trust Center requests", [["Enterprise prospect: SOC 2 report", "NDA signed", "ok"], ["Bank: ISO certificate", "Approved", "ok"], ["Retailer: pen test summary", "Pending", "warn"]]),
});

export default function DashboardMock({ view = "dashboard" }) {
  const V = VIEWS[view] || VIEWS.dashboard;
  return (
    <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <V />
      <p className="mt-3 flex items-center gap-1.5 text-xs text-mute"><Clock size={12} />Interactive preview with sample data</p>
    </motion.div>
  );
}

export { Ring, Tag, Check, AlertTriangle };
