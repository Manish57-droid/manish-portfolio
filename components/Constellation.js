"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STARS = [
  // Frontend
  { id: "react",      label: "React",       group: "frontend",  x: 20,  y: 25,  size: 14, exp: 85, projects: ["EcoTrack", "DevBoard"], desc: "My primary UI library for building component-based apps" },
  { id: "nextjs",     label: "Next.js",     group: "frontend",  x: 32,  y: 15,  size: 13, exp: 80, projects: ["DevBoard", "Portfolio"], desc: "Full stack React framework — powers this very portfolio" },
  { id: "tailwind",   label: "Tailwind",    group: "frontend",  x: 14,  y: 40,  size: 11, exp: 90, projects: ["Portfolio", "EcoTrack"], desc: "Utility-first CSS — fast, consistent, scalable" },
  { id: "javascript", label: "JavaScript",  group: "frontend",  x: 28,  y: 42,  size: 14, exp: 88, projects: ["EcoTrack", "DevBoard", "DataLens"], desc: "The language the web runs on — my daily driver" },
  { id: "html",       label: "HTML5",       group: "frontend",  x: 8,   y: 55,  size: 10, exp: 95, projects: ["All projects"], desc: "The foundation of everything I build" },
  { id: "css",        label: "CSS3",        group: "frontend",  x: 22,  y: 60,  size: 10, exp: 88, projects: ["All projects"], desc: "Styling the web, one pixel at a time" },

  // Backend
  { id: "nodejs",     label: "Node.js",     group: "backend",   x: 55,  y: 20,  size: 13, exp: 82, projects: ["EcoTrack", "DevBoard"], desc: "Server-side JavaScript runtime for fast APIs" },
  { id: "express",    label: "Express",     group: "backend",   x: 65,  y: 30,  size: 11, exp: 80, projects: ["EcoTrack", "DevBoard"], desc: "Minimal Node.js framework for REST APIs" },
  { id: "mongodb",    label: "MongoDB",     group: "backend",   x: 50,  y: 40,  size: 12, exp: 78, projects: ["EcoTrack"], desc: "NoSQL document database for flexible data" },
  { id: "sql",        label: "SQL",         group: "backend",   x: 68,  y: 48,  size: 11, exp: 75, projects: ["DevBoard"], desc: "Relational database for structured, complex data" },
  { id: "supabase",   label: "Supabase",    group: "backend",   x: 58,  y: 58,  size: 11, exp: 72, projects: ["Portfolio"], desc: "Open-source Firebase alternative — used in this portfolio" },

  // Cloud
  { id: "aws",        label: "AWS",         group: "cloud",     x: 82,  y: 18,  size: 16, exp: 80, projects: ["DevBoard", "EcoTrack"], desc: "Certified Cloud Practitioner — EC2, S3, RDS, IAM" },
  { id: "git",        label: "Git",         group: "cloud",     x: 78,  y: 35,  size: 12, exp: 92, projects: ["All projects"], desc: "Version control — committing to good code daily" },
  { id: "github",     label: "GitHub",      group: "cloud",     x: 88,  y: 45,  size: 11, exp: 90, projects: ["All projects"], desc: "Remote repo hosting and collaboration" },
  { id: "linux",      label: "Linux",       group: "cloud",     x: 75,  y: 55,  size: 11, exp: 70, projects: ["DevBoard"], desc: "Ubuntu for development and server environments" },

  // AI / Data
  { id: "python",     label: "Python",      group: "data",      x: 42,  y: 72,  size: 13, exp: 78, projects: ["DataLens"], desc: "For data science, scripting and AI workflows" },
  { id: "pandas",     label: "Pandas",      group: "data",      x: 30,  y: 80,  size: 11, exp: 72, projects: ["DataLens"], desc: "Data manipulation and analysis library" },
  { id: "numpy",      label: "NumPy",       group: "data",      x: 55,  y: 80,  size: 11, exp: 70, projects: ["DataLens"], desc: "Numerical computing for data pipelines" },
  { id: "orange",     label: "Orange",      group: "data",      x: 68,  y: 75,  size: 10, exp: 65, projects: ["DataLens"], desc: "Visual AI/ML workflow tool for data mining" },
];

// constellation lines connecting related stars
const LINES = [
  // frontend cluster
  ["react", "nextjs"],
  ["react", "javascript"],
  ["react", "tailwind"],
  ["javascript", "html"],
  ["html", "css"],
  ["tailwind", "css"],
  ["nextjs", "javascript"],

  // backend cluster
  ["nodejs", "express"],
  ["nodejs", "mongodb"],
  ["express", "sql"],
  ["mongodb", "supabase"],
  ["nodejs", "javascript"],

  // cloud cluster
  ["aws", "git"],
  ["git", "github"],
  ["aws", "linux"],
  ["linux", "git"],

  // data cluster
  ["python", "pandas"],
  ["python", "numpy"],
  ["pandas", "orange"],
  ["numpy", "orange"],

  // cross-group bridges
  ["nodejs", "aws"],
  ["supabase", "aws"],
  ["python", "nodejs"],
  ["react", "nodejs"],
];

const GROUP_COLORS = {
  frontend: "#3ddc84",
  backend:  "#56e8d4",
  cloud:    "#e8c252",
  data:     "#8b7cf8",
};

const GROUP_LABELS = {
  frontend: "Frontend",
  backend:  "Backend",
  cloud:    "Cloud & DevOps",
  data:     "AI & Data",
};

function getPos(star, w, h) {
  return {
    x: (star.x / 100) * w,
    y: (star.y / 100) * h,
  };
}

export default function Constellation() {
  const svgRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 500 });
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [twinkle, setTwinkle] = useState({});

  // resize observer
  useEffect(() => {
    function measure() {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDims({ w: rect.width, h: rect.height });
      }
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, []);

  // random twinkle
  useEffect(() => {
    const id = setInterval(() => {
      const star = STARS[Math.floor(Math.random() * STARS.length)];
      setTwinkle((prev) => ({ ...prev, [star.id]: true }));
      setTimeout(() => {
        setTwinkle((prev) => ({ ...prev, [star.id]: false }));
      }, 600);
    }, 400);
    return () => clearInterval(id);
  }, []);

  const visibleStars = activeGroup
    ? STARS.filter((s) => s.group === activeGroup)
    : STARS;

  const visibleIds = new Set(visibleStars.map((s) => s.id));

  const visibleLines = LINES.filter(
    ([a, b]) => visibleIds.has(a) && visibleIds.has(b)
  );

  const activeStar = selected || hovered;

  return (
    <section id="constellation" className="relative border-b border-border scroll-mt-12">
      <div className="px-4 lg:px-8 pt-3 pb-1 text-[11px] text-ink-dim tracking-wide border-b border-border/60">
        src / constellation.tsx
      </div>

      <div className="px-4 lg:px-8 py-8">
        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-ink mb-1">
              <span className="code-keyword">const</span>{" "}
              <span className="code-prop">techStack</span>{" "}
              <span className="text-ink">=</span>{" "}
              <span className="text-accent-green">starMap</span>
              <span className="text-accent-cyan">(skills)</span>
            </h2>
            <p className="text-[11px] text-ink-muted">
              Hover or click any star to explore · lines show relationships
            </p>
          </div>

          {/* group filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveGroup(null)}
              className={`text-[11px] px-3 py-1.5 border font-mono transition-colors ${
                !activeGroup
                  ? "border-accent-green text-accent-green bg-accent-green/10"
                  : "border-border text-ink-muted hover:border-accent-green/50"
              }`}
            >
              all
            </button>
            {Object.entries(GROUP_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveGroup(activeGroup === key ? null : key)}
                className={`text-[11px] px-3 py-1.5 border font-mono transition-colors ${
                  activeGroup === key
                    ? "text-void"
                    : "border-border text-ink-muted hover:border-opacity-50"
                }`}
                style={
                  activeGroup === key
                    ? { background: GROUP_COLORS[key], borderColor: GROUP_COLORS[key] }
                    : { borderColor: activeGroup ? "#1c2826" : "#1c2826" }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* constellation SVG */}
          <div className="lg:col-span-2">
            <div
              className="relative border border-border bg-panel/30 overflow-hidden"
              style={{ height: "460px" }}
            >
              {/* background stars */}
              <div className="absolute inset-0">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: Math.random() * 1.5 + 0.5,
                      height: Math.random() * 1.5 + 0.5,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.3 + 0.05,
                    }}
                  />
                ))}
              </div>

              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                style={{ cursor: "crosshair" }}
              >
                {/* constellation lines */}
                {visibleLines.map(([aId, bId]) => {
                  const a = STARS.find((s) => s.id === aId);
                  const b = STARS.find((s) => s.id === bId);
                  if (!a || !b) return null;
                  const pa = getPos(a, dims.w, dims.h);
                  const pb = getPos(b, dims.w, dims.h);
                  const isActive =
                    activeStar &&
                    (activeStar.id === aId || activeStar.id === bId);

                  return (
                    <line
                      key={`${aId}-${bId}`}
                      x1={pa.x} y1={pa.y}
                      x2={pb.x} y2={pb.y}
                      stroke={isActive ? GROUP_COLORS[a.group] : "#1c2826"}
                      strokeWidth={isActive ? 1.5 : 0.8}
                      strokeOpacity={isActive ? 0.8 : 0.5}
                      style={{ transition: "all 0.3s ease" }}
                    />
                  );
                })}

                {/* stars */}
                {visibleStars.map((star) => {
                  const pos = getPos(star, dims.w, dims.h);
                  const color = GROUP_COLORS[star.group];
                  const isActive = activeStar?.id === star.id;
                  const isTwinkling = twinkle[star.id];
                  const expRadius = (star.exp / 100) * star.size;

                  return (
                    <g
                      key={star.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(selected?.id === star.id ? null : star)}
                    >
                      {/* outer pulse ring */}
                      {isActive && (
                        <circle
                          r={expRadius + 10}
                          fill="none"
                          stroke={color}
                          strokeWidth="1"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="r"
                            values={`${expRadius + 6};${expRadius + 18};${expRadius + 6}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.4;0;0.4"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* glow */}
                      <circle
                        r={expRadius + 4}
                        fill={color}
                        opacity={isTwinkling ? 0.25 : isActive ? 0.2 : 0.08}
                        style={{ transition: "all 0.3s" }}
                        filter="url(#glow)"
                      />

                      {/* main star */}
                      <circle
                        r={expRadius}
                        fill={isActive ? color : "transparent"}
                        stroke={color}
                        strokeWidth={isActive ? 0 : 1.5}
                        opacity={isTwinkling ? 1 : isActive ? 1 : 0.75}
                        style={{ transition: "all 0.3s" }}
                      />

                      {/* center dot */}
                      <circle
                        r={2}
                        fill={color}
                        opacity={0.9}
                      />

                      {/* label */}
                      <text
                        y={expRadius + 14}
                        textAnchor="middle"
                        fill={isActive ? color : "#5c6b6b"}
                        fontSize={isActive ? "11" : "10"}
                        fontFamily="monospace"
                        style={{ transition: "all 0.2s", userSelect: "none" }}
                      >
                        {star.label}
                      </text>

                      {/* SVG filter for glow */}
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                    </g>
                  );
                })}
              </svg>

              {/* corner label */}
              <div className="absolute top-2 left-3 text-[10px] text-ink-dim font-mono">
                {visibleStars.length} technologies · {visibleLines.length} connections
              </div>
            </div>
          </div>

          {/* info panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {activeStar ? (
                <motion.div
                  key={activeStar.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="border bg-panel/60 p-4"
                  style={{ borderColor: `${GROUP_COLORS[activeStar.group]}40` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: GROUP_COLORS[activeStar.group] }}
                    />
                    <span
                      className="text-lg font-bold font-mono"
                      style={{ color: GROUP_COLORS[activeStar.group] }}
                    >
                      {activeStar.label}
                    </span>
                  </div>

                  <p className="text-[11px] text-ink-muted font-mono mb-3 uppercase tracking-wider">
                    {GROUP_LABELS[activeStar.group]}
                  </p>

                  <p className="text-sm text-ink/80 leading-relaxed mb-4">
                    {activeStar.desc}
                  </p>

                  {/* proficiency bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-ink-muted">proficiency</span>
                      <span style={{ color: GROUP_COLORS[activeStar.group] }}>
                        {activeStar.exp}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-void border border-border/60 overflow-hidden">
                      <motion.div
                        className="h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeStar.exp}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ background: GROUP_COLORS[activeStar.group] }}
                      />
                    </div>
                  </div>

                  {/* projects */}
                  <div>
                    <p className="text-[10px] text-ink-muted font-mono mb-2">
                      used in
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeStar.projects.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] border px-2 py-0.5 font-mono"
                          style={{
                            borderColor: `${GROUP_COLORS[activeStar.group]}40`,
                            color: GROUP_COLORS[activeStar.group],
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-dashed border-border p-6 text-center"
                >
                  <div className="text-3xl mb-3">✦</div>
                  <p className="text-sm text-ink-muted">
                    Hover or click a star to explore the tech
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* legend */}
            <div className="border border-border bg-panel/40 p-4">
              <p className="text-[10px] text-ink-dim font-mono mb-3">
                // groups
              </p>
              <div className="space-y-2">
                {Object.entries(GROUP_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveGroup(activeGroup === key ? null : key)}
                    className="w-full flex items-center gap-2.5 text-[12px] hover:opacity-80 transition-opacity text-left"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: GROUP_COLORS[key] }}
                    />
                    <span className="text-ink/80">{label}</span>
                    <span className="ml-auto text-ink-dim text-[10px]">
                      {STARS.filter((s) => s.group === key).length} tech
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* total exp */}
            <div className="border border-border bg-panel/40 p-4">
              <p className="text-[10px] text-ink-dim font-mono mb-3">
                // avg proficiency
              </p>
              {Object.entries(GROUP_LABELS).map(([key, label]) => {
                const groupStars = STARS.filter((s) => s.group === key);
                const avg = Math.round(
                  groupStars.reduce((s, t) => s + t.exp, 0) / groupStars.length
                );
                return (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between text-[10px] font-mono mb-0.5">
                      <span className="text-ink-muted">{label}</span>
                      <span style={{ color: GROUP_COLORS[key] }}>{avg}%</span>
                    </div>
                    <div className="w-full h-1 bg-void border border-border/40 overflow-hidden">
                      <motion.div
                        className="h-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${avg}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ background: GROUP_COLORS[key] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}