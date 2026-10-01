import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, CornerDownLeft } from "lucide-react";
import { SECTIONS, SETTINGS_SECTION } from "../nav.js";

export default function CommandMenu({ open, onClose, onOpenCopilot }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const items = useMemo(() => {
    const nav = [...SECTIONS, SETTINGS_SECTION].map((s) => ({
      type: "nav", id: s.slug || "home", label: `Go to ${s.name}`, icon: s.icon, action: () => navigate(s.path),
    }));
    const copilot = { type: "action", id: "copilot", label: "Ask the Copilot", icon: Sparkles, action: () => onOpenCopilot() };
    return [copilot, ...nav];
  }, [navigate, onOpenCopilot]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    if (open) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 40); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); run(filtered[active]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose]);

  const run = (item) => {
    if (!item) return;
    onClose();
    item.action();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
          <motion.button
            aria-label="Close command menu"
            data-testid="command-menu-backdrop"
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-label="Command menu"
            data-testid="command-menu"
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-p-edge/10 bg-p-surface shadow-p-pop"
            initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-3 border-b border-p-edge/10 px-4">
              <Search className="h-4 w-4 shrink-0 text-p-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="command-menu-input"
                placeholder="Jump to a section or ask the Copilot…"
                className="h-14 w-full bg-transparent text-[15px] text-p-ink placeholder:text-p-faint focus:outline-none"
              />
            </div>
            <ul className="max-h-[52vh] overflow-y-auto p-2" data-testid="command-menu-list">
              {filtered.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => run(item)}
                      data-testid={`command-item-${item.id}`}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        active === i ? "bg-p-violet/15 text-p-ink" : "text-p-mute"
                      }`}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-p-edge/10 ${item.id === "copilot" ? "text-p-violet" : "text-p-faint"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {active === i && <CornerDownLeft className="h-3.5 w-3.5 text-p-faint" />}
                    </button>
                  </li>
                );
              })}
              {!filtered.length && (
                <li className="px-3 py-6 text-center text-sm text-p-faint" data-testid="command-menu-empty">No matches</li>
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
