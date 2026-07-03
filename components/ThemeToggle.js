"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-3 right-4 z-[150] flex items-center gap-2 border border-border bg-panel/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-mono text-ink-muted hover:border-accent-green hover:text-accent-green transition-colors"
      title="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.span
            key="dark"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-1.5"
          >
            <span>🌙</span>
            <span className="hidden sm:inline">
              theme<span className="text-accent-green">:</span>{" "}
              <span className="text-accent-cyan">&quot;dark&quot;</span>
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="light"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-1.5"
          >
            <span>☀️</span>
            <span className="hidden sm:inline">
              theme<span className="text-accent-green">:</span>{" "}
              <span className="text-accent-cyan">&quot;light&quot;</span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}