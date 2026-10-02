import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Check, Loader2, ArrowRight } from "lucide-react";
import { apiFetch, getToken } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function JoinPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => { document.title = "Join workspace · DU-NZO"; }, []);

  useEffect(() => {
    apiFetch(`/invites/${token}`).then(setInvite).catch((e) => setError(e.message));
  }, [token]);

  const join = async () => {
    if (!getToken()) {
      try { localStorage.setItem("dunzo.pendingInvite", token); } catch { /* ignore */ }
      navigate("/app");
      return;
    }
    setJoining(true); setError("");
    try {
      await apiFetch(`/invites/${token}/accept`, { method: "POST" });
      try { localStorage.removeItem("dunzo.pendingInvite"); } catch { /* ignore */ }
      window.location.href = "/app";
    } catch (e) {
      setError(e.message);
      setJoining(false);
    }
  };

  return (
    <div className="dz-app grid min-h-screen place-items-center bg-p-bg p-6 font-sans text-p-ink antialiased" data-theme="dark" data-testid="join-page">
      <div className="pointer-events-none fixed -left-32 top-10 h-96 w-96 rounded-full bg-p-violet/10 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="p-panel p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: "var(--p-grad)" }}><ShieldCheck className="h-6 w-6" /></span>
          {error ? (
            <>
              <h1 className="mt-5 text-xl font-semibold tracking-tight">Invite unavailable</h1>
              <p data-testid="join-error" className="mt-2 text-sm text-p-mute">{error}</p>
              <button onClick={() => navigate("/app")} className="mt-6 rounded-full border border-p-edge/10 bg-p-ink/5 px-5 py-2.5 text-sm font-semibold text-p-mute hover:text-p-ink">Go to DU-NZO</button>
            </>
          ) : !invite ? (
            <Loader2 className="mx-auto mt-6 h-6 w-6 animate-spin text-p-violet" />
          ) : (
            <>
              <h1 className="mt-5 text-xl font-semibold tracking-tight">You're invited to <span className="p-text-gradient">{invite.company}</span></h1>
              <p className="mt-2 text-sm text-p-mute">Join as a <span className="font-semibold capitalize text-p-ink">{invite.role}</span> on the DU-NZO compliance workspace.</p>
              {ready && !user && <p className="mt-3 rounded-xl border border-p-info/20 bg-p-info/5 px-3 py-2 text-xs text-p-info">You'll sign in or create an account first, then land back here.</p>}
              <button onClick={join} disabled={joining} data-testid="join-accept" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60" style={{ background: "var(--p-grad)" }}>
                {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{user ? "Accept & join" : "Continue"}<ArrowRight className="h-4 w-4" /></>}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
