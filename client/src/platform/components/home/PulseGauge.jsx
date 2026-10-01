import { motion } from "framer-motion";

export default function PulseGauge({ score, size = 190 }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const target = c * (1 - score / 100);
  return (
    <div className="relative" style={{ width: size, height: size }} data-testid="pulse-gauge">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ filter: "drop-shadow(0 0 22px rgba(139,124,255,0.28))" }}>
        <defs>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7CFF" />
            <stop offset="100%" stopColor="#3EE0CF" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--p-ink) / 0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#pulseGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: target }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="text-5xl font-semibold tracking-tight" data-testid="pulse-score">{score}</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-p-faint">out of 100</p>
        </div>
      </div>
    </div>
  );
}
