import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import Home from "./pages/Home.jsx";

const Solution = lazy(() => import("./pages/Solution.jsx"));
const ComplianceIndex = lazy(() => import("./pages/ComplianceIndex.jsx"));
const Framework = lazy(() => import("./pages/Framework.jsx"));
const ServicesIndex = lazy(() => import("./pages/ServicesIndex.jsx"));
const Service = lazy(() => import("./pages/Service.jsx"));
const Platform = lazy(() => import("./pages/Platform.jsx"));
const Gcc = lazy(() => import("./pages/Gcc.jsx"));
const TrustCenter = lazy(() => import("./pages/TrustCenter.jsx"));
const Launchpad = lazy(() => import("./pages/Launchpad.jsx"));
const ToolsIndex = lazy(() => import("./tools/ToolsIndex.jsx"));
const Assessment = lazy(() => import("./tools/Assessment.jsx"));
const RiskGenerator = lazy(() => import("./tools/RiskGenerator.jsx"));
const VendorRisk = lazy(() => import("./tools/VendorRisk.jsx"));
const PolicyGap = lazy(() => import("./tools/PolicyGap.jsx"));
const CostEstimator = lazy(() => import("./tools/CostEstimator.jsx"));
const Compare = lazy(() => import("./tools/Compare.jsx"));
const Hub = lazy(() => import("./pages/Hub.jsx"));
const Guides = lazy(() => import("./pages/Guides.jsx"));
const Checklists = lazy(() => import("./pages/Checklists.jsx"));
const Glossary = lazy(() => import("./pages/Glossary.jsx"));
const ResourcesIndex = lazy(() => import("./pages/ResourcesIndex.jsx"));
const Company = lazy(() => import("./pages/Company.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
const Planner = lazy(() => import("./pages/Planner.jsx"));
const PlanView = lazy(() => import("./pages/PlanView.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const PlatformApp = lazy(() => import("./platform/PlatformApp.jsx"));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const Fallback = () => <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-mute" aria-label="Loading" /></div>;

export default function App() {
  const { pathname } = useLocation();
  if (pathname === "/app" || pathname.startsWith("/app/")) {
    return (
      <Suspense fallback={<Fallback />}>
        <PlatformApp />
      </Suspense>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-void">Skip to content</a>
      <ScrollManager />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solutions/:slug" element={<Solution />} />
            <Route path="/compliance" element={<ComplianceIndex />} />
            <Route path="/compliance/:slug" element={<Framework />} />
            <Route path="/services" element={<ServicesIndex />} />
            <Route path="/services/:slug" element={<Service />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/gcc" element={<Gcc />} />
            <Route path="/trust-center" element={<TrustCenter />} />
            <Route path="/launchpad" element={<Launchpad />} />
            <Route path="/tools" element={<ToolsIndex />} />
            <Route path="/tools/risk-generator" element={<RiskGenerator />} />
            <Route path="/tools/vendor-risk" element={<VendorRisk />} />
            <Route path="/tools/policy-gap" element={<PolicyGap />} />
            <Route path="/tools/cost-estimator" element={<CostEstimator />} />
            <Route path="/tools/compare" element={<Compare />} />
            <Route path="/tools/:id" element={<Assessment />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/plan/:id" element={<PlanView />} />
            <Route path="/resources" element={<ResourcesIndex />} />
            <Route path="/resources/startup-hub" element={<Hub kind="startup" />} />
            <Route path="/resources/gcc-hub" element={<Hub kind="gcc" />} />
            <Route path="/resources/guides" element={<Guides />} />
            <Route path="/resources/guides/:slug" element={<Guides />} />
            <Route path="/resources/checklists" element={<Checklists />} />
            <Route path="/resources/checklists/:slug" element={<Checklists />} />
            <Route path="/resources/glossary" element={<Glossary />} />
            <Route path="/company/:slug" element={<Company />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal/:slug" element={<Legal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
