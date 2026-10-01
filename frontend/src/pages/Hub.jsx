import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ListChecks } from "lucide-react";
import { PageHero, Reveal, Spotlight, SectionHead, CtaBand, TypeBadge } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import { TOOLS, GUIDES, CHECKLISTS, SOLUTIONS, fwBySlug } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const CONFIG = {
  startup: { title: "Startup Compliance Hub", icon: "Rocket", body: "Everything a founder needs to win enterprise trust: tools, checklists, guides and the DU-NZO Launchpad.", tools: ["launchpad", "soc-2", "iso-27001", "cost", "policy", "compare"], guides: ["soc-2-vs-iso-27001", "iso-27001-certification-steps"], checklists: ["startup-security-baseline", "soc-2-readiness"], sol: "startups", cta: { label: "Open the Startup Launchpad", to: "/launchpad" } },
  gcc: { title: "GCC Compliance Hub", icon: "Building2", body: "Resources for Global Capability Center leaders: the Command Center, maturity model, DPDPA guidance and assessments.", tools: ["gcc", "security-maturity", "audit-readiness", "vendor", "risk", "iso-27701"], guides: ["dpdpa-for-gccs", "iso-27001-certification-steps"], checklists: ["iso-27001-mandatory-documents"], sol: "gcc", cta: { label: "Take the GCC Compliance Assessment", to: "/tools/gcc" } },
};

export default function Hub({ kind }) {
  const c = CONFIG[kind];
  useSeo(c.title, c.body);
  const sol = SOLUTIONS.find((s) => s.slug === c.sol);
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources", "/resources"], [c.title]]} kicker={<><Icon name={c.icon} size={15} className="text-aqua" />DU-NZO {c.title}</>} title={c.title} body={c.body}>
        <Link to={c.cta.to} className="btn-glow">{c.cta.label}<ArrowRight size={17} /></Link>
      </PageHero>
      <section className="container-x py-16 md:py-24">
        <SectionHead kicker="Tools" title="Start with a free tool." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.tools.map((id) => TOOLS.find((t) => t.id === id)).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.04}><Spotlight as={Link} to={t.to} className="glass focus-ring flex h-full gap-4 rounded-3xl p-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-violet-soft"><Icon name={t.icon} size={20} /></span><span><span className="block font-semibold">{t.name}</span><span className="mt-1 block text-sm text-mute">{t.summary}</span></span></Spotlight></Reveal>
          ))}
        </div>
      </section>
      <section className="border-y border-edge bg-night py-16 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Guides</h2>
            <div className="mt-6 space-y-3">{c.guides.map((s) => GUIDES.find((g) => g.slug === s)).map((g) => <Link key={g.slug} to={`/resources/guides/${g.slug}`} className="glass focus-ring flex items-center gap-4 rounded-2xl p-5 hover:border-white/20"><BookOpen size={19} className="shrink-0 text-aqua" /><span className="flex-1 font-medium">{g.title}</span><ArrowRight size={16} className="text-mute" /></Link>)}</div>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Checklists</h2>
            <div className="mt-6 space-y-3">{c.checklists.map((s) => CHECKLISTS.find((g) => g.slug === s)).map((g) => <Link key={g.slug} to={`/resources/checklists/${g.slug}`} className="glass focus-ring flex items-center gap-4 rounded-2xl p-5 hover:border-white/20"><ListChecks size={19} className="shrink-0 text-aqua" /><span className="flex-1 font-medium">{g.title}</span><span className="text-xs text-mute">{g.items.length} items</span></Link>)}</div>
          </div>
        </div>
      </section>
      <section className="container-x py-16 md:py-24">
        <SectionHead kicker="Frameworks" title="Most relevant for you." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sol.frameworks.map((s) => { const f = fwBySlug(s); return <Link key={s} to={`/compliance/${s}`} className="glass focus-ring flex items-center justify-between rounded-2xl p-5 hover:border-white/20"><span className="font-semibold">{f.code}</span><TypeBadge type={f.type} /></Link>; })}</div>
      </section>
      <CtaBand />
    </>
  );
}
