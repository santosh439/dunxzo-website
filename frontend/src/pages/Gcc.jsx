import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Check } from "lucide-react";
import { PageHero, Reveal, Spotlight, SectionHead, CtaBand, TypeBadge } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import { GCC_DOMAINS, MATURITY_LEVELS, SOLUTIONS, fwBySlug, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const DOMAIN_TEXT = {
  "Governance": "Local governance forum, RACI with group functions, and policy localisation.",
  "Information Security": "ISMS aligned with ISO/IEC 27001 and group security standards.",
  "Privacy": "DPDPA, GDPR and client privacy obligations in one privacy program.",
  "Risk": "Risk register linked to group enterprise risk reporting.",
  "IAM": "Joiner mover leaver, MFA, privileged access and periodic reviews.",
  "Cloud Security": "Baselines and posture monitoring across AWS, Azure and Google Cloud.",
  "Endpoint Security": "Device management, encryption and endpoint detection.",
  "Vendor Risk": "Tiering and assessment of local and global suppliers.",
  "HR Security": "Background verification, agreements and awareness training.",
  "Asset Management": "Hardware, software and data inventories with owners.",
  "Business Continuity": "Business impact analysis, plans and exercises aligned with ISO 22301.",
  "Incident Management": "Detection, response and reporting within CERT-In, group and client timelines.",
  "Regulatory Alignment": "Tracking Indian, regional and client obligations and mapping them to controls.",
  "AI Governance": "AI inventory, acceptable use and ISO/IEC 42001 aligned governance.",
  "Audit and Assurance": "Integrated plan for group, client, certification and internal audits.",
};

export default function Gcc() {
  useSeo("GCC Compliance Command Center", "The DU-NZO GCC Compliance Command Center covers 15 domains with a five level maturity model for Global Capability Centers.");
  const s = SOLUTIONS.find((x) => x.slug === "gcc");
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Solutions"], ["GCC Command Center"]]} kicker={<><Icon name="Building2" size={15} className="text-aqua" />For Global Capability Centers</>} title="DU-NZO GCC Compliance Command Center" body={s.summary}>
        <div className="flex flex-col gap-3 sm:flex-row"><Link to="/tools/gcc" className="btn-glow">Take the GCC Compliance Assessment<ArrowRight size={17} /></Link><a href={mailto("GCC Compliance Command Center")} className="btn-ghost"><Mail size={17} />Talk to an Expert</a></div>
      </PageHero>

      <section className="container-x py-20 md:py-28">
        <SectionHead kicker="15 domains" title="Complete coverage for your center." body="Each domain has defined controls, evidence and metrics, mapped to group standards, certifications and local law." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GCC_DOMAINS.map(([d, icon], i) => (
            <Reveal key={d} delay={i * 0.03}>
              <Spotlight className="glass flex h-full gap-4 rounded-3xl p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-violet-soft"><Icon name={icon} size={20} /></span>
                <span><h3 className="font-semibold">{d}</h3><p className="mt-1 text-sm leading-relaxed text-mute">{DOMAIN_TEXT[d]}</p></span>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-edge bg-night py-20 md:py-28">
        <div className="container-x">
          <SectionHead kicker="GCC Compliance Maturity Model" title="Five levels from foundation to continuous improvement." />
          <div className="mt-14 grid items-end gap-4 md:grid-cols-5">
            {MATURITY_LEVELS.map((m, i) => (
              <Reveal key={m.level} delay={i * 0.08}>
                <div className="flex flex-col">
                  <motion.div className="glass flex flex-col justify-end rounded-3xl p-6" initial={{ minHeight: 160 }} whileInView={{ minHeight: 160 + m.level * 46 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08 }}
                    style={{ background: `linear-gradient(180deg, rgba(139,124,255,${0.06 + m.level * 0.05}), rgba(62,224,207,${0.02 + m.level * 0.04}))` }}>
                    <span className="text-5xl font-semibold tracking-[-0.05em] text-gradient">{m.level}</span>
                    <h3 className="mt-3 text-lg font-semibold">{m.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{m.body}</p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5"><SectionHead kicker="Frameworks" title="Aligned with what your parent and clients expect." /></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {s.frameworks.map((fs) => { const f = fwBySlug(fs); return <Link key={fs} to={`/compliance/${fs}`} className="glass focus-ring flex items-center justify-between rounded-2xl p-5 hover:border-white/20"><span className="font-semibold">{f.code}</span><TypeBadge type={f.type} /></Link>; })}
          </div>
        </div>
        <div className="glass mt-12 grid gap-6 rounded-3xl p-7 md:grid-cols-3 md:p-9">
          {["Group policy localisation and evidence", "Client audit readiness on demand", "Board ready maturity reporting"].map((t) => <div key={t} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-aqua" size={18} strokeWidth={2.6} /><span className="font-medium">{t}</span></div>)}
        </div>
      </section>
      <CtaBand title="Benchmark your GCC in 10 minutes." body="Score all 15 domains and see your level on the DU-NZO maturity model." primary={{ label: "Start the GCC Assessment", to: "/tools/gcc" }} />
    </>
  );
}
