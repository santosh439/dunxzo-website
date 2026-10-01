import { useParams } from "react-router-dom";
import { PageHero } from "../components/ui.jsx";
import NotFound from "./NotFound.jsx";
import { BRAND } from "../content/site.js";
import { useSeo } from "../lib/seo.js";

const DOCS = {
  privacy: ["Privacy Policy", ["Who we are", `DU-NZO (${BRAND.domain}) is the controller of personal data collected through this website. Contact: ${BRAND.email}. [Add registered legal entity name and address.]`], ["What we collect", "Contact form details, assessment and roadmap answers you choose to send, and technical data such as browser type. [Confirm analytics tools used.]"], ["Why we use it", "To respond to enquiries, deliver requested services and improve the website. [State lawful bases for GDPR and purposes for DPDPA notices.]"], ["Sharing", "[List processors such as hosting and email providers, and international transfer safeguards.]"], ["Retention", "[State retention periods.]"], ["Your rights", `You can request access, correction or deletion by writing to ${BRAND.email}. [Add grievance officer details as required under DPDPA and complaint routes.]`]],
  terms: ["Terms of Use", ["Use of the website", "[Add acceptable use terms.]"], ["Free tools", "Assessments, estimates and roadmaps are indicative guidance, not legal advice, audit opinions or certification decisions."], ["Intellectual property", "[Add ownership and licence terms for content and templates.]"], ["Liability", "[Add limitation of liability.]"], ["Governing law", "[Add governing law and jurisdiction.]"]],
  cookies: ["Cookie Policy", ["What we use", "This site uses browser storage to remember your planner and assessment progress. [List any analytics or marketing cookies and providers.]"], ["Your choices", "[Describe consent banner and how to change preferences.]"]],
  disclaimer: ["Disclaimer", ["No certification", "DU-NZO provides advisory, implementation and readiness services. Certificates are issued only by accredited certification bodies and SOC 2 reports only by licensed CPA firms."], ["Not legal advice", "Information about laws such as GDPR, DPDPA and HIPAA is general guidance. Obtain legal advice for your specific situation."], ["Trademarks", "ISO, SOC 2, NIST, CIS, PCI DSS and other marks belong to their respective owners."]],
};

export default function Legal() {
  const { slug } = useParams();
  const d = DOCS[slug];
  useSeo(d?.[0] || "Not found");
  if (!d) return <NotFound />;
  const [title, ...sections] = d;
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Legal"], [title]]} kicker="Legal" title={title} body="DU-NZO template. Review with qualified legal counsel before publishing." />
      <article className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-10">
          <p className="rounded-2xl border border-amber/40 bg-amber/10 p-5 text-sm text-amber">Placeholder text. Bracketed items must be completed and the full document reviewed by a lawyer. Last updated: [date].</p>
          {sections.map(([h, p]) => <section key={h}><h2 className="text-2xl font-semibold tracking-[-0.03em]">{h}</h2><p className="mt-3 leading-[1.75] text-ink/85">{p}</p></section>)}
        </div>
      </article>
    </>
  );
}
