/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05060D",
        night: "#0A0C18",
        panel: "#10132A",
        edge: "rgba(255,255,255,0.08)",
        ink: "#F4F5FB",
        mute: "#9CA3BD",
        violet: { DEFAULT: "#8B7CFF", soft: "#B7ADFF", deep: "#5B4BE0" },
        aqua: { DEFAULT: "#3EE0CF", soft: "#9FF3EA" },
        amber: { DEFAULT: "#FFB547" },
        rose: { DEFAULT: "#FF6B8B" },
        // DU-NZO Platform (app shell) tokens — CSS vars flip with [data-theme]
        p: {
          bg: "rgb(var(--p-bg) / <alpha-value>)",
          surface: "rgb(var(--p-surface) / <alpha-value>)",
          elevated: "rgb(var(--p-elevated) / <alpha-value>)",
          edge: "rgb(var(--p-edge) / <alpha-value>)",
          ink: "rgb(var(--p-ink) / <alpha-value>)",
          mute: "rgb(var(--p-mute) / <alpha-value>)",
          faint: "rgb(var(--p-faint) / <alpha-value>)",
          violet: "rgb(var(--p-violet) / <alpha-value>)",
          violets: "rgb(var(--p-violet-soft) / <alpha-value>)",
          aqua: "rgb(var(--p-aqua) / <alpha-value>)",
          success: "rgb(var(--p-success) / <alpha-value>)",
          warning: "rgb(var(--p-warning) / <alpha-value>)",
          danger: "rgb(var(--p-danger) / <alpha-value>)",
          info: "rgb(var(--p-info) / <alpha-value>)",
        },
      },
      borderRadius: { "p-sm": "8px", "p-md": "12px", "p-lg": "16px", "p-xl": "24px" },
      boxShadow: { "p-card": "var(--p-shadow-card)", "p-pop": "var(--p-shadow-pop)" },
      fontFamily: {
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.055em" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        drift: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "50%": { transform: "translate(40px,-30px) scale(1.1)" } },
      },
      animation: { marquee: "marquee 40s linear infinite", drift: "drift 18s ease-in-out infinite" },
    },
  },
  plugins: [],
};
