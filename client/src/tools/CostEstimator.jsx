import { useState } from "react";
import { Check, Mail, Info } from "lucide-react";
import ToolShell from "./ToolShell.jsx";
import { COST_FRAMEWORKS, COST_SIZES, COST_MATURITY, COST_MODELS, estimateCost } from "@shared/tools.js";
import { mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const CUR = ["INR", "USD", "EUR", "GBP", "AED", "SGD", "AUD"];

export default function CostEstimator() {
  useSeo("Compliance Cost Estimator", "Estimate consultant and internal effort for ISO, SOC 2, privacy and AI governance programs, and apply your own day rate.");
  const [s, setS] = useState({ frameworks: ["iso-27001"], size: 1, maturity: 1, model: 1, sites: 1, dayRate: "", currency: "INR" });
  const r = estimateCost({ ...s, dayRate: Number(s.dayRate) || 0 });
  const fmt = (n) => new Intl.NumberFormat("en", { style: "currency", currency: s.currency, maximumFractionDigits: 0 }).format(n);
  const Opt = ({ list, k }) => <div className="grid gap-2 sm:grid-cols-2">{list.map((o, i) => <button key={o[0]} type="button" aria-pressed={s[k] === i} onClick={() => setS({ ...s, [k]: i })} className={`focus-ring rounded-xl border px-4 py-3 text-left text-sm transition ${s[k] === i ? "border-violet bg-violet/15" : "border-edge text-mute hover:text-ink"}`}><span className="block font-medium text-ink">{o[0]}</span>{o[3] && <span className="text-xs text-mute">{o[3]}</span>}</button>)}</div>;
  return (
    <ToolShell icon="Calculator" title="Compliance Cost Estimator" body="Estimate the effort for your program. Add your own day rate to convert effort into a budget range.">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="glass flex flex-col gap-8 rounded-3xl p-6 md:p-8 lg:col-span-7">
          <fieldset><legend className="label">Frameworks</legend><div className="flex flex-wrap gap-2">{COST_FRAMEWORKS.map((f) => { const on = s.frameworks.includes(f.id); return <button key={f.id} aria-pressed={on} onClick={() => setS({ ...s, frameworks: on ? s.frameworks.filter((x) => x !== f.id) : [...s.frameworks, f.id] })} className={`chip ${on ? "border-transparent bg-ink text-void" : "border-edge text-mute hover:text-ink"}`}>{on && <Check size={14} strokeWidth={3} />}{f.name}</button>; })}</div></fieldset>
          <fieldset><legend className="label">Employees in scope</legend><Opt list={COST_SIZES} k="size" /></fieldset>
          <fieldset><legend className="label">Current maturity</legend><Opt list={COST_MATURITY} k="maturity" /></fieldset>
          <fieldset><legend className="label">Delivery model</legend><Opt list={COST_MODELS} k="model" /></fieldset>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label htmlFor="ce-s" className="label">Sites</label><input id="ce-s" type="number" min="1" max="50" className="field" value={s.sites} onChange={(e) => setS({ ...s, sites: Math.max(1, Number(e.target.value) || 1) })} /></div>
            <div><label htmlFor="ce-r" className="label">Consultant day rate</label><input id="ce-r" type="number" min="0" className="field" value={s.dayRate} onChange={(e) => setS({ ...s, dayRate: e.target.value })} placeholder="Optional" /></div>
            <div><label htmlFor="ce-c" className="label">Currency</label><select id="ce-c" className="field" value={s.currency} onChange={(e) => setS({ ...s, currency: e.target.value })}>{CUR.map((c) => <option key={c} className="bg-night">{c}</option>)}</select></div>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="glass print-plain sticky top-28 rounded-3xl p-6 md:p-8">
            {!r ? <p className="text-mute">Select at least one framework.</p> : (<>
              <p className="text-sm text-mute">Consultant effort</p>
              <p className="text-5xl font-semibold tracking-[-0.05em] text-gradient">{r.consultantDays[0]} to {r.consultantDays[1]}<span className="text-lg font-normal text-mute"> days</span></p>
              <p className="mt-5 text-sm text-mute">Internal team effort</p>
              <p className="text-3xl font-semibold">{r.internalDays[0]} to {r.internalDays[1]} days</p>
              {r.cost && <><p className="mt-5 text-sm text-mute">Consulting budget at your rate</p><p className="text-3xl font-semibold">{fmt(r.cost[0])} to {fmt(r.cost[1])}</p></>}
              {r.savings > 0 && <p className="mt-5 rounded-xl bg-aqua/10 p-3 text-sm text-aqua">A unified control set saves about {r.savings}% of effort compared with running each framework separately.</p>}
              <div className="mt-6 flex gap-2 text-xs text-mute"><Info size={14} className="mt-0.5 shrink-0" /><span>Not included: {r.excluded.join("; ")}.</span></div>
              <a href={mailto("Compliance proposal request", `Frameworks: ${r.frameworks.join(", ")}\nModel: ${r.model}\nEstimate: ${r.consultantDays.join(" to ")} consultant days`)} className="btn-glow mt-6 w-full"><Mail size={17} />Get a fixed DU-NZO proposal</a>
            </>)}
          </div>
        </aside>
      </div>
      <p className="mt-4 text-xs text-mute">Indicative planning estimate. DU-NZO confirms scope and fees in a written proposal.</p>
    </ToolShell>
  );
}
