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
      },
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
