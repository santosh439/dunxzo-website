import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, Reveal, Spotlight, CtaBand } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import { TOOLS } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function ToolsIndex() {
  useSeo("Free compliance tools", "Free DU-NZO assessments and tools: ISO 27001, 27701, 42001 and SOC 2 readiness, GCC assessment, risk generator, vendor risk, policy gap checker, cost estimator and framework comparison.");
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources", "/resources"], ["Free Tools"]]} kicker="Free Tools" title="Fourteen free tools. Zero sign up." body="Assess readiness, generate a risk register, tier vendors, check policies, estimate effort and compare frameworks. Results stay in your browser." />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.03}>
              <Spotlight as={Link} to={t.to} className="glass focus-ring group flex h-full flex-col gap-4 rounded-3xl p-6">
                <div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-violet-soft transition group-hover:bg-gradient-to-br group-hover:from-violet group-hover:to-aqua group-hover:text-void"><Icon name={t.icon} size={20} /></span><span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-mute">{t.tag}</span></div>
                <h2 className="text-lg font-semibold">{t.name}</h2>
                <p className="text-sm leading-relaxed text-mute">{t.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Open<ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
