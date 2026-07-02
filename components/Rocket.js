"use client";

import { useEffect, useRef } from "react";

function createRocket(color1, color2, flameColor) {
  return { color1, color2, flameColor };
}

function RocketUnit({ color1, color2, flameColor, initialX, initialY, speed }) {
  const rocketRef = useRef(null);
  const posRef = useRef({ x: initialX, y: initialY });
  const angleRef = useRef(-45);
  const targetRef = useRef({ x: 200, y: 200 });
  const frameRef = useRef(null);

  useEffect(() => {
    function newTarget() {
      const margin = 80;
      return {
        x: margin + Math.random() * (window.innerWidth - margin * 2),
        y: margin + Math.random() * (window.innerHeight - margin * 2),
      };
    }

    targetRef.current = newTarget();

    function animate() {
      const pos = posRef.current;
      const target = targetRef.current;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30) {
        targetRef.current = newTarget();
      }

      pos.x += (dx / dist) * speed;
      pos.y += (dy / dist) * speed;

      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      let currentAngle = angleRef.current;
      let diff = targetAngle - currentAngle;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      angleRef.current = currentAngle + diff * 0.05;

      if (rocketRef.current) {
        rocketRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${angleRef.current}deg)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [speed]);

  return (
    <div
      ref={rocketRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{ willChange: "transform", zIndex: 25 }}
    >
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        {/* outer glow */}
        <ellipse cx="32" cy="50" rx="10" ry="12"
          fill={flameColor} opacity="0.3"
          style={{ filter: "blur(8px)" }}
        />

        {/* body glow */}
        <ellipse cx="32" cy="28" rx="14" ry="22"
          fill={color1} opacity="0.08"
          style={{ filter: "blur(10px)" }}
        />

        {/* body */}
        <path
          d="M32 4 C20 4 14 20 14 36 L32 44 L50 36 C50 20 44 4 32 4Z"
          fill="#0e1414" stroke={color1} strokeWidth="2"
        />

        {/* stripe */}
        <path
          d="M18 30 C18 30 24 33 32 33 C40 33 46 30 46 30"
          stroke={color2} strokeWidth="1" opacity="0.6"
        />

        {/* window */}
        <circle cx="32" cy="24" r="7" fill="#090c0d" stroke={color2} strokeWidth="1.5" />
        <circle cx="32" cy="24" r="4" fill={color2} opacity="0.5" />
        <circle cx="30" cy="22" r="1.5" fill="#ffffff" opacity="0.4" />

        {/* left fin */}
        <path d="M14 34 L4 50 L18 44Z" fill={color1} opacity="0.9" />
        {/* right fin */}
        <path d="M50 34 L60 50 L46 44Z" fill={color1} opacity="0.9" />

        {/* main flame */}
        <ellipse cx="32" cy="48" rx="6" ry="9"
          fill={flameColor} opacity="0.95"
          style={{ filter: "blur(1px)" }}
        />
        {/* inner flame */}
        <ellipse cx="32" cy="50" rx="3.5" ry="6"
          fill="#ffffff" opacity="0.8"
          style={{ filter: "blur(1px)" }}
        />

        {/* trail particles */}
        <circle cx="27" cy="57" r="2.5" fill={color1} opacity="0.6"
          style={{ filter: "blur(2px)" }} />
        <circle cx="37" cy="59" r="2" fill={color2} opacity="0.5"
          style={{ filter: "blur(2px)" }} />
        <circle cx="32" cy="62" r="1.5" fill={flameColor} opacity="0.4"
          style={{ filter: "blur(3px)" }} />
        <circle cx="29" cy="64" r="1" fill={color1} opacity="0.3"
          style={{ filter: "blur(3px)" }} />
      </svg>
    </div>
  );
}

export default function Rocket() {
  return (
    <>
      /* Extra rocket*/ 
      {/*
      <RocketUnit
        color1="#3ddc84"
        color2="#56e8d4"
        flameColor="#e8c252"
        initialX={100}
        initialY={100}
        speed={1.4}
      />
      */}
      <RocketUnit
        color1="#56e8d4"
        color2="#3ddc84"
        flameColor="#ff8c42"
        initialX={300}
        initialY={300}
        speed={1.0}
      /> 
      
      <RocketUnit
        color1="#e8c252"
        color2="#3ddc84"
        flameColor="#56e8d4"
        initialX={500}
        initialY={200}
        speed={1.7}
      />
    </>
  );
}