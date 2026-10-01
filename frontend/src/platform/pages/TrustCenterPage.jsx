import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, Eye, Inbox, Lock, Globe, Check, X } from "lucide-react";
import { TRUST, TRUST_CERTS, TRUST_DOCS, TRUST_REQUESTS, CERT_BADGE } from "../data/assurance.js";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function TrustCenterPage() {
  const [requests, setRequests] = useState(TRUST_REQUESTS);

  useEffect(() => {
    document.title = "Trust Center · DU-NZO Platform";
  }, []);

  const decide = (id, status) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <motion.div data-testid="platform-page-trust-center" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="space-y-6">
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Trust Center</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">Your public trust portal — certifications, documents and inbound access requests.</p>
        </div>
        <a href={`https://${TRUST.url}`} target="_blank" rel="noreferrer" data-testid="trust-view-public" className="inline-flex items-center gap-2 rounded-full border border-p-edge/10 bg-p-ink/5 px-5 py-2.5 text-sm font-semibold text-p-mute transition hover:text-p-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua">
          <ExternalLink className="h-4 w-4" />{TRUST.url}
        </a>
      </motion.header>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div data-testid="trust-stat-status" className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-success"><BadgeCheck className="h-5 w-5" /></span>
          <span><span className="block text-sm font-semibold tracking-tight">Published</span><span className="block text-xs text-p-faint">Portal status</span></span>
        </div>
        <div className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-violet"><Eye className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{TRUST.views.toLocaleString()}</span><span className="block text-xs text-p-faint">Views (30d)</span></span>
        </div>
        <div className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-info"><Inbox className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{pending}</span><span className="block text-xs text-p-faint">Pending requests</span></span>
        </div>
        <div className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-aqua"><BadgeCheck className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{TRUST_CERTS.filter((c) => c.state === "certified").length}</span><span className="block text-xs text-p-faint">Active certifications</span></span>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.section variants={fadeUp} className="p-panel p-6" data-testid="trust-certs">
          <h2 className="text-lg font-semibold tracking-tight">Certifications</h2>
          <ul className="mt-4 space-y-2">
            {TRUST_CERTS.map((c) => {
              const b = CERT_BADGE[c.state];
              return (
                <li key={c.name} className="flex items-center gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3.5">
                  <BadgeCheck className={`h-5 w-5 shrink-0 ${c.state === "certified" ? "text-p-success" : "text-p-info"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-p-ink">{c.name}</p>
                    <p className="text-xs text-p-faint">{c.detail}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${b.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />{b.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <h3 className="mt-6 text-sm font-semibold tracking-tight">Documents</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {TRUST_DOCS.map((d) => (
              <li key={d.name} className="flex items-center gap-2.5 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] px-3 py-2.5">
                {d.icon === "lock" ? <Lock className="h-4 w-4 shrink-0 text-p-warning" /> : <Globe className="h-4 w-4 shrink-0 text-p-success" />}
                <div className="min-w-0">
                  <p className="truncate text-sm text-p-ink/90">{d.name}</p>
                  <p className="text-[11px] text-p-faint">{d.access}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={fadeUp} className="p-panel p-6" data-testid="trust-requests">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Access requests</h2>
            <span className="p-chip">{pending} pending</span>
          </div>
          <ul className="mt-4 space-y-2">
            {requests.map((r) => (
              <li key={r.id} data-testid={`trust-request-${r.id}`} className="rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-p-ink">{r.company}</p>
                  <span className="text-xs text-p-faint">{r.when}</span>
                </div>
                <p className="mt-0.5 text-xs text-p-mute">Requesting: {r.doc}</p>
                <div className="mt-3 flex items-center gap-2">
                  {r.status === "pending" ? (
                    <>
                      <button onClick={() => decide(r.id, "approved")} data-testid={`trust-approve-${r.id}`} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white transition active:scale-[0.98]" style={{ background: "var(--p-grad)" }}>
                        <Check className="h-3.5 w-3.5" />Approve
                      </button>
                      <button onClick={() => decide(r.id, "denied")} data-testid={`trust-deny-${r.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-p-edge/10 bg-p-ink/5 px-3.5 py-1.5 text-xs font-semibold text-p-mute transition hover:text-p-ink">
                        <X className="h-3.5 w-3.5" />Deny
                      </button>
                    </>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${r.status === "approved" ? "border-p-success/25 bg-p-success/10 text-p-success" : "border-p-danger/25 bg-p-danger/10 text-p-danger"}`}>
                      {r.status === "approved" ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}{r.status}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </motion.div>
  );
}
