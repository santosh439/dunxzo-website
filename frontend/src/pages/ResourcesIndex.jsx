import { Link } from "react-router-dom";
import { PageHero, Reveal, Spotlight, CtaBand } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";
import { NAV } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

export default function ResourcesIndex() {
  useSeo("Resource Center", "DU-NZO Resource Center: free tools, Startup and GCC Compliance Hubs, guides, checklists, framework comparison and glossary.");
  const items = NAV.find((n) => n.label === "Resources").items;
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Resources"]]} kicker="Resource Center" title="Learn, assess and plan." body="Free tools, hubs, guides and checklists to make compliance simple." />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => <Reveal key={it.to} delay={i * 0.04}><Spotlight as={Link} to={it.to} className="glass focus-ring flex h-full flex-col gap-4 rounded-3xl p-6"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-violet-soft"><Icon name={it.icon} size={20} /></span><h2 className="font-semibold">{it.label}</h2><p className="text-sm text-mute">{it.desc}</p></Spotlight></Reveal>)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
