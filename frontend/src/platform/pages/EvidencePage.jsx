import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, FileText, FolderCheck, FileWarning, Inbox, UploadCloud, Loader2 } from "lucide-react";
import { EVIDENCE_ITEMS, EVIDENCE_REQUESTS } from "../data/operations.js";
import { FRESHNESS as FRESHNESS_ITEMS } from "../data/controls.js";
import { downloadAuditPack } from "../lib/auditPack.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { apiFetch, getToken } from "../lib/api.js";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function EvidencePage() {
  const { data, refresh } = useWorkspace();
  const [query, setQuery] = useState("");
  const [freshness, setFreshness] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef(null);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (file.size > 15 * 1024 * 1024) { setUploadError("File exceeds the 15 MB limit."); e.target.value = ""; return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/workspace/evidence?control=${encodeURIComponent("—")}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.detail || "Upload failed"); }
      await refresh();
    } catch (err) {
      setUploadError(err.message || "Upload failed, please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const downloadEvidence = async (fileId, name) => {
    const res = await apiFetch(`/workspace/evidence/${fileId}/download`, { raw: true });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  useEffect(() => {
    document.title = "Evidence · DU-NZO Platform";
  }, []);

  const items = data?.evidence ?? EVIDENCE_ITEMS;
  const requests = data?.auditRequests ?? EVIDENCE_REQUESTS;

  const counts = useMemo(() => {
    const c = { fresh: 0, stale: 0 };
    items.forEach((e) => { if (c[e.freshness] != null) c[e.freshness]++; });
    return { ...c, total: items.length };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (e) =>
        (freshness === "All" || e.freshness === freshness) &&
        (!q || e.name.toLowerCase().includes(q) || e.control.toLowerCase().includes(q))
    );
  }, [items, query, freshness]);

  const chipCls = (active) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua ${
      active ? "border-p-violet/40 bg-p-violet/15 text-p-ink" : "border-p-edge/10 bg-p-ink/5 text-p-mute hover:text-p-ink"
    }`;

  const freshPct = Math.round((counts.fresh / counts.total) * 100);
  const stalePct = 100 - freshPct;

  return (
    <motion.div
      data-testid="platform-page-evidence"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Evidence</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">
            Every artefact an auditor will ask for — collected, fresh and exportable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" onChange={onUpload} className="hidden" data-testid="evidence-file-input" accept=".pdf,.csv,.txt,.json,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            data-testid="upload-evidence-button"
            className="inline-flex items-center gap-2 rounded-full border border-p-edge/10 bg-p-ink/5 px-4 py-2.5 text-sm font-semibold text-p-mute transition hover:text-p-ink disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload evidence"}
          </button>
          <button
            onClick={downloadAuditPack}
            data-testid="export-audit-pack"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
          style={{ background: "var(--p-grad)" }}
        >
          <Download className="h-4 w-4" />
          Export audit pack
        </button>
        </div>
        {uploadError && <p data-testid="upload-error" className="w-full text-right text-sm text-p-danger">{uploadError}</p>}
      </motion.header>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div data-testid="stat-total" className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-violet"><FileText className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{counts.total}</span><span className="block text-xs text-p-faint">Evidence items</span></span>
        </div>
        <div data-testid="stat-fresh" className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-success"><FolderCheck className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{counts.fresh}</span><span className="block text-xs text-p-faint">Fresh</span></span>
        </div>
        <div data-testid="stat-stale" className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-warning"><FileWarning className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{counts.stale}</span><span className="block text-xs text-p-faint">Stale</span></span>
        </div>
        <div data-testid="stat-requests" className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-info"><Inbox className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{requests.length}</span><span className="block text-xs text-p-faint">Open requests</span></span>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section variants={fadeUp} className="p-panel p-6 lg:col-span-1" data-testid="freshness-panel">
          <h2 className="text-lg font-semibold tracking-tight">Freshness</h2>
          <p className="mt-0.5 text-sm text-p-mute">Share of evidence inside its validity window</p>
          <p className="mt-5 text-4xl font-semibold tracking-tight">{freshPct}%</p>
          <p className="mt-1 text-xs text-p-faint">of {counts.total} items are fresh</p>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-p-ink/10">
            <motion.div className="h-full bg-p-success" initial={{ width: 0 }} animate={{ width: `${freshPct}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
            <motion.div className="h-full bg-p-warning" initial={{ width: 0 }} animate={{ width: `${stalePct}%` }} transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-p-mute">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-p-success" />Fresh · {counts.fresh}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-p-warning" />Stale · {counts.stale}</span>
          </div>

          <h3 className="mt-7 text-sm font-semibold tracking-tight">Auditor requests</h3>
          <ul className="mt-3 space-y-3">
            {requests.map((r) => (
              <li key={r.id} data-testid={`request-${r.id}`} className="rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3">
                <p className="text-sm font-medium leading-snug text-p-ink">{r.label}</p>
                <p className="mt-1 text-xs text-p-faint">{r.requester || "External auditor"} · due {r.due}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-p-ink/10">
                    <div className="h-full rounded-full" style={{ width: `${(r.collected / r.total) * 100}%`, background: "var(--p-grad)" }} />
                  </div>
                  <span className="text-xs font-medium text-p-mute">{r.collected}/{r.total}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={fadeUp} className="lg:col-span-2" data-testid="evidence-library">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-p-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="evidence-search"
                type="search"
                placeholder="Search evidence or control…"
                className="h-10 w-full rounded-full border border-p-edge/10 bg-p-ink/5 pl-10 pr-4 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25"
              />
            </div>
            <button onClick={() => setFreshness("All")} data-testid="filter-freshness-all" className={chipCls(freshness === "All")}>All</button>
            {Object.entries(FRESHNESS_ITEMS).map(([key, f]) => (
              <button key={key} onClick={() => setFreshness(freshness === key ? "All" : key)} data-testid={`filter-freshness-${key}`} className={chipCls(freshness === key)}>
                <span className={`h-1.5 w-1.5 rounded-full ${f.dot}`} />
                {f.label}
              </button>
            ))}
          </div>

          <div className="p-panel overflow-x-auto">
            <div className="grid min-w-[680px] grid-cols-12 items-center gap-3 border-b border-p-edge/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-p-faint">
              <span className="col-span-5">Artefact</span>
              <span className="col-span-2">Control</span>
              <span className="col-span-1">Owner</span>
              <span className="col-span-2">Updated</span>
              <span className="col-span-2">Freshness</span>
            </div>
            <ul className="min-w-[680px] divide-y divide-p-edge/5">
              {filtered.map((e, idx) => {
                const f = FRESHNESS_ITEMS[e.freshness];
                return (
                  <li key={e.fileId || `${e.name}-${idx}`} data-testid={`evidence-row-${e.control}`} className="grid grid-cols-12 items-center gap-3 px-5 py-3.5 transition hover:bg-p-ink/[0.04]">
                    <span className="col-span-5 flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-p-edge/10 bg-p-ink/5 text-p-faint">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          {e.fileId ? (
                            <button onClick={() => downloadEvidence(e.fileId, e.name)} data-testid={`evidence-download-${e.fileId}`} className="truncate text-left text-sm font-medium text-p-ink hover:text-p-violet hover:underline">
                              {e.name}
                            </button>
                          ) : (
                            <span className="block truncate text-sm font-medium text-p-ink">{e.name}</span>
                          )}
                          {e.fileId && <span className="shrink-0 rounded border border-p-aqua/25 bg-p-aqua/10 px-1.5 text-[10px] font-semibold text-p-aqua">Uploaded</span>}
                        </span>
                        <span className="block text-xs text-p-faint">{e.type} · {e.size}</span>
                      </span>
                    </span>
                    <span className="col-span-2">
                      <span className="rounded-md border border-p-violet/25 bg-p-violet/10 px-2 py-0.5 font-mono text-xs font-semibold text-p-violet">{e.control}</span>
                    </span>
                    <span className="col-span-1">
                      <span className="grid h-7 w-7 place-items-center rounded-full border border-p-edge/10 bg-p-violet/10 text-[10px] font-semibold text-p-violet">{e.owner}</span>
                    </span>
                    <span className="col-span-2 text-xs text-p-mute">{e.updated}</span>
                    <span className={`col-span-2 inline-flex items-center gap-1.5 text-xs font-semibold ${f.cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${f.dot}`} />
                      {f.label}
                    </span>
                  </li>
                );
              })}
              {!filtered.length && (
                <li className="p-10 text-center text-sm text-p-mute" data-testid="evidence-empty">No evidence matches these filters.</li>
              )}
            </ul>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
