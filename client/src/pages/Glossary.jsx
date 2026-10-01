import { useState } from "react";
import { Search } from "lucide-react";
import { PageHero, CtaBand } from "../components/ui.jsx";
import { GLOSSARY } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function Glossary() {
  useSeo("Compliance Glossary", "Plain language definitions of ISO, SOC 2, GDPR, DPDPA and GRC terms from DU-NZO.");
  const [q, setQ] = useState("");
  const list = GLOSSARY.filter(([t, d]) => (t + d).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources", "/resources"], ["Glossary"]]} kicker="Knowledge Center" title="Compliance glossary." body="The terms you will meet on the journey, defined in plain language." />
      <section className="container-x py-12 md:py-20">
        <div className="relative mx-auto max-w-3xl">
          <label htmlFor="gq" className="sr-only">Search the glossary</label>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input id="gq" className="field !h-14 !pl-12 text-base" placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} />
          <dl className="mt-8 divide-y divide-white/[0.06]">
            {list.map(([t, d]) => <div key={t} className="grid gap-2 py-5 md:grid-cols-3"><dt className="font-semibold">{t}</dt><dd className="leading-relaxed text-mute md:col-span-2">{d}</dd></div>)}
            {!list.length && <p className="py-10 text-center text-mute">No terms match “{q}”.</p>}
          </dl>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
