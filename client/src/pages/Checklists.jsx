import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, ListChecks, Printer, Download } from "lucide-react";
import { PageHero, Reveal, Spotlight, CtaBand } from "../components/ui.jsx";
import NotFound from "./NotFound.jsx";
import { CHECKLISTS } from "../content/site.js";
import { downloadText, toCsv } from "../lib/download.js";
import { useSeo } from "../lib/seo.js";

function Detail({ c }) {
  const [done, setDone] = useState([]);
  const pct = Math.round((done.length / c.items.length) * 100);
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources", "/resources"], ["Checklists", "/resources/checklists"], [c.title]]} kicker="Interactive checklist" title={c.title} />
      <section className="container-x py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="glass print-plain rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between text-sm"><span className="font-medium">{done.length} of {c.items.length} complete</span><span className="text-mute">{pct}%</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-violet to-aqua transition-all" style={{ width: `${pct}%` }} /></div>
            <ul className="mt-6 divide-y divide-white/[0.05]">
              {c.items.map((it) => { const on = done.includes(it); return (
                <li key={it}><label className="flex cursor-pointer items-center gap-4 py-3.5">
                  <input type="checkbox" className="peer sr-only" checked={on} onChange={() => setDone(on ? done.filter((x) => x !== it) : [...done, it])} />
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border peer-focus-visible:ring-2 peer-focus-visible:ring-aqua ${on ? "border-transparent bg-gradient-to-br from-violet to-aqua text-void" : "border-white/20"}`}>{on && <Check size={14} strokeWidth={3} />}</span>
                  <span className={on ? "text-mute line-through decoration-white/30" : ""}>{it}</span>
                </label></li>
              ); })}
            </ul>
            <div className="no-print mt-6 flex flex-wrap gap-2"><button className="btn-ghost !min-h-[44px] text-sm" onClick={() => window.print()}><Printer size={16} />Print</button><button className="btn-ghost !min-h-[44px] text-sm" onClick={() => downloadText(`${c.slug}.csv`, "text/csv;charset=utf-8", toCsv([["Item", "Status"], ...c.items.map((i) => [i, done.includes(i) ? "Done" : "Open"])]))}><Download size={16} />Export CSV</button></div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export default function Checklists() {
  const { slug } = useParams();
  const c = slug ? CHECKLISTS.find((x) => x.slug === slug) : null;
  useSeo(c ? c.title : "Checklists and Templates", "Interactive DU-NZO compliance checklists for ISO/IEC 27001, SOC 2 and startup security.");
  if (slug && !c) return <NotFound />;
  if (c) return <Detail c={c} />;
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources", "/resources"], ["Checklists and Templates"]]} kicker="Checklists and Templates" title="Tick through what matters." body="Interactive checklists you can print or export. DU-NZO policy and procedure templates are available on request." />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {CHECKLISTS.map((x, i) => <Reveal key={x.slug} delay={i * 0.05}><Spotlight as={Link} to={`/resources/checklists/${x.slug}`} className="glass focus-ring flex h-full flex-col gap-3 rounded-3xl p-7"><ListChecks className="text-aqua" /><h2 className="text-xl font-semibold">{x.title}</h2><p className="text-sm text-mute">{x.items.length} items</p><span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Open<ArrowRight size={15} /></span></Spotlight></Reveal>)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
