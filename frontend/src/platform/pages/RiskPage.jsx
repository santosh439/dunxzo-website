import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, Flame, Wrench, Gauge, X } from "lucide-react";
import { RISKS, RISK_STATUS, BAND, bandOf } from "../data/risk.js";
import RiskDrawer from "../components/risk/RiskDrawer.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const RISK_BY_ID = Object.fromEntries(RISKS.map((r) => [r.id, r]));

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function RiskPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [cell, setCell] = useState(null); // { l, i }
  const [selectedId, setSelectedId] = useState(null);
  const { data, acceptRisk } = useWorkspace();

  useEffect(() => {
    document.title = "Risk register · DU-NZO Platform";
  }, []);

  const scored = useMemo(() => {
    const source = data?.risks || [];
    return source.map((r) => {
      const merged = { ...(RISK_BY_ID[r.id] || {}), ...r };
      return { ...merged, score: merged.likelihood * merged.impact, band: bandOf(merged.likelihood * merged.impact) };
    });
  }, [data]);

  const stats = useMemo(() => {
    const open = scored.filter((r) => r.status === "open").length;
    const mitigating = scored.filter((r) => r.status === "mitigating").length;
    const severe = scored.filter((r) => r.band === "critical" || r.band === "high").length;
    const avg = (scored.reduce((a, r) => a + r.score, 0) / scored.length).toFixed(1);
    return { total: scored.length, open, mitigating, severe, avg };
  }, [scored]);

  const cellCounts = useMemo(() => {
    const m = {};
    scored.forEach((r) => {
      const k = `${r.likelihood}x${r.impact}`;
      m[k] = (m[k] || 0) + 1;
    });
    return m;
  }, [scored]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scored.filter(
      (r) =>
        (status === "All" || r.status === status) &&
        (!cell || (r.likelihood === cell.l && r.impact === cell.i)) &&
        (!q || r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    );
  }, [scored, query, status, cell]);

  const chipCls = (active) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua ${
      active ? "border-p-violet/40 bg-p-violet/15 text-p-ink" : "border-p-edge/10 bg-p-ink/5 text-p-mute hover:text-p-ink"
    }`;

  const selected = scored.find((r) => r.id === selectedId) || null;
  const acceptResidual = (id) => {
    acceptRisk(id).catch(() => {});
    setSelectedId(null);
  };

  const STAT_META = [
    { key: "total", label: "Risks on register", icon: Gauge, cls: "text-p-violet", value: stats.total },
    { key: "severe", label: "Critical / High", icon: Flame, cls: "text-p-danger", value: stats.severe },
    { key: "mitigating", label: "Being mitigated", icon: Wrench, cls: "text-p-warning", value: stats.mitigating },
    { key: "open", label: "Open & untreated", icon: AlertTriangle, cls: "text-p-info", value: stats.open },
  ];

  return (
    <motion.div
      data-testid="platform-page-risk"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Risk register</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">
            Risks scored by likelihood × impact, linked to the controls that treat them.
          </p>
        </div>
        <span className="p-chip">
          <span className="h-1.5 w-1.5 rounded-full bg-p-aqua" />
          Avg score {stats.avg} / 25
        </span>
      </motion.header>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_META.map((s) => (
          <div key={s.key} data-testid={`stat-${s.key}`} className="p-panel flex items-center gap-3 p-4">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 ${s.cls}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-2xl font-semibold tracking-tight">{s.value}</span>
              <span className="block text-xs text-p-faint">{s.label}</span>
            </span>
          </div>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section variants={fadeUp} className="p-panel p-6" data-testid="risk-heatmap">
          <h2 className="text-lg font-semibold tracking-tight">Heat map</h2>
          <p className="mt-0.5 text-sm text-p-mute">Likelihood × impact · select a cell to filter</p>
          <div className="mt-5 flex gap-2">
            <div className="flex flex-col justify-between py-1 text-[10px] font-medium uppercase tracking-wider text-p-faint">
              {[5, 4, 3, 2, 1].map((l) => (
                <span key={l} className="flex h-11 items-center">L{l}</span>
              ))}
            </div>
            <div className="flex-1">
              <div className="grid grid-rows-5 gap-1.5">
                {[5, 4, 3, 2, 1].map((l) => (
                  <div key={l} className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const count = cellCounts[`${l}x${i}`] || 0;
                      const band = BAND[bandOf(l * i)];
                      const active = cell && cell.l === l && cell.i === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setCell(active ? null : { l, i })}
                          disabled={!count}
                          aria-pressed={active}
                          aria-label={`Likelihood ${l}, impact ${i}: ${count} risks`}
                          data-testid={`heat-cell-${l}-${i}`}
                          className={`flex h-11 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                            count ? band.cell : "border-p-edge/5 bg-p-ink/[0.02] text-p-faint/40"
                          } ${active ? "ring-2 ring-p-violet/60" : ""} ${count ? "hover:scale-[1.04]" : "cursor-default"}`}
                        >
                          {count || ""}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-1.5 grid grid-cols-5 gap-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-p-faint">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i}>I{i}</span>
                ))}
              </div>
            </div>
          </div>
          {cell && (
            <button onClick={() => setCell(null)} data-testid="heat-clear" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-p-violet/40 bg-p-violet/15 px-3 py-1.5 text-xs font-semibold text-p-ink">
              L{cell.l} × I{cell.i} selected
              <X className="h-3 w-3" />
            </button>
          )}
        </motion.section>

        <motion.section variants={fadeUp} className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-p-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="risk-search"
                type="search"
                placeholder="Search risks…"
                className="h-10 w-full rounded-full border border-p-edge/10 bg-p-ink/5 pl-10 pr-4 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25"
              />
            </div>
            <button onClick={() => setStatus("All")} data-testid="filter-risk-status-all" className={chipCls(status === "All")}>All</button>
            {Object.entries(RISK_STATUS).map(([key, s]) => (
              <button key={key} onClick={() => setStatus(status === key ? "All" : key)} data-testid={`filter-risk-status-${key}`} className={chipCls(status === key)}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-panel overflow-x-auto" data-testid="risk-table">
            <div className="grid min-w-[820px] grid-cols-12 items-center gap-3 border-b border-p-edge/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-p-faint">
              <span className="col-span-4">Risk</span>
              <span className="col-span-2">Score</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2">Controls</span>
              <span className="col-span-1">Owner</span>
              <span className="col-span-1">Review</span>
            </div>
            <ul className="min-w-[820px] divide-y divide-p-edge/5">
              {filtered.map((r) => {
                const st = RISK_STATUS[r.status];
                const band = BAND[r.band];
                return (
                  <li key={r.id}>
                  <button onClick={() => setSelectedId(r.id)} data-testid={`risk-row-${r.id}`} className="grid w-full grid-cols-12 items-center gap-3 px-5 py-3.5 text-left transition hover:bg-p-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-p-aqua">
                    <span className="col-span-4 flex min-w-0 items-center gap-3">
                      <span className="shrink-0 rounded-md border border-p-edge/15 bg-p-ink/5 px-2 py-1 font-mono text-xs font-semibold text-p-mute">{r.id}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-p-ink">{r.title}</span>
                        <span className="block text-xs text-p-faint">{r.category}</span>
                      </span>
                    </span>
                    <span className="col-span-2 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${band.cls}`}>
                        {r.score} · {band.label}
                      </span>
                      <span className="text-[11px] text-p-faint">{r.likelihood}×{r.impact}</span>
                    </span>
                    <span className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </span>
                    <span className="col-span-2 flex flex-wrap gap-1">
                      {r.controls.length
                        ? r.controls.map((c) => (
                            <span key={c} className="rounded border border-p-violet/25 bg-p-violet/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-p-violet">{c}</span>
                          ))
                        : <span className="text-xs text-p-faint">—</span>}
                    </span>
                    <span className="col-span-1">
                      <span className="grid h-7 w-7 place-items-center rounded-full border border-p-edge/10 bg-p-violet/10 text-[10px] font-semibold text-p-violet">{r.owner}</span>
                    </span>
                    <span className="col-span-1 text-xs text-p-mute">{r.review}</span>
                  </button>
                  </li>
                );
              })}
              {!filtered.length && (
                <li className="p-10 text-center text-sm text-p-mute" data-testid="risk-empty">No risks match these filters.</li>
              )}
            </ul>
          </div>
        </motion.section>
      </div>

      <RiskDrawer risk={selected} onClose={() => setSelectedId(null)} onAcceptResidual={acceptResidual} />
    </motion.div>
  );
}
