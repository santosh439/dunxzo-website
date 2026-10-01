import { CalendarDays } from "lucide-react";

export default function SideColumn({ upcoming, activity }) {
  return (
    <div className="flex h-full flex-col gap-4">
      <section data-testid="upcoming-panel" className="p-panel p-5">
        <h3 className="text-sm font-semibold tracking-tight">Upcoming</h3>
        <ul className="mt-4 space-y-3">
          {upcoming.map((u, i) => (
            <li key={i} data-testid={`upcoming-${i}`} className="flex items-center gap-3">
              <span className="grid h-10 w-12 shrink-0 place-items-center rounded-lg border border-p-edge/10 bg-p-ink/5 text-[11px] font-semibold leading-tight text-p-mute">
                <CalendarDays className="mb-0.5 h-3.5 w-3.5 text-p-faint" />
                {u.date}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-p-ink/90">{u.label}</span>
              <span className="shrink-0 text-xs font-medium text-p-faint">in {u.days}d</span>
            </li>
          ))}
        </ul>
      </section>

      <section data-testid="activity-panel" className="p-panel flex-1 p-5">
        <h3 className="text-sm font-semibold tracking-tight">Recent activity</h3>
        <ul className="mt-4 space-y-0">
          {activity.map((a, i) => (
            <li key={i} data-testid={`activity-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
              {i < activity.length - 1 && <span className="absolute left-[3px] top-3 h-full w-px bg-p-edge/15" />}
              <span className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-p-violet" />
              <div className="min-w-0">
                <p className="text-sm leading-snug text-p-ink/90">{a.text}</p>
                <p className="mt-0.5 text-xs text-p-faint">{a.when}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
