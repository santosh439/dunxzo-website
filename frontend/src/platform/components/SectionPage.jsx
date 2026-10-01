import { useEffect } from "react";

export default function SectionPage({ section }) {
  const Icon = section.icon;
  const slug = section.slug || "home";

  useEffect(() => {
    document.title = `${section.name} · DU-NZO Platform`;
  }, [section.name]);

  return (
    <div data-testid={`platform-page-${slug}`} className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="p-chip" data-testid={`command-chip-${slug}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-p-aqua" />
            Command {section.command} · Preview
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{section.name}</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-p-mute">{section.blurb}</p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-p-edge/10 bg-p-violet/10 text-p-violet">
          <Icon className="h-6 w-6" />
        </span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Primary metric", "Secondary metric", "Trend"].map((label, i) => (
          <div key={label} className="p-panel p-5" data-testid={`stat-card-${slug}-${i}`}>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-p-faint">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-p-ink/40">—</p>
            <div className="mt-4 h-1.5 w-2/3 animate-pulse rounded-full bg-p-ink/10" />
          </div>
        ))}
      </div>

      <div className="p-panel relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-p-violet/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-p-aqua/10 blur-3xl" />
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-p-faint">Coming next</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
          This section ships in <span className="p-text-gradient">Command {section.command}</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-p-mute">
          {section.blurb} The app shell, routing, design tokens and theming you see now are Command 1.
        </p>
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-p-ink/[0.06]" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
