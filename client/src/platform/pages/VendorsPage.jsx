import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Building2, ShieldAlert, FileWarning, FileClock } from "lucide-react";
import { VENDORS, VENDOR_STATUS, TIER, CERT_STATE } from "../data/risk.js";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function VendorsPage() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");

  useEffect(() => {
    document.title = "Vendors · DU-NZO Platform";
  }, []);

  const stats = useMemo(() => {
    return {
      total: VENDORS.length,
      critical: VENDORS.filter((v) => v.tier === "critical").length,
      expired: VENDORS.filter((v) => v.certState === "expired").length,
      review: VENDORS.filter((v) => v.status === "review").length,
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VENDORS.filter(
      (v) => (tier === "All" || v.tier === tier) && (!q || v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q))
    );
  }, [query, tier]);

  const chipCls = (active) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua ${
      active ? "border-p-violet/40 bg-p-violet/15 text-p-ink" : "border-p-edge/10 bg-p-ink/5 text-p-mute hover:text-p-ink"
    }`;

  const STAT_META = [
    { key: "total", label: "Vendors", icon: Building2, cls: "text-p-violet", value: stats.total },
    { key: "critical", label: "Critical tier", icon: ShieldAlert, cls: "text-p-danger", value: stats.critical },
    { key: "expired", label: "Expired certificates", icon: FileWarning, cls: "text-p-warning", value: stats.expired },
    { key: "review", label: "Under review", icon: FileClock, cls: "text-p-info", value: stats.review },
  ];

  return (
    <motion.div
      data-testid="platform-page-vendors"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Vendors</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">
            Third-party inventory with risk tiers, data access and certificate tracking.
          </p>
        </div>
        <button
          data-testid="add-vendor"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
          style={{ background: "var(--p-grad)" }}
        >
          <Plus className="h-4 w-4" />
          Add vendor
        </button>
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

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-p-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="vendors-search"
            type="search"
            placeholder="Search vendors…"
            className="h-10 w-full rounded-full border border-p-edge/10 bg-p-ink/5 pl-10 pr-4 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25"
          />
        </div>
        <button onClick={() => setTier("All")} data-testid="filter-tier-all" className={chipCls(tier === "All")}>All tiers</button>
        {Object.entries(TIER).map(([key, t]) => (
          <button key={key} onClick={() => setTier(tier === key ? "All" : key)} data-testid={`filter-tier-${key}`} className={chipCls(tier === key)}>
            <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
            {t.label}
          </button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="p-panel overflow-x-auto" data-testid="vendors-table">
          <div className="grid min-w-[860px] grid-cols-12 items-center gap-3 border-b border-p-edge/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-p-faint">
            <span className="col-span-3">Vendor</span>
            <span className="col-span-1">Tier</span>
            <span className="col-span-2">Data access</span>
            <span className="col-span-3">Certificate</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-1">Owner</span>
          </div>
          <ul className="min-w-[860px] divide-y divide-p-edge/5">
            {filtered.map((v) => {
              const t = TIER[v.tier];
              const st = VENDOR_STATUS[v.status];
              const cert = CERT_STATE[v.certState];
              return (
                <li key={v.id} data-testid={`vendor-row-${v.id}`} className="grid grid-cols-12 items-center gap-3 px-5 py-3.5 transition hover:bg-p-ink/[0.04]">
                  <span className="col-span-3 flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-p-edge/10 bg-p-ink/5 text-xs font-bold text-p-mute">
                      {v.name.slice(0, 1)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-p-ink">{v.name}</span>
                      <span className="block text-xs text-p-faint">{v.category} · review {v.nextReview}</span>
                    </span>
                  </span>
                  <span className="col-span-1">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${t.cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                      {t.label}
                    </span>
                  </span>
                  <span className="col-span-2 text-xs text-p-mute">{v.dataAccess}</span>
                  <span className="col-span-3">
                    <span className="block text-sm text-p-ink/90">{v.cert}</span>
                    <span className={`text-xs font-medium ${cert.cls}`}>
                      {v.certState === "expired" || v.certState === "none" ? (v.certState === "none" ? "None on file" : v.certExpiry) : `Valid · ${v.certExpiry}`}
                    </span>
                  </span>
                  <span className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </span>
                  <span className="col-span-1">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-p-edge/10 bg-p-violet/10 text-[10px] font-semibold text-p-violet">{v.owner}</span>
                  </span>
                </li>
              );
            })}
            {!filtered.length && (
              <li className="p-10 text-center text-sm text-p-mute" data-testid="vendors-empty">No vendors match these filters.</li>
            )}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
