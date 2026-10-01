import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, Circle, Upload, FileCheck2 } from "lucide-react";
import { AUDIT, AUDITOR_REQUESTS, FINDINGS, FINDING_SEVERITY, REQUEST_STATUS } from "../data/assurance.js";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function AuditPage() {
  const [requests, setRequests] = useState(AUDITOR_REQUESTS);

  useEffect(() => {
    document.title = "Audit hub · DU-NZO Platform";
  }, []);

  const submittedCount = useMemo(() => requests.filter((r) => r.status === "submitted").length, [requests]);
  const openFindings = FINDINGS.filter((f) => f.status !== "closed").length;

  const submit = (id) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "submitted", collected: r.total } : r)));

  return (
    <motion.div data-testid="platform-page-audit" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="space-y-6">
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Audit hub</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">Your command center for the upcoming audit — readiness, requests and findings.</p>
        </div>
        <span className="p-chip"><CalendarClock className="h-3.5 w-3.5 text-p-aqua" />{AUDIT.window} · in {AUDIT.daysOut}d</span>
      </motion.header>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section variants={fadeUp} className="p-panel relative overflow-hidden p-6" data-testid="audit-readiness">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-p-violet/10 blur-3xl" />
          <p className="text-sm font-medium text-p-mute">{AUDIT.framework}</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">{AUDIT.stage}</h2>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight p-text-gradient">{AUDIT.readiness}%</span>
            <span className="pb-1.5 text-sm text-p-faint">ready</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-p-ink/10">
            <motion.div className="h-full rounded-full" style={{ background: "var(--p-grad)" }} initial={{ width: 0 }} animate={{ width: `${AUDIT.readiness}%` }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <p className="mt-4 text-xs text-p-faint">Auditor</p>
          <p className="text-sm font-medium text-p-ink">{AUDIT.auditor}</p>

          <ul className="mt-5 space-y-2.5">
            {AUDIT.milestones.map((m, i) => (
              <li key={i} data-testid={`milestone-${i}`} className="flex items-center gap-2.5 text-sm">
                {m.done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-p-success" /> : <Circle className="h-4 w-4 shrink-0 text-p-faint" />}
                <span className={m.done ? "text-p-mute line-through" : "text-p-ink"}>{m.label}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={fadeUp} className="p-panel p-6 lg:col-span-2" data-testid="auditor-requests">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Auditor requests</h2>
              <p className="mt-0.5 text-sm text-p-mute">{submittedCount} of {requests.length} submitted</p>
            </div>
            <span className="p-chip"><FileCheck2 className="h-3.5 w-3.5" />{requests.length - submittedCount} pending</span>
          </div>
          <ul className="mt-5 space-y-2">
            {requests.map((r) => {
              const rs = REQUEST_STATUS[r.status];
              return (
                <li key={r.id} data-testid={`auditor-request-${r.id}`} className="flex items-center gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-p-ink">{r.label}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-p-ink/10">
                        <div className="h-full rounded-full" style={{ width: `${(r.collected / r.total) * 100}%`, background: "var(--p-grad)" }} />
                      </div>
                      <span className="text-xs text-p-faint">{r.collected}/{r.total}</span>
                      <span className="text-xs text-p-faint">· due {r.due}</span>
                      <span className={`text-xs font-semibold ${rs.cls}`}>{rs.label}</span>
                    </div>
                  </div>
                  {r.status === "submitted" ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-p-success/25 bg-p-success/10 px-2.5 py-1 text-xs font-semibold text-p-success">
                      <CheckCircle2 className="h-3 w-3" />Submitted
                    </span>
                  ) : (
                    <button onClick={() => submit(r.id)} data-testid={`request-submit-${r.id}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-p-edge/10 bg-p-ink/5 px-3.5 py-1.5 text-xs font-semibold text-p-mute transition hover:border-p-violet/40 hover:text-p-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua">
                      <Upload className="h-3.5 w-3.5" />Submit
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.section>
      </div>

      <motion.section variants={fadeUp} className="p-panel p-6" data-testid="audit-findings">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Findings</h2>
          <span className="p-chip">{openFindings} open</span>
        </div>
        <ul className="mt-4 divide-y divide-p-edge/5">
          {FINDINGS.map((f) => {
            const sev = FINDING_SEVERITY[f.severity];
            return (
              <li key={f.id} data-testid={`finding-${f.id}`} className="flex items-center gap-3 py-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${sev.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />{sev.label}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-p-ink">{f.title}</span>
                <span className="shrink-0 rounded border border-p-violet/25 bg-p-violet/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-p-violet">{f.control}</span>
                <span className={`shrink-0 text-xs font-medium capitalize ${f.status === "closed" ? "text-p-success" : f.status === "in-progress" ? "text-p-warning" : "text-p-danger"}`}>{f.status.replace("-", " ")}</span>
              </li>
            );
          })}
        </ul>
      </motion.section>
    </motion.div>
  );
}
