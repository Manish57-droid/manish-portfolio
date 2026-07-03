/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        void:   "var(--void)",
        panel:  "var(--panel)",
        panel2: "var(--panel2)",
        border: "var(--border)",
        accent: {
          green: "var(--green)",
          cyan:  "var(--cyan)",
          amber: "var(--amber)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted:   "var(--ink-mut)",
          dim:     "var(--ink-dim)",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        sans: ["var(--font-inter)", "ui-sans-serif", "sans-serif"],
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        scan:  "scan 6s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 49%":  { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};