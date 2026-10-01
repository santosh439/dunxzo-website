import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, ShieldCheck, Check, Globe2, Lock, FileText, BookOpen } from "lucide-react";
import { Aurora, Reveal, Spotlight, SectionHead, TypeBadge, CtaBand } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import DashboardMock from "../components/DashboardMock.jsx";
import { BRAND, FRAMEWORKS, TYPES, PLATFORM_MODULES, GCC_DOMAINS, MATURITY_LEVELS, REGIONS, TOOLS, GUIDES, SOLUTIONS, SERVICE_CATEGORIES, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

/* ---------------- Hero ---------------- */
const STARTUP_STEPS = ["Launch", "Secure", "Comply", "Certify", "Build trust", "Scale"];
const heroGcc = [3, 4, 2, 3, 4, 3, 4, 2, 3, 3, 2, 3, 2, 1, 3];

function HeroPreview({ mode }) {
  return (
    <div className="glass relative rounded-[28px] p-4 shadow-[0_50px_120px_-30px_rgba(91,75,224,0.55)] md:p-6">
      <div className="flex items-center justify-between border-b border-edge pb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5"><span className="h-3 w-3 rounded-full bg-white/15" /><span className="h-3 w-3 rounded-full bg-white/15" /><span className="h-3 w-3 rounded-full bg-white/15" /></div>
          <span className="text-sm text-mute">{mode === "startup" ? "Your DU-NZO Compliance Roadmap" : "DU-NZO GCC Compliance Command Center"}</span>
        </div>
        <span className="hidden items-center gap-2 rounded-full bg-aqua/10 px-3 py-1 text-xs font-medium text-aqua sm:flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqua" />Sample</span>
      </div>
      <AnimatePresence mode="wait">
        {mode === "startup" ? (
          <motion.div key="s" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid gap-4 pt-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="grid grid-cols-6 gap-1.5">
                {STARTUP_STEPS.map((s, i) => (
                  <div key={s} className="flex flex-col gap-2">
                    <motion.div className={`h-2 rounded-full ${i < 2 ? "bg-gradient-to-r from-violet to-aqua" : i === 2 ? "bg-violet/60" : "bg-white/[0.08]"}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} />
                    <span className={`text-[11px] sm:text-xs ${i <= 2 ? "text-ink" : "text-mute"}`}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {[["ISO/IEC 27001", "Primary", "certification"], ["SOC 2", "Next", "attestation"], ["DPDPA", "Applies", "regulation"], ["ISO/IEC 42001", "Consider", "certification"]].map(([n, p, t]) => (
                  <div key={n} className="flex items-center justify-between rounded-xl border border-edge bg-white/[0.02] px-3 py-2.5"><span className="text-sm font-medium">{n}</span><span className="flex items-center gap-2"><TypeBadge type={t} /><span className="text-xs text-mute">{p}</span></span></div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-edge bg-white/[0.03] p-4">
              <p className="text-xs text-mute">Current maturity</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">Level 2</p>
              <p className="text-sm text-violet-soft">Defined</p>
              <p className="mt-4 text-xs text-mute">Priority gaps</p>
              <ul className="mt-2 space-y-1.5 text-sm">{["Centralised logging", "Tested backups", "Incident response plan"].map((g) => <li key={g} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber" />{g}</li>)}</ul>
            </div>
          </motion.div>
        ) : (
          <motion.div key="g" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid gap-4 pt-5 md:grid-cols-3">
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 md:col-span-2">
              {GCC_DOMAINS.map(([d], i) => {
                const l = heroGcc[i];
                const bg = ["", "bg-rose/25 border-rose/30", "bg-amber/20 border-amber/30", "bg-violet/25 border-violet/40", "bg-aqua/20 border-aqua/40", "bg-aqua/35 border-aqua/50"][l];
                return <motion.div key={d} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.03 }} className={`flex min-h-[58px] flex-col justify-between rounded-lg border p-2 ${bg}`}><span className="text-[10px] leading-tight text-ink/90 sm:text-[11px]">{d}</span><span className="text-xs font-semibold">L{l}</span></motion.div>;
              })}
            </div>
            <div className="rounded-2xl border border-edge bg-white/[0.03] p-4">
              <p className="text-xs text-mute">Center maturity</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">Level 3</p>
              <p className="text-sm text-aqua">Controlled</p>
              <div className="mt-4 space-y-2">{MATURITY_LEVELS.map((m) => <div key={m.level} className="flex items-center gap-2 text-xs"><span className={`h-2 rounded-full ${m.level <= 3 ? "bg-gradient-to-r from-violet to-aqua" : "bg-white/[0.08]"}`} style={{ width: `${m.level * 14}px` }} /><span className={m.level <= 3 ? "text-ink" : "text-mute"}>{m.name}</span></div>)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  const [mode, setMode] = useState("startup");
  return (
    <section className="noise relative overflow-hidden">
      <Aurora />
      <div className="container-x relative pb-20 pt-14 md:pb-28 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <span className="kicker"><ShieldCheck size={15} className="text-aqua" />{BRAND.tagline}</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] }}
          className="h-display mx-auto mt-8 max-w-6xl text-center text-[clamp(2.9rem,8vw,7rem)]">
          Build Trust. Prove Compliance. <span className="text-gradient">Scale Globally.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }} className="mx-auto mt-7 max-w-3xl text-center text-lg leading-relaxed text-mute md:text-xl">
          {BRAND.description}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26 }} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/launchpad" className="btn-glow">Get Your Compliance Roadmap<ArrowRight size={17} /></Link>
          <a href={mailto("Talk to a DU-NZO expert")} className="btn-ghost"><Mail size={17} />Talk to an Expert</a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className="relative mx-auto mt-16 max-w-5xl">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex rounded-full border border-edge bg-white/[0.04] p-1" role="tablist" aria-label="Choose your journey">
              {[["startup", "I am a Startup"], ["gcc", "I run a GCC"]].map(([k, l]) => (
                <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`focus-ring relative min-h-[40px] rounded-full px-5 text-sm font-medium transition ${mode === k ? "text-void" : "text-mute hover:text-ink"}`}>
                  {mode === k && <motion.span layoutId="heroTab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                  <span className="relative">{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="absolute -inset-px top-14 rounded-[28px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" aria-hidden="true" />
          <HeroPreview mode={mode} />
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...FRAMEWORKS, ...FRAMEWORKS];
  return (
    <section className="border-y border-edge py-6" aria-label="Frameworks DU-NZO covers">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {row.map((f, i) => <Link key={i} to={`/compliance/${f.slug}`} className="flex items-center gap-3 text-lg font-medium text-mute transition hover:text-ink"><ShieldCheck size={18} className="text-violet-soft" />{f.code}</Link>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Frameworks ---------------- */
function Frameworks() {
  const [filter, setFilter] = useState("all");
  const list = FRAMEWORKS.filter((f) => filter === "all" || f.type === filter);
  return (
    <section id="frameworks" className="container-x scroll-mt-24 py-24 md:py-32">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHead kicker="Compliance frameworks" title="Every standard, law and framework. Clearly explained." body="Certifications, attestations, regulations and voluntary frameworks work differently. DU-NZO makes the difference obvious, then maps them to one control set." />
      </div>
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {[["all", "All"], ...Object.entries(TYPES).map(([k, v]) => [k, v.short])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k} className={`chip ${filter === k ? "border-transparent bg-ink text-void" : "border-edge text-mute hover:text-ink"}`}>{l}</button>
        ))}
      </div>
      {filter !== "all" && <p className="mt-4 text-sm text-mute">{TYPES[filter].note}</p>}
      <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((f) => (
            <motion.div key={f.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
              <Spotlight as={Link} to={`/compliance/${f.slug}`} className="glass focus-ring group flex h-full flex-col gap-4 rounded-3xl p-6 transition hover:border-white/20">
                <div className="flex items-center justify-between"><TypeBadge type={f.type} /><ArrowRight size={16} className="text-mute transition group-hover:translate-x-0.5 group-hover:text-ink" /></div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">{f.code}</h3>
                  <p className="mt-1 text-sm text-violet-soft">{f.title}</p>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-mute">{f.summary}</p>
              </Spotlight>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------------- Journeys ---------------- */
function StartupJourney() {
  const s = SOLUTIONS[0];
  const desc = ["Confirm what customers, investors and laws require", "Close baseline gaps in identity, devices and cloud", "Policies, risk assessment, privacy and AI governance", "ISO/IEC 27001 certificate or SOC 2 report", "Publish a Trust Center and answer questionnaires fast", "Add frameworks and move to continuous compliance"];
  return (
    <section className="relative border-y border-edge bg-night py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead kicker="For startups and scale ups" title="From first questionnaire to global trust." body={s.summary} />
          <Reveal><Link to="/launchpad" className="btn-glow shrink-0">Open the Startup Launchpad<ArrowRight size={17} /></Link></Reveal>
        </div>
        <ol className="relative mt-16 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-violet via-aqua to-transparent xl:block" aria-hidden="true" />
          {s.journey.map((step, i) => (
            <Reveal key={step} delay={i * 0.06}>
              <li className="relative">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-void text-sm font-semibold shadow-[0_0_0_6px_#0A0C18]">{i + 1}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{desc[i]}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function GccJourney() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead kicker="Flagship for Global Capability Centers" title="The DU-NZO GCC Compliance Command Center." body="Fifteen domains, one governed program. Align with group requirements, localise for Indian and regional law and prove maturity to global leadership." />
          <Reveal delay={0.15}><div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"><Link to="/gcc" className="btn-glow">Explore the Command Center</Link><Link to="/tools/gcc" className="btn-ghost">Take the GCC assessment</Link></div></Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {GCC_DOMAINS.map(([d, icon]) => (
                <Spotlight key={d} className="glass flex min-h-[104px] flex-col justify-between gap-3 rounded-2xl p-4">
                  <Icon name={icon} size={18} className="text-violet-soft" />
                  <span className="text-sm font-medium leading-snug">{d}</span>
                </Spotlight>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass mt-4 rounded-3xl p-6">
              <p className="text-sm font-semibold">GCC Compliance Maturity Model</p>
              <div className="mt-5 flex items-end gap-2">
                {MATURITY_LEVELS.map((m) => (
                  <div key={m.level} className="flex min-w-0 flex-1 flex-col gap-2">
                    <motion.div className="rounded-xl bg-gradient-to-t from-violet-deep via-violet to-aqua" initial={{ height: 0 }} whileInView={{ height: 26 + m.level * 22 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: m.level * 0.08 }} />
                    <span className="text-xs text-mute">Level {m.level}</span>
                    <span className="hyphens-auto break-words text-[11px] font-semibold leading-tight sm:min-h-[2.6em] sm:text-sm" lang="en">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Platform ---------------- */
function Platform() {
  const [mod, setMod] = useState("dashboard");
  return (
    <section className="relative overflow-hidden border-y border-edge bg-night py-24 md:py-32">
      <div className="container-x">
        <SectionHead kicker="The DU-NZO platform" title="Continuous compliance, in one workspace." body="Controls, evidence, risks, policies, vendors, audits and AI governance, with experts behind every module." />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="no-scrollbar flex gap-2 overflow-x-auto lg:col-span-4 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Platform modules">
            {PLATFORM_MODULES.map((m) => (
              <button key={m.id} role="tab" aria-selected={mod === m.id} onClick={() => setMod(m.id)}
                className={`focus-ring flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${mod === m.id ? "border-violet/60 bg-violet/10" : "border-transparent hover:bg-white/[0.04]"}`}>
                <Icon name={m.icon} size={18} className={mod === m.id ? "text-aqua" : "text-mute"} />
                <span className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">{m.name}</span>
              </button>
            ))}
          </div>
          <div className="glass rounded-3xl p-5 md:p-7 lg:col-span-8">
            <div className="mb-5">
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">{PLATFORM_MODULES.find((m) => m.id === mod).name}</h3>
              <p className="mt-1 text-mute">{PLATFORM_MODULES.find((m) => m.id === mod).summary}</p>
            </div>
            <DashboardMock view={mod} />
            <Link to="/platform" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">See the full platform<ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beyond compliance: Cybersecurity and IT Infrastructure ---------------- */
function BeyondCompliance() {
  const cards = [
    { cat: SERVICE_CATEGORIES[1], icon: "ShieldCheck", points: ["Vulnerability and penetration testing", "Cloud security assessment", "Managed security monitoring (SOC)", "Incident response"] },
    { cat: SERVICE_CATEGORIES[2], icon: "Server", points: ["Cloud migration and management", "Network design and security", "Device management", "Managed IT support"] },
  ];
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHead kicker="Beyond compliance" title="Beyond compliance: Cybersecurity and IT Infrastructure." body="The same team that builds your compliance program also tests, secures and runs the technology underneath it." />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {cards.map(({ cat, icon, points }, i) => (
          <Reveal key={cat.id} delay={i * 0.08}>
            <Spotlight as={Link} to={`/services#${cat.id}`} className="glass focus-ring group flex h-full flex-col rounded-3xl p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet to-aqua text-void"><Icon name={icon} size={22} /></span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{cat.name}</h3>
              <p className="mt-2 leading-relaxed text-mute">{cat.intro}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {points.map((p) => <li key={p} className="flex items-center gap-2 text-sm text-ink/85"><Check size={15} className="shrink-0 text-aqua" strokeWidth={2.6} />{p}</li>)}
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Explore {cat.name}<ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Tools ---------------- */
function Tools() {
  const featured = TOOLS.slice(0, 8);
  return (
    <section className="container-x py-24 md:py-32">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHead kicker="Free assessments and tools" title="Know where you stand in minutes." body="Fourteen free tools, from readiness assessments to a risk register generator. No sign up required." />
        <Reveal><Link to="/tools" className="btn-ghost shrink-0">View all tools<ArrowRight size={17} /></Link></Reveal>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.04} className={t.featured ? "sm:col-span-2" : ""}>
            <Spotlight as={Link} to={t.to} className={`glass focus-ring group flex h-full flex-col gap-4 rounded-3xl p-6 ${t.featured ? "md:p-8" : ""}`}>
              <div className="flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.featured ? "bg-gradient-to-br from-violet to-aqua text-void" : "bg-white/[0.06] text-violet-soft"}`}><Icon name={t.icon} size={20} /></span>
                <span className="text-xs text-mute">{t.tag}</span>
              </div>
              <h3 className={`${t.featured ? "text-2xl" : "text-lg"} font-semibold tracking-[-0.02em]`}>{t.name}</h3>
              <p className="text-sm leading-relaxed text-mute">{t.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Start<ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Comparison ---------------- */
function Comparison() {
  const picks = ["iso-27001", "soc-2", "gdpr", "dpdpa", "iso-42001"].map((s) => FRAMEWORKS.find((f) => f.slug === s));
  const rows = [["Type", (f) => <TypeBadge type={f.type} />], ["Assessed by", (f) => f.assessor], ["You receive", (f) => f.output], ["Cycle", (f) => f.cycle]];
  return (
    <section className="relative border-y border-edge bg-night py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead kicker="Framework comparison" title="Certificate, report or legal duty?" body="The most common question we hear, answered side by side." />
          <Reveal><Link to="/tools/compare" className="btn-ghost shrink-0">Compare any frameworks<ArrowRight size={17} /></Link></Reveal>
        </div>
        <Reveal>
          <div className="glass mt-12 overflow-x-auto rounded-3xl">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead><tr className="border-b border-edge"><th className="p-5 font-medium text-mute" scope="col"><span className="sr-only">Attribute</span></th>{picks.map((f) => <th key={f.slug} scope="col" className="p-5 text-base font-semibold">{f.code}</th>)}</tr></thead>
              <tbody>{rows.map(([label, fn]) => <tr key={label} className="border-b border-white/[0.05] last:border-0"><th scope="row" className="p-5 font-medium text-mute">{label}</th>{picks.map((f) => <td key={f.slug} className="p-5 align-top text-ink/90">{fn(f)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Global coverage ---------------- */
function Global() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHead kicker="Global compliance coverage" title="One program. Many jurisdictions." body="Key requirements DU-NZO helps you align with across the markets where startups sell and GCCs operate. Applicability depends on your activities and is confirmed during assessment." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.04}>
            <Spotlight className="glass h-full rounded-3xl p-6">
              <div className="flex items-center gap-3"><Globe2 size={18} className="text-aqua" /><h3 className="text-lg font-semibold">{r.name}</h3></div>
              <ul className="mt-4 flex flex-wrap gap-2">{r.items.map((it) => <li key={it} className="rounded-full border border-edge bg-white/[0.03] px-3 py-1.5 text-xs text-ink/85">{it}</li>)}</ul>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Trust Center & Resources ---------------- */
function TrustAndResources() {
  return (
    <section className="relative border-y border-edge bg-night py-24 md:py-32">
      <div className="container-x grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="glass flex h-full flex-col rounded-3xl p-8">
            <span className="kicker self-start">Trust Center</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em]">Show buyers your security posture before they ask.</h2>
            <p className="mt-4 leading-relaxed text-mute">A public page with your certifications, policies and subprocessors, plus NDA gated access to reports. DU-NZO builds it with you and keeps it current.</p>
            <div className="mt-8 space-y-2">
              {[["ISO/IEC 27001 certificate", Lock], ["SOC 2 Type II report", FileText], ["Subprocessor list", Globe2]].map(([t, I]) => (
                <div key={t} className="flex items-center justify-between rounded-xl border border-edge bg-white/[0.02] px-4 py-3 text-sm"><span className="flex items-center gap-3"><I size={16} className="text-violet-soft" />{t}</span><span className="text-xs text-mute">Request access</span></div>
              ))}
            </div>
            <Link to="/trust-center" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">View the DU-NZO Trust Center<ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="grid gap-4 lg:col-span-7">
          <Reveal><div className="flex items-end justify-between"><h2 className="text-3xl font-semibold tracking-[-0.03em]">Resources</h2><Link to="/resources" className="text-sm font-semibold text-aqua">All resources</Link></div></Reveal>
          {GUIDES.map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.05}>
              <Spotlight as={Link} to={`/resources/guides/${g.slug}`} className="glass focus-ring group flex items-center gap-5 rounded-3xl p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-violet-soft"><BookOpen size={20} /></span>
                <span className="flex-1"><span className="text-xs text-aqua">{g.tag} · {g.read}</span><span className="mt-1 block text-lg font-semibold leading-snug">{g.title}</span></span>
                <ArrowRight size={18} className="shrink-0 text-mute transition group-hover:translate-x-0.5 group-hover:text-ink" />
              </Spotlight>
            </Reveal>
          ))}
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/resources/startup-hub" className="glass focus-ring rounded-3xl p-6 hover:border-white/20"><Icon name="Rocket" size={20} className="text-aqua" /><p className="mt-4 font-semibold">Startup Compliance Hub</p><p className="mt-1 text-sm text-mute">Tools, checklists and guides for founders.</p></Link>
              <Link to="/resources/gcc-hub" className="glass focus-ring rounded-3xl p-6 hover:border-white/20"><Icon name="Building2" size={20} className="text-aqua" /><p className="mt-4 font-semibold">GCC Compliance Hub</p><p className="mt-1 text-sm text-mute">Everything a GCC compliance lead needs.</p></Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Why() {
  const points = [
    ["Clear, not complex", "Plain language roadmaps that tell you exactly what to do next, in what order and why."],
    ["One control set", "Implement once and map to ISO, SOC 2, privacy law and AI governance together."],
    ["Experts plus platform", "Senior practitioners guide every step, supported by tooling that keeps evidence current."],
    ["Built for Startups and GCCs", "Right sized programs for fast growing companies and for centers serving global parents."],
  ];
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHead center kicker="Why DU-NZO" title="Compliance without the complexity." />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(([t, b], i) => (
          <Reveal key={t} delay={i * 0.06}>
            <div className="glass h-full rounded-3xl p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua text-void"><Check size={18} strokeWidth={3} /></span>
              <h3 className="mt-5 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{b}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  useSeo(null, BRAND.description);
  return (
    <>
      <Hero />
      <Marquee />
      <Frameworks />
      <StartupJourney />
      <GccJourney />
      <Platform />
      <BeyondCompliance />
      <Tools />
      <Comparison />
      <Global />
      <TrustAndResources />
      <Why />
      <CtaBand title="Get your DU-NZO Compliance Roadmap." />
    </>
  );
}
