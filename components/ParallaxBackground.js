"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TOKENS = [
  "const", "function", "async", "await", "=>", "{ }", "import", "export",
  "useState", "useEffect", "return", "props", "interface", "AWS::Lambda",
  "git push", "npm run", "useState(0)", "<Component />", "try { } catch",
  "for (let i)", "null", "undefined", "true", "false", "S3Bucket",
];

function makeRow(seed) {
  const items = [];
  for (let i = 0; i < 14; i++) {
    items.push(TOKENS[(seed * 7 + i * 13) % TOKENS.length]);
  }
  return items.join("   ");
}

function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function useStars(count) {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const arr = Array.from({ length: count }, (_, i) => ({
      id: i,
      top: seededRandom(i + 1) * 100,
      left: seededRandom(i + 50) * 100,
      size: 1 + seededRandom(i + 100) * 2,
      delay: seededRandom(i + 200) * 4,
      duration: 2.5 + seededRandom(i + 300) * 3,
      color: i % 5 === 0 ? "#56e8d4" : i % 7 === 0 ? "#e8c252" : "#3ddc84",
    }));
    setStars(arr);
  }, [count]);
  return stars;
}

function Moon({ className, color = "#3ddc84" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none"
      style={{
        filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 20px ${color}) drop-shadow(0 0 40px ${color})`,
      }}
    >
      <path d="M50 5a45 45 0 1 0 45 45 36 36 0 0 1-45-45Z" fill={color} />
    </svg>
  );
}

export default function ParallaxBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  const yFar      = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const yMid      = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
  const yNear     = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);
  const yStarsBack  = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const yStarsFront = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const yMoons    = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const starsBack  = useStars(520);
  const starsFront = useStars(550);

  return (
    <div ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* base grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#3ddc84 1px, transparent 1px), linear-gradient(90deg, #3ddc84 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* stars back layer */}
      <motion.div style={{ y: yStarsBack }} className="absolute inset-0">
        {starsBack.map((s) => (
          <motion.span
            key={`b-${s.id}`}
            className="absolute rounded-full"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, backgroundColor: s.color }}
            animate={{ opacity: [0.15, 0.8, 0.15] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* stars front layer */}
      <motion.div style={{ y: yStarsFront }} className="absolute inset-0">
        {starsFront.map((s) => (
          <motion.span
            key={`f-${s.id}`}
            className="absolute rounded-full"
            style={{
              top: `${s.top}%`, left: `${s.left}%`,
              width: s.size * 1.3, height: s.size * 1.3,
              backgroundColor: s.color, boxShadow: `0 0 4px ${s.color}`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: s.duration * 0.8, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* moons */}
      <motion.div style={{ y: yMoons }} className="absolute inset-0 opacity-[0.5]">
        <Moon className="absolute w-16 h-16 top-[8%]   right-[12%] rotate-[15deg]"  color="#3ddc84" />
        <Moon className="absolute w-10 h-10 top-[34%]  left-[7%]   rotate-[-20deg]" color="#56e8d4" />
        <Moon className="absolute w-14 h-14 top-[60%]  right-[6%]  rotate-[40deg]"  color="#e8c252" />
        <Moon className="absolute w-9  h-9  top-[88%]  left-[14%]  rotate-[-10deg]" color="#3ddc84" />
        <Moon className="absolute w-12 h-12 top-[112%] right-[20%] rotate-[25deg]"  color="#56e8d4" />
        <Moon className="absolute w-10 h-10 top-[140%] left-[9%]   rotate-[5deg]"   color="#3ddc84" />
      </motion.div>

      {/* far code text layer */}
      <motion.div style={{ y: yFar }} className="absolute inset-0 flex flex-col justify-around opacity-[0.05] select-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap text-[13px] tracking-wider text-accent-green">
            {makeRow(i)}
          </div>
        ))}
      </motion.div>

      {/* mid code text layer */}
      <motion.div style={{ y: yMid }} className="absolute inset-0 flex flex-col justify-around opacity-[0.045] select-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap text-[11px] tracking-widest text-accent-cyan">
            {makeRow(i + 4)}
          </div>
        ))}
      </motion.div>

      {/* near big glyph layer */}
      <motion.div style={{ y: yNear }} className="absolute inset-0 opacity-[0.04] select-none">
        <div className="absolute top-[12%] left-[6%]   text-[120px] font-bold text-accent-green rotate-[-6deg]">{"</>"}</div>
        <div className="absolute top-[48%] right-[8%]  text-[100px] font-bold text-accent-cyan  rotate-[8deg]"> {"{ }"}</div>
        <div className="absolute top-[78%] left-[18%]  text-[90px]  font-bold text-accent-amber rotate-[-3deg]">{"=>"}</div>
        <div className="absolute top-[28%] right-[22%] text-[80px]  font-bold text-accent-green rotate-[10deg]">{"[ ]"}</div>
      </motion.div>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(9,12,13,0.2) 0%, rgba(9,12,13,0.85) 70%, rgba(9,12,13,1) 100%)",
        }}
      />
    </div>
  );
}