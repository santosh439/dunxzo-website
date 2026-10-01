import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Check } from "lucide-react";
import { PageHero, Reveal, Spotlight, SectionHead, CtaBand } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import DashboardMock from "../components/DashboardMock.jsx";
import { PLATFORM_MODULES, mailto } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function Platform() {
  useSeo("Platform", "The DU-NZO compliance platform: dashboard, controls, evidence, risk and asset registers, policies, vendors, audits, CAPA, training, AI governance and Trust Center.");
  const [mod, setMod] = useState("dashboard");
  const m = PLATFORM_MODULES.find((x) => x.id === mod);
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Platform"]]} kicker="DU-NZO Platform" title="Your compliance program, finally in one place." body="Twelve connected modules, one unified control library, and DU-NZO experts on hand when you need them.">
        <div className="flex flex-col gap-3 sm:flex-row"><a href={mailto("DU-NZO platform demo request")} className="btn-glow"><Mail size={17} />Request a demo</a><Link to="/launchpad" className="btn-ghost">Get Your Compliance Roadmap</Link></div>
      </PageHero>
      <section className="container-x py-16 md:py-24">
        <div className="glass overflow-hidden rounded-[28px]">
          <div className="grid lg:grid-cols-12">
            <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-edge p-3 lg:col-span-3 lg:flex-col lg:border-b-0 lg:border-r" aria-label="Modules">
              {PLATFORM_MODULES.map((x) => (
                <button key={x.id} onClick={() => setMod(x.id)} aria-current={mod === x.id} className={`focus-ring flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${mod === x.id ? "bg-white/[0.08] text-ink" : "text-mute hover:text-ink"}`}>
                  <Icon name={x.icon} size={17} className={mod === x.id ? "text-aqua" : ""} /><span className="whitespace-nowrap">{x.name}</span>
                </button>
              ))}
            </nav>
            <div className="p-5 md:p-8 lg:col-span-9">
              <h2 className="text-3xl font-semibold tracking-[-0.03em]">{m.name}</h2>
              <p className="mb-6 mt-2 text-mute">{m.summary}</p>
              <DashboardMock view={mod} />
            </div>
          </div>
        </div>
      </section>
      <section className="container-x pb-20 md:pb-28">
        <SectionHead kicker="Modules" title="Everything connected. Nothing duplicated." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_MODULES.map((x, i) => (
            <Reveal key={x.id} delay={i * 0.03}>
              <Spotlight className="glass h-full rounded-3xl p-6"><Icon name={x.icon} size={22} className="text-violet-soft" /><h3 className="mt-4 font-semibold">{x.name}</h3><p className="mt-2 text-sm leading-relaxed text-mute">{x.summary}</p></Spotlight>
            </Reveal>
          ))}
        </div>
        <div className="glass mt-6 grid gap-6 rounded-3xl p-7 md:grid-cols-3 md:p-9">
          {[["Map once", "Every control links to ISO, SOC 2, privacy law and AI requirements at the same time."], ["Evidence that stays fresh", "Expiry dates and owners mean evidence is ready before the auditor asks."], ["Experts inside", "DU-NZO consultants review evidence, run internal audits and support your auditor."]].map(([t, b]) => (
            <div key={t}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua text-void"><Check size={16} strokeWidth={3} /></span><h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="mt-2 text-sm text-mute">{b}</p></div>
          ))}
        </div>
      </section>
      <CtaBand title="See the DU-NZO platform with your own frameworks." primary={{ label: "Get Your Compliance Roadmap", to: "/launchpad" }} />
    </>
  );
}
