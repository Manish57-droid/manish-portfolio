"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const SECTIONS = [
  { id: "about",         label: "about.tsx" },
  { id: "skills",        label: "skills.json" },
  { id: "constellation", label: "constellation.tsx" },
  { id: "projects",      label: "projects/" },
  { id: "experience",    label: "experience.md" },
  { id: "blog",          label: "blog/" },
  { id: "messages",      label: "messages.log" },
  { id: "visitors",      label: "visitor-map.tsx" },
  { id: "contact",       label: "contact.tsx" },
];

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState(0);
  const [active, setActive] = useState("about");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      setPercent(Math.round(v * 100));
      setVisible(v > 0.02);
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[200] h-[3px] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #3ddc84, #56e8d4, #e8c252)",
          boxShadow: "0 0 10px #3ddc84, 0 0 20px #3ddc84",
        }}
      />

      {/* percent badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        className="fixed top-3 right-20 z-[201] text-[10px] font-mono text-accent-green border border-accent-green/30 bg-void/80 px-2 py-0.5 backdrop-blur-sm"
      >
        {percent}%
      </motion.div>

      {/* right side section dots */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <div key={s.id} className="relative group flex items-center justify-end">
              {/* tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-6 bg-panel border border-border px-2 py-1 text-[10px] font-mono text-ink-muted whitespace-nowrap pointer-events-none"
              >
                {s.label}
              </motion.div>

              {/* dot */}
              <button
                onClick={() => scrollTo(s.id)}
                className="relative flex items-center justify-center"
                title={s.label}
              >
                <motion.div
                  animate={{
                    width:  isActive ? 10 : 5,
                    height: isActive ? 10 : 5,
                    backgroundColor: isActive ? "#3ddc84" : "#1c2826",
                    boxShadow: isActive
                      ? "0 0 8px #3ddc84, 0 0 16px #3ddc84"
                      : "none",
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full border border-border group-hover:border-accent-green/60 transition-colors"
                  style={{ borderColor: isActive ? "#3ddc84" : "#1c2826" }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* bottom compile bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] hidden lg:flex items-center gap-3 border border-border bg-panel/90 backdrop-blur-sm px-4 py-2"
      >
        <span className="text-[10px] font-mono text-ink-dim">compile progress</span>
        <div className="w-32 h-1 bg-void border border-border/60 overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, #3ddc84, #56e8d4)",
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="text-[10px] font-mono text-accent-green">{percent}%</span>
        <span className="text-[10px] font-mono text-ink-dim">·</span>
        <span className="text-[10px] font-mono text-accent-cyan">{active}.tsx</span>
      </motion.div>
    </>
  );
}