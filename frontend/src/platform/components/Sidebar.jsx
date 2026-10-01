import { NavLink, Link } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";
import { SECTIONS, SETTINGS_SECTION } from "../nav.js";

function NavItem({ section, collapsed, onNavigate }) {
  const Icon = section.icon;
  return (
    <NavLink
      to={section.path}
      end={section.path === "/app"}
      onClick={onNavigate}
      title={section.name}
      data-testid={`nav-${section.slug || "home"}`}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua ${
          isActive
            ? "border-p-violet/25 bg-p-violet/15 text-p-ink"
            : "border-transparent text-p-mute hover:bg-p-ink/5 hover:text-p-ink"
        } ${collapsed ? "lg:justify-center lg:px-0" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-p-violet" : "text-p-faint group-hover:text-p-mute"}`} />
          <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>{section.name}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          data-testid="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        data-testid="platform-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-p-edge/10 bg-p-surface/90 backdrop-blur-xl transition-all duration-300 lg:z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${collapsed ? "lg:w-[84px]" : "lg:w-[264px]"}`}
      >
        <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-p-edge/10 px-5 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <Link to="/app" data-testid="platform-logo" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ background: "var(--p-grad)" }}>
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className={`leading-tight ${collapsed ? "lg:hidden" : ""}`}>
              <span className="block text-[15px] font-semibold tracking-tight">DU-NZO</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">Platform</span>
            </span>
          </Link>
          <button onClick={onClose} data-testid="sidebar-close" aria-label="Close menu" className="p-icon-btn ml-auto lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Platform sections" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {SECTIONS.map((s) => (
            <NavItem key={s.path} section={s} collapsed={collapsed} onNavigate={onClose} />
          ))}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-p-edge/10 px-3 py-3">
          <NavItem section={SETTINGS_SECTION} collapsed={collapsed} onNavigate={onClose} />
          <p className={`px-3 pt-2 text-[11px] text-p-faint ${collapsed ? "lg:hidden" : ""}`}>v0.1 · Command 1 shell</p>
        </div>
      </aside>
    </>
  );
}
