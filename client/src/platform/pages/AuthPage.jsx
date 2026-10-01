import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Sign in · DU-NZO Platform"; }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dz-app grid min-h-screen bg-p-bg font-sans text-p-ink antialiased lg:grid-cols-2" data-theme="dark" data-testid="auth-page">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0" style={{ background: "var(--p-grad)", opacity: 0.12 }} />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-p-violet/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-p-aqua/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: "var(--p-grad)" }}>
              <ShieldCheck className="h-6 w-6" />
            </span>
            <span className="text-lg font-semibold tracking-tight">DU-NZO Platform</span>
          </div>
          <div>
            <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
              Compliance, <span className="p-text-gradient">on autopilot</span>.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-p-mute">
              Track controls across ISO 27001, SOC 2, DPDPA and ISO 42001. Continuous monitoring, an AI Copilot, and an audit-ready trust center — in one workspace.
            </p>
          </div>
          <p className="text-xs text-p-faint">Preview workspace · sample data</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: "var(--p-grad)" }}>
              <ShieldCheck className="h-6 w-6" />
            </span>
            <span className="text-lg font-semibold tracking-tight">DU-NZO Platform</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">{mode === "login" ? "Welcome back" : "Create your workspace"}</h2>
          <p className="mt-1 text-sm text-p-mute">{mode === "login" ? "Sign in to your compliance workspace." : "Start your compliance program in minutes."}</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-p-ink/90">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required data-testid="auth-name" className="h-11 w-full rounded-xl border border-p-edge/10 bg-p-ink/5 px-3.5 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25" placeholder="Jordan Lee" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-p-ink/90">Work email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required data-testid="auth-email" className="h-11 w-full rounded-xl border border-p-edge/10 bg-p-ink/5 px-3.5 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25" placeholder="you@company.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-p-ink/90">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} data-testid="auth-password" className="h-11 w-full rounded-xl border border-p-edge/10 bg-p-ink/5 px-3.5 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25" placeholder="At least 6 characters" />
            </div>

            {error && <p data-testid="auth-error" className="rounded-xl border border-p-danger/25 bg-p-danger/10 px-3.5 py-2.5 text-sm text-p-danger">{error}</p>}

            <button type="submit" disabled={busy} data-testid="auth-submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua" style={{ background: "var(--p-grad)" }}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === "login" ? "Sign in" : "Create workspace"}<ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-p-mute">
            {mode === "login" ? "New to DU-NZO?" : "Already have a workspace?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} data-testid="auth-toggle" className="font-semibold text-p-violet hover:underline">
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
