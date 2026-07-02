"use client";

import { useRef, useCallback } from "react";

export default function Tilt3D({ children, className = "", intensity = 15, glowColor = "#3ddc84" }) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -intensity;
    const rotateY = (x - 0.5) * intensity;
    const glowX = x * 100;
    const glowY = y * 100;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    ref.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(61,220,132,0.08) 0%, transparent 60%)`;
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    ref.current.style.background = "";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-3d ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}