import { Link } from "react-router-dom";
import { Aurora } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";

export default function ToolShell({ icon = "Wrench", kicker, title, body, children }) {
  return (
    <>
      <section className="noise relative overflow-hidden border-b border-edge">
        <Aurora className="opacity-70" />
        <div className="container-x relative pb-12 pt-10 md:pb-16 md:pt-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex gap-2 text-sm text-mute"><Link to="/" className="hover:text-ink">Home</Link><span className="text-white/20">/</span><Link to="/tools" className="hover:text-ink">Free Tools</Link></nav>
          <span className="kicker"><Icon name={icon} size={14} className="text-aqua" />{kicker || "DU-NZO free tool"}</span>
          <h1 className="h-display mt-5 max-w-4xl text-4xl md:text-6xl">{title}</h1>
          {body && <p className="mt-5 max-w-2xl text-lg text-mute">{body}</p>}
        </div>
      </section>
      <div className="container-x py-10 md:py-14">{children}</div>
    </>
  );
}
