import { useState } from "react";
import { Check, Download, Mail } from "lucide-react";
import ToolShell from "./ToolShell.jsx";
import { POLICIES, POLICY_FRAMEWORKS, checkPolicies } from "@shared/tools.js";
import { downloadText, toCsv } from "../lib/download.js";
import { mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function PolicyGap() {
  useSeo("Policy Gap Checker", "Check which policies ISO/IEC 27001, SOC 2, ISO/IEC 27701, GDPR, DPDPA, ISO/IEC 42001 and PCI DSS expect, and which are missing.");
  const [fws, setFws] = useState(["iso27001", "soc2"]);
  const [have, setHave] = useState([]);
  const r = checkPolicies(fws, have);
  const tog = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const relevant = POLICIES.filter(([, f]) => f.some((x) => fws.includes(x)));
  const name = (id) => POLICY_FRAMEWORKS.find(([k]) => k === id)[1];
  return (
    <ToolShell icon="ScrollText" title="Policy Gap Checker" body="Pick your frameworks, tick the policies you already have, and see what is missing.">
      <section className="glass rounded-3xl p-6">
        <h2 className="font-semibold">1. Frameworks in scope</h2>
        <div className="mt-4 flex flex-wrap gap-2">{POLICY_FRAMEWORKS.map(([k, l]) => { const on = fws.includes(k); return <button key={k} aria-pressed={on} onClick={() => tog(fws, setFws, k)} className={`chip ${on ? "border-transparent bg-ink text-void" : "border-edge text-mute hover:text-ink"}`}>{on && <Check size={14} strokeWidth={3} />}{l}</button>; })}</div>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <section className="glass rounded-3xl p-6 lg:col-span-7">
          <h2 className="font-semibold">2. Policies you already have ({relevant.length} expected)</h2>
          <ul className="mt-4 divide-y divide-white/[0.05]">
            {relevant.map(([p, f, ref]) => { const on = have.includes(p); return (
              <li key={p}><label className="flex cursor-pointer items-start gap-4 py-3">
                <input type="checkbox" className="peer sr-only" checked={on} onChange={() => tog(have, setHave, p)} />
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border peer-focus-visible:ring-2 peer-focus-visible:ring-aqua ${on ? "border-transparent bg-gradient-to-br from-violet to-aqua text-void" : "border-white/20"}`}>{on && <Check size={14} strokeWidth={3} />}</span>
                <span><span className="block font-medium">{p}</span><span className="text-xs text-mute">{ref} · {f.filter((x) => fws.includes(x)).map(name).join(", ")}</span></span>
              </label></li>
            ); })}
          </ul>
        </section>
        <aside className="lg:col-span-5">
          <div className="glass print-plain sticky top-28 rounded-3xl p-6">
            <p className="text-sm text-mute">Policy coverage</p>
            <p className="text-6xl font-semibold tracking-[-0.05em] text-gradient">{r.pct}%</p>
            <p className="text-sm text-mute">{r.present} of {r.expected} in place</p>
            <h2 className="mt-6 font-semibold">Missing ({r.missing.length})</h2>
            <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">{r.missing.map((m) => <li key={m.name} className="rounded-xl border border-edge bg-white/[0.02] px-3 py-2 text-sm">{m.name}</li>)}</ul>
            <div className="mt-6 flex flex-col gap-2">
              <a href={mailto("Policy development", `Missing policies:\n${r.missing.map((m) => m.name).join("\n")}`)} className="btn-glow"><Mail size={17} />Get these policies drafted</a>
              <button className="btn-ghost" onClick={() => downloadText("du-nzo-policy-gaps.csv", "text/csv;charset=utf-8", toCsv([["Policy", "Reference", "Frameworks"], ...r.missing.map((m) => [m.name, m.ref, m.frameworks.map(name).join("; ")])]))}><Download size={17} />Export gaps</button>
            </div>
          </div>
        </aside>
      </div>
      <p className="mt-4 text-xs text-mute">Frameworks expect these topics to be documented. Exact documentation requirements depend on your scope and risk assessment.</p>
    </ToolShell>
  );
}
