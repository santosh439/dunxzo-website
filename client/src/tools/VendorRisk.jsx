import { useState } from "react";
import { Check, AlertTriangle, Mail } from "lucide-react";
import ToolShell from "./ToolShell.jsx";
import { VENDOR_QUESTIONS, assessVendor } from "@shared/tools.js";
import { mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const TC = { Critical: "from-rose to-amber", High: "from-amber to-violet-soft", Medium: "from-violet to-violet-soft", Low: "from-aqua to-aqua-soft" };

export default function VendorRisk() {
  useSeo("Vendor Risk Questionnaire", "Tier a vendor by inherent risk and see the due diligence DU-NZO recommends.");
  const [name, setName] = useState("");
  const [a, setA] = useState({});
  const r = assessVendor(a);
  return (
    <ToolShell icon="Network" title="Vendor Risk Questionnaire" body="Answer seven questions about a vendor to calculate its inherent risk tier and the due diligence it needs.">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="glass rounded-3xl p-6 md:p-8 lg:col-span-7">
          <label htmlFor="vn" className="label">Vendor name</label>
          <input id="vn" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vendor name" />
          <div className="mt-8 space-y-7">
            {VENDOR_QUESTIONS.map((q) => (
              <fieldset key={q.id}>
                <legend className="mb-3 font-medium">{q.label}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map(([label], i) => { const on = (a[q.id] ?? 0) === i; return (
                    <button key={label} type="button" aria-pressed={on} onClick={() => setA({ ...a, [q.id]: i })} className={`focus-ring flex min-h-[48px] items-center justify-between gap-2 rounded-xl border px-4 py-2 text-left text-sm transition ${on ? "border-violet bg-violet/15" : "border-edge text-mute hover:text-ink"}`}>{label}{on && <Check size={15} className="shrink-0 text-aqua" strokeWidth={3} />}</button>
                  ); })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="glass print-plain sticky top-28 rounded-3xl p-6 md:p-8">
            <p className="text-sm text-mute">{name || "This vendor"} is</p>
            <p className={`mt-1 bg-gradient-to-r ${TC[r.tier]} bg-clip-text text-6xl font-semibold tracking-[-0.05em] text-transparent`}>{r.tier}</p>
            <p className="text-sm text-mute">Inherent risk score {r.score} of {r.max}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full bg-gradient-to-r ${TC[r.tier]} transition-all`} style={{ width: `${Math.max(4, r.pct)}%` }} /></div>
            {r.flags.length > 0 && <ul className="mt-6 space-y-2">{r.flags.map((f) => <li key={f} className="flex gap-2 rounded-xl border border-amber/30 bg-amber/10 p-3 text-sm text-amber"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{f}</li>)}</ul>}
            <h2 className="mt-6 font-semibold">Recommended due diligence</h2>
            <ul className="mt-3 space-y-2">{r.steps.map((s) => <li key={s} className="flex gap-2 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-aqua" strokeWidth={2.6} />{s}</li>)}</ul>
            <a href={mailto("Vendor risk management", `Vendor: ${name}\nTier: ${r.tier}`)} className="btn-glow mt-6 w-full"><Mail size={17} />Set up vendor risk with DU-NZO</a>
          </div>
        </aside>
      </div>
    </ToolShell>
  );
}
