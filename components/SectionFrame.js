"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionFrame({ id, path, lineCount = 24, children }) {
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);
  const ref = useRef(null);
  const [glitching, setGlitching] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlitching(true);
          setTimeout(() => setGlitching(false), 600);
        }
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function handleMouseMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
    const rotateX = (y - 0.5) * -3;
    const rotateY = (x - 0.5) * 3;
    ref.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
  }

  return (
    <section
      id={id}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative border-b border-border scroll-mt-12 transition-transform duration-200 ${
        glitching ? "section-3d-enter" : ""
      }`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 scanline-hard opacity-[0.6]" />

      {/* dynamic glow following mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(61,220,132,0.04) 0%, transparent 60%)`,
        }}
      />

      <div className="px-4 lg:px-8 pt-3 pb-1 text-[11px] text-ink-dim tracking-wide border-b border-border/60 relative z-10">
        <span className="glitch-rgb" style={{ fontSize: "11px" }}>{path}</span>
      </div>

      <div className="flex relative z-10">
        <div className="hidden md:flex flex-col pt-6 pr-3 pl-4 lg:pl-8 select-none">
          {lines.map((n) => (
            <span key={n} className="gutter text-[12px] leading-[2.1rem] w-6">
              {n}
            </span>
          ))}
        </div>
        <div className="flex-1 px-4 md:px-2 lg:px-4 py-6 min-w-0">{children}</div>
      </div>
    </section>
  );
}