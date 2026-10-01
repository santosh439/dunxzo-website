import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, UploadCloud, CheckCircle2, FileText, AlertTriangle, Pencil, ChevronRight } from "lucide-react";
import { CONTROL_STATUS, FRESHNESS, OWNERS, evidenceState } from "../../data/controls.js";

const SEVERITY_DOT = { critical: "bg-p-danger", high: "bg-p-warning", medium: "bg-p-info", low: "bg-p-faint" };

function MetaItem({ label, children }) {
  return (
    <div className="rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-p-faint">{label}</p>
      <div className="mt-1.5 text-sm font-medium text-p-ink">{children}</div>
    </div>
  );
}

export default function ControlDrawer({ control, onClose, onMarkReviewed }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {control && (
        <>
          <motion.button
            aria-label="Close control details"
            data-testid="drawer-backdrop"
            onClick={onClose}
            className="fixed inset-0 z-50 cursor-default bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-label={`Control ${control.id}: ${control.title}`}
            data-testid="control-drawer"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col border-l border-p-edge/10 bg-p-surface shadow-p-pop"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-p-edge/10 p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-p-violet/25 bg-p-violet/10 px-2 py-1 font-mono text-xs font-semibold text-p-violet">
                    {control.id}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${CONTROL_STATUS[control.status].cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${CONTROL_STATUS[control.status].dot}`} />
                    {CONTROL_STATUS[control.status].label}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{control.title}</h2>
                <p className="mt-1 text-xs text-p-faint">{control.domain}</p>
              </div>
              <button onClick={onClose} data-testid="drawer-close" aria-label="Close" className="p-icon-btn h-9 w-9">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <p className="text-sm leading-relaxed text-p-mute">{control.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <MetaItem label="Owner">
                  <span className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-p-edge/10 bg-p-violet/10 text-[10px] font-semibold text-p-violet">
                      {control.owner}
                    </span>
                    {OWNERS[control.owner] || control.owner}
                  </span>
                </MetaItem>
                <MetaItem label="Automation">{control.automation}</MetaItem>
                <MetaItem label="Last tested">{control.lastTested}</MetaItem>
                <MetaItem label="Next review">
                  <span className={control.nextReview === "Overdue" ? "text-p-danger" : ""}>{control.nextReview}</span>
                </MetaItem>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">Frameworks mapped</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {control.frameworks.map((f) => (
                    <span key={f} className="rounded-full border border-p-edge/10 bg-p-ink/5 px-2.5 py-1 text-xs font-medium text-p-mute">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">Evidence</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${FRESHNESS[evidenceState(control)].cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${FRESHNESS[evidenceState(control)].dot}`} />
                    {FRESHNESS[evidenceState(control)].label}
                  </span>
                </div>
                <ul className="mt-2 space-y-2">
                  {control.evidence.map((e, i) => (
                    <li key={e.name}>
                      <Link
                        to="/app/evidence"
                        data-testid={`drawer-evidence-link-${i}`}
                        className="group flex items-center gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] px-3 py-2.5 transition hover:border-p-aqua/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-p-faint" />
                        <span className="min-w-0 flex-1 truncate text-sm text-p-ink/90">{e.name}</span>
                        <span className={`inline-flex items-center gap-1 text-xs ${FRESHNESS[e.freshness].cls}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${FRESHNESS[e.freshness].dot}`} />
                          {FRESHNESS[e.freshness].label}
                        </span>
                        <span className="hidden text-xs text-p-faint sm:inline">{e.updated}</span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-p-faint transition-transform duration-150 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                  {!control.evidence.length && (
                    <li className="flex items-center gap-2 rounded-xl border border-p-danger/20 bg-p-danger/5 px-3 py-2.5 text-sm text-p-danger">
                      <AlertTriangle className="h-4 w-4" />
                      No evidence on file — upload before the next review
                    </li>
                  )}
                </ul>
                <button
                  data-testid="drawer-upload-evidence"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-p-edge/20 px-3 py-2.5 text-sm font-medium text-p-mute transition hover:border-p-aqua/40 hover:text-p-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload evidence
                </button>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">Related risks</p>
                <ul className="mt-2 space-y-2">
                  {control.risks.map((r, i) => (
                    <li key={r.label}>
                      <Link
                        to="/app/risk"
                        data-testid={`drawer-risk-link-${i}`}
                        className="group flex items-center gap-2.5 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] px-3 py-2.5 text-sm text-p-ink/90 transition hover:border-p-aqua/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[r.severity]}`} />
                        <span className="min-w-0 flex-1 truncate">{r.label}</span>
                        <span className="text-xs capitalize text-p-faint">{r.severity}</span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-p-faint transition-transform duration-150 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <footer className="flex items-center gap-3 border-t border-p-edge/10 p-5">
              <button
                onClick={() => onMarkReviewed(control.id)}
                data-testid="drawer-mark-reviewed"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                style={{ background: "var(--p-grad)" }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as reviewed
              </button>
              <button
                data-testid="drawer-edit"
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
