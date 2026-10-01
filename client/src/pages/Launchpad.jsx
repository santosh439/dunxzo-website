import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Rocket, Printer, Mail, AlertTriangle, FileText, RefreshCw, Loader2, CalendarRange } from "lucide-react";
import { Aurora } from "../components/ui.jsx";
import { LP_QUESTIONS, LP_DEFAULTS, buildRoadmap } from "@shared/launchpad.js";
import { mailto, BRAND } from "../content/site.js";
import { api } from "../lib/api.js";
import { useSeo } from "../lib/seo.js";

const KIND = { Certification: "bg-violet/15 text-violet-soft", Attestation: "bg-aqua/15 text-aqua", Regulation: "bg-amber/15 text-amber", "Industry standard": "bg-aqua/10 text-aqua-soft" };
const PRI = { 1: "Primary", 2: "Next", 3: "Consider" };

function Question({ q, value, onChange }) {
  const multi = q.type === "multi";
  const toggle = (o) => {
    if (!multi) return onChange(o);
    let next = value.includes(o) ? value.filter((x) => x !== o) : [...value, o];
    if (o === "None yet" || o === "Nothing yet") next = value.includes(o) ? [] : [o];
    else next = next.filter((x) => x !== "None yet" && x !== "Nothing yet");
    onChange(next);
  };
  return (
    <fieldset>
      <legend className="text-2xl font-semibold tracking-[-0.03em] md:text-4xl">{q.label}</legend>
      {multi && <p className="mt-2 text-sm text-mute">Select all that apply.</p>}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {q.options.map((o) => {
          const on = multi ? value.includes(o) : value === o;
          return (
            <button key={o} type="button" onClick={() => toggle(o)} aria-pressed={on}
              className={`focus-ring flex min-h-[60px] items-center justify-between gap-3 rounded-2xl border px-5 py-3 text-left transition ${on ? "border-violet bg-violet/10 shadow-[0_0_0_1px_rgba(139,124,255,0.6)]" : "border-edge bg-white/[0.03] hover:border-white/20"}`}>
              <span className="font-medium">{o}</span>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center ${multi ? "rounded-md" : "rounded-full"} border ${on ? "border-transparent bg-gradient-to-br from-violet to-aqua text-void" : "border-white/20"}`}>{on && <Check size={14} strokeWidth={3} />}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Results({ r, onRestart }) {
  const [sent, setSent] = useState("idle");
  const [email, setEmail] = useState("");
  const [mkt, setMkt] = useState(false);
  const summary = [
    `DU-NZO Compliance Roadmap`,
    `Maturity: Level ${r.maturity.level} ${r.maturity.name} (${r.maturity.pct}%)`,
    `Primary: ${r.primary?.name || "n/a"}`,
    `Frameworks: ${r.frameworks.map((f) => `${f.name} (${PRI[f.priority]})`).join(", ")}`,
    `Priority gaps: ${r.gaps.slice(0, 5).map((g) => g.control).join(", ")}`,
    `Indicative path: ${r.totalWeeks} weeks`,
    `Profile: ${r.input.country}, ${r.input.industry}, ${r.input.employees} employees`,
  ].join("\n");
  const send = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setSent("error");
    setSent("sending");
    try { await api.sendLead({ name: email.split("@")[0], email, company: "", source: "launchpad", summary, message: "Please send my DU-NZO Compliance Roadmap and book a review.", marketing: mkt }); setSent("sent"); } catch { setSent("error"); }
  };
  const statusCls = { "In place": "bg-aqua/15 text-aqua", Partial: "bg-amber/15 text-amber", Missing: "bg-rose/15 text-rose" };
  const sevCls = { High: "text-rose", Medium: "text-amber", Low: "text-mute" };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container-x py-12 md:py-16">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <span className="kicker"><Rocket size={14} className="text-aqua" />DU-NZO Startup Compliance Launchpad</span>
          <h1 className="h-display mt-5 text-5xl md:text-7xl">Your DU-NZO <span className="text-gradient">Compliance Roadmap</span></h1>
          <p className="mt-4 text-mute">{r.input.country} · {r.input.industry} · {r.input.employees} employees</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button className="btn-ghost !min-h-[44px] text-sm" onClick={onRestart}><RefreshCw size={16} />Edit answers</button>
          <button className="btn-ghost !min-h-[44px] text-sm" onClick={() => window.print()}><Printer size={16} />Print or save PDF</button>
          <a className="btn-glow !min-h-[44px] text-sm" href={mailto("My DU-NZO Compliance Roadmap", summary)}><Mail size={16} />Talk to an Expert</a>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="glass print-plain rounded-3xl p-6">
          <p className="text-sm text-mute">Current maturity</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">Level {r.maturity.level}</p>
          <p className="text-violet-soft">{r.maturity.name}</p>
          <div className="mt-5 flex gap-1.5">{[1, 2, 3, 4, 5].map((l) => <span key={l} className={`h-2 flex-1 rounded-full ${l <= r.maturity.level ? "bg-gradient-to-r from-violet to-aqua" : "bg-white/[0.08]"}`} />)}</div>
        </div>
        <div className="glass print-plain rounded-3xl p-6">
          <p className="text-sm text-mute">Recommended starting point</p>
          <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">{r.primary?.name || "Security baseline"}</p>
          <p className="mt-2 text-sm text-mute">{r.frameworks.find((f) => f.slug === r.primary?.slug)?.reasons[0]}</p>
        </div>
        <div className="glass print-plain rounded-3xl p-6">
          <p className="text-sm text-mute">Indicative path</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{r.totalWeeks}<span className="text-xl font-normal text-mute"> weeks</span></p>
          <p className="mt-2 text-sm text-mute">From launch to first certification or report, before scaling.</p>
        </div>
      </div>

      {r.timelineRisk && <div className="mt-4 flex gap-3 rounded-2xl border border-amber/40 bg-amber/10 p-5 text-sm text-amber"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{r.timelineRisk}</div>}

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <section className="glass print-plain rounded-3xl p-6 md:p-8 lg:col-span-7">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Relevant frameworks</h2>
          <ul className="mt-6 space-y-3">
            {r.frameworks.map((f) => (
              <li key={f.slug} className="rounded-2xl border border-edge bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{f.name}</span>
                  <span className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${KIND[f.kind] || "bg-white/10"}`}>{f.kind}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.held ? "bg-aqua text-void" : f.priority === 1 ? "bg-ink text-void" : "bg-white/[0.08] text-mute"}`}>{f.held ? "Already held" : f.kind === "Regulation" && f.priority === 1 ? "Likely applies" : PRI[f.priority]}</span>
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-mute">{f.reasons[0]}</p>
                {!["local", "eu-ai-act"].includes(f.slug) && <Link to={`/compliance/${f.slug}`} className="no-print mt-2 inline-flex text-xs font-semibold text-aqua">Learn about {f.name}</Link>}
              </li>
            ))}
          </ul>
        </section>
        <section className="glass print-plain rounded-3xl p-6 md:p-8 lg:col-span-5">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Priority gaps</h2>
          {r.gaps.length === 0 ? <p className="mt-4 text-mute">No baseline gaps found in the controls you selected. Focus on documentation and evidence.</p> : (
            <ul className="mt-6 space-y-3">
              {r.gaps.slice(0, 7).map((g) => (
                <li key={g.control} className="flex gap-3">
                  <span className={`mt-1 text-xs font-bold ${sevCls[g.severity]}`}>{g.severity}</span>
                  <span><span className="block font-medium">{g.control}</span><span className="block text-sm text-mute">{g.fix}</span></span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="glass print-plain mt-6 rounded-3xl p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">Control categories</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {r.categories.map((c) => <div key={c.name} className="flex items-center justify-between rounded-2xl border border-edge bg-white/[0.02] px-4 py-3"><span className="text-sm font-medium">{c.name}</span><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCls[c.status]}`}>{c.status}</span></div>)}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">Implementation phases</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {r.phases.map((p, i) => (
            <li key={p.name} className="glass print-plain rounded-3xl p-6">
              <div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua text-sm font-bold text-void">{i + 1}</span><span className="text-sm text-mute">{p.weeks ? `About ${p.weeks} week${p.weeks > 1 ? "s" : ""}` : "Ongoing"}</span></div>
              <h3 className="mt-4 text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-mute">{p.focus}</p>
              <ul className="mt-4 space-y-2">{p.items.filter(Boolean).map((it) => <li key={it} className="flex gap-2 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-aqua" strokeWidth={2.6} />{it}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="glass print-plain rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Evidence requirements</h2>
          <div className="mt-6 space-y-5">
            {r.evidence.map((e) => <div key={e.framework}><p className="text-sm font-semibold text-violet-soft">{e.framework}</p><div className="mt-2 flex flex-wrap gap-2">{e.items.map((it) => <span key={it} className="flex items-center gap-1.5 rounded-full border border-edge bg-white/[0.03] px-3 py-1.5 text-xs"><FileText size={12} className="text-mute" />{it}</span>)}</div></div>)}
          </div>
        </section>
        <section className="glass print-plain rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Recommended next actions</h2>
          <ol className="mt-6 space-y-3">{r.nextActions.map((a, i) => <li key={a} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-semibold">{i + 1}</span><span className="pt-0.5">{a}</span></li>)}</ol>
          <Link to="/planner" className="no-print mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aqua"><CalendarRange size={16} />Turn this into a dated ISO certification plan</Link>
        </section>
      </div>

      <section className="no-print relative mt-10 overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-deep via-violet to-aqua p-8 text-void md:p-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div><h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Review this roadmap with a DU-NZO expert.</h2><p className="mt-3 text-void/80">Free 30 minute session. We validate your frameworks, scope and timeline.</p></div>
          {sent === "sent" ? <p className="rounded-2xl bg-void/15 p-5 font-semibold">Sent. DU-NZO will contact {email} shortly.</p> : (
            <div className="flex flex-col gap-3">
              <form onSubmit={send} className="flex flex-col gap-3 sm:flex-row" noValidate>
                <label htmlFor="lp-email" className="sr-only">Work email</label>
                <input id="lp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="h-12 flex-1 rounded-full border border-void/20 bg-white/70 px-5 text-void placeholder:text-void/50 focus:outline-none focus:ring-2 focus:ring-void" />
                <button className="btn bg-void text-ink hover:bg-night" disabled={sent === "sending"}>{sent === "sending" ? <Loader2 size={17} className="animate-spin" /> : "Send my roadmap"}</button>
              </form>
              <label className="flex cursor-pointer items-start gap-2 text-xs text-void/85">
                <input type="checkbox" checked={mkt} onChange={(e) => setMkt(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#05060D]" />
                <span>Send me DU-NZO updates and insights. I can unsubscribe anytime.</span>
              </label>
              <p className="text-[11px] leading-relaxed text-void/70">By submitting, you agree to our <Link to="/legal/privacy" className="font-semibold underline">Privacy Policy</Link>.</p>
            </div>
          )}
        </div>
        {sent === "error" && <p className="mt-3 text-sm font-semibold">Enter a valid work email, or write to {BRAND.email}.</p>}
      </section>
      <p className="mt-6 text-xs text-mute">Indicative roadmap based on your answers. Legal applicability and timelines are confirmed during a DU-NZO assessment.</p>
    </motion.div>
  );
}

export default function Launchpad() {
  useSeo("Startup Compliance Launchpad", "Answer 13 questions and get your personalised DU-NZO Compliance Roadmap: maturity, frameworks, gaps, evidence and phases.");
  const [i, setI] = useState(-1);
  const [ans, setAns] = useState(LP_DEFAULTS);
  const [done, setDone] = useState(false);
  const roadmap = useMemo(() => (done ? buildRoadmap(ans) : null), [done, ans]);
  const q = LP_QUESTIONS[i];

  if (done) return <Results r={roadmap} onRestart={() => { setDone(false); setI(0); }} />;

  return (
    <section className="noise relative min-h-[80vh] overflow-hidden">
      <Aurora />
      <div className="container-x relative py-12 md:py-20">
        {i < 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="kicker"><Rocket size={14} className="text-aqua" />DU-NZO Startup Compliance Launchpad</span>
            <h1 className="h-display mt-6 text-5xl md:text-7xl">Your compliance roadmap in <span className="text-gradient">three minutes.</span></h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-mute">Thirteen questions about your company, customers, data and AI. Get your maturity level, relevant frameworks, priority gaps, evidence and a phased plan.</p>
            <button onClick={() => setI(0)} className="btn-glow mt-10">Start the Launchpad<ArrowRight size={17} /></button>
            <p className="mt-4 text-sm text-mute">No sign up needed. Answers stay in your browser.</p>
          </motion.div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between text-sm text-mute"><span>Question {i + 1} of {LP_QUESTIONS.length}</span><span>{Math.round(((i + 1) / LP_QUESTIONS.length) * 100)}%</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><motion.div className="h-full rounded-full bg-gradient-to-r from-violet to-aqua" animate={{ width: `${((i + 1) / LP_QUESTIONS.length) * 100}%` }} /></div>
            <div className="glass mt-8 rounded-3xl p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                  <Question q={q} value={ans[q.id]} onChange={(v) => setAns({ ...ans, [q.id]: v })} />
                </motion.div>
              </AnimatePresence>
              <div className="mt-10 flex items-center justify-between border-t border-edge pt-6">
                <button className="btn-ghost" onClick={() => setI(i - 1)}><ArrowLeft size={17} />Back</button>
                {i < LP_QUESTIONS.length - 1
                  ? <button className="btn-primary" onClick={() => setI(i + 1)}>Next<ArrowRight size={17} /></button>
                  : <button className="btn-glow" onClick={() => setDone(true)}>Generate my roadmap<ArrowRight size={17} /></button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
