import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, Reveal, Spotlight, TypeBadge, CtaBand } from "../components/ui.jsx";
import { FRAMEWORKS, TYPES } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function ComplianceIndex() {
  useSeo("Compliance frameworks", "ISO/IEC 27001, 27701, 9001, 22301, 42001, SOC 2, GDPR, DPDPA, NIST CSF, CIS Controls, PCI DSS and HIPAA explained by DU-NZO.");
  const groups = Object.entries(TYPES).map(([k, t]) => [k, t, FRAMEWORKS.filter((f) => f.type === k)]).filter(([, , l]) => l.length);
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Compliance"]]} kicker="Compliance coverage" title="Standards, laws and frameworks, clearly separated." body="Know what each requirement is, who assesses it and what you receive. Then let DU-NZO map them into one program." />
      <div className="container-x flex flex-col gap-16 py-20 md:py-28">
        {groups.map(([k, t, list]) => (
          <section key={k} aria-labelledby={`g-${k}`}>
            <div className="flex flex-col justify-between gap-3 border-b border-edge pb-5 md:flex-row md:items-end">
              <div><TypeBadge type={k} /><h2 id={`g-${k}`} className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{t.label}</h2></div>
              <p className="max-w-lg text-sm text-mute">{t.note}</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((f, i) => (
                <Reveal key={f.slug} delay={i * 0.04}>
                  <Spotlight as={Link} to={`/compliance/${f.slug}`} className="glass focus-ring group flex h-full flex-col gap-3 rounded-3xl p-6">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em]">{f.code}</h3>
                    <p className="text-sm text-violet-soft">{f.title}</p>
                    <p className="text-sm leading-relaxed text-mute">{f.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-aqua">Explore {f.code}<ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
                  </Spotlight>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <CtaBand />
    </>
  );
}
