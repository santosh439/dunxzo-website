import { Link } from "react-router-dom";
import { Mail, Globe2 } from "lucide-react";
import { Logo } from "./ui.jsx";
import { BRAND, FRAMEWORKS, SOLUTIONS, SERVICES, mailto } from "../content/site.js";

const svcLinks = (cat, n, all) =>
  SERVICES.filter((s) => s.category === cat).slice(0, n).map((s) => [s.name, `/services/${s.slug}`]).concat([all]);

const cols = [
  ["Solutions", SOLUTIONS.map((s) => [s.name, `/solutions/${s.slug}`])],
  ["Compliance", FRAMEWORKS.slice(0, 8).map((f) => [f.code, `/compliance/${f.slug}`]).concat([["All frameworks", "/compliance"]])],
  ["Compliance and GRC", svcLinks("Compliance and GRC", 6, ["All services", "/services"])],
  ["Cybersecurity", svcLinks("Cybersecurity", 5, ["All cybersecurity services", "/services#cybersecurity"])],
  ["IT Infrastructure", svcLinks("IT Infrastructure", 5, ["All IT infrastructure services", "/services#it-infrastructure"])],
  ["Resources", [["Free Tools", "/tools"], ["Startup Compliance Hub", "/resources/startup-hub"], ["GCC Compliance Hub", "/resources/gcc-hub"], ["Guides and Blog", "/resources/guides"], ["Checklists", "/resources/checklists"], ["Glossary", "/resources/glossary"], ["Trust Center", "/trust-center"]]],
  ["Company", [["About DU-NZO", "/company/about"], ["Experts", "/company/experts"], ["Partners", "/company/partners"], ["Platform", "/platform"], ["Contact", "/contact"]]],
];

export default function Footer() {
  return (
    <footer className="no-print border-t border-edge">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm text-lg font-medium tracking-[-0.02em]">{BRAND.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">{BRAND.description}</p>
          <div className="mt-6 flex flex-col gap-3 text-sm">
            <a href={mailto()} className="flex items-center gap-2 text-ink/90 hover:text-aqua"><Mail size={16} className="text-aqua" />{BRAND.email}</a>
            <a href={BRAND.url} className="flex items-center gap-2 text-ink/90 hover:text-aqua"><Globe2 size={16} className="text-aqua" />{BRAND.domain}</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
          {cols.map(([h, items]) => (
            <div key={h}>
              <p className="mb-4 text-sm font-semibold">{h}</p>
              <ul className="flex flex-col gap-2.5">
                {items.map(([label, to]) => <li key={label}><Link to={to} className="focus-ring rounded text-sm text-mute transition hover:text-ink">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-x flex flex-col justify-between gap-4 border-t border-edge py-6 text-xs text-mute md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} DU-NZO. All rights reserved. ISO, SOC 2 and other marks belong to their respective owners.</span>
        <span className="flex flex-wrap gap-5">
          <Link to="/legal/privacy" className="hover:text-ink">Privacy Policy</Link>
          <Link to="/legal/terms" className="hover:text-ink">Terms of Use</Link>
          <Link to="/legal/cookies" className="hover:text-ink">Cookie Policy</Link>
          <Link to="/legal/disclaimer" className="hover:text-ink">Disclaimer</Link>
          <Link to="/trust-center" className="hover:text-ink">Trust Center</Link>
        </span>
      </div>
    </footer>
  );
}
