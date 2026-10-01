import { Link, useParams } from "react-router-dom";
import { ArrowRight, AlertCircle, Mail } from "lucide-react";
import { PageHero, Reveal, Spotlight, SectionHead, TypeBadge, CtaBand } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import NotFound from "./NotFound.jsx";
import { SOLUTIONS, SERVICES, fwBySlug, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function Solution() {
  const { slug } = useParams();
  const s = SOLUTIONS.find((x) => x.slug === slug);
  useSeo(s ? `Compliance for ${s.name}` : "Not found", s?.summary);
  if (!s) return <NotFound />;
  const services = SERVICES.filter((x) => ["gap-assessment", "vciso", "iso-readiness", "privacy-advisory", "ai-governance", "vendor-risk"].includes(x.slug));
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Solutions"], [s.name]]} kicker={<><Icon name={s.icon} size={15} className="text-aqua" />DU-NZO for {s.name}</>} title={s.headline} body={s.summary}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={s.cta.to} className="btn-glow">{s.cta.label}<ArrowRight size={17} /></Link>
          <a href={mailto(`DU-NZO for ${s.name}`)} className="btn-ghost"><Mail size={17} />Talk to an Expert</a>
        </div>
      </PageHero>

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5"><SectionHead kicker="Challenges we solve" title="Sound familiar?" /></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {s.pains.map((p, i) => (
              <Reveal key={p} delay={i * 0.05}><div className="glass flex h-full gap-3 rounded-2xl p-5"><AlertCircle size={20} className="mt-0.5 shrink-0 text-amber" /><p className="leading-relaxed">{p}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-edge bg-night py-20 md:py-28">
        <div className="container-x">
          <SectionHead kicker="Your journey" title={s.journey.join(" → ")} />
          <ol className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {s.journey.map((j, i) => (
              <Reveal key={j} delay={i * 0.05}><li className="glass h-full rounded-2xl p-5"><span className="text-sm text-aqua">Step {i + 1}</span><p className="mt-2 text-lg font-semibold">{j}</p></li></Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <SectionHead kicker="Relevant frameworks" title={`What ${s.name.toLowerCase()} typically need`} body="Your exact mix depends on customers, markets and data. The Launchpad personalises it for you." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.frameworks.map((fs) => { const f = fwBySlug(fs); return (
            <Spotlight key={fs} as={Link} to={`/compliance/${f.slug}`} className="glass focus-ring group flex flex-col gap-3 rounded-3xl p-6">
              <TypeBadge type={f.type} className="self-start" />
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">{f.code}</h3>
              <p className="text-sm leading-relaxed text-mute">{f.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Learn more<ArrowRight size={15} /></span>
            </Spotlight>
          ); })}
        </div>
      </section>

      <section className="border-t border-edge py-20 md:py-28">
        <div className="container-x">
          <SectionHead kicker="How DU-NZO helps" title="Services built for this stage." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((v) => (
              <Link key={v.slug} to={`/services/${v.slug}`} className="glass focus-ring flex gap-4 rounded-2xl p-5 hover:border-white/20">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-violet-soft"><Icon name={v.icon} size={19} /></span>
                <span><span className="block font-semibold">{v.name}</span><span className="mt-1 block text-sm text-mute">{v.summary}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
