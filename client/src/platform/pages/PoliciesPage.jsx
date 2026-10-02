import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, ChevronRight, BookCheck, BookOpen, FileEdit, AlarmClock } from "lucide-react";
import { POLICIES, POLICY_STATUS } from "../data/operations.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const STAT_META = [
  { key: "published", label: "Published", icon: BookCheck, cls: "text-p-success" },
  { key: "in-review", label: "In review", icon: BookOpen, cls: "text-p-info" },
  { key: "draft", label: "Draft", icon: FileEdit, cls: "text-p-mute" },
  { key: "overdue", label: "Review overdue", icon: AlarmClock, cls: "text-p-danger" },
];

export default function PoliciesPage() {
  const { data } = useWorkspace();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    document.title = "Policies · DU-NZO Platform";
  }, []);

  const policies = data?.policies ?? POLICIES;

  const stats = useMemo(() => {
    const s = { published: 0, "in-review": 0, draft: 0, overdue: 0 };
    policies.forEach((p) => { if (s[p.status] != null) s[p.status]++; });
    return s;
  }, [policies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return policies.filter(
      (p) => (status === "All" || p.status === status) && (!q || p.name.toLowerCase().includes(q))
    );
  }, [policies, query, status]);

  return (
    <motion.div
      data-testid="platform-page-policies"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Policies</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">
            The full policy lifecycle — drafts, approvals, publication and company-wide attestation.
          </p>
        </div>
        <button
          data-testid="new-policy"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
          style={{ background: "var(--p-grad)" }}
        >
          <Plus className="h-4 w-4" />
          New policy
        </button>
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

      <motion.div variants={fadeUp} className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-p-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="policies-search"
          type="search"
          placeholder="Search policies…"
          className="h-11 w-full rounded-full border border-p-edge/10 bg-p-ink/5 pl-10 pr-4 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25"
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="p-panel overflow-x-auto" data-testid="policies-table">
          <div className="grid min-w-[820px] grid-cols-12 items-center gap-3 border-b border-p-edge/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-p-faint">
            <span className="col-span-4">Policy</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2">Attestation</span>
            <span className="col-span-2">Updated</span>
            <span className="col-span-2">Next review</span>
          </div>
          <ul className="min-w-[820px] divide-y divide-p-edge/5">
            {filtered.map((p) => {
              const st = POLICY_STATUS[p.status];
              return (
                <li key={p.id}>
                  <button
                    data-testid={`policy-row-${p.id}`}
                    className="grid w-full grid-cols-12 items-center gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-p-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-p-aqua"
                  >
                    <span className="col-span-4 flex min-w-0 items-center gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-p-ink">{p.name}</span>
                        <span className="mt-0.5 block text-xs text-p-faint">{p.version} · Owner {p.owner}</span>
                      </span>
                    </span>
                    <span className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </span>
                    <span className="col-span-2">
                      {p.attestation != null ? (
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-p-ink/10">
                            <span className="block h-full rounded-full" style={{ width: `${p.attestation}%`, background: "var(--p-grad)" }} />
                          </span>
                          <span className="text-xs font-medium text-p-mute">{p.attestation}%</span>
                        </span>
                      ) : (
                        <span className="text-xs text-p-faint">—</span>
                      )}
                    </span>
                    <span className="col-span-2 text-xs text-p-mute">{p.updated}</span>
                    <span className="col-span-2 flex items-center justify-between gap-2">
                      <span className={`text-xs font-medium ${p.status === "overdue" ? "text-p-danger" : "text-p-mute"}`}>{p.nextReview}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-p-faint" />
                    </span>
                  </button>
                </li>
              );
            })}
            {!filtered.length && (
              <li className="p-10 text-center text-sm text-p-mute" data-testid="policies-empty">No policies match these filters.</li>
            )}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
