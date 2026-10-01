import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Printer, Mail, RefreshCw, Check } from "lucide-react";
import ToolShell from "./ToolShell.jsx";
import NotFound from "../pages/NotFound.jsx";
import { ASSESSMENTS, SCALE, scoreAssessment } from "@shared/assessments.js";
import { TOOLS, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const levelColor = (l) => ["", "from-rose to-amber", "from-amber to-violet-soft", "from-violet to-violet-soft", "from-violet to-aqua", "from-aqua to-aqua-soft"][l];

export default function Assessment() {
  const { id } = useParams();
  const a = ASSESSMENTS[id];
  const tool = TOOLS.find((t) => t.id === id);
  useSeo(a?.title || "Not found", a?.intro);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const result = useMemo(() => (a ? scoreAssessment(id, answers) : null), [id, answers, a]);
  if (!a) return <NotFound />;

  const set = (d, i, v) => setAnswers((s) => { const arr = [...(s[d] || [])]; arr[i] = v; return { ...s, [d]: arr }; });
  const complete = result.answered === result.total;

  if (done) {
    const summary = `${a.title}\nOverall: ${result.overall}% (Level ${result.level.level} ${result.level.name})\n${result.domains.map((d) => `${d.name}: ${d.pct}%`).join("\n")}`;
    return (
      <ToolShell icon={tool?.icon} kicker="Your results" title={a.title}>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="glass print-plain rounded-3xl p-7 lg:col-span-4">
            <p className="text-sm text-mute">Overall readiness</p>
            <p className="mt-2 text-7xl font-semibold tracking-[-0.06em] text-gradient">{result.overall}%</p>
            <p className="mt-2 text-xl font-semibold">Level {result.level.level}: {result.level.name}</p>
            <div className="mt-5 flex gap-1.5">{[1, 2, 3, 4, 5].map((l) => <span key={l} className={`h-2 flex-1 rounded-full ${l <= result.level.level ? "bg-gradient-to-r from-violet to-aqua" : "bg-white/[0.08]"}`} />)}</div>
            <div className="no-print mt-8 flex flex-col gap-2">
              <a href={mailto(`${a.title} results`, summary)} className="btn-glow"><Mail size={17} />Review with an expert</a>
              <button onClick={() => window.print()} className="btn-ghost"><Printer size={17} />Print or save PDF</button>
              <button onClick={() => setDone(false)} className="btn-ghost"><RefreshCw size={17} />Edit answers</button>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="glass print-plain rounded-3xl p-7">
              <h2 className="text-xl font-semibold">Score by domain</h2>
              <ul className="mt-6 space-y-4">
                {result.domains.map((d, i) => (
                  <li key={d.id}>
                    <div className="mb-2 flex justify-between gap-4 text-sm"><span>{d.name}</span><span className="shrink-0 tabular-nums text-mute">{d.pct}% · L{d.level.level}</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]"><motion.div className={`h-full rounded-full bg-gradient-to-r ${levelColor(d.level.level)}`} initial={{ width: 0 }} animate={{ width: `${Math.max(3, d.pct)}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} /></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass print-plain rounded-3xl p-7">
              <h2 className="text-xl font-semibold">Priority gaps and next actions</h2>
              {result.gaps.length === 0 ? <p className="mt-4 text-mute">No major gaps. Focus on evidence quality and continual improvement.</p> : (
                <ol className="mt-5 space-y-4">{result.gaps.map((g, i) => <li key={g.id} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-semibold">{i + 1}</span><span><span className="block font-semibold">{g.name} <span className="font-normal text-mute">({g.pct}%)</span></span><span className="block text-sm text-mute">{g.gap}</span></span></li>)}</ol>
              )}
              <Link to="/launchpad" className="no-print mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Get a full DU-NZO Compliance Roadmap<ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-mute">Self assessment for guidance only. It is not an audit opinion or certification decision.</p>
      </ToolShell>
    );
  }

  return (
    <ToolShell icon={tool?.icon} title={a.title} body={a.intro}>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-8">
          {a.domains.map((d, di) => (
            <section key={d.id} className="glass rounded-3xl p-6 md:p-7" aria-labelledby={`d-${d.id}`}>
              <h2 id={`d-${d.id}`} className="text-lg font-semibold"><span className="mr-2 text-aqua">{di + 1}.</span>{d.name}</h2>
              <div className="mt-5 space-y-6">
                {d.questions.map((q, qi) => {
                  const v = answers[d.id]?.[qi];
                  return (
                    <fieldset key={qi}>
                      <legend className="mb-3 text-[15px] leading-relaxed">{q}</legend>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {SCALE.map((s) => (
                          <button key={s.value} type="button" aria-pressed={v === s.value} onClick={() => set(d.id, qi, s.value)}
                            className={`focus-ring min-h-[44px] rounded-xl border px-3 py-2 text-left text-sm transition ${v === s.value ? "border-violet bg-violet/15 text-ink" : "border-edge text-mute hover:border-white/20 hover:text-ink"}`}>{s.label}</button>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <div className="glass sticky top-28 rounded-3xl p-6">
            <p className="text-sm text-mute">Progress</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{result.answered} / {result.total}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]"><motion.div className="h-full rounded-full bg-gradient-to-r from-violet to-aqua" animate={{ width: `${(result.answered / result.total) * 100}%` }} /></div>
            <p className="mt-6 text-sm text-mute">Live score</p>
            <p className="text-5xl font-semibold tracking-[-0.05em] text-gradient">{result.overall}%</p>
            <p className="text-sm">Level {result.level.level}: {result.level.name}</p>
            <button onClick={() => { setDone(true); window.scrollTo(0, 0); }} className="btn-glow mt-6 w-full">{complete ? <><Check size={17} />See my results</> : "See results so far"}</button>
            {!complete && <p className="mt-3 text-xs text-mute">Unanswered questions count as not in place.</p>}
          </div>
        </aside>
      </div>
    </ToolShell>
  );
}
