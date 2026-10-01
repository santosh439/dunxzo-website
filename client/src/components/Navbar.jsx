import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight, Mail } from "lucide-react";
import { Logo } from "./ui.jsx";
import Icon from "./Icon.jsx";
import { NAV, mailto } from "../content/site.js";

function MenuPanel({ item, close }) {
  if (item.variant === "services") {
    return (
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {item.columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-mute">{col.title}</p>
            <div className="grid gap-0.5">
              {col.items.map((l) => (
                <Link key={l.to} to={l.to} onClick={close} className="focus-ring group flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/[0.05]">
                  {l.icon && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-violet-soft transition group-hover:bg-gradient-to-br group-hover:from-violet group-hover:to-aqua group-hover:text-void"><Icon name={l.icon} size={15} /></span>}
                  <span className="text-sm font-medium leading-snug">{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (item.columns) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {item.columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 px-3 text-xs font-semibold text-mute">{col.title}</p>
            <div className="grid gap-1 sm:grid-cols-2">
              {col.items.map((l) => (
                <Link key={l.to} to={l.to} onClick={close} className="focus-ring rounded-xl px-3 py-2.5 transition hover:bg-white/[0.05]">
                  <span className="block text-sm font-semibold">{l.label}</span>
                  <span className="block text-xs text-mute">{l.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`grid gap-1 ${item.grid ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {item.items.map((l) => (
        <Link key={l.to} to={l.to} onClick={close} className="focus-ring group flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.05]">
          {l.icon && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-violet-soft transition group-hover:bg-gradient-to-br group-hover:from-violet group-hover:to-aqua group-hover:text-void"><Icon name={l.icon} size={17} /></span>}
          <span><span className="block text-sm font-semibold">{l.label}</span>{l.desc && <span className="mt-0.5 block text-xs leading-snug text-mute">{l.desc}</span>}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const timer = useRef();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);
  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);

  const enter = (label) => { clearTimeout(timer.current); setOpen(label); };
  const leave = () => { timer.current = setTimeout(() => setOpen(null), 140); };
  const active = NAV.find((n) => n.label === open);

  return (
    <header className="no-print sticky top-0 z-50" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }} onMouseLeave={leave}>
      <div className={`transition-all duration-300 ${scrolled || open || mobile ? "border-b border-edge bg-void/85 backdrop-blur-xl" : "border-b border-transparent"}`}>
        <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[76px]">
          <Link to="/" className="focus-ring shrink-0 rounded-lg" aria-label="DU-NZO home"><Logo /></Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {NAV.map((n) => n.to ? (
              <Link key={n.label} to={n.to} className={`focus-ring rounded-full px-3.5 py-2 text-sm transition hover:text-ink ${pathname.startsWith(n.to) ? "text-ink" : "text-mute"}`} onMouseEnter={() => setOpen(null)}>{n.label}</Link>
            ) : (
              <button key={n.label} onMouseEnter={() => enter(n.label)} onClick={() => setOpen(open === n.label ? null : n.label)} aria-expanded={open === n.label}
                className={`focus-ring flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition hover:text-ink ${open === n.label ? "bg-white/[0.06] text-ink" : "text-mute"}`}>
                {n.label}<ChevronDown size={14} className={`transition ${open === n.label ? "rotate-180" : ""}`} />
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a href={mailto("Talk to a DU-NZO expert")} className="focus-ring rounded-full px-3 py-2 text-sm text-mute hover:text-ink">Talk to an Expert</a>
            <Link to="/launchpad" className="btn-glow !min-h-[42px] !px-5 text-sm">Get Your Roadmap</Link>
          </div>

          <button className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl lg:hidden" onClick={() => setMobile((v) => !v)} aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile}>
            {mobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {active && (
            <motion.div key={active.label} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
              className="hidden border-t border-edge lg:block" onMouseEnter={() => enter(active.label)}>
              <div className="container-x grid gap-8 py-7 xl:grid-cols-12">
                <div className="xl:col-span-9"><MenuPanel item={active} close={() => setOpen(null)} /></div>
                <div className="glass hidden rounded-2xl p-5 xl:col-span-3 xl:block">
                  <p className="text-sm font-semibold">Not sure where to start?</p>
                  <p className="mt-2 text-sm text-mute">Get your DU-NZO Compliance Roadmap in about three minutes.</p>
                  <Link to="/launchpad" onClick={() => setOpen(null)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Open the Launchpad<ArrowRight size={15} /></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-edge bg-void lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            <div className="container-x flex flex-col py-4">
              {NAV.map((n) => n.to ? (
                <Link key={n.label} to={n.to} className="border-b border-edge py-4 text-lg font-medium">{n.label}</Link>
              ) : (
                <div key={n.label} className="border-b border-edge">
                  <button onClick={() => setMobileSection(mobileSection === n.label ? null : n.label)} aria-expanded={mobileSection === n.label} className="flex w-full items-center justify-between py-4 text-lg font-medium">
                    {n.label}<ChevronDown size={18} className={`transition ${mobileSection === n.label ? "rotate-180" : ""}`} />
                  </button>
                  {mobileSection === n.label && (
                    <div className="grid gap-1 pb-4">
                      {n.columns
                        ? n.columns.map((c) => (
                            <div key={c.title}>
                              <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-mute/70">{c.title}</p>
                              {c.items.map((l) => <Link key={l.to} to={l.to} className="block rounded-lg px-3 py-2.5 text-mute hover:bg-white/5 hover:text-ink">{l.label}</Link>)}
                            </div>
                          ))
                        : n.items.map((l) => <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2.5 text-mute hover:bg-white/5 hover:text-ink">{l.label}</Link>)}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/launchpad" className="btn-glow mt-6">Get Your Compliance Roadmap</Link>
              <a href={mailto("Talk to a DU-NZO expert")} className="btn-ghost mt-3"><Mail size={17} />Talk to an Expert</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
