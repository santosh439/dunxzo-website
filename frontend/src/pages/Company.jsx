import { useParams, Link } from "react-router-dom";
import { Mail, Target, Eye, HeartHandshake, UserRound, Handshake, ArrowRight } from "lucide-react";
import { PageHero, Reveal, SectionHead, CtaBand } from "../components/ui.jsx";
import NotFound from "./NotFound.jsx";
import { BRAND, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const Placeholder = ({ children }) => <div className="rounded-2xl border border-amber/40 bg-amber/10 p-5 text-sm text-amber">{children}</div>;

function About() {
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Company"], ["About DU-NZO"]]} kicker="About DU-NZO" title="Compliance without the complexity." body={BRAND.description} />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[[Target, "Mission", "Make security, privacy and AI governance achievable for every growing company and capability center, without unnecessary complexity."], [Eye, "Approach", "Structured assessments, practical roadmaps and continuous compliance, delivered by practitioners and supported by a platform."], [HeartHandshake, "Principles", "Plain language, honest timelines, no unsupported claims, and controls that fit how your teams actually work."]].map(([I, t, b], i) => (
            <Reveal key={t} delay={i * 0.06}><div className="glass h-full rounded-3xl p-7"><I className="text-aqua" size={22} /><h2 className="mt-4 text-xl font-semibold">{t}</h2><p className="mt-2 leading-relaxed text-mute">{b}</p></div></Reveal>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-7"><h2 className="text-2xl font-semibold">Our story</h2><div className="mt-4"><Placeholder>[Add the DU-NZO founding story, headquarters location, year founded and team size. Keep claims verifiable.]</Placeholder></div></div>
          <div className="glass rounded-3xl p-7"><h2 className="text-2xl font-semibold">Who we serve</h2><p className="mt-4 leading-relaxed text-mute">Startups, scale ups, Global Capability Centers, SaaS and AI companies, technology companies and global enterprises across India, the Middle East, Europe, North America and Asia Pacific.</p><Link to="/company/experts" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua">Meet the experts<ArrowRight size={15} /></Link></div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

function Experts() {
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Company"], ["Experts"]]} kicker="Experts" title="Practitioners, not generalists." body="DU-NZO experts cover information security, privacy, AI governance, business continuity and audit." />
      <section className="container-x py-16 md:py-24">
        <Placeholder>Add real team profiles only. For each expert include name, role, verified credentials (for example ISO/IEC 27001 Lead Auditor, CISSP, CIPP/E) and a short bio. Do not publish unverified credentials.</Placeholder>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["[Founder and Principal Consultant]", "[Lead Auditor, ISO]", "[Privacy Lead]", "[AI Governance Lead]", "[vCISO]", "[Business Continuity Lead]"].map((r) => (
            <div key={r} className="glass rounded-3xl p-6"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-mute"><UserRound size={26} /></span><p className="mt-4 font-semibold">[Name]</p><p className="text-sm text-violet-soft">{r}</p><p className="mt-3 text-sm text-mute">[Credentials and short bio]</p></div>
          ))}
        </div>
        <div className="glass mt-10 flex flex-col justify-between gap-4 rounded-3xl p-7 sm:flex-row sm:items-center"><p className="font-medium">Interested in joining DU-NZO?</p><a href={mailto("Careers at DU-NZO")} className="btn-ghost"><Mail size={17} />{BRAND.email}</a></div>
      </section>
      <CtaBand />
    </>
  );
}

function Partners() {
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Company"], ["Partners"]]} kicker="Partners" title="Better outcomes, together." body="DU-NZO works with certification bodies, audit firms, technology vendors and advisors to deliver complete programs." />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[["Certification bodies", "Independent accredited bodies that audit and certify. DU-NZO prepares you; it does not certify you."], ["Audit firms", "Licensed CPA firms for SOC 2 examinations."], ["Technology partners", "Security and cloud tooling that automates controls and evidence."], ["Referral partners", "Advisors, investors and accelerators who refer startups and GCCs."]].map(([t, b]) => (
            <div key={t} className="glass rounded-3xl p-6"><Handshake className="text-aqua" size={22} /><h2 className="mt-4 font-semibold">{t}</h2><p className="mt-2 text-sm text-mute">{b}</p></div>
          ))}
        </div>
        <div className="mt-8"><Placeholder>[List named partners only with written permission and accurate descriptions of the relationship.]</Placeholder></div>
        <div className="glass mt-8 flex flex-col justify-between gap-4 rounded-3xl p-7 sm:flex-row sm:items-center"><div><h2 className="text-xl font-semibold">Become a DU-NZO partner</h2><p className="mt-1 text-mute">Tell us about your organisation and how you work with clients.</p></div><a href={mailto("DU-NZO partnership")} className="btn-glow"><Mail size={17} />Contact partnerships</a></div>
      </section>
      <CtaBand />
    </>
  );
}

const PAGES = { about: [About, "About DU-NZO"], experts: [Experts, "Experts"], partners: [Partners, "Partners"] };
export default function Company() {
  const { slug } = useParams();
  const p = PAGES[slug];
  useSeo(p?.[1] || "Not found");
  if (!p) return <NotFound />;
  const C = p[0];
  return <C />;
}
