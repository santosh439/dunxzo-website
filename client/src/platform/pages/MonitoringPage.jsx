import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Radar, CheckCircle2, AlertTriangle, XCircle, Check } from "lucide-react";
import { CHECKS, DRIFT_ALERTS, CHECK_STATUS, SEVERITY } from "../data/operations.js";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const CHECK_ICON = {
  passing: { icon: CheckCircle2, cls: "text-p-success" },
  drifting: { icon: AlertTriangle, cls: "text-p-warning" },
  failing: { icon: XCircle, cls: "text-p-danger" },
};

const STAT_META = [
  { key: "total", label: "Active checks", icon: Radar, cls: "text-p-violet" },
  { key: "passing", label: "Passing", icon: CheckCircle2, cls: "text-p-success" },
  { key: "drifting", label: "Drifting", icon: AlertTriangle, cls: "text-p-warning" },
  { key: "failing", label: "Failing", icon: XCircle, cls: "text-p-danger" },
];

export default function MonitoringPage() {
  const [acknowledged, setAcknowledged] = useState(() => new Set());

  useEffect(() => {
    document.title = "Monitoring · DU-NZO Platform";
  }, []);

  const stats = useMemo(() => {
    const s = { total: CHECKS.length, passing: 0, drifting: 0, failing: 0 };
    CHECKS.forEach((c) => s[c.status]++);
    return s;
  }, []);

  const acknowledge = (id) => setAcknowledged((prev) => new Set(prev).add(id));

  return (
    <motion.div
      data-testid="platform-page-monitoring"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Monitoring</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">
            Continuous checks on your controls — drift is caught here before an auditor catches it.
          </p>
        </div>
        <span className="p-chip">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-p-success" />
          Live · {CHECKS.length} checks running
        </span>
      </motion.header>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_META.map((s) => (
          <div key={s.key} data-testid={`stat-${s.key}`} className="p-panel flex items-center gap-3 p-4">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 ${s.cls}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-2xl font-semibold tracking-tight">{stats[s.key]}</span>
              <span className="block text-xs text-p-faint">{s.label}</span>
            </span>
          </div>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section variants={fadeUp} data-testid="drift-alerts" className="p-panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Drift alerts</h2>
              <p className="mt-0.5 text-sm text-p-mute">Configuration and process drift detected across connected sources</p>
            </div>
            <span className="p-chip">{DRIFT_ALERTS.length - acknowledged.size} open</span>
          </div>
          <ul className="mt-5 space-y-2">
            {DRIFT_ALERTS.map((a) => {
              const sev = SEVERITY[a.severity];
              const acked = acknowledged.has(a.id);
              return (
                <li
                  key={a.id}
                  data-testid={`alert-${a.id}`}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 transition ${
                    acked ? "border-p-edge/5 opacity-50" : "border-p-edge/10 bg-p-ink/[0.03]"
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${sev.dot} ${!acked && a.severity === "critical" ? "animate-pulse" : ""}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-p-ink">{a.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-p-faint">
                      <span className="rounded-md border border-p-violet/25 bg-p-violet/10 px-1.5 py-0.5 font-mono font-semibold text-p-violet">{a.control}</span>
                      <span>{a.source}</span>
                      <span>·</span>
                      <span>{a.detected}</span>
                      <span className={`font-semibold capitalize ${sev.cls}`}>{sev.label}</span>
                    </p>
                  </div>
                  {acked ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-p-success/25 bg-p-success/10 px-2.5 py-1 text-xs font-semibold text-p-success">
                      <Check className="h-3 w-3" />
                      Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledge(a.id)}
                      data-testid={`alert-ack-${a.id}`}
                      className="shrink-0 rounded-full border border-p-edge/10 bg-p-ink/5 px-3.5 py-1.5 text-xs font-semibold text-p-mute transition hover:border-p-violet/40 hover:text-p-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                    >
                      Acknowledge
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.section>

        <motion.section variants={fadeUp} data-testid="check-runs" className="p-panel p-6">
          <h2 className="text-lg font-semibold tracking-tight">Check runs</h2>
          <p className="mt-0.5 text-sm text-p-mute">Latest result from every connected source</p>
          <ul className="mt-5 space-y-1">
            {CHECKS.map((c) => {
              const I = CHECK_ICON[c.status];
              const st = CHECK_STATUS[c.status];
              return (
                <li key={c.id} data-testid={`check-${c.id}`} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-p-ink/[0.04]">
                  <I.icon className={`h-[18px] w-[18px] shrink-0 ${I.cls}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-p-ink">{c.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-p-faint">
                      <span className="rounded border border-p-violet/25 bg-p-violet/10 px-1 font-mono text-[10px] font-semibold text-p-violet">{c.control}</span>
                      {c.source} · {c.cadence}
                    </p>
                  </div>
                  <span className="shrink-0 text-right">
                    <span className={`block text-[11px] font-semibold ${st.cls.split(" ").pop()}`}>{st.label}</span>
                    <span className="block text-[11px] text-p-faint">{c.lastRun}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.section>
      </div>
    </motion.div>
  );
}
