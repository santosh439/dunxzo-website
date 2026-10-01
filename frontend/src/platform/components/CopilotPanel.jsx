import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Send, Loader2, User } from "lucide-react";
import { getToken } from "../lib/api.js";

const API = "";

const SUGGESTIONS = [
  "What should I fix before the ISO 27001 audit?",
  "Draft an incident response policy outline",
  "Explain control CC6.6 in plain English",
  "Which of my risks are untreated?",
];

function sessionId() {
  try {
    let s = localStorage.getItem("dunzo.copilot.session");
    if (!s) { s = `cp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; localStorage.setItem("dunzo.copilot.session", s); }
    return s;
  } catch { return `cp-${Date.now()}`; }
}

export default function CopilotPanel({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef(null);
  const sidRef = useRef(sessionId());

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/copilot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ session_id: sidRef.current, message: q }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const payload = JSON.parse(line.slice(5).trim());
          if (payload.delta) {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + payload.delta };
              return copy;
            });
          } else if (payload.error) {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: payload.error };
              return copy;
            });
          }
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Copilot is unavailable right now. Please try again." };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close Copilot"
            data-testid="copilot-backdrop"
            onClick={onClose}
            className="fixed inset-0 z-50 cursor-default bg-black/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-label="DU-NZO Copilot"
            data-testid="copilot-panel"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-p-edge/10 bg-p-surface shadow-p-pop"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between gap-3 border-b border-p-edge/10 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: "var(--p-grad)" }}>
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold tracking-tight">DU-NZO Copilot</h2>
                  <p className="text-xs text-p-faint">Claude Sonnet 5 · compliance assistant</p>
                </div>
              </div>
              <button onClick={onClose} data-testid="copilot-close" aria-label="Close" className="p-icon-btn h-9 w-9">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" data-testid="copilot-messages">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-p-edge/10 bg-p-ink/[0.03] p-4">
                    <p className="text-sm leading-relaxed text-p-mute">
                      Hi — I'm your compliance Copilot. Ask me about your controls, risks, policies or audit prep.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-p-faint">Try asking</p>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        data-testid="copilot-suggestion"
                        className="block w-full rounded-xl border border-p-edge/10 bg-p-ink/[0.03] px-3.5 py-2.5 text-left text-sm text-p-ink/90 transition hover:border-p-violet/40 hover:bg-p-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`} data-testid={`copilot-msg-${m.role}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${m.role === "user" ? "bg-p-ink/20" : ""}`} style={m.role === "assistant" ? { background: "var(--p-grad)" } : {}}>
                    {m.role === "user" ? <User className="h-3.5 w-3.5 text-p-ink" /> : <Sparkles className="h-3.5 w-3.5" />}
                  </span>
                  <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-p-violet/15 text-p-ink" : "border border-p-edge/10 bg-p-ink/[0.03] text-p-ink/90"
                  }`}>
                    {m.content || (streaming && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin text-p-faint" /> : "")}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="border-t border-p-edge/10 p-4"
            >
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  data-testid="copilot-input"
                  rows={1}
                  placeholder="Ask about controls, risks, policies…"
                  className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-p-edge/10 bg-p-ink/5 px-3.5 py-2.5 text-sm text-p-ink transition placeholder:text-p-faint focus:border-p-violet/50 focus:outline-none focus:ring-2 focus:ring-p-violet/25"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  data-testid="copilot-send"
                  aria-label="Send"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-aqua"
                  style={{ background: "var(--p-grad)" }}
                >
                  {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
