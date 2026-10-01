import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, FileText, Globe2, ShieldCheck, Mail, Check, KeyRound, Server, Eye, Loader2 } from "lucide-react";
import { PageHero, Reveal, SectionHead, CtaBand } from "../components/ui.jsx";
import { BRAND, mailto } from "../content/site.js";
import { api } from "../lib/api.js";
import { useSeo } from "../lib/seo.js";

const PRACTICES = [
  [KeyRound, "Access control", "Single sign on and MFA on business systems, with least privilege access. [Confirm DU-NZO's current controls before publishing.]"],
  [Lock, "Encryption", "Data encrypted in transit with TLS and at rest by our hosting providers. [Confirm.]"],
  [Server, "Hosting", "[Name DU-NZO's hosting provider and region.]"],
  [Eye, "Monitoring", "[Describe logging, alerting and review practices.]"],
  [ShieldCheck, "Vulnerability management", "[Describe scanning, patching timelines and penetration testing cadence.]"],
  [FileText, "Policies", "[List published policies such as information security, privacy and acceptable use.]"],
];
const DOCS = ["Information security overview", "Privacy Policy", "Subprocessor list", "[Certificate or report, once achieved]"];

export default function TrustCenter() {
  useSeo("Trust Center", "How DU-NZO protects your data: security practices, privacy, subprocessors and document access.");
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [state, setState] = useState("idle");
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !/^\S+@\S+\.\S+$/.test(form.email)) return setState("error");
    setState("sending");
    try { await api.sendLead({ ...form, source: "trust-center", message: "Trust Center document request" }); setState("sent"); } catch { setState("error"); }
  };
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Trust Center"]]} kicker={<><ShieldCheck size={15} className="text-aqua" />DU-NZO Trust Center</>} title="How DU-NZO protects your data." body="Transparency is part of compliance without the complexity. This page summarises our security and privacy practices and how to request documents." />
      <section className="container-x py-20 md:py-28">
        <div className="mb-8 rounded-2xl border border-amber/40 bg-amber/10 p-5 text-sm text-amber">Template content. Replace every bracketed item with DU-NZO's verified practices before publishing. Do not list certifications DU-NZO has not achieved.</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICES.map(([I, t, b], i) => (
            <Reveal key={t} delay={i * 0.04}><div className="glass h-full rounded-3xl p-6"><I size={20} className="text-aqua" /><h2 className="mt-4 text-lg font-semibold">{t}</h2><p className="mt-2 text-sm leading-relaxed text-mute">{b}</p></div></Reveal>
          ))}
        </div>
      </section>
      <section className="border-y border-edge bg-night py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead kicker="Documents" title="Request security documentation." body="Some documents are shared under NDA. Request access and the DU-NZO team will respond." />
            <ul className="mt-8 space-y-2">{DOCS.map((d) => <li key={d} className="glass flex items-center justify-between rounded-2xl px-5 py-4"><span className="flex items-center gap-3"><FileText size={17} className="text-violet-soft" />{d}</span><span className="text-xs text-mute">On request</span></li>)}</ul>
            <p className="mt-6 text-sm text-mute">Security contact: <a href={mailto("Security enquiry")} className="text-aqua hover:underline">{BRAND.email}</a></p>
          </div>
          <div className="glass rounded-3xl p-6 md:p-8">
            {state === "sent" ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua text-void"><Check size={26} strokeWidth={3} /></span><p className="text-2xl font-semibold">Request received</p><p className="text-mute">DU-NZO will reply to {form.email}.</p></div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">Request access</h3>
                <div><label htmlFor="t-n" className="label">Full name</label><input id="t-n" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></div>
                <div><label htmlFor="t-e" className="label">Work email</label><input id="t-e" type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></div>
                <div><label htmlFor="t-c" className="label">Company</label><input id="t-c" className="field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} autoComplete="organization" /></div>
                {state === "error" && <p role="alert" className="text-sm text-rose">Enter your name and a valid work email.</p>}
                <button className="btn-glow" disabled={state === "sending"}>{state === "sending" ? <Loader2 size={17} className="animate-spin" /> : "Request documents"}</button>
              </form>
            )}
          </div>
        </div>
      </section>
      <section className="container-x py-20 md:py-28">
        <div className="glass flex flex-col justify-between gap-6 rounded-3xl p-8 md:flex-row md:items-center md:p-10">
          <div><Globe2 className="text-aqua" /><h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Want a Trust Center like this for your company?</h2><p className="mt-2 max-w-xl text-mute">DU-NZO builds and maintains Trust Centers that shorten security reviews and answer buyer questions upfront.</p></div>
          <a href={mailto("Trust Center for my company")} className="btn-glow shrink-0"><Mail size={17} />Talk to an Expert</a>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
