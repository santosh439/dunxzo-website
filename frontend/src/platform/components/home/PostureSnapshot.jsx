import { motion } from "framer-motion";
import { CalendarClock, AlertCircle, Sparkles } from "lucide-react";

const STATUS = {
  "on-track": { label: "On track", cls: "border-p-success/25 bg-p-success/10 text-p-success", dot: "bg-p-success" },
  attention: { label: "Needs attention", cls: "border-p-warning/25 bg-p-warning/10 text-p-warning", dot: "bg-p-warning" },
  early: { label: "Early stage", cls: "border-p-info/25 bg-p-info/10 text-p-info", dot: "bg-p-info" },
};

const META_ICON = {
  "on-track": { icon: CalendarClock, cls: "text-p-faint" },
  attention: { icon: AlertCircle, cls: "text-p-warning" },
  early: { icon: Sparkles, cls: "text-p-info" },
};

export default function PostureSnapshot({ frameworks }) {
  return (
    <section data-testid="posture-snapshot">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Posture snapshot</h2>
        <span className="p-chip">{frameworks.length} frameworks</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {frameworks.map((f, i) => {
          const s = STATUS[f.status];
          const Meta = META_ICON[f.status];
          const pct = Math.round(f.progress * 100);
          return (
            <div
              key={f.id}
              data-testid={`framework-card-${f.id}`}
              className="p-panel flex flex-col gap-4 p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[15px] font-semibold tracking-tight">{f.name}</h3>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-tight">{pct}%</span>
                  <span className="text-xs text-p-faint">{f.controls}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-p-ink/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--p-grad)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
              <p className="mt-auto flex items-center gap-1.5 text-xs text-p-mute">
                <Meta.icon className={`h-3.5 w-3.5 shrink-0 ${Meta.cls}`} />
                {f.meta}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
