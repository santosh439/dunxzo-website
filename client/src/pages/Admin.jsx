import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Loader2, RefreshCw, Inbox, Map } from "lucide-react";
import { useSeo } from "../lib/seo.js";
import { api, fmtDate } from "../lib/api.js";

export default function Admin() {
  useSeo("Admin");
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem("dunzo.admin") || ""; } catch { return ""; } });
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("leads");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("server");

  const load = async (t = token) => {
    setLoading(true); setError("");
    try {
      const [leads, plans] = await Promise.all([api.admin("leads", t), api.admin("plans", t)]);
      setData({ leads, plans });
      try { sessionStorage.setItem("dunzo.admin", t); } catch { /* ignore */ }
    } catch (e) { setError(e.message); setData(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { api.mode().then((m) => { setMode(m); if (m === "browser" || token) load(); }); }, []); // eslint-disable-line

  if (!data) return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="glass w-full max-w-md rounded-3xl p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]"><KeyRound className="text-violet-soft" /></span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Admin</h1>
        <p className="mt-2 text-mute">Enter the ADMIN_TOKEN configured on the server to view leads and plans.</p>
        <label htmlFor="tok" className="label mt-6">Admin token</label>
        <input id="tok" type="password" className="field" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="current-password" />
        {error && <p role="alert" className="mt-4 text-sm text-rose">{error}</p>}
        <button className="btn-glow mt-6 w-full" disabled={loading || !token}>{loading ? <Loader2 size={17} className="animate-spin" /> : "Sign in"}</button>
      </form>
    </div>
  );

  const rows = data[tab];
  return (
    <div className="container-x py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="h-display text-4xl md:text-5xl">Dashboard</h1><p className="mt-2 text-mute">{mode === "browser" ? "Showing data saved in this browser." : "Live data from the API server."}</p></div>
        <button className="btn-ghost" onClick={() => load()}><RefreshCw size={16} className={loading ? "animate-spin" : ""} />Refresh</button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button onClick={() => setTab("leads")} className={`glass focus-ring rounded-3xl p-6 text-left ${tab === "leads" ? "border-violet/60" : ""}`}><Inbox className="text-violet-soft" /><p className="mt-4 text-4xl font-semibold">{data.leads.length}</p><p className="text-mute">Leads</p></button>
        <button onClick={() => setTab("plans")} className={`glass focus-ring rounded-3xl p-6 text-left ${tab === "plans" ? "border-violet/60" : ""}`}><Map className="text-aqua" /><p className="mt-4 text-4xl font-semibold">{data.plans.length}</p><p className="text-mute">Plans created</p></button>
      </div>
      <div className="glass mt-6 overflow-x-auto rounded-3xl">
        {rows.length === 0 ? <p className="p-10 text-center text-mute">No {tab} yet. They appear here as visitors use the site.</p> : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-edge text-mute">
              {tab === "leads"
                ? <tr><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Frameworks</th><th className="p-4 font-medium">Message</th></tr>
                : <tr><th className="p-4 font-medium">Created</th><th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Standards</th><th className="p-4 font-medium">Certificate</th><th className="p-4 font-medium">Progress</th><th className="p-4" /></tr>}
            </thead>
            <tbody>
              {rows.map((r) => tab === "leads" ? (
                <tr key={r.id} className="border-b border-white/[0.04] align-top last:border-0">
                  <td className="p-4 text-mute">{fmtDate(r.createdAt.slice(0, 10))}</td><td className="p-4">{r.name}</td>
                  <td className="p-4"><a className="text-aqua hover:underline" href={`mailto:${r.email}`}>{r.email}</a></td><td className="p-4">{r.company}</td>
                  <td className="p-4">{(r.frameworks || []).join(", ")}</td><td className="max-w-xs p-4 text-mute">{r.message}</td>
                </tr>
              ) : (
                <tr key={r.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="p-4 text-mute">{fmtDate(r.createdAt.slice(0, 10))}</td><td className="p-4">{r.company}</td>
                  <td className="p-4">{r.frameworks.map((f) => f.replace("iso", "ISO ")).join(", ")}</td><td className="p-4">{fmtDate(r.certificationDate)}</td>
                  <td className="p-4 tabular-nums">{r.done}/{r.total}</td><td className="p-4"><Link to={`/plan/${r.id}`} className="text-aqua hover:underline">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
