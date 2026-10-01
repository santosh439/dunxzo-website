import { useEffect, useRef, useState } from "react";
import { Search, Bell, Sun, Moon, Menu, PanelLeftClose, PanelLeftOpen, ChevronDown, Sparkles, LogOut } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function Topbar({ theme, onToggleTheme, collapsed, onToggleCollapse, onOpenMobile, onOpenMenu, onOpenCopilot, onLogout, userName }) {
  const searchRef = useRef(null);
  const [userMenu, setUserMenu] = useState(false);
  const { data } = useWorkspace();
  const company = data?.profile?.company || "Workspace";
  const initials = (userName || "DU").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header data-testid="platform-topbar" className="sticky top-0 z-30 border-b border-p-edge/10 bg-p-bg/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-4 md:gap-3 md:px-6">
        <button onClick={onOpenMobile} data-testid="mobile-menu-button" aria-label="Open menu" className="p-icon-btn lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={onToggleCollapse}
          data-testid="sidebar-collapse-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-icon-btn hidden lg:inline-flex"
        >
          {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
        </button>

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-p-faint" />
          <button
            type="button"
            onClick={onOpenMenu}
            data-testid="global-search"
            className="flex h-10 w-full items-center rounded-full border border-p-edge/10 bg-p-ink/5 pl-10 pr-14 text-left text-sm text-p-faint transition hover:bg-p-ink/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-violet/25"
          >
            Search or jump to…
          </button>
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-p-edge/15 bg-p-ink/5 px-1.5 py-0.5 text-[11px] font-medium text-p-faint sm:block">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            onClick={onOpenCopilot}
            data-testid="copilot-open-button"
            className="inline-flex items-center gap-2 rounded-full border border-p-violet/30 bg-p-violet/10 py-2 pl-3 pr-3.5 text-sm font-semibold text-p-violet transition hover:bg-p-violet/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Copilot</span>
          </button>
          <button
            data-testid="org-switcher"
            className="hidden items-center gap-2 rounded-full border border-p-edge/10 bg-p-ink/5 py-2 pl-3.5 pr-2.5 text-sm font-medium text-p-mute transition hover:text-p-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua md:flex"
          >
            <span className="h-2 w-2 rounded-full bg-p-aqua" />
            {company}
            <ChevronDown className="h-3.5 w-3.5 text-p-faint" />
          </button>
          <button
            onClick={onToggleTheme}
            data-testid="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="p-icon-btn"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button data-testid="notifications-button" aria-label="Notifications" className="p-icon-btn relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-p-warning" />
          </button>
          <div className="relative">
            <button
              onClick={() => setUserMenu((v) => !v)}
              data-testid="user-menu-button"
              aria-label="Account"
              className="ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
              style={{ background: "var(--p-grad)" }}
            >
              {initials}
            </button>
            {userMenu && (
              <>
                <button className="fixed inset-0 z-40 cursor-default" aria-hidden onClick={() => setUserMenu(false)} />
                <div data-testid="user-menu" className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-p-edge/10 bg-p-surface p-1.5 shadow-p-pop">
                  <button
                    onClick={() => { setUserMenu(false); onLogout?.(); }}
                    data-testid="logout-button"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-p-mute transition hover:bg-p-ink/5 hover:text-p-ink"
                  >
                    <LogOut className="h-4 w-4" />Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
