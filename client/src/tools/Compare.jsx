import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import ToolShell from "./ToolShell.jsx";
import { TypeBadge } from "../components/ui.jsx";
import { FRAMEWORKS, TYPES } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const ROWS = [
  ["Type", (f) => <TypeBadge type={f.type} />], ["What it is", (f) => f.title], ["Published by", (f) => f.issuer], ["Assessed by", (f) => f.assessor],
  ["You receive", (f) => f.output], ["Cycle", (f) => f.cycle], ["Geography", (f) => f.region], ["Who needs it", (f) => f.who],
  ["Key evidence", (f) => <ul className="space-y-1">{f.evidence.slice(0, 4).map((e) => <li key={e}>{e}</li>)}</ul>],
];

export default function Compare() {
  useSeo("Framework Comparison", "Compare ISO/IEC 27001, 27701, 42001, SOC 2, GDPR, DPDPA, NIST CSF, PCI DSS and more side by side.");
  const [sel, setSel] = useState(["iso-27001", "soc-2", "dpdpa"]);
  const picks = sel.map((s) => FRAMEWORKS.find((f) => f.slug === s));
  const tog = (s) => setSel(sel.includes(s) ? sel.filter((x) => x !== s) : sel.length >= 4 ? [...sel.slice(1), s] : [...sel, s]);
  return (
    <ToolShell icon="Columns3" title="Framework Comparison" body="Pick up to four frameworks to compare what they are, who assesses them and what you receive.">
      <div className="glass rounded-3xl p-6">
        <div className="flex flex-wrap gap-2">{FRAMEWORKS.map((f) => { const on = sel.includes(f.slug); return <button key={f.slug} aria-pressed={on} onClick={() => tog(f.slug)} className={`chip ${on ? "border-transparent bg-ink text-void" : "border-edge text-mute hover:text-ink"}`}>{on && <Check size={14} strokeWidth={3} />}{f.code}</button>; })}</div>
      </div>
      <div className="glass mt-6 overflow-x-auto rounded-3xl">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead><tr className="border-b border-edge"><th className="w-44 p-5" scope="col"><span className="sr-only">Attribute</span></th>{picks.map((f) => <th key={f.slug} scope="col" className="p-5 align-bottom"><Link to={`/compliance/${f.slug}`} className="text-lg font-semibold hover:text-aqua">{f.code}</Link></th>)}</tr></thead>
          <tbody>{ROWS.map(([l, fn]) => <tr key={l} className="border-b border-white/[0.05] last:border-0"><th scope="row" className="p-5 align-top font-medium text-mute">{l}</th>{picks.map((f) => <td key={f.slug} className="p-5 align-top leading-relaxed text-ink/90">{fn(f)}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-5">{Object.entries(TYPES).map(([k, t]) => <div key={k} className="glass rounded-2xl p-4"><TypeBadge type={k} /><p className="mt-2 text-xs leading-relaxed text-mute">{t.note}</p></div>)}</div>
    </ToolShell>
  );
}
