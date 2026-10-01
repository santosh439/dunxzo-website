import { useState } from "react";
import { Mail, Globe2, Check, Loader2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui.jsx";
import { BRAND, mailto } from "../content/site.js";
import { api } from "../lib/api.js";
import { useSeo } from "../lib/seo.js";

const TOPICS = ["Compliance roadmap", "ISO certification", "SOC 2", "Privacy (GDPR, DPDPA)", "AI governance", "GCC Command Center", "vCISO", "Platform demo", "Partnership", "Other"];

export default function Contact() {
  useSeo("Contact DU-NZO", `Talk to a DU-NZO expert. Email ${BRAND.email}.`);
  const [f, setF] = useState({ name: "", email: "", company: "", topic: TOPICS[0], message: "" });
  const [state, setState] = useState("idle");
  const [err, setErr] = useState({});
  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Enter a valid email";
    setErr(x);
    if (Object.keys(x).length) return;
    setState("sending");
    try { await api.sendLead({ ...f, source: "contact", message: `[${f.topic}] ${f.message}` }); setState("sent"); } catch { setState("error"); }
  };
  return (
    <>
      <PageHero crumbs={[["Home", "/"], ["Contact"]]} kicker="Contact" title="Talk to a DU-NZO expert." body="Tell us where you are and where you need to be. We reply with practical next steps." />
      <section className="container-x grid gap-6 py-16 md:py-24 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <a href={mailto()} className="glass focus-ring flex items-center gap-4 rounded-3xl p-6 hover:border-white/20"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet to-aqua text-void"><Mail size={20} /></span><span><span className="block text-sm text-mute">Email</span><span className="text-lg font-semibold">{BRAND.email}</span></span></a>
          <a href={BRAND.url} className="glass focus-ring flex items-center gap-4 rounded-3xl p-6 hover:border-white/20"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-aqua"><Globe2 size={20} /></span><span><span className="block text-sm text-mute">Website</span><span className="text-lg font-semibold">{BRAND.domain}</span></span></a>
          <Link to="/launchpad" className="glass focus-ring flex items-center gap-4 rounded-3xl p-6 hover:border-white/20"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-aqua"><Rocket size={20} /></span><span><span className="block text-sm text-mute">Prefer to start yourself?</span><span className="text-lg font-semibold">Get Your Compliance Roadmap</span></span></Link>
        </div>
        <div className="glass rounded-3xl p-6 md:p-8 lg:col-span-7">
          {state === "sent" ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua text-void"><Check size={30} strokeWidth={3} /></span><h2 className="text-3xl font-semibold">Thank you, {f.name.split(" ")[0]}.</h2><p className="text-mute">DU-NZO will reply to {f.email}.</p></div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="c-n" className="label">Full name</label><input id="c-n" className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" aria-invalid={!!err.name} aria-describedby={err.name ? "c-n-e" : undefined} />{err.name && <p id="c-n-e" className="mt-1.5 text-sm text-rose">{err.name}</p>}</div>
              <div><label htmlFor="c-e" className="label">Work email</label><input id="c-e" type="email" className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" aria-invalid={!!err.email} aria-describedby={err.email ? "c-e-e" : undefined} />{err.email && <p id="c-e-e" className="mt-1.5 text-sm text-rose">{err.email}</p>}</div>
              <div><label htmlFor="c-c" className="label">Company</label><input id="c-c" className="field" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} autoComplete="organization" /></div>
              <div><label htmlFor="c-t" className="label">Topic</label><select id="c-t" className="field" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>{TOPICS.map((t) => <option key={t} className="bg-night">{t}</option>)}</select></div>
              <div className="sm:col-span-2"><label htmlFor="c-m" className="label">How can DU-NZO help?</label><textarea id="c-m" rows={5} className="field !h-auto py-3" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
              {state === "error" && <p role="alert" className="text-sm text-rose sm:col-span-2">Something went wrong. Email {BRAND.email} directly.</p>}
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-mute">By submitting you agree to the DU-NZO <Link to="/legal/privacy" className="underline">Privacy Policy</Link>.</p><button className="btn-glow" disabled={state === "sending"}>{state === "sending" ? <Loader2 size={17} className="animate-spin" /> : "Send message"}</button></div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
