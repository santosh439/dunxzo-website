import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, Minus, Plus, Sparkles, Building2, Layers, Gauge, CalendarRange } from "lucide-react";
import { OPTIONS, generatePlan } from "@shared/planEngine.js";
import { Aurora } from "../components/ui.jsx";
import { useSeo } from "../lib/seo.js";
import { api, fmtDate } from "../lib/api.js";

const nextMonday = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
};

const STEPS = [
  { id: "org", label: "Organisation", icon: Building2 },
  { id: "scope", label: "Standards", icon: Layers },
  { id: "maturity", label: "Maturity", icon: Gauge },
  { id: "time", label: "Timeline", icon: CalendarRange },
];

function OptionCard({ on, onClick, title, hint, disabled, locked }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={on}
      className={`focus-ring relative flex min-h-[76px] w-full flex-col items-start justify-center rounded-2xl border p-4 text-left transition ${on ? "border-violet bg-violet/10 shadow-[0_0_0_1px_rgba(139,124,255,0.6)]" : "border-edge bg-white/[0.03] hover:border-white/20"} ${disabled ? "cursor-not-allowed" : ""}`}>
      <span className="flex w-full items-center justify-between gap-3">
        <span className="font-semibold">{title}</span>
        <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${on ? "border-transparent bg-gradient-to-br from-violet to-aqua text-void" : "border-edge"}`}>
          {locked ? <Lock size={12} /> : on ? <Check size={14} strokeWidth={3} /> : null}
        </span>
      </span>
      {hint && <span className="mt-1 text-sm text-mute">{hint}</span>}
    </button>
  );
}

export default function Planner() {
  useSeo("ISO Certification Planner");
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    company: "", employees: "51-250", sites: 1, hosting: "cloud",
    frameworks: ["iso27001"], alignments: [], maturity: "basic",
    startDate: nextMonday(), targetDate: "",
  });
  const up = (patch) => setF((s) => ({ ...s, ...patch }));
  const toggle = (key, v) => up({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] });

  const preview = useMemo(() => generatePlan({ ...f, targetDate: f.targetDate || null }), [f]);
  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); };

  const create = async () => {
    setBusy(true); setError("");
    try {
      const rec = await api.createPlan({ ...f, company: f.company.trim() || "Your organisation", targetDate: f.targetDate || null });
      navigate(`/plan/${rec.id}`);
    } catch (e) { setError(e.message || "The plan could not be created. Try again."); setBusy(false); }
  };

  return (
    <section className="relative overflow-hidden">
      <Aurora className="opacity-70" />
      <div className="container-x relative py-12 md:py-20">
        <div className="max-w-3xl">
          <span className="kicker"><Sparkles size={14} className="text-aqua" />ISO certification journey planner</span>
          <h1 className="h-display mt-5 text-5xl md:text-7xl">Your plan to certification, <span className="text-gradient">in one minute.</span></h1>
          <p className="mt-5 max-w-xl text-lg text-mute">Tell us about your organisation. We generate a phased plan with dates, owners, ISO clause references and audit milestones you can track with your team.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Wizard */}
          <div className="glass min-w-0 rounded-3xl p-5 md:p-8 lg:col-span-8">
            <ol className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Planner steps">
              {STEPS.map((s, i) => {
                const state = i === step ? "current" : i < step ? "done" : "todo";
                return (
                  <li key={s.id} className="flex-1">
                    <button onClick={() => go(i)} aria-current={state === "current" ? "step" : undefined}
                      className={`focus-ring flex w-full min-w-[130px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${state === "current" ? "border-violet/60 bg-violet/10 text-ink" : "border-edge text-mute hover:text-ink"}`}>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${state === "done" ? "bg-aqua text-void" : state === "current" ? "bg-violet text-void" : "bg-white/[0.06]"}`}>
                        {state === "done" ? <Check size={14} strokeWidth={3} /> : <s.icon size={14} />}
                      </span>
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="relative mt-8 min-h-[380px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={step} custom={dir} initial={{ opacity: 0, x: 30 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 * dir }} transition={{ duration: 0.28 }}>
                  {step === 0 && (
                    <div className="flex flex-col gap-7">
                      <div><label htmlFor="p-co" className="label">Organisation name</label><input id="p-co" className="field" value={f.company} onChange={(e) => up({ company: e.target.value })} placeholder="Acme Technologies" /></div>
                      <div>
                        <p className="label">Employees in scope</p>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{OPTIONS.employees.map((o) => <OptionCard key={o.value} on={f.employees === o.value} onClick={() => up({ employees: o.value })} title={o.label} />)}</div>
                      </div>
                      <div className="grid gap-7 md:grid-cols-2">
                        <div>
                          <p className="label">Where your systems run</p>
                          <div className="flex flex-col gap-3">{OPTIONS.hosting.map((o) => <OptionCard key={o.value} on={f.hosting === o.value} onClick={() => up({ hosting: o.value })} title={o.label} />)}</div>
                        </div>
                        <div>
                          <p className="label" id="sites-label">Offices or sites in scope</p>
                          <div className="flex items-center gap-3" role="group" aria-labelledby="sites-label">
                            <button className="btn-ghost !h-14 !w-14 !px-0" onClick={() => up({ sites: Math.max(1, f.sites - 1) })} aria-label="Fewer sites"><Minus size={18} /></button>
                            <span className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-edge bg-white/[0.03] text-2xl font-semibold tabular-nums" aria-live="polite">{f.sites}</span>
                            <button className="btn-ghost !h-14 !w-14 !px-0" onClick={() => up({ sites: Math.min(50, f.sites + 1) })} aria-label="More sites"><Plus size={18} /></button>
                          </div>
                          <p className="mt-3 text-sm text-mute">Remote only teams can keep this at 1.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col gap-7">
                      <div>
                        <p className="label">Certification standards</p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <OptionCard on locked disabled title="ISO/IEC 27001" hint="Information security management system. Always included." />
                          <OptionCard on={f.frameworks.includes("iso27701")} onClick={() => toggle("frameworks", "iso27701")} title="ISO/IEC 27701" hint="Privacy information management extension." />
                        </div>
                      </div>
                      <div>
                        <p className="label">Also align with</p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <OptionCard on={f.alignments.includes("gdpr")} onClick={() => toggle("alignments", "gdpr")} title="GDPR" hint="Records of processing, DPIAs, breach notification, transfers." />
                          <OptionCard on={f.alignments.includes("soc2")} onClick={() => toggle("alignments", "soc2")} title="SOC 2 bridge" hint="Reuse ISO controls for a SOC 2 readiness review." />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <p className="label">How mature is your security program today?</p>
                      <div className="flex flex-col gap-3">
                        {OPTIONS.maturity.map((o) => <OptionCard key={o.value} on={f.maturity === o.value} onClick={() => up({ maturity: o.value })} title={o.label} hint={o.hint} />)}
                      </div>
                      <p className="mt-5 text-sm text-mute">Maturity changes how long controls need to operate before audit so there is enough evidence for the auditor to sample.</p>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid gap-7 md:grid-cols-2">
                      <div><label htmlFor="p-start" className="label">Project start</label><input id="p-start" type="date" className="field [color-scheme:dark]" value={f.startDate} onChange={(e) => up({ startDate: e.target.value })} /></div>
                      <div>
                        <label htmlFor="p-target" className="label">Target certification date <span className="font-normal text-mute">(optional)</span></label>
                        <input id="p-target" type="date" className="field [color-scheme:dark]" value={f.targetDate} min={f.startDate} onChange={(e) => up({ targetDate: e.target.value })} />
                      </div>
                      <p className="text-sm text-mute md:col-span-2">If you have a customer or tender deadline, add it and the plan will tell you whether it is realistic.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {error && <p role="alert" className="mt-4 rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">{error}</p>}

            <div className="mt-6 flex items-center justify-between border-t border-edge pt-6">
              <button className="btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}><ArrowLeft size={17} />Back</button>
              {step < STEPS.length - 1 ? (
                <button className="btn-primary" onClick={() => go(step + 1)}>Continue<ArrowRight size={17} /></button>
              ) : (
                <button className="btn-glow" onClick={create} disabled={busy}>{busy ? <><Loader2 size={17} className="animate-spin" />Creating plan</> : <><Sparkles size={17} />Create my plan</>}</button>
              )}
            </div>
          </div>

          {/* Live estimate */}
          <aside className="min-w-0 lg:col-span-4">
            <div className="glass sticky top-28 rounded-3xl p-6 md:p-7" aria-live="polite">
              <p className="text-sm text-mute">Live estimate</p>
              <div className="mt-4 flex items-end gap-2">
                <motion.span key={preview.summary.months} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-gradient text-6xl font-semibold tracking-[-0.05em]">{preview.summary.months}</motion.span>
                <span className="pb-2 text-mute">months to Stage 2</span>
              </div>
              <dl className="mt-6 flex flex-col divide-y divide-white/[0.06] text-sm">
                {[
                  ["Stage 2 audit", fmtDate(preview.summary.stage2Date)],
                  ["Expected certificate", fmtDate(preview.summary.certificationDate)],
                  ["Phases", preview.phases.length],
                  ["Tasks", preview.summary.taskCount],
                  ["Effort estimate", `${preview.summary.effortDays} person days`],
                ].map(([k, v]) => <div key={k} className="flex justify-between py-3"><dt className="text-mute">{k}</dt><dd className="font-medium tabular-nums">{v}</dd></div>)}
              </dl>
              {preview.risks.filter((r) => r.level === "high" || r.level === "ok").map((r) => (
                <div key={r.title} className={`mt-4 rounded-2xl border p-4 text-sm ${r.level === "high" ? "border-amber/40 bg-amber/10 text-amber" : "border-aqua/40 bg-aqua/10 text-aqua"}`}>{r.title}</div>
              ))}
              <p className="mt-5 text-xs leading-relaxed text-mute">Indicative planning estimate. Certification body audit days and dates are confirmed by your chosen body.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
