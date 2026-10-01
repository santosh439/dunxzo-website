import { ArrowRight, Clock, AlertCircle } from "lucide-react";

const DUE_STYLE = {
  danger: { cls: "text-p-danger", icon: AlertCircle },
  warning: { cls: "text-p-warning", icon: Clock },
  neutral: { cls: "text-p-faint", icon: Clock },
};

export default function NextActions({ actions }) {
  return (
    <section data-testid="next-actions" className="p-panel h-full p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Next best actions</h2>
          <p className="mt-0.5 text-sm text-p-mute">Ranked by impact on your Trust Pulse</p>
        </div>
        <span className="p-chip">{actions.length} actions</span>
      </div>

      <ol className="mt-5 space-y-1.5">
        {actions.map((a, i) => {
          const due = DUE_STYLE[a.tone];
          const DueIcon = due.icon;
          return (
            <li
              key={a.id}
              data-testid={`action-row-${a.id}`}
              className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-colors duration-150 hover:border-p-edge/10 hover:bg-p-ink/[0.04]"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-p-edge/10 bg-p-ink/5 text-sm font-semibold text-p-mute">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-p-ink">
                  {a.title}
                  {a.fresh && (
                    <span data-testid={`action-fresh-${a.id}`} className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-p-aqua align-middle" title="New from Monitoring" />
                  )}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-p-edge/10 bg-p-ink/5 px-2 py-0.5 font-medium text-p-mute">{a.framework}</span>
                  <span className={`inline-flex items-center gap-1 ${due.cls}`}>
                    <DueIcon className="h-3 w-3" />
                    {a.due}
                  </span>
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full border border-p-aqua/25 bg-p-aqua/10 px-2.5 py-1 text-xs font-semibold text-p-aqua sm:inline-flex">
                +{a.impact} Pulse
              </span>
              <span
                className="hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-p-edge/10 bg-p-violet/10 text-[11px] font-semibold text-p-violet md:grid"
                title={`Owner: ${a.owner}`}
              >
                {a.owner}
              </span>
              <button
                data-testid={`action-start-${a.id}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-p-edge/10 px-3 py-1.5 text-xs font-semibold text-p-mute transition-colors duration-150 hover:border-p-violet/40 hover:text-p-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
              >
                Start
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
