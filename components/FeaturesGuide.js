"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, ChevronRight } from "lucide-react";

const FEATURES = [
  {
    category: "⌨️ Keyboard Shortcuts",
    color: "#3ddc84",
    items: [
      { key: "`",     label: "Open secret terminal",         hint: "Try typing 'help' inside" },
      { key: "Esc",   label: "Close any open modal",         hint: "Works everywhere" },
    ],
  },
  {
    category: "🖱️ Mouse & Cursor",
    color: "#56e8d4",
    items: [
      { key: "Move",  label: "Snake follows your cursor",    hint: "Watch the tongue flick!" },
      { key: "Click", label: "Click anywhere for explosion", hint: "Code symbols burst out" },
      { key: "Hover", label: "Cards tilt in 3D",            hint: "Try hovering project cards" },
    ],
  },
  {
    category: "🎮 Interactive Sections",
    color: "#e8c252",
    items: [
      { key: "★",     label: "Tech Stack Constellation",     hint: "Click stars to explore your stack" },
      { key: "✍️",    label: "Messages Wall",                hint: "Leave a message for Manish" },
      { key: "🌍",    label: "Visitor World Map",            hint: "See where visitors come from" },
      { key: "📝",    label: "Live Blog Editor",             hint: "Write & publish posts in real time" },
    ],
  },
  {
    category: "🎨 Visual Effects",
    color: "#8b7cf8",
    items: [
      { key: "MATRIX", label: "Matrix Rain Mode",           hint: "Bottom-left MATRIX button" },
      { key: "♪",      label: "Ambient Space Sound",        hint: "Bottom-left speaker button" },
      { key: "🌙/☀️",  label: "Dark / Light theme",         hint: "Top-right theme toggle" },
      { key: "🚀",     label: "Live rocket flying around",  hint: "Always in motion!" },
    ],
  },
  {
    category: "🏆 Hidden Secrets",
    color: "#3ddc84",
    items: [
      { key: "10",    label: "Achievement badges to unlock", hint: "Trophy button bottom-right" },
      { key: "🥚",    label: "Easter egg in terminal",       hint: "Type 'easter' in the terminal" },
      { key: "☕",    label: "Make coffee command",          hint: "Type 'sudo make_me_coffee'" },
      { key: "💼",    label: "Hire command",                 hint: "Type 'hire manish' in terminal" },
    ],
  },
  {
    category: "📊 Live Data",
    color: "#56e8d4",
    items: [
      { key: "🕐",    label: "Live clock with availability", hint: "Shows Manish's current time" },
      { key: "📡",    label: "Real-time visitor tracking",   hint: "You just got tracked! 👀" },
      { key: "💬",    label: "Live messages wall",           hint: "Updates instantly worldwide" },
    ],
  },
];

export default function FeaturesGuide() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // show hint bubble after 5 seconds on first visit
  useEffect(() => {
    const seen = localStorage.getItem("guide-seen");
    if (!seen) {
      const t = setTimeout(() => {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 5000);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, []);

  function handleOpen() {
    setOpen(true);
    setShowHint(false);
    localStorage.setItem("guide-seen", "true");
  }

  return (
    <>
      {/* hint bubble */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] border border-accent-green/50 bg-panel/95 backdrop-blur-sm px-4 py-2.5 text-[12px] font-mono text-ink-muted whitespace-nowrap"
            style={{ boxShadow: "0 0 20px rgba(61,220,132,0.15)" }}
          >
            <span className="text-accent-green">?</span>{" "}
            Did you know this portfolio has hidden features?{" "}
            <button
              onClick={handleOpen}
              className="text-accent-cyan underline hover:text-accent-green transition-colors"
            >
              Explore them
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* floating ? button */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 border border-border bg-panel/90 backdrop-blur-sm px-4 py-2 text-[11px] font-mono text-ink-muted hover:border-accent-green hover:text-accent-green transition-colors"
        style={{
          boxShadow: "0 0 16px rgba(61,220,132,0.1)",
        }}
      >
        <Keyboard size={13} className="text-accent-green" />
        <span>explore features</span>
        <span className="text-accent-green/50 text-[10px]">?</span>
      </motion.button>

      {/* guide modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
            style={{ background: "rgba(9,12,13,0.92)", backdropFilter: "blur(8px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl border border-border bg-void flex flex-col"
              style={{
                height: "min(680px, 90vh)",
                boxShadow: "0 0 60px rgba(61,220,132,0.12)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-panel shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setOpen(false)}
                      className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110"
                    />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="ml-2 text-[12px] text-ink-muted font-mono">
                    features.guide — interactive portfolio
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-ink-dim hover:text-accent-green transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* header */}
              <div className="px-6 py-4 border-b border-border bg-panel/40 shrink-0">
                <h2 className="text-lg font-bold text-ink font-mono mb-1">
                  <span className="code-keyword">import</span>{" "}
                  <span className="text-accent-green">features</span>{" "}
                  <span className="code-keyword">from</span>{" "}
                  <span className="code-string">&quot;./manish-portfolio&quot;</span>
                </h2>
                <p className="text-[12px] text-ink-muted">
                  This portfolio is packed with interactive features. Here&apos;s everything you can do!
                </p>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* category sidebar */}
                <div className="w-48 border-r border-border bg-panel/30 overflow-y-auto shrink-0">
                  {FEATURES.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCategory(i)}
                      className={`w-full text-left px-3 py-3 text-[11px] font-mono border-b border-border/40 transition-colors flex items-center gap-2 ${
                        activeCategory === i
                          ? "bg-panel text-ink border-l-2"
                          : "text-ink-muted hover:text-ink hover:bg-panel/50 border-l-2 border-l-transparent"
                      }`}
                      style={
                        activeCategory === i
                          ? { borderLeftColor: cat.color }
                          : {}
                      }
                    >
                      <span>{cat.category.split(" ")[0]}</span>
                      <span className="truncate">{cat.category.split(" ").slice(1).join(" ")}</span>
                      {activeCategory === i && (
                        <ChevronRight size={10} className="ml-auto shrink-0" style={{ color: cat.color }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* feature items */}
                <div className="flex-1 overflow-y-auto p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <h3
                        className="text-sm font-bold font-mono mb-4"
                        style={{ color: FEATURES[activeCategory].color }}
                      >
                        {FEATURES[activeCategory].category}
                      </h3>

                      <div className="space-y-3">
                        {FEATURES[activeCategory].items.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-4 border border-border bg-panel/40 px-4 py-3 hover:border-opacity-60 transition-colors"
                            style={{
                              borderColor: `${FEATURES[activeCategory].color}20`,
                            }}
                          >
                            {/* key badge */}
                            <div
                              className="shrink-0 border px-2 py-1 text-[10px] font-mono font-bold min-w-[44px] text-center"
                              style={{
                                borderColor: `${FEATURES[activeCategory].color}40`,
                                color: FEATURES[activeCategory].color,
                                background: `${FEATURES[activeCategory].color}08`,
                              }}
                            >
                              {item.key}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-ink font-semibold mb-0.5">
                                {item.label}
                              </p>
                              <p className="text-[11px] text-ink-muted">
                                {item.hint}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* bottom bar */}
              <div className="px-4 py-2.5 border-t border-border bg-panel shrink-0 flex items-center justify-between">
                <span className="text-[10px] text-ink-dim font-mono">
                  {FEATURES.reduce((s, c) => s + c.items.length, 0)} features total · Press{" "}
                  <kbd className="border border-border px-1 text-accent-green">Esc</kbd> to close
                </span>
                <span className="text-[10px] text-accent-green font-mono animate-pulse">
                  ● enjoy exploring
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}