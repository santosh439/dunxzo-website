import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, Reveal, Spotlight, CtaBand } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import { SERVICES } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function ServicesIndex() {
  useSeo("Services", "DU-NZO services: gap assessment, ISO readiness, ISMS and PIMS implementation, risk assessment, internal audit, vCISO, privacy advisory and AI governance.");
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Services"]]} kicker="Services" title="Expert delivery for every stage of compliance." body="From a two week gap assessment to a fully managed program, DU-NZO consultants do the work alongside your team." />
      <section className="container-x py-20 md:py-28">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.03}>
              <Spotlight as={Link} to={`/services/${s.slug}`} className="glass focus-ring group flex h-full flex-col gap-4 rounded-3xl p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-violet-soft transition group-hover:bg-gradient-to-br group-hover:from-violet group-hover:to-aqua group-hover:text-void"><Icon name={s.icon} size={21} /></span>
                <h2 className="text-xl font-semibold tracking-[-0.02em]">{s.name}</h2>
                <p className="text-sm leading-relaxed text-mute">{s.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Learn more<ArrowRight size={15} /></span>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
