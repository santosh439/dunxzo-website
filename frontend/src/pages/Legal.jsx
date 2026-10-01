import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Printer, ListTree, ChevronDown } from "lucide-react";
import { PageHero } from "../components/ui.jsx";
import NotFound from "./NotFound.jsx";
import { LEGAL_DOCS, LEGAL_REVIEW_NOTICE } from "../content/legal.js";
import { useSeo } from "../lib/seo.js";

/* Render plain text with inline tokens:
 *   [placeholder]           -> highlighted amber value DU-NZO must confirm
 *   [[Label|/path]]         -> internal link
 *   [[Label|https://...]]   -> external link
 *   [[Label|mailto:...]]    -> email link
 */
const TOKEN = /(\[\[[^\]|]+\|[^\]]+\]\]|\[[^\]]+\])/g;
function renderRich(text) {
  return String(text).split(TOKEN).map((part, i) => {
    const link = part.match(/^\[\[([^\]|]+)\|([^\]]+)\]\]$/);
    if (link) {
      const [, label, to] = link;
      if (to.startsWith("mailto:")) return <a key={i} href={to} className="font-medium text-aqua hover:underline">{label}</a>;
      if (to.startsWith("http")) return <a key={i} href={to} target="_blank" rel="noopener noreferrer" className="font-medium text-aqua hover:underline">{label}</a>;
      return <Link key={i} to={to} className="font-medium text-aqua hover:underline">{label}</Link>;
    }
    const ph = part.match(/^\[([^\]]+)\]$/);
    if (ph) return <mark key={i} className="rounded bg-amber/15 px-1 py-0.5 font-medium text-amber">[{ph[1]}]</mark>;
    return <span key={i}>{part}</span>;
  });
}

function Block({ b }) {
  if (b.p) return <p className="leading-[1.8] text-ink/85">{renderRich(b.p)}</p>;
  if (b.ul) return <ul className="list-disc space-y-2 pl-6 leading-[1.75] text-ink/85 marker:text-aqua">{b.ul.map((it, i) => <li key={i}>{renderRich(it)}</li>)}</ul>;
  if (b.ol) return <ol className="list-decimal space-y-2 pl-6 leading-[1.75] text-ink/85 marker:text-mute">{b.ol.map((it, i) => <li key={i}>{renderRich(it)}</li>)}</ol>;
  if (b.note) return <p className="rounded-xl border border-edge bg-white/[0.03] p-4 text-sm text-mute">{renderRich(b.note)}</p>;
  if (b.table) return (
    <div className="overflow-x-auto rounded-2xl border border-edge">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead><tr className="border-b border-edge bg-white/[0.03]">{b.table.head.map((h) => <th key={h} scope="col" className="p-3.5 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{b.table.rows.map((r, i) => <tr key={i} className="border-b border-white/[0.05] last:border-0">{r.map((c, j) => <td key={j} className="p-3.5 align-top leading-relaxed text-ink/85">{renderRich(c)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
  return null;
}

function Toc({ sections, label }) {
  return (
    <nav aria-label={label} className="flex flex-col gap-1">
      {sections.map((s) => <a key={s.id} href={`#${s.id}`} className="focus-ring rounded-lg px-3 py-2 text-sm text-mute transition hover:bg-white/[0.05] hover:text-ink">{s.h}</a>)}
    </nav>
  );
}

export default function Legal() {
  const { slug } = useParams();
  const d = LEGAL_DOCS[slug];
  useSeo(d ? d.title : "Not found", d ? d.seo : undefined);
  const [tocOpen, setTocOpen] = useState(false);
  if (!d) return <NotFound />;
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Legal"], [d.title]]} kicker="Legal" title={d.title} body={d.seo}>
        <div className="flex flex-wrap items-center gap-3 text-sm text-mute">
          <span className="rounded-full border border-edge bg-white/[0.04] px-3 py-1">Version {d.version}</span>
          <span className="rounded-full border border-edge bg-white/[0.04] px-3 py-1">Last updated: {renderRich(d.updated)}</span>
          <button type="button" onClick={() => window.print()} className="btn-ghost no-print !min-h-[40px] !px-4 text-sm"><Printer size={15} />Print</button>
        </div>
      </PageHero>
      <article className="container-x py-12 md:py-16">
        {LEGAL_REVIEW_NOTICE && (
          <p className="no-print mb-8 rounded-2xl border border-amber/40 bg-amber/10 p-4 text-sm text-amber">Template prepared for legal review. Confirm with qualified counsel before relying on it.</p>
        )}
        <div className="no-print mb-8 lg:hidden">
          <button type="button" onClick={() => setTocOpen((v) => !v)} aria-expanded={tocOpen} className="focus-ring flex w-full items-center justify-between rounded-2xl border border-edge bg-white/[0.03] px-4 py-3 text-sm font-semibold">
            <span className="flex items-center gap-2"><ListTree size={16} className="text-aqua" />On this page</span>
            <ChevronDown size={16} className={`transition ${tocOpen ? "rotate-180" : ""}`} />
          </button>
          {tocOpen && <div className="glass mt-2 rounded-2xl p-3"><Toc sections={d.sections} label={`${d.title} contents`} /></div>}
        </div>
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="no-print hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-mute">On this page</p>
              <Toc sections={d.sections} label={`${d.title} contents`} />
            </div>
          </aside>
          <div className="max-w-3xl space-y-10 lg:col-span-9">
            {d.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]"><a href={`#${s.id}`} className="transition hover:text-aqua">{s.h}</a></h2>
                <div className="mt-4 space-y-4">{s.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
