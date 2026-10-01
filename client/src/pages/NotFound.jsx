import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Aurora } from "../components/ui.jsx";
import { useSeo } from "../lib/seo.js";

export default function NotFound() {
  useSeo("Page not found");
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <Aurora />
      <div className="container-x relative text-center">
        <p className="text-gradient text-8xl font-semibold tracking-[-0.06em]">404</p>
        <h1 className="mt-4 text-3xl font-semibold">This page is not in scope.</h1>
        <p className="mt-3 text-mute">The page you are looking for does not exist on DU-NZO.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/" className="btn-glow">Back to home</Link><Link to="/launchpad" className="btn-ghost">Get Your Compliance Roadmap<ArrowRight size={17} /></Link></div>
      </div>
    </section>
  );
}
