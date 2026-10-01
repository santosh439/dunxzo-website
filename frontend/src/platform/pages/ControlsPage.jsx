import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, AlertTriangle, FileWarning, FileEdit } from "lucide-react";
import ControlsTable from "../components/controls/ControlsTable.jsx";
import ControlDrawer from "../components/controls/ControlDrawer.jsx";
import { CONTROLS, CONTROL_STATUS, FRAMEWORK_FILTERS } from "../data/controls.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const CONTROL_BY_ID = Object.fromEntries(CONTROLS.map((c) => [c.id, c]));

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const STAT_META = [
  { key: "operational", label: "Operational", icon: ShieldCheck, cls: "text-p-success" },
  { key: "attention", label: "Needs attention", icon: AlertTriangle, cls: "text-p-warning" },
  { key: "missing", label: "Missing evidence", icon: FileWarning, cls: "text-p-danger" },
  { key: "draft", label: "Draft", icon: FileEdit, cls: "text-p-info" },
];

export default function ControlsPage() {
  const { data, reviewControl } = useWorkspace();
  const [query, setQuery] = useState("");
  const [framework, setFramework] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    document.title = "Controls · DU-NZO Platform";
  }, []);

  // Merge live workspace status/owner with the rich display template fields by id.
  const controls = useMemo(() => {
    const source = data?.controls;
    if (!source) return [];
    return source.map((c) => ({ ...(CONTROL_BY_ID[c.id] || {}), ...c }));
  }, [data]);

  const stats = useMemo(() => {
    const s = { operational: 0, attention: 0, missing: 0, draft: 0 };
    controls.forEach((c) => { if (s[c.status] != null) s[c.status]++; });
    return s;
  }, [controls]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return controls.filter(
      (c) =>
        (framework === "All" || c.frameworks.includes(framework)) &&
        (status === "All" || c.status === status) &&
        (!q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || (c.domain || "").toLowerCase().includes(q))
    );
  }, [controls, query, framework, status]);

  const selected = controls.find((c) => c.id === selectedId) || null;

  const markReviewed = (id) => {
    reviewControl(id).catch(() => {});
    setSelectedId(null);
  };

  const chipCls = (active) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua ${
      active ? "border-p-violet/40 bg-p-violet/15 text-p-ink" : "border-p-edge/10 bg-p-ink/5 text-p-mute hover:text-p-ink"
    }`;

  return (
    <motion.div
      data-testid="platform-page-controls"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Controls</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">
            Every control mapped across your frameworks — one library, many obligations.
          </p>
        </div>
        <span className="p-chip">
          <span className="h-1.5 w-1.5 rounded-full bg-p-aqua" />
          {controls.length} controls · 4 frameworks
        </span>
      </motion.header>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_META.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatus(status === s.key ? "All" : s.key)}
            data-testid={`stat-${s.key}`}
            className={`p-panel flex items-center gap-3 p-4 text-left transition-transform duration-200 hover:-translate-y-0.5 ${
              status === s.key ? "ring-2 ring-p-violet/50" : ""
            }`}
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 ${s.cls}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-2xl font-semibold tracking-tight">{stats[s.key]}</span>
              <span className="block text-xs text-p-faint">{s.label}</span>
            </span>
          </button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-p-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="controls-search"
            type="search"
            placeholder="Search by ID, title or domain…"
            className="h-11 w-full rounded-full border border-p-edge/10 bg-p-ink/5 pl-10 pr-4 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus-visible:ring-p-violet/25"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setFramework("All")} data-testid="filter-framework-all" className={chipCls(framework === "All")}>
            All frameworks
          </button>
          {FRAMEWORK_FILTERS.map((f) => (
            <button key={f} onClick={() => setFramework(framework === f ? "All" : f)} data-testid={`filter-framework-${f.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`} className={chipCls(framework === f)}>
              {f}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-p-edge/15 sm:inline-block" />
          <button onClick={() => setStatus("All")} data-testid="filter-status-all" className={chipCls(status === "All")}>
            All statuses
          </button>
          {Object.entries(CONTROL_STATUS).map(([key, s]) => (
            <button key={key} onClick={() => setStatus(status === key ? "All" : key)} data-testid={`filter-status-${key}`} className={chipCls(status === key)}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {filtered.length ? (
          <ControlsTable controls={filtered} onSelect={setSelectedId} />
        ) : (
          <div data-testid="controls-empty" className="p-panel p-10 text-center">
            <p className="text-lg font-semibold">No controls match these filters</p>
            <p className="mt-1 text-sm text-p-mute">Try a different search term or clear the filters.</p>
            <button
              onClick={() => { setQuery(""); setFramework("All"); setStatus("All"); }}
              data-testid="controls-clear-filters"
              className="mt-4 rounded-full border border-p-edge/10 bg-p-ink/5 px-5 py-2 text-sm font-semibold text-p-mute transition hover:text-p-ink"
            >
              Clear filters
            </button>
          </div>
        )}
      </motion.div>

      <ControlDrawer control={selected} onClose={() => setSelectedId(null)} onMarkReviewed={markReviewed} />
    </motion.div>
  );
}
