import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { TYPES, mailto } from "../content/site.js";

export function Mark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="dnz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B7ADFF" /><stop offset=".55" stopColor="#8B7CFF" /><stop offset="1" stopColor="#3EE0CF" /></linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#dnz)" />
      <path d="M13 11h7.5a9 9 0 0 1 0 18H13z" fill="none" stroke="#05060D" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="m17.5 20 2.6 2.6 5-5.2" fill="none" stroke="#05060D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Mark />
      <span className="text-[19px] font-bold tracking-[-0.04em] text-ink">DU<span className="text-aqua">-</span>NZO</span>
    </span>
  );
}

export function Reveal({ children, delay = 0, y = 24, className = "" }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

export function Spotlight({ as: Tag = "div", className = "", children, ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return <Tag onMouseMove={onMove} className={`spotlight ${className}`} {...rest}>{children}</Tag>;
}

export function Aurora({ className = "" }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet/30 blur-[120px] animate-drift" />
      <div className="absolute -right-32 top-20 h-[460px] w-[460px] rounded-full bg-aqua/20 blur-[120px] animate-drift [animation-delay:-6s]" />
      <div className="absolute left-1/3 top-[55%] h-[380px] w-[380px] rounded-full bg-violet-deep/25 blur-[120px] animate-drift [animation-delay:-12s]" />
      <div className="grid-bg absolute inset-0" />
    </div>
  );
}

export function SectionHead({ kicker, title, body, center = false, as: H = "h2" }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {kicker && <Reveal><span className="kicker">{kicker}</span></Reveal>}
      <Reveal delay={0.05}><H className="h-section mt-5">{title}</H></Reveal>
      {body && <Reveal delay={0.1}><p className={`mt-5 max-w-2xl text-lg leading-relaxed text-mute ${center ? "mx-auto" : ""}`}>{body}</p></Reveal>}
    </div>
  );
}

export function PageHero({ kicker, title, body, children, crumbs }) {
  return (
    <section className="noise relative overflow-hidden border-b border-edge">
      <Aurora className="opacity-80" />
      <div className="container-x relative pb-16 pt-12 md:pb-24 md:pt-20">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-mute">
            {crumbs.map(([label, to], i) => (
              <span key={label} className="flex items-center gap-2">{i > 0 && <span className="text-white/20">/</span>}{to ? <Link to={to} className="hover:text-ink">{label}</Link> : <span className="text-ink/80">{label}</span>}</span>
            ))}
          </nav>
        )}
        {kicker && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kicker">{kicker}</motion.span>}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="h-display mt-5 max-w-5xl text-[clamp(2.6rem,6.5vw,5.5rem)]">{title}</motion.h1>
        {body && <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-6 max-w-2xl text-lg leading-relaxed text-mute md:text-xl">{body}</motion.p>}
        {children && <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }} className="mt-9">{children}</motion.div>}
      </div>
    </section>
  );
}

export function TypeBadge({ type, className = "" }) {
  const t = TYPES[type];
  if (!t) return null;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${t.bg} ${t.color} ${className}`}><span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />{t.short}</span>;
}

export function CtaBand({ title = "Get your DU-NZO Compliance Roadmap", body = "Answer 13 questions and receive a personalised roadmap with frameworks, priority gaps, evidence and phases.", primary = { label: "Get Your Compliance Roadmap", to: "/launchpad" } }) {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-deep via-violet to-aqua p-8 text-void md:p-14">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold tracking-[-0.045em] md:text-6xl" style={{ lineHeight: 1.02 }}>{title}</h2>
            <p className="mt-5 text-lg text-void/80">{body}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link to={primary.to} className="btn bg-void text-ink hover:bg-night">{primary.label}<ArrowRight size={17} /></Link>
            <a href={mailto("Talk to a DU-NZO expert")} className="btn border border-void/25 text-void hover:bg-void/10"><Mail size={17} />Talk to an Expert</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pill({ children, className = "" }) {
  return <span className={`inline-flex items-center rounded-full border border-edge bg-white/[0.04] px-3 py-1 text-xs text-mute ${className}`}>{children}</span>;
}
