import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Clock, Mail } from "lucide-react";
import { PageHero, Reveal, CtaBand, TypeBadge } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import NotFound from "./NotFound.jsx";
import { SERVICES, FRAMEWORKS, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const STEPS = [["Discover", "Understand your scope, stakeholders, systems and deadlines."], ["Assess", "Review current state against requirements and score gaps."], ["Deliver", "Implement, document and evidence the work with your owners."], ["Handover", "Transfer knowledge and set up ongoing monitoring."]];

export default function Service() {
  const { slug } = useParams();
  const s = SERVICES.find((x) => x.slug === slug);
  useSeo(s?.name || "Not found", s?.summary);
  if (!s) return <NotFound />;
  const fws = FRAMEWORKS.filter((f) => f.services.includes(s.slug));
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 6);
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Services", "/services"], [s.name]]} kicker={<><Icon name={s.icon} size={15} className="text-aqua" />Service</>} title={s.name} body={s.summary}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={mailto(`${s.name} enquiry`)} className="btn-glow"><Mail size={17} />Request a proposal</a>
          <Link to="/launchpad" className="btn-ghost">Get Your Compliance Roadmap</Link>
        </div>
      </PageHero>
      <section className="container-x grid gap-6 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal><div className="glass rounded-3xl p-7 md:p-9"><h2 className="text-2xl font-semibold tracking-[-0.03em]">What you receive</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{s.outcomes.map((o) => <li key={o} className="flex gap-3 rounded-2xl border border-edge bg-white/[0.02] p-4"><Check size={18} className="mt-0.5 shrink-0 text-aqua" strokeWidth={2.6} />{o}</li>)}</ul><p className="mt-6 flex items-center gap-2 text-sm text-mute"><Clock size={16} />{s.duration}. Final scope is confirmed in your proposal.</p></div></Reveal>
          <Reveal><div className="glass mt-6 rounded-3xl p-7 md:p-9"><h2 className="text-2xl font-semibold tracking-[-0.03em]">How we work</h2><ol className="mt-6 grid gap-4 sm:grid-cols-2">{STEPS.map(([t, b], i) => <li key={t} className="rounded-2xl border border-edge bg-white/[0.02] p-5"><span className="text-sm text-aqua">Step {i + 1}</span><p className="mt-1 text-lg font-semibold">{t}</p><p className="mt-1 text-sm text-mute">{b}</p></li>)}</ol></div></Reveal>
        </div>
        <aside className="flex flex-col gap-6 lg:col-span-5">
          {fws.length > 0 && <div className="glass rounded-3xl p-6"><h2 className="font-semibold">Frameworks covered</h2><ul className="mt-4 space-y-2">{fws.map((f) => <li key={f.slug}><Link to={`/compliance/${f.slug}`} className="flex items-center justify-between rounded-xl border border-edge px-4 py-3 text-sm hover:border-white/20"><span className="font-medium">{f.code}</span><TypeBadge type={f.type} /></Link></li>)}</ul></div>}
          <div className="glass rounded-3xl p-6"><h2 className="font-semibold">Other services</h2><ul className="mt-3 space-y-1">{others.map((o) => <li key={o.slug}><Link to={`/services/${o.slug}`} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-white/[0.04]"><Icon name={o.icon} size={16} className="text-aqua" />{o.name}<ArrowRight size={14} className="ml-auto text-mute" /></Link></li>)}</ul></div>
        </aside>
      </section>
      <CtaBand />
    </>
  );
}
