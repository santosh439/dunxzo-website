import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, BookOpen, Mail } from "lucide-react";
import { PageHero, Reveal, Spotlight, CtaBand } from "../components/ui.jsx";
import NotFound from "./NotFound.jsx";
import { GUIDES, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function Guides() {
  const { slug } = useParams();
  const g = slug ? GUIDES.find((x) => x.slug === slug) : null;
  useSeo(g ? g.title : "Guides and Blog", g ? g.body[0][1] : "Practical, plain language guides from DU-NZO on ISO, SOC 2, privacy and AI governance.");
  if (slug && !g) return <NotFound />;
  if (g) return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources", "/resources"], ["Guides", "/resources/guides"], [g.tag]]} kicker={`${g.tag} · ${g.read}`} title={g.title} />
      <article className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-10">
          {g.body.map(([h, p]) => <section key={h}><h2 className="text-2xl font-semibold tracking-[-0.03em]">{h}</h2><p className="mt-3 text-lg leading-[1.75] text-ink/85">{p}</p></section>)}
          <div className="glass flex flex-col justify-between gap-4 rounded-3xl p-6 sm:flex-row sm:items-center"><p className="font-medium">Questions about your situation?</p><a href={mailto(`Question about: ${g.title}`)} className="btn-glow"><Mail size={17} />Ask a DU-NZO expert</a></div>
          <Link to="/resources/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-aqua"><ArrowLeft size={15} />All guides</Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources", "/resources"], ["Guides and Blog"]]} kicker="Guides and Blog" title="Plain language guidance." body="Short, accurate guides written by DU-NZO practitioners." />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {GUIDES.map((x, i) => (
            <Reveal key={x.slug} delay={i * 0.05}><Spotlight as={Link} to={`/resources/guides/${x.slug}`} className="glass focus-ring group flex h-full flex-col gap-4 rounded-3xl p-7"><BookOpen className="text-aqua" size={22} /><span className="text-xs text-mute">{x.tag} · {x.read}</span><h2 className="text-xl font-semibold leading-snug">{x.title}</h2><p className="line-clamp-3 text-sm text-mute">{x.body[0][1]}</p><span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Read<ArrowRight size={15} /></span></Spotlight></Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
