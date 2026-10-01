import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import TrustPulse from "../components/home/TrustPulse.jsx";
import PostureSnapshot from "../components/home/PostureSnapshot.jsx";
import NextActions from "../components/home/NextActions.jsx";
import SideColumn from "../components/home/SideColumn.jsx";
import { PULSE, FRAMEWORKS, ACTIONS, UPCOMING, ACTIVITY } from "../data/home.js";
import { subscribe, getExtraActions } from "../store.js";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const extraActions = useSyncExternalStore(subscribe, getExtraActions);
  const actions = [...extraActions, ...ACTIONS];

  useEffect(() => {
    document.title = "Home · DU-NZO Platform";
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{greeting}, Demo team</h1>
          <p className="mt-2 text-[15px] text-p-mute">Here's your compliance posture at a glance — {today}.</p>
        </div>
        <span className="p-chip">
          <span className="h-1.5 w-1.5 rounded-full bg-p-aqua" />
          4 frameworks active
        </span>
      </motion.header>

      <motion.div variants={fadeUp}>
        <TrustPulse pulse={PULSE} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <PostureSnapshot frameworks={FRAMEWORKS} />
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
