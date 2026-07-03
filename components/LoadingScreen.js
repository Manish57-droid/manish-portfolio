"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_SEQUENCE = [
  { text: "> Initializing Manish.exe...",            delay: 0,    color: "text-ink-muted" },
  { text: "> Checking system requirements...",        delay: 300,  color: "text-ink-muted" },
  { text: "  ✓ React 18 detected",                   delay: 600,  color: "text-accent-green" },
  { text: "  ✓ Next.js 14 detected",                 delay: 800,  color: "text-accent-green" },
  { text: "  ✓ AWS credentials loaded",              delay: 1000, color: "text-accent-green" },
  { text: "> Importing { skills } from './manish'...",delay: 1300, color: "text-ink-muted" },
  { text: "  ✓ Full Stack Development loaded",       delay: 1500, color: "text-accent-green" },
  { text: "  ✓ AWS Cloud Practitioner loaded",       delay: 1700, color: "text-accent-green" },
  { text: "  ✓ AI/ML tools loaded",                  delay: 1900, color: "text-accent-green" },
  { text: "> Mounting portfolio components...",       delay: 2200, color: "text-ink-muted" },
  { text: "  ✓ Projects compiled successfully",      delay: 2400, color: "text-accent-green" },
  { text: "  ✓ Blog & Photography ready",            delay: 2600, color: "text-accent-green" },
  { text: "  ✓ Supabase connected",                  delay: 2800, color: "text-accent-green" },
  { text: "> Launching portfolio...",                 delay: 3100, color: "text-accent-cyan" },
  { text: "  ✓ All systems operational!",            delay: 3400, color: "text-accent-green" },
];

const PROGRESS_STEPS = [
  { label: "Loading skills",    percent: 20,  delay: 600  },
  { label: "Compiling code",    percent: 40,  delay: 1000 },
  { label: "Mounting AWS",      percent: 60,  delay: 1700 },
  { label: "Building UI",       percent: 80,  delay: 2400 },
  { label: "Almost there",      percent: 95,  delay: 3000 },
  { label: "Ready",             percent: 100, delay: 3400 },
];

export default function LoadingScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Initializing");
  const [done, setDone] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // show lines one by one
    BOOT_SEQUENCE.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, { text, color }]);
      }, delay);
    });

    // progress bar steps
    PROGRESS_STEPS.forEach(({ label, percent, delay }) => {
      setTimeout(() => {
        setProgress(percent);
        setProgressLabel(label);
      }, delay);
    });

    // done
    setTimeout(() => {
      setDone(true);
      setTimeout(() => {
        setExit(true);
        setTimeout(onComplete, 600);
      }, 600);
    }, 3800);
  }, []);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[500] bg-void flex flex-col items-center justify-center px-6"
        >
          {/* scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, #3ddc84 2px, #3ddc84 3px)",
            }}
          />

          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#3ddc84 1px, transparent 1px), linear-gradient(90deg, #3ddc84 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="w-full max-w-xl relative z-10">

            {/* logo / name */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold font-mono mb-2">
                <span className="text-ink">Manish</span>
                <span className="text-accent-green">.</span>
                <span className="text-accent-cyan">exe</span>
              </h1>
              <p className="text-ink-muted text-sm font-mono">
                Full Stack Developer · AWS Certified
              </p>
            </motion.div>

            {/* terminal box */}
            <div className="border border-border bg-panel/80 mb-6">
              {/* title bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-panel">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[11px] text-ink-muted font-mono">
                  boot.log
                </span>
              </div>

              {/* lines */}
              <div className="p-4 h-52 overflow-hidden font-mono text-[12px] leading-relaxed space-y-0.5">
                <AnimatePresence>
                  {visibleLines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={line.color}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </AnimatePresence>

                {/* blinking cursor */}
                {!done && (
                  <span className="inline-block w-2 h-4 bg-accent-green animate-blink ml-1" />
                )}
              </div>
            </div>

            {/* progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-ink-muted">{progressLabel}...</span>
                <span className="text-accent-green">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-panel border border-border overflow-hidden">
                <motion.div
                  className="h-full bg-accent-green relative overflow-hidden"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* shimmer */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      animation: "shimmer 1.2s infinite",
                    }}
                  />
                </motion.div>
              </div>

              {/* progress segments */}
              <div className="flex gap-1 mt-1">
                {PROGRESS_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className="flex-1 h-0.5 transition-all duration-300"
                    style={{
                      background: progress >= step.percent
                        ? "#3ddc84"
                        : "#1c2826",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* done message */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <p className="text-accent-green font-mono text-sm">
                    ✓ Portfolio loaded successfully
                  </p>
                  <p className="text-ink-dim text-[11px] mt-1 font-mono">
                    Welcome to Manish&apos;s digital space
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* corner decorations */}
          <span className="absolute top-4 left-4 text-[10px] font-mono text-ink-dim">
            v1.0.0
          </span>
          <span className="absolute top-4 right-4 text-[10px] font-mono text-ink-dim">
            Ranchi, IN
          </span>
          <span className="absolute bottom-4 left-4 text-[10px] font-mono text-ink-dim">
            © 2025 Manish Kushwaha
          </span>
          <span className="absolute bottom-4 right-4 text-[10px] font-mono text-accent-green animate-pulse">
            ● booting
          </span>

          <style>{`
            @keyframes shimmer {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}