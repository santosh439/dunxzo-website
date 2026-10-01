import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import TrustPulse from "../components/home/TrustPulse.jsx";
import PostureSnapshot from "../components/home/PostureSnapshot.jsx";
import NextActions from "../components/home/NextActions.jsx";
import SideColumn from "../components/home/SideColumn.jsx";
import { PULSE, FRAMEWORKS, ACTIONS, UPCOMING, ACTIVITY } from "../data/home.js";
import { subscribe, getExtraActions } from "../store.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const FRAMEWORK_META = {
  "ISO/IEC 27001": { total: 114, meta: "Certification audit in 23 days" },
  "SOC 2": { total: 105, meta: "Observation window ends Nov 30" },
  "DPDPA": { total: 54, meta: "Grievance workflow not yet published" },
  "ISO/IEC 42001": { total: 55, meta: "Kickoff scheduled for next week" },
};

function buildPulse(ws) {
  const p = ws.pulse;
  const controls = ws.controls || [];
  const pct = (status, weight) => controls.length ? Math.round((controls.filter((c) => c.status === status).length / controls.length) * 100) : 0;
  return {
    score: p.score,
    delta: 4,
    period: "this week",
    pillars: [
      { id: "controls", label: "Controls health", value: controls.length ? Math.round((p.operational / controls.length) * 100) : 0 },
      { id: "evidence", label: "Evidence freshness", value: 74 },
      { id: "risk", label: "Risk coverage", value: 81 },
      { id: "vendors", label: "Vendor assurance", value: 68 },
    ],
    changes: PULSE.changes,
  };
}

function buildFrameworks(ws) {
  const chosen = ws.profile?.frameworks || [];
  const controls = ws.controls || [];
  return chosen.map((name) => {
    const inFw = controls.filter((c) => c.frameworks.includes(name));
    const done = inFw.filter((c) => c.status === "operational").length;
    const progress = inFw.length ? done / inFw.length : 0;
    const status = progress >= 0.75 ? "on-track" : progress >= 0.5 ? "attention" : "early";
    const total = FRAMEWORK_META[name]?.total || inFw.length;
    return {
      id: name.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
      name,
      status,
      progress,
      controls: `${done} of ${inFw.length} controls`,
      meta: FRAMEWORK_META[name]?.meta || `${total} total controls in scope`,
    };
  });
}

export default function HomePage() {
  const extraActions = useSyncExternalStore(subscribe, getExtraActions);
  const { data } = useWorkspace();
  const actions = [...extraActions, ...ACTIONS];

  useEffect(() => {
    document.title = "Home · DU-NZO Platform";
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const company = data?.profile?.company;
  const pulse = data ? buildPulse(data) : PULSE;
  const frameworks = data ? buildFrameworks(data) : FRAMEWORKS;

  return (
    <motion.div
      data-testid="platform-page-home"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-6"
    >
      <motion.header variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{greeting}{company ? `, ${company}` : ", Demo team"}</h1>
          <p className="mt-2 text-[15px] text-p-mute">Here's your compliance posture at a glance — {today}.</p>
        </div>
        <span className="p-chip">
          <span className="h-1.5 w-1.5 rounded-full bg-p-aqua" />
          {frameworks.length} framework{frameworks.length === 1 ? "" : "s"} active
        </span>
      </motion.header>

      <motion.div variants={fadeUp}>
        <TrustPulse pulse={pulse} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <PostureSnapshot frameworks={frameworks} />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <NextActions actions={actions} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <SideColumn upcoming={UPCOMING} activity={ACTIVITY} />
        </motion.div>
      </div>
    </motion.div>
  );
}
