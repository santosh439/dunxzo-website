import { ChevronRight } from "lucide-react";
import { CONTROL_STATUS, FRESHNESS, evidenceState } from "../../data/controls.js";

function HeaderRow() {
  return (
    <div className="grid min-w-[820px] grid-cols-12 items-center gap-3 border-b border-p-edge/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-p-faint">
      <span className="col-span-4">Control</span>
      <span className="col-span-3">Frameworks</span>
      <span className="col-span-1">Owner</span>
      <span className="col-span-2">Evidence</span>
      <span className="col-span-2">Status</span>
    </div>
  );
}

export default function ControlsTable({ controls, onSelect }) {
  return (
    <div data-testid="controls-table" className="p-panel overflow-x-auto">
      <HeaderRow />
      <ul className="min-w-[820px] divide-y divide-p-edge/5">
        {controls.map((c) => {
          const st = CONTROL_STATUS[c.status];
          const fr = FRESHNESS[evidenceState(c)];
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                data-testid={`control-row-${c.id}`}
                className="grid w-full grid-cols-12 items-center gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-p-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-p-aqua"
              >
                <span className="col-span-4 flex min-w-0 items-center gap-3">
                  <span className="shrink-0 rounded-md border border-p-violet/25 bg-p-violet/10 px-2 py-1 font-mono text-xs font-semibold text-p-violet">
                    {c.id}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-p-ink">{c.title}</span>
                    <span className="mt-0.5 block text-xs text-p-faint">{c.domain}</span>
                  </span>
                </span>
                <span className="col-span-3 flex flex-wrap items-center gap-1">
                  {c.frameworks.slice(0, 2).map((f) => (
                    <span key={f} className="rounded-full border border-p-edge/10 bg-p-ink/5 px-2 py-0.5 text-[11px] font-medium text-p-mute">
                      {f}
                    </span>
                  ))}
                  {c.frameworks.length > 2 && (
                    <span className="text-[11px] font-medium text-p-faint">+{c.frameworks.length - 2}</span>
                  )}
                </span>
                <span className="col-span-1">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-p-edge/10 bg-p-violet/10 text-[11px] font-semibold text-p-violet">
                    {c.owner}
                  </span>
                </span>
                <span className="col-span-2 flex items-center gap-1.5 text-xs text-p-mute">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${fr.dot}`} />
                  {c.evidence.length ? `${c.evidence.length} item${c.evidence.length > 1 ? "s" : ""} · ${fr.label}` : "None · Missing"}
                </span>
                <span className="col-span-2 flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-p-faint transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
