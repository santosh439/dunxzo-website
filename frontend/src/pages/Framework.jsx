import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Info, Mail, FileText } from "lucide-react";
import { PageHero, Reveal, TypeBadge, CtaBand, Spotlight } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import NotFound from "./NotFound.jsx";
import { FRAMEWORKS, TYPES, fwBySlug, svcBySlug, TOOLS, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function Framework() {
  const { slug } = useParams();
  const f = fwBySlug(slug);
  useSeo(f ? `${f.code} ${f.title}` : "Not found", f?.summary);
  if (!f) return <NotFound />;
  const t = TYPES[f.type];
  const tool = TOOLS.find((x) => x.id === f.tool);
  const related = FRAMEWORKS.filter((x) => x.slug !== f.slug && (x.family === f.family || x.type === f.type)).slice(0, 3);
  const facts = [["Type", t.label], ["Published by", f.issuer], ["Assessed by", f.assessor], ["You receive", f.output], ["Cycle", f.cycle], ["Geography", f.region]];
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Compliance", "/compliance"], [f.code]]} kicker={<TypeBadge type={f.type} />} title={f.name} body={f.summary}>
        <div className="flex flex-col gap-3 sm:flex-row">
          {tool ? <Link to={tool.to} className="btn-glow">Take the {tool.name}<ArrowRight size={17} /></Link> : <Link to="/launchpad" className="btn-glow">Get Your Compliance Roadmap<ArrowRight size={17} /></Link>}
          <a href={mailto(`${f.code} enquiry`)} className="btn-ghost"><Mail size={17} />Talk to an Expert</a>
        </div>
      </PageHero>

      <section className="container-x grid gap-6 py-20 md:py-28 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <Reveal><div className="glass rounded-3xl p-7 md:p-9"><h2 className="text-2xl font-semibold tracking-[-0.03em]">{f.title}</h2><p className="mt-3 leading-relaxed text-mute">{t.note}</p><h3 className="mt-8 font-semibold">Who needs it</h3><p className="mt-2 leading-relaxed text-mute">{f.who}</p></div></Reveal>
          <Reveal><div className="glass rounded-3xl p-7 md:p-9"><h2 className="text-2xl font-semibold tracking-[-0.03em]">How it is structured</h2><ul className="mt-5 grid gap-3">{f.structure.map((s) => <li key={s} className="flex gap-3"><Check size={18} className="mt-0.5 shrink-0 text-aqua" strokeWidth={2.6} /><span className="leading-relaxed">{s}</span></li>)}</ul></div></Reveal>
          <Reveal><div className="glass rounded-3xl p-7 md:p-9"><h2 className="text-2xl font-semibold tracking-[-0.03em]">Evidence you will need</h2><div className="mt-5 grid gap-2 sm:grid-cols-2">{f.evidence.map((e) => <div key={e} className="flex items-center gap-3 rounded-xl border border-edge bg-white/[0.02] px-4 py-3 text-sm"><FileText size={16} className="text-violet-soft" />{e}</div>)}</div></div></Reveal>
          {f.notice && <div className="flex gap-3 rounded-2xl border border-amber/40 bg-amber/10 p-5 text-sm text-amber"><Info size={18} className="mt-0.5 shrink-0" />{f.notice}</div>}
        </div>
        <aside className="flex flex-col gap-6 lg:col-span-4">
          <div className="glass sticky top-28 rounded-3xl p-6">
            <h2 className="font-semibold">At a glance</h2>
            <dl className="mt-4 divide-y divide-white/[0.06] text-sm">{facts.map(([k, v]) => <div key={k} className="py-3"><dt className="text-mute">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>)}</dl>
            <h2 className="mt-6 font-semibold">DU-NZO services</h2>
            <ul className="mt-3 space-y-1">{f.services.map((s) => { const v = svcBySlug(s); return v && <li key={s}><Link to={`/services/${s}`} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-white/[0.04]"><Icon name={v.icon} size={16} className="text-aqua" />{v.name}</Link></li>; })}</ul>
          </div>
        </aside>
      </section>

      <section className="border-t border-edge py-20">
        <div className="container-x">
          <h2 className="text-3xl font-semibold tracking-[-0.03em]">Related</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => <Spotlight key={r.slug} as={Link} to={`/compliance/${r.slug}`} className="glass focus-ring flex flex-col gap-2 rounded-3xl p-6"><TypeBadge type={r.type} className="self-start" /><h3 className="text-xl font-semibold">{r.code}</h3><p className="text-sm text-mute">{r.title}</p></Spotlight>)}
          </div>
        </div>
      </section>
      <CtaBand title={`Plan your ${f.code} journey with DU-NZO.`} />
    </>
  );
}
