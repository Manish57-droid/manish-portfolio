/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#090c0d",
        panel: "#0e1414",
        panel2: "#111a19",
        border: "#1c2826",
        accent: {
          green: "#3ddc84",
          cyan: "#56e8d4",
          amber: "#e8c252",
        },
        ink: {
          DEFAULT: "#d4dadb",
          muted: "#5c6b6b",
          dim: "#3a4544",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        sans: ["var(--font-inter)", "ui-sans-serif", "sans-serif"],
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        scan: "scan 6s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
