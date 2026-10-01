import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import SectionPage from "./components/SectionPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ControlsPage from "./pages/ControlsPage.jsx";
import MonitoringPage from "./pages/MonitoringPage.jsx";
import EvidencePage from "./pages/EvidencePage.jsx";
import PoliciesPage from "./pages/PoliciesPage.jsx";
import RiskPage from "./pages/RiskPage.jsx";
import VendorsPage from "./pages/VendorsPage.jsx";
import AuditPage from "./pages/AuditPage.jsx";
import GccPage from "./pages/GccPage.jsx";
import TrustCenterPage from "./pages/TrustCenterPage.jsx";
import { SECTIONS, SETTINGS_SECTION } from "./nav.js";

const THEME_KEY = "dunzo.platform.theme";

export default function PlatformApp() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; }
  });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* private mode */ }
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="dz-app min-h-screen bg-p-bg font-sans text-p-ink antialiased" data-theme={theme} data-testid="platform-app">
      <a href="#p-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-p-ink focus:px-4 focus:py-2 focus:text-p-bg">
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className={`flex min-h-screen flex-col transition-[padding-left] duration-300 ${collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]"}`}>
        <Topbar
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main id="p-main" className="flex-1">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8 md:py-10">
            <Routes>
              <Route path="/app" element={<HomePage />} />
              <Route path="/app/controls" element={<ControlsPage />} />
              <Route path="/app/monitoring" element={<MonitoringPage />} />
              <Route path="/app/evidence" element={<EvidencePage />} />
              <Route path="/app/policies" element={<PoliciesPage />} />
              <Route path="/app/risk" element={<RiskPage />} />
              <Route path="/app/vendors" element={<VendorsPage />} />
              <Route path="/app/audit" element={<AuditPage />} />
              <Route path="/app/gcc" element={<GccPage />} />
              <Route path="/app/trust-center" element={<TrustCenterPage />} />
              <Route path={SETTINGS_SECTION.path} element={<SectionPage section={SETTINGS_SECTION} />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </div>
        </main>
        <footer data-testid="platform-footer" className="border-t border-p-edge/10">
          <div className="mx-auto flex h-11 w-full max-w-[1200px] items-center justify-between px-5 text-xs text-p-faint md:px-8">
            <span>DU-NZO Platform · Preview v0.1</span>
            <span className="hidden sm:inline">Environment: Demo · Sample data</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
