import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Users, TrendingUp } from "lucide-react";
import { GCC_ENTITIES, GCC_DOMAINS } from "../data/assurance.js";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function scoreColor(s) {
  if (s >= 80) return "text-p-success";
  if (s >= 65) return "text-p-warning";
  return "text-p-danger";
}
function scoreBg(s) {
  if (s >= 80) return "bg-p-success";
  if (s >= 65) return "bg-p-warning";
  return "bg-p-danger";
}

export default function GccPage() {
  const [entity, setEntity] = useState("all");

  useEffect(() => {
    document.title = "GCC command center · DU-NZO Platform";
  }, []);

  // vary domain scores slightly per entity for realism
  const offset = useMemo(() => {
    if (entity === "all") return 0;
    const e = GCC_ENTITIES.find((x) => x.id === entity);
    return Math.round((e.maturity - 74) * 0.6);
  }, [entity]);

  const domains = useMemo(
    () => GCC_DOMAINS.map((d) => ({ ...d, score: Math.max(20, Math.min(99, d.score + offset)) })),
    [offset]
  );

  const avg = Math.round(domains.reduce((a, d) => a + d.score, 0) / domains.length);
  const totalHeadcount = GCC_ENTITIES.reduce((a, e) => a + e.headcount, 0);
  const weakest = [...domains].sort((a, b) => a.score - b.score)[0];

  return (
    <motion.div data-testid="platform-page-gcc" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="space-y-6">
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">GCC command center</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-p-mute">Multi-entity oversight across the 15 governance domains for your global capability centers.</p>
        </div>
        <span className="p-chip"><Globe2 className="h-3.5 w-3.5 text-p-aqua" />{GCC_ENTITIES.length} entities · {totalHeadcount} people</span>
      </motion.header>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div data-testid="gcc-stat-maturity" className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-violet"><TrendingUp className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{avg}%</span><span className="block text-xs text-p-faint">Avg maturity</span></span>
        </div>
        <div className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-info"><Globe2 className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">15</span><span className="block text-xs text-p-faint">Domains tracked</span></span>
        </div>
        <div className="p-panel flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 text-p-success"><Users className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-semibold tracking-tight">{totalHeadcount}</span><span className="block text-xs text-p-faint">Headcount</span></span>
        </div>
        <div className="p-panel flex items-center gap-3 p-4">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-p-edge/10 bg-p-ink/5 ${scoreColor(weakest.score)}`}><TrendingUp className="h-5 w-5 rotate-180" /></span>
          <span><span className="block text-sm font-semibold leading-tight tracking-tight">{weakest.name}</span><span className="block text-xs text-p-faint">Weakest · {weakest.score}%</span></span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2" data-testid="gcc-entity-switcher">
        <button onClick={() => setEntity("all")} data-testid="gcc-entity-all" className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${entity === "all" ? "border-p-violet/40 bg-p-violet/15 text-p-ink" : "border-p-edge/10 bg-p-ink/5 text-p-mute hover:text-p-ink"}`}>All entities</button>
        {GCC_ENTITIES.map((e) => (
          <button key={e.id} onClick={() => setEntity(e.id)} data-testid={`gcc-entity-${e.id}`} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${entity === e.id ? "border-p-violet/40 bg-p-violet/15 text-p-ink" : "border-p-edge/10 bg-p-ink/5 text-p-mute hover:text-p-ink"}`}>
            {e.name.split(" — ")[1]} <span className="text-p-faint">{e.region}</span>
          </button>
        ))}
      </motion.div>

      <motion.section variants={fadeUp} className="p-panel p-6" data-testid="gcc-domains">
        <h2 className="text-lg font-semibold tracking-tight">15-domain maturity</h2>
        <p className="mt-0.5 text-sm text-p-mute">{entity === "all" ? "Aggregated across all entities" : GCC_ENTITIES.find((e) => e.id === entity).name}</p>
        <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
          {domains.map((d, i) => (
            <div key={d.id} data-testid={`gcc-domain-${d.id}`}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 text-sm text-p-ink">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-p-edge/10 bg-p-ink/5 text-[10px] font-semibold text-p-faint">{d.id}</span>
                  <span className="truncate">{d.name}</span>
                </span>
                <span className={`text-sm font-semibold ${scoreColor(d.score)}`}>{d.score}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-p-ink/10">
                <motion.div className={`h-full rounded-full ${scoreBg(d.score)}`} initial={{ width: 0 }} animate={{ width: `${d.score}%` }} transition={{ duration: 0.9, delay: 0.1 + i * 0.03, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
