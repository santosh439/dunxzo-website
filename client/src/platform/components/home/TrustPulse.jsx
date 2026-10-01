import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import PulseGauge from "./PulseGauge.jsx";

function PillarBar({ pillar, index }) {
  return (
    <div data-testid={`pillar-${pillar.id}`}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-p-mute">{pillar.label}</p>
        <p className="text-sm font-semibold">{pillar.value}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-p-ink/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--p-grad)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pillar.value}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function TrustPulse({ pulse }) {
  return (
    <section data-testid="trust-pulse-panel" className="p-panel relative overflow-hidden p-6 md:p-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-p-violet/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-p-aqua/10 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Trust Pulse</h2>
          <p className="mt-0.5 text-sm text-p-mute">Your live compliance health score across every framework</p>
        </div>
        <span className="p-chip">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-p-success" />
          Live · updated 12 min ago
        </span>
      </div>

      <div className="relative mt-6 grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4">
          <PulseGauge score={pulse.score} />
          <span
            data-testid="pulse-delta"
            className="inline-flex items-center gap-1.5 rounded-full border border-p-success/25 bg-p-success/10 px-3 py-1 text-sm font-semibold text-p-success"
          >
            <TrendingUp className="h-4 w-4" />
            +{pulse.delta} {pulse.period}
          </span>
        </div>

        <div className="space-y-5">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {pulse.pillars.map((p, i) => (
              <PillarBar key={p.id} pillar={p} index={i} />
            ))}
          </div>

          <div className="rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">What moved your score</p>
            <ul className="mt-3 space-y-2.5">
              {pulse.changes.map((c, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" data-testid={`pulse-change-${i}`}>
                  <span
                    className={`inline-flex w-12 shrink-0 items-center justify-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs font-semibold ${
                      c.delta > 0
                        ? "border-p-success/25 bg-p-success/10 text-p-success"
                        : "border-p-danger/25 bg-p-danger/10 text-p-danger"
                    }`}
                  >
                    {c.delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {c.delta > 0 ? `+${c.delta}` : c.delta}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-p-ink/90">{c.text}</span>
                  <span className="shrink-0 text-xs text-p-faint">{c.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
