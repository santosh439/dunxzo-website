import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, ArrowRight, CheckCircle2, Pencil, ChevronRight } from "lucide-react";
import { BAND, RISK_STATUS, TREATMENT } from "../../data/risk.js";
import { OWNERS } from "../../data/controls.js";

function ScoreBlock({ label, score, band }) {
  const b = BAND[band];
  return (
    <div className="flex-1 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-p-faint">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${b.cls.split(" ").pop()}`}>{score}</p>
      <p className="text-[11px] font-medium capitalize text-p-faint">{b.label}</p>
    </div>
  );
}

export default function RiskDrawer({ risk, onClose, onAcceptResidual }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {risk && (
        <>
          <motion.button
            aria-label="Close risk details"
            data-testid="risk-drawer-backdrop"
            onClick={onClose}
            className="fixed inset-0 z-50 cursor-default bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-label={`Risk ${risk.id}: ${risk.title}`}
            data-testid="risk-drawer"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col border-l border-p-edge/10 bg-p-surface shadow-p-pop"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-p-edge/10 p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-p-edge/15 bg-p-ink/5 px-2 py-1 font-mono text-xs font-semibold text-p-mute">{risk.id}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${RISK_STATUS[risk.status].cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${RISK_STATUS[risk.status].dot}`} />
                    {RISK_STATUS[risk.status].label}
                  </span>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TREATMENT[risk.treatment].cls}`}>
                    {TREATMENT[risk.treatment].label}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{risk.title}</h2>
                <p className="mt-1 text-xs text-p-faint">{risk.category} · Owner {OWNERS[risk.owner] || risk.owner} · review {risk.review}</p>
              </div>
              <button onClick={onClose} data-testid="risk-drawer-close" aria-label="Close" className="p-icon-btn h-9 w-9">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <p className="text-sm leading-relaxed text-p-mute">{risk.description}</p>

              <div className="flex items-center gap-3">
                <ScoreBlock label="Inherent" score={risk.likelihood * risk.impact} band={risk.band} />
                <ArrowRight className="h-5 w-5 shrink-0 text-p-faint" />
                <ScoreBlock label="Residual" score={risk.residual} band={risk.residual >= 15 ? "critical" : risk.residual >= 10 ? "high" : risk.residual >= 5 ? "medium" : "low"} />
              </div>
              <p className="-mt-2 text-center text-xs text-p-faint">Likelihood {risk.likelihood} × Impact {risk.impact} before treatment</p>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">Treatment plan</p>
                <ol className="mt-2 space-y-2">
                  {risk.plan.map((step, i) => (
                    <li key={i} data-testid={`risk-plan-${i}`} className="flex items-start gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] px-3 py-2.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-p-edge/10 bg-p-ink/5 text-[11px] font-semibold text-p-mute">{i + 1}</span>
                      <span className="text-sm leading-snug text-p-ink/90">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">Treating controls</p>
                {risk.controls.length ? (
                  <ul className="mt-2 space-y-2">
                    {risk.controls.map((c) => (
                      <li key={c}>
                        <Link
                          to="/app/controls"
                          data-testid={`risk-control-link-${c}`}
                          className="group flex items-center gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] px-3 py-2.5 transition hover:border-p-aqua/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                        >
                          <ShieldCheck className="h-4 w-4 shrink-0 text-p-violet" />
                          <span className="rounded border border-p-violet/25 bg-p-violet/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-p-violet">{c}</span>
                          <span className="flex-1 text-sm text-p-ink/90">Mapped control</span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-p-faint transition-transform duration-150 group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 rounded-xl border border-p-warning/20 bg-p-warning/5 px-3 py-2.5 text-sm text-p-warning">
                    No controls mapped — this risk is currently untreated.
                  </p>
                )}
              </div>
            </div>

            <footer className="flex items-center gap-3 border-t border-p-edge/10 p-5">
              <button
                onClick={() => onAcceptResidual(risk.id)}
                data-testid="risk-accept-residual"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                style={{ background: "var(--p-grad)" }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Accept residual risk
              </button>
              <button
                data-testid="risk-edit"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-p-edge/10 bg-p-ink/5 px-5 py-2.5 text-sm font-semibold text-p-mute transition hover:text-p-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
