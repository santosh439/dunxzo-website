import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Copy, Check, Mail, Users, Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const ROLE_CLS = {
  member: "border-p-edge/15 bg-p-ink/5 text-p-mute",
  admin: "border-p-violet/25 bg-p-violet/10 text-p-violet",
};

export default function SettingsPage() {
  const { data } = useWorkspace();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [invites, setInvites] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => { document.title = "Settings · DU-NZO Platform"; }, []);

  const loadInvites = () => apiFetch("/workspace/invites").then(setInvites).catch(() => {});
  useEffect(() => { loadInvites(); }, []);

  const members = data?.members ?? [];

  const invite = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await apiFetch("/workspace/invites", { method: "POST", body: { email: email.trim(), role } });
      setEmail("");
      await loadInvites();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const linkFor = (token) => `${window.location.origin}/app/join/${token}`;
  const copy = async (token) => {
    try {
      await navigator.clipboard.writeText(linkFor(token));
      setCopied(token);
      setTimeout(() => setCopied(""), 1800);
    } catch { /* clipboard blocked */ }
  };

  return (
    <motion.div data-testid="platform-page-settings" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="space-y-6">
      <motion.header variants={fadeUp}>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-p-mute">Manage your workspace{data?.profile?.company ? ` — ${data.profile.company}` : ""} and invite your team.</p>
      </motion.header>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.section variants={fadeUp} className="p-panel p-6" data-testid="invite-section">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight"><UserPlus className="h-5 w-5 text-p-violet" />Invite a teammate</h2>
          <p className="mt-0.5 text-sm text-p-mute">Generate a shareable invite link — no email required.</p>
          <form onSubmit={invite} className="mt-5 space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-p-faint" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required data-testid="invite-email" placeholder="teammate@company.com" className="h-11 w-full rounded-xl border border-p-edge/10 bg-p-ink/5 pl-9 pr-3 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25" />
              </div>
              <select value={role} onChange={(e) => setRole(e.target.value)} data-testid="invite-role" className="h-11 rounded-xl border border-p-edge/10 bg-p-ink/5 px-3 text-sm text-p-ink focus:border-p-violet/50 focus:outline-none">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && <p data-testid="invite-error" className="text-sm text-p-danger">{error}</p>}
            <button type="submit" disabled={busy} data-testid="invite-submit" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60" style={{ background: "var(--p-grad)" }}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}Create invite link
            </button>
          </form>

          {invites.length > 0 && (
            <ul className="mt-5 space-y-2" data-testid="invite-list">
              {invites.map((inv) => (
                <li key={inv.id} data-testid={`invite-${inv.id}`} className="flex items-center gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-p-ink">{inv.email}</p>
                    <p className="text-xs text-p-faint capitalize">{inv.role} · {inv.status}</p>
                  </div>
                  {inv.status === "pending" && inv.token && (
                    <button onClick={() => copy(inv.token)} data-testid={`invite-copy-${inv.id}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-p-edge/10 bg-p-ink/5 px-3 py-1.5 text-xs font-semibold text-p-mute transition hover:text-p-ink">
                      {copied === inv.token ? <><Check className="h-3.5 w-3.5 text-p-success" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy link</>}
                    </button>
                  )}
                  {inv.status === "accepted" && <span className="shrink-0 rounded-full border border-p-success/25 bg-p-success/10 px-2.5 py-1 text-xs font-semibold text-p-success">Joined</span>}
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        <motion.section variants={fadeUp} className="p-panel p-6" data-testid="members-section">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight"><Users className="h-5 w-5 text-p-aqua" />Members</h2>
          <p className="mt-0.5 text-sm text-p-mute">{members.length + 1} {members.length === 0 ? "person" : "people"} in this workspace.</p>
          <ul className="mt-5 space-y-2">
            <li className="flex items-center gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: "var(--p-grad)" }}>YOU</span>
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-p-ink">You</p><p className="text-xs text-p-faint">Owner</p></div>
            </li>
            {members.map((m) => (
              <li key={m.userId} data-testid={`member-${m.userId}`} className="flex items-center gap-3 rounded-xl border border-p-edge/10 bg-p-ink/[0.03] p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-p-edge/10 bg-p-violet/10 text-xs font-semibold text-p-violet">{m.initials}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-p-ink">{m.name}</p><p className="truncate text-xs text-p-faint">{m.email}</p></div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${ROLE_CLS[m.role] || ROLE_CLS.member}`}>{m.role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-p-faint">Tip: assign any member as a control owner from the Controls detail drawer.</p>
        </motion.section>
      </div>
    </motion.div>
  );
}
