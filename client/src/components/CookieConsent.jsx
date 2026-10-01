import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X, Check } from "lucide-react";

/* Cookie consent manager.
 * - Shows a banner on first visit with three equal-prominence actions.
 * - Preferences panel with per-category toggles; strictly necessary is locked on.
 * - Choice + date are stored; consent is re-asked after 12 months or when the
 *   category version changes (bump CONSENT_VERSION).
 * - Accessible: dialog semantics, labelled toggles, Escape to close, mobile friendly,
 *   and the bottom banner does not block page content.
 * Reopen the panel from anywhere with:
 *   window.dispatchEvent(new CustomEvent("dunzo:open-cookie-settings"))
 */

const KEY = "dunzo.consent";
export const CONSENT_VERSION = 1;
const TWELVE_MONTHS = 365 * 24 * 60 * 60 * 1000;

const CATEGORIES = [
  { id: "necessary", name: "Strictly necessary", desc: "Required for the site and for remembering your consent choices.", locked: true },
  { id: "preferences", name: "Preferences", desc: "Remember choices such as your planner and assessment progress." },
  { id: "analytics", name: "Analytics", desc: "Help us understand how the site is used. Loads only with your consent." },
  { id: "marketing", name: "Marketing", desc: "Used to measure or deliver marketing. Loads only with your consent." },
];

function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
function needsConsent() {
  const c = read();
  if (!c || c.v !== CONSENT_VERSION) return true;
  if (!c.at || Date.now() - new Date(c.at).getTime() > TWELVE_MONTHS) return true;
  return false;
}

/* Gate optional third-party scripts by category. No analytics or marketing scripts
 * are currently installed, so nothing loads until a visitor consents. Add future
 * scripts here so they only ever load after consent to that category. */
function applyConsent(consent) {
  if (consent.analytics) { /* load analytics script here */ }
  if (consent.marketing) { /* load marketing script here */ }
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [panel, setPanel] = useState(false);
  const [sel, setSel] = useState({ preferences: false, analytics: false, marketing: false });

  useEffect(() => { setShow(needsConsent()); const c = read(); if (c) applyConsent(c); }, []);
  useEffect(() => {
    const open = () => { const c = read(); if (c) setSel({ preferences: !!c.preferences, analytics: !!c.analytics, marketing: !!c.marketing }); setPanel(true); };
    window.addEventListener("dunzo:open-cookie-settings", open);
    return () => window.removeEventListener("dunzo:open-cookie-settings", open);
  }, []);
  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") setPanel(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const save = (val) => {
    const consent = { v: CONSENT_VERSION, at: new Date().toISOString(), necessary: true, ...val };
    try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch { /* storage unavailable */ }
    applyConsent(consent);
    setShow(false);
    setPanel(false);
  };
  const acceptAll = () => save({ preferences: true, analytics: true, marketing: true });
  const rejectAll = () => save({ preferences: false, analytics: false, marketing: false });

  return (
    <>
      <AnimatePresence>
        {show && !panel && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="no-print fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-6" role="region" aria-label="Cookie consent">
            <div className="glass mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl p-5 shadow-2xl md:flex-row md:items-center">
              <div className="flex items-start gap-3">
                <Cookie className="mt-0.5 shrink-0 text-aqua" size={22} />
                <p className="text-sm leading-relaxed text-ink/85">We use cookies and browser storage to run the site and remember your choices. Analytics and marketing load only if you allow them. Read our <Link to="/legal/cookies" className="font-medium text-aqua underline">Cookie Policy</Link>.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:shrink-0">
                <button onClick={acceptAll} className="btn-ghost !min-h-[44px] !px-5 text-sm">Accept all</button>
                <button onClick={rejectAll} className="btn-ghost !min-h-[44px] !px-5 text-sm">Reject all</button>
                <button onClick={() => setPanel(true)} className="btn-ghost !min-h-[44px] !px-5 text-sm">Manage preferences</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-[80] flex items-end justify-center bg-void/70 p-4 backdrop-blur-sm sm:items-center"
            role="dialog" aria-modal="true" aria-labelledby="cookie-pref-title"
            onClick={(e) => { if (e.target === e.currentTarget) setPanel(false); }}>
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.25 }}
              className="glass max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 id="cookie-pref-title" className="text-xl font-semibold">Cookie preferences</h2>
                <button onClick={() => setPanel(false)} aria-label="Close cookie preferences" className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/5"><X size={18} /></button>
              </div>
              <div className="mt-5 space-y-3">
                {CATEGORIES.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-4 rounded-2xl border border-edge bg-white/[0.02] p-4">
                    <div><p className="font-medium">{c.name}</p><p className="mt-0.5 text-sm text-mute">{c.desc}</p></div>
                    {c.locked ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-mute"><Check size={13} />Always on</span>
                    ) : (
                      <button type="button" role="switch" aria-checked={!!sel[c.id]} aria-label={`${c.name} cookies`} onClick={() => setSel({ ...sel, [c.id]: !sel[c.id] })}
                        className={`focus-ring relative h-7 w-12 shrink-0 rounded-full transition ${sel[c.id] ? "bg-gradient-to-r from-violet to-aqua" : "bg-white/[0.12]"}`}>
                        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-ink transition-all ${sel[c.id] ? "left-[22px]" : "left-0.5"}`} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button onClick={() => save(sel)} className="btn-glow !min-h-[44px] text-sm">Save preferences</button>
                <button onClick={acceptAll} className="btn-ghost !min-h-[44px] text-sm">Accept all</button>
                <button onClick={rejectAll} className="btn-ghost !min-h-[44px] text-sm">Reject all</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
