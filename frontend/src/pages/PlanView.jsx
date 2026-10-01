import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, Info, CalendarDays, Clock, Users, ListChecks, Download, CalendarPlus,
  Printer, Link2, Check, ChevronDown, FileText, Flag, Loader2, Sparkles,
} from "lucide-react";
import { useSeo } from "../lib/seo.js";
import { api, exportCsv, exportIcs, fmtDate } from "../lib/api.js";

const GROUP = {
  Plan: { bar: "from-violet to-violet-soft", dot: "bg-violet", text: "text-violet-soft" },
  Build: { bar: "from-violet-soft to-aqua", dot: "bg-violet-soft", text: "text-violet-soft" },
  Run: { bar: "from-aqua to-aqua-soft", dot: "bg-aqua", text: "text-aqua" },
  Certify: { bar: "from-amber to-rose", dot: "bg-amber", text: "text-amber" },
};

function Kpi({ icon: Icon, label, value, sub }) {
  return (
    <div className="glass print-plain rounded-3xl p-5 md:p-6">
      <div className="flex items-center gap-2 text-sm text-mute"><Icon size={16} />{label}</div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{value}</p>
      {sub && <p className="mt-1 text-sm text-mute">{sub}</p>}
    </div>
  );
}

function Gantt({ plan, done }) {
  const total = plan.summary.totalWeeks;
  const start = new Date(plan.summary.startDate + "T00:00:00Z");
  const months = [];
  for (let w = 0; w <= total; w++) {
    const d = new Date(start); d.setUTCDate(d.getUTCDate() + w * 7);
    const key = d.getUTCFullYear() * 12 + d.getUTCMonth();
    if (!months.length || months[months.length - 1].key !== key) months.push({ key, w, label: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }) });
  }
  return (
    <div className="glass print-plain overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-edge px-5 py-4 md:px-6">
        <h2 className="font-semibold">Timeline</h2>
        <div className="hidden gap-4 text-xs text-mute sm:flex">
          {Object.entries(GROUP).map(([g, c]) => <span key={g} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />{g}</span>)}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[760px] p-5 md:p-6">
          <div className="relative ml-[220px] h-6 text-xs text-mute">
            {months.map((m) => <span key={m.key} className="absolute top-0" style={{ left: `${(m.w / total) * 100}%` }}>{m.label}</span>)}
          </div>
          <div className="mt-2 flex flex-col gap-2.5">
            {plan.phases.map((p, i) => {
              const c = GROUP[p.group];
              const pct = p.tasks.length ? p.tasks.filter((t) => done.has(t.id)).length / p.tasks.length : 0;
              return (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-[204px] shrink-0 truncate text-sm" title={p.name}>{p.name}</div>
                  <div className="relative h-8 flex-1 rounded-lg bg-white/[0.03]">
                    {months.map((m) => <span key={m.key} className="absolute inset-y-0 w-px bg-white/[0.05]" style={{ left: `${(m.w / total) * 100}%` }} />)}
                    <motion.div className={`absolute inset-y-1 overflow-hidden rounded-md bg-gradient-to-r ${c.bar} opacity-90`}
                      style={{ left: `${(p.startWeek / total) * 100}%` }}
                      initial={{ width: 0 }} animate={{ width: `${(p.weeks / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.04 * i, ease: [0.2, 0.7, 0.2, 1] }}
                      title={`${fmtDate(p.startDate)} to ${fmtDate(p.endDate)}`}>
                      <div className="absolute inset-y-0 left-0 bg-void/35" style={{ width: `${(1 - pct) * 100}%`, left: `${pct * 100}%` }} />
                      <span className="relative flex h-full items-center px-2 text-[11px] font-semibold text-void">{p.weeks}w</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskList({ risks }) {
  if (!risks.length) return null;
  const style = {
    high: ["border-amber/40 bg-amber/10", AlertTriangle, "text-amber"],
    medium: ["border-violet/40 bg-violet/10", Info, "text-violet-soft"],
    info: ["border-edge bg-white/[0.03]", Info, "text-mute"],
    ok: ["border-aqua/40 bg-aqua/10", CheckCircle2, "text-aqua"],
  };
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {risks.map((r) => {
        const [cls, Icon, tc] = style[r.level] || style.info;
        return (
          <div key={r.title} className={`print-plain flex gap-3 rounded-2xl border p-4 ${cls}`}>
            <Icon size={20} className={`mt-0.5 shrink-0 ${tc}`} />
            <div><p className={`font-semibold ${tc}`}>{r.title}</p><p className="mt-1 text-sm leading-relaxed text-ink/80">{r.detail}</p></div>
          </div>
        );
      })}
    </div>
  );
}

function Tasks({ rec, onToggle, pending }) {
  const done = new Set(rec.done);
  const [open, setOpen] = useState(() => rec.plan.phases.find((p) => p.tasks.some((t) => !done.has(t.id)))?.id);
  return (
    <div className="flex flex-col gap-3">
      {rec.plan.phases.map((p) => {
        const c = GROUP[p.group];
        const n = p.tasks.filter((t) => done.has(t.id)).length;
        const isOpen = open === p.id;
        return (
          <div key={p.id} className="glass print-plain overflow-hidden rounded-2xl">
            <button onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen} className="focus-ring flex w-full flex-wrap items-center gap-4 p-5 text-left">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.dot}`} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{p.name}</span>
                <span className="mt-0.5 block text-sm text-mute">{fmtDate(p.startDate)} to {fmtDate(p.endDate)} · {p.refs}</span>
              </span>
              <span className="text-sm tabular-nums text-mute">{n}/{p.tasks.length}</span>
              <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.08] sm:block"><span className={`block h-full bg-gradient-to-r ${c.bar}`} style={{ width: `${(n / p.tasks.length) * 100}%` }} /></span>
              <ChevronDown size={18} className={`text-mute transition ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-edge">
                  {p.tasks.map((t) => {
                    const on = done.has(t.id);
                    return (
                      <li key={t.id} className="border-b border-white/[0.04] last:border-0">
                        <label className="flex cursor-pointer items-start gap-4 px-5 py-4 transition hover:bg-white/[0.02]">
                          <input type="checkbox" className="peer sr-only" checked={on} onChange={() => onToggle(t.id, !on)} />
                          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition peer-focus-visible:ring-2 peer-focus-visible:ring-aqua ${on ? "border-transparent bg-gradient-to-br from-violet to-aqua text-void" : "border-white/20"}`}>
                            {pending === t.id ? <Loader2 size={13} className="animate-spin" /> : on && <Check size={14} strokeWidth={3} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`block ${on ? "text-mute line-through decoration-white/30" : ""}`}>{t.title}</span>
                            <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mute">
                              <span className="flex items-center gap-1"><Users size={12} />{t.owner}</span>
                              <span className="flex items-center gap-1"><FileText size={12} />{t.deliverable}</span>
                              {t.ref && <span className={c.text}>{t.ref.startsWith("A.") || t.ref.includes("GDPR") || t.ref.includes("TSC") || t.ref.includes("ISO") || t.ref.includes("SOC") ? t.ref : `Clause ${t.ref}`}</span>}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function Milestones({ plan }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <ol className="glass print-plain relative rounded-3xl p-6 md:p-8">
      <span className="absolute bottom-10 left-[39px] top-10 w-px bg-gradient-to-b from-violet via-aqua to-amber md:left-[47px]" aria-hidden="true" />
      {plan.milestones.map((m) => {
        const past = m.date < today;
        return (
          <li key={m.id} className="relative flex items-center gap-5 py-3">
            <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${past ? "border-aqua bg-aqua text-void" : "border-edge bg-void"}`}><Flag size={14} /></span>
            <span className="flex-1"><span className="font-medium">{m.name}</span>{m.estimate && <span className="ml-2 rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-mute">estimate</span>}</span>
            <span className="text-sm tabular-nums text-mute">{fmtDate(m.date)}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Documents({ plan }) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="glass print-plain rounded-3xl p-6 lg:col-span-3">
        <h3 className="font-semibold">Mandatory documented information</h3>
        <p className="mt-1 text-sm text-mute">Required by ISO/IEC 27001 clauses 4 to 10.</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {plan.documents.map((d) => (
            <li key={d.name} className="flex items-start justify-between gap-3 rounded-xl border border-edge bg-white/[0.02] px-4 py-3 text-sm"><span>{d.name}</span><span className="shrink-0 text-violet-soft">{d.ref}</span></li>
          ))}
        </ul>
      </div>
      <div className="glass print-plain rounded-3xl p-6 lg:col-span-2">
        <h3 className="font-semibold">Annex A control themes</h3>
        <p className="mt-1 text-sm text-mute">ISO/IEC 27001:2022, 93 controls.</p>
        <div className="mt-6 flex flex-col gap-5">
          {plan.annexA.map((a, i) => (
            <div key={a.theme}>
              <div className="mb-2 flex justify-between text-sm"><span>{a.clause} {a.theme}</span><span className="tabular-nums text-mute">{a.controls}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><motion.div className="h-full rounded-full bg-gradient-to-r from-violet to-aqua" initial={{ width: 0 }} animate={{ width: `${(a.controls / 37) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} /></div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-mute">Applicability of each control is justified in your Statement of Applicability.</p>
      </div>
    </div>
  );
}

export default function PlanView() {
  useSeo("Your ISO certification plan");
  const { id } = useParams();
  const [rec, setRec] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("tasks");
  const [pending, setPending] = useState(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState("server");

  useEffect(() => {
    api.mode().then(setMode);
    api.getPlan(id).then(setRec).catch((e) => setError(e.message));
  }, [id]);

  const done = useMemo(() => new Set(rec?.done || []), [rec]);

  const toggle = async (taskId, value) => {
    const prev = rec;
    const nextDone = value ? [...rec.done, taskId] : rec.done.filter((x) => x !== taskId);
    const total = rec.plan.summary.taskCount;
    setRec({ ...rec, done: nextDone, progress: { completed: nextDone.length, total, percent: Math.round((nextDone.length / total) * 100) } });
    setPending(taskId);
    try { setRec(await api.setTask(id, taskId, value)); }
    catch { setRec(prev); }
    finally { setPending(null); }
  };

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };

  if (error) return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Plan not found</h1>
      <p className="max-w-md text-mute">This link may be from another device or the plan was removed. Create a new plan in under a minute.</p>
      <Link to="/planner" className="btn-glow mt-2"><Sparkles size={17} />Create a plan</Link>
    </div>
  );
  if (!rec) return <div className="container-x flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-mute" /></div>;

  const { plan, progress } = rec;
  const s = plan.summary;
  const tabs = [["tasks", "Tasks"], ["milestones", "Milestones"], ["docs", "Documents and controls"]];

  return (
    <div className="container-x py-10 md:py-16">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-mute">{plan.input.frameworks.map((f) => (f === "iso27001" ? "ISO/IEC 27001" : "ISO/IEC 27701")).join(" + ")}{plan.input.alignments.length ? ` with ${plan.input.alignments.map((a) => (a === "gdpr" ? "GDPR" : "SOC 2")).join(" and ")}` : ""}</p>
          <h1 className="h-display mt-2 text-4xl md:text-6xl">{plan.input.company}</h1>
          <p className="mt-3 text-mute">Certification journey plan, created {fmtDate(rec.createdAt.slice(0, 10))}</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button className="btn-ghost !min-h-[44px] text-sm" onClick={share}>{copied ? <Check size={16} /> : <Link2 size={16} />}{copied ? "Link copied" : "Copy link"}</button>
          <button className="btn-ghost !min-h-[44px] text-sm" onClick={() => exportCsv(rec)}><Download size={16} />Tasks CSV</button>
          <button className="btn-ghost !min-h-[44px] text-sm" onClick={() => exportIcs(rec)}><CalendarPlus size={16} />Add to calendar</button>
          <button className="btn-ghost !min-h-[44px] text-sm" onClick={() => window.print()}><Printer size={16} />Print</button>
        </div>
      </div>

      {mode === "browser" && <p className="no-print mt-6 rounded-2xl border border-edge bg-white/[0.03] px-4 py-3 text-sm text-mute">Saved in this browser. Connect the API server to share plans across devices and your team.</p>}

      {/* Progress */}
      <div className="glass print-plain mt-8 rounded-3xl p-5 md:p-6">
        <div className="flex items-center justify-between text-sm"><span className="font-medium">Overall progress</span><span className="tabular-nums text-mute">{progress.completed} of {progress.total} tasks · {progress.percent}%</span></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/[0.06]"><motion.div className="h-full rounded-full bg-gradient-to-r from-violet via-violet-soft to-aqua" animate={{ width: `${progress.percent}%` }} transition={{ duration: 0.5 }} /></div>
      </div>

      {/* KPIs */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Clock} label="Duration to Stage 2" value={`${s.months} months`} sub={`${s.totalWeeks} weeks from ${fmtDate(s.startDate)}`} />
        <Kpi icon={CalendarDays} label="Expected certificate" value={fmtDate(s.certificationDate, { month: "short", year: "numeric" })} sub={`Stage 2 from ${fmtDate(s.stage2Date)}`} />
        <Kpi icon={Users} label="Effort estimate" value={`${s.effortDays} days`} sub={`${s.internalDays} internal, ${s.consultantDays} consultant`} />
        <Kpi icon={ListChecks} label="Workplan" value={`${plan.phases.length} phases`} sub={`${s.taskCount} tasks with owners`} />
      </div>

      <div className="mt-4"><RiskList risks={plan.risks} /></div>
      <div className="mt-4"><Gantt plan={plan} done={done} /></div>

      {/* Tabs */}
      <div className="no-print mt-10 flex gap-2 overflow-x-auto no-scrollbar" role="tablist">
        {tabs.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`chip whitespace-nowrap ${tab === k ? "border-transparent bg-ink text-void" : "border-edge text-mute hover:text-ink"}`}>{l}</button>
        ))}
      </div>
      <div className="mt-5">
        {tab === "tasks" && <Tasks rec={rec} onToggle={toggle} pending={pending} />}
        {tab === "milestones" && <Milestones plan={plan} />}
        {tab === "docs" && <Documents plan={plan} />}
      </div>

      {/* CTA */}
      <div className="no-print relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-deep via-violet to-aqua p-8 text-void md:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Turn this plan into a commitment.</h2>
            <p className="mt-2 max-w-lg text-void/80">A lead auditor reviews your plan, validates the scope and books certification body dates with you.</p>
          </div>
          <Link to={{ pathname: "/", hash: "#contact" }} className="btn shrink-0 bg-void text-ink hover:bg-night">Book an expert review</Link>
        </div>
      </div>
      <p className="mt-6 text-xs text-mute">Indicative plan generated from your answers. Durations, effort and audit dates are estimates to be confirmed during a readiness assessment and with your certification body.</p>
    </div>
  );
}
