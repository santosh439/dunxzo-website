import { useMemo, useState } from "react";
import { Download, Check, Mail } from "lucide-react";
import ToolShell from "./ToolShell.jsx";
import { RISK_LIBRARY, generateRisks, rating } from "@shared/tools.js";
import { downloadText, toCsv } from "../lib/download.js";
import { mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const RC = { Critical: "bg-rose/20 text-rose", High: "bg-amber/20 text-amber", Medium: "bg-violet/20 text-violet-soft", Low: "bg-aqua/15 text-aqua" };

export default function RiskGenerator() {
  useSeo("Risk Assessment Generator", "Generate a starter information security risk register mapped to ISO/IEC 27001 Annex A controls.");
  const [assets, setAssets] = useState(RISK_LIBRARY.slice(0, 4).map((r) => r.asset));
  const [edits, setEdits] = useState({});
  const base = useMemo(() => generateRisks(assets), [assets]);
  const risks = base.map((r) => { const e = edits[r.threat] || {}; const l = e.l ?? r.likelihood, i = e.i ?? r.impact; return { ...r, likelihood: l, impact: i, score: l * i, rating: rating(l * i) }; });
  const toggle = (a) => setAssets(assets.includes(a) ? assets.filter((x) => x !== a) : [...assets, a]);
  const exportCsv = () => downloadText("du-nzo-risk-register.csv", "text/csv;charset=utf-8", toCsv([["ID", "Asset", "Threat scenario", "Likelihood", "Impact", "Score", "Rating", "Treatment", "Suggested controls", "Owner"], ...risks.map((r) => [r.id, r.asset, r.threat, r.likelihood, r.impact, r.score, r.rating, r.treatment, r.controls, ""])]));
  const counts = ["Critical", "High", "Medium", "Low"].map((k) => [k, risks.filter((r) => r.rating === k).length]);
  return (
    <ToolShell icon="Gauge" title="Risk Assessment Generator" body="Select your assets to generate a starter risk register with likelihood, impact and suggested ISO/IEC 27001:2022 Annex A controls. Adjust scores to fit your context.">
      <section className="glass rounded-3xl p-6">
        <h2 className="font-semibold">1. Select assets in scope</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {RISK_LIBRARY.map((r) => { const on = assets.includes(r.asset); return <button key={r.asset} onClick={() => toggle(r.asset)} aria-pressed={on} className={`chip ${on ? "border-transparent bg-ink text-void" : "border-edge text-mute hover:text-ink"}`}>{on && <Check size={14} strokeWidth={3} />}{r.asset}</button>; })}
        </div>
      </section>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{counts.map(([k, n]) => <div key={k} className="glass rounded-2xl p-5"><p className="text-sm text-mute">{k}</p><p className="mt-1 text-3xl font-semibold">{n}</p></div>)}</div>
      <section className="glass mt-6 overflow-hidden rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge p-5"><h2 className="font-semibold">2. Review your risk register ({risks.length} risks)</h2><div className="flex gap-2"><button onClick={exportCsv} className="btn-ghost !min-h-[42px] text-sm" disabled={!risks.length}><Download size={16} />Export CSV</button><a href={mailto("Risk assessment support")} className="btn-glow !min-h-[42px] text-sm"><Mail size={16} />Get expert review</a></div></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-mute"><tr className="border-b border-edge"><th className="p-4 font-medium">ID</th><th className="p-4 font-medium">Asset and threat</th><th className="p-4 font-medium">Likelihood</th><th className="p-4 font-medium">Impact</th><th className="p-4 font-medium">Rating</th><th className="p-4 font-medium">Treatment</th><th className="p-4 font-medium">Suggested controls</th></tr></thead>
            <tbody>
              {risks.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04] align-top last:border-0">
                  <td className="p-4 text-mute">{r.id}</td>
                  <td className="p-4"><span className="block font-medium">{r.threat}</span><span className="text-xs text-mute">{r.asset}</span></td>
                  {["l", "i"].map((k) => (
                    <td key={k} className="p-4"><label className="sr-only" htmlFor={`${r.id}${k}`}>{k === "l" ? "Likelihood" : "Impact"} for {r.id}</label>
                      <select id={`${r.id}${k}`} className="field !h-10 !w-20 !px-2" value={k === "l" ? r.likelihood : r.impact} onChange={(e) => setEdits({ ...edits, [r.threat]: { ...(edits[r.threat] || {}), [k]: Number(e.target.value) } })}>{[1, 2, 3, 4, 5].map((n) => <option key={n} className="bg-night">{n}</option>)}</select></td>
                  ))}
                  <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${RC[r.rating]}`}>{r.score} {r.rating}</span></td>
                  <td className="p-4 text-mute">{r.treatment}</td>
                  <td className="p-4 text-xs text-violet-soft">{r.controls}</td>
                </tr>
              ))}
              {!risks.length && <tr><td colSpan={7} className="p-10 text-center text-mute">Select at least one asset to generate risks.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <p className="mt-4 text-xs text-mute">Scores use a 5 by 5 matrix. Low 1 to 6, Medium 7 to 12, High 13 to 19, Critical 20 to 25. Assign risk owners and approve residual risk as ISO/IEC 27001 clause 6.1 requires.</p>
    </ToolShell>
  );
}
