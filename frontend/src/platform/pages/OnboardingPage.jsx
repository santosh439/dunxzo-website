import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { apiFetch } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const FRAMEWORKS = [
  { id: "ISO/IEC 27001", desc: "Information security management" },
  { id: "SOC 2", desc: "Trust services criteria for SaaS" },
  { id: "DPDPA", desc: "India's Data Protection Act 2023" },
  { id: "ISO/IEC 42001", desc: "AI management system" },
];
const SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

export default function OnboardingPage() {
  const { user, markOnboarded } = useAuth();
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState("");
  const [frameworks, setFrameworks] = useState(["ISO/IEC 27001", "SOC 2"]);
  const [size, setSize] = useState("11-50");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { document.title = "Set up your workspace · DU-NZO"; }, []);

  const toggleFw = (id) => setFrameworks((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const finish = async () => {
    setBusy(true); setError("");
    try {
      await apiFetch("/onboarding", { method: "POST", body: { company: company.trim(), frameworks, size } });
      markOnboarded();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const canNext = step === 0 ? company.trim().length > 0 : step === 1 ? frameworks.length > 0 : true;
  const steps = ["Company", "Frameworks", "Team size"];

  return (
    <div className="dz-app grid min-h-screen place-items-center bg-p-bg font-sans text-p-ink antialiased p-6" data-theme="dark" data-testid="onboarding-page">
      <div className="pointer-events-none fixed -left-32 top-10 h-96 w-96 rounded-full bg-p-violet/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 bottom-0 h-96 w-96 rounded-full bg-p-aqua/10 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: "var(--p-grad)" }}><ShieldCheck className="h-5 w-5" /></span>
          <span className="text-[15px] font-semibold tracking-tight">Welcome, {user?.name?.split(" ")[0] || "there"}</span>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition ${i < step ? "bg-p-success text-white" : i === step ? "text-white" : "border border-p-edge/15 text-p-faint"}`} style={i === step ? { background: "var(--p-grad)" } : {}}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {i < steps.length - 1 && <span className={`h-px flex-1 ${i < step ? "bg-p-success" : "bg-p-edge/15"}`} />}
            </div>
          ))}
        </div>

        <div className="p-panel p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div data-testid="onboarding-step-company">
                  <h2 className="text-xl font-semibold tracking-tight">What's your company called?</h2>
                  <p className="mt-1 text-sm text-p-mute">This labels your workspace and trust center.</p>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} autoFocus data-testid="onboarding-company" placeholder="Zephyr Labs" className="mt-5 h-12 w-full rounded-xl border border-p-edge/10 bg-p-ink/5 px-4 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25" />
                </div>
              )}
              {step === 1 && (
                <div data-testid="onboarding-step-frameworks">
                  <h2 className="text-xl font-semibold tracking-tight">Which frameworks are you pursuing?</h2>
                  <p className="mt-1 text-sm text-p-mute">We'll seed the right controls for each. Pick at least one.</p>
                  <div className="mt-5 space-y-2">
                    {FRAMEWORKS.map((f) => {
                      const on = frameworks.includes(f.id);
                      return (
                        <button key={f.id} onClick={() => toggleFw(f.id)} data-testid={`onboarding-fw-${f.id.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${on ? "border-p-violet/40 bg-p-violet/15" : "border-p-edge/10 bg-p-ink/[0.03] hover:border-p-edge/25"}`}>
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${on ? "border-transparent text-white" : "border-p-edge/25"}`} style={on ? { background: "var(--p-grad)" } : {}}>
                            {on && <Check className="h-3.5 w-3.5" />}
                          </span>
                          <span><span className="block text-sm font-medium text-p-ink">{f.id}</span><span className="block text-xs text-p-faint">{f.desc}</span></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div data-testid="onboarding-step-size">
                  <h2 className="text-xl font-semibold tracking-tight">How big is your team?</h2>
                  <p className="mt-1 text-sm text-p-mute">Helps us tailor recommendations.</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button key={s} onClick={() => setSize(s)} data-testid={`onboarding-size-${s}`} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${size === s ? "border-p-violet/40 bg-p-violet/15 text-p-ink" : "border-p-edge/10 bg-p-ink/5 text-p-mute hover:text-p-ink"}`}>
                        {s} people
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p data-testid="onboarding-error" className="mt-4 rounded-xl border border-p-danger/25 bg-p-danger/10 px-3.5 py-2.5 text-sm text-p-danger">{error}</p>}

          <div className="mt-7 flex items-center justify-between">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} data-testid="onboarding-back" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-p-mute transition hover:text-p-ink disabled:opacity-0">
              <ArrowLeft className="h-4 w-4" />Back
            </button>
            {step < 2 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canNext} data-testid="onboarding-next" className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50" style={{ background: "var(--p-grad)" }}>
                Continue<ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={finish} disabled={busy} data-testid="onboarding-finish" className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60" style={{ background: "var(--p-grad)" }}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Launch workspace<ArrowRight className="h-4 w-4" /></>}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
