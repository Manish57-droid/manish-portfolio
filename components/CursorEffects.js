"use client";

import { useEffect, useRef, useState } from "react";

const SNAKE_LENGTH = 20;
const SEGMENT_SIZE = 10;

function CustomCursor() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -200, y: -200 });
  const frameRef = useRef(null);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    function onMove(e) {
      posRef.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isClickable = el?.closest("a, button, input, textarea, select, [role='button']");
      setHovering(!!isClickable);
    }

    function onDown() { setClicking(true); }
    function onUp() { setClicking(false); }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    function animate() {
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }
      frameRef.current = requestAnimationFrame(animate);
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[999] pointer-events-none"
      style={{ willChange: "transform" }}
    >
      <div
        style={{
          transform: "translate(-50%, -50%)",
          transition: "color 0.15s, text-shadow 0.15s, font-size 0.1s",
          color: hovering ? "#56e8d4" : "#3ddc84",
          fontSize: clicking ? "13px" : hovering ? "17px" : "15px",
          fontFamily: "monospace",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          textShadow: clicking
            ? "0 0 12px #e8c252, 0 0 24px #e8c252, 0 0 40px #e8c252"
            : hovering
            ? "0 0 10px #56e8d4, 0 0 20px #56e8d4, 0 0 35px #56e8d4"
            : "0 0 8px #3ddc84, 0 0 16px #3ddc84, 0 0 30px #3ddc84",
          userSelect: "none",
        }}
      >
        {clicking ? "{ }" : hovering ? "( )" : "</>"}
      </div>
    </div>
  );
}

function ClickBurst({ x, y }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * Math.PI * 2,
    dist: 30 + Math.random() * 30,
    color: i % 3 === 0 ? "#3ddc84" : i % 3 === 1 ? "#56e8d4" : "#e8c252",
    size: 3 + Math.random() * 4,
    delay: Math.random() * 0.05,
  }));

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
    >
      {/* ring expand */}
      <div
        className="absolute rounded-full border border-accent-green"
        style={{
          width: 8, height: 8,
          left: -4, top: -4,
          animation: "click-ring 0.6s ease-out forwards",
        }}
      />
      <div
        className="absolute rounded-full border border-accent-cyan"
        style={{
          width: 8, height: 8,
          left: -4, top: -4,
          animation: "click-ring 0.8s ease-out 0.1s forwards",
        }}
      />

      {/* code symbol */}
      <div
        className="absolute font-mono text-xs font-bold whitespace-nowrap"
        style={{
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          color: "#3ddc84",
          animation: "click-symbol 0.7s ease-out forwards",
          textShadow: "0 0 8px #3ddc84",
        }}
      >
        {["</>", "{ }", "=>", "[]", "fn()", "git"][Math.floor(Math.random() * 6)]}
      </div>

      {/* particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            background: p.color,
            left: -p.size / 2, top: -p.size / 2,
            boxShadow: `0 0 6px ${p.color}`,
            animation: `click-particle-${i} 0.7s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}

      <style>{`
        @keyframes click-ring {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(8); opacity: 0; }
        }
        @keyframes click-symbol {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(0.5); }
          40%  { opacity: 1; transform: translate(-50%,-180%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%,-280%) scale(0.8); }
        }
        ${particles.map((p, i) => `
          @keyframes click-particle-${i} {
            0%   { transform: translate(0,0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.cos(p.angle) * p.dist}px, ${Math.sin(p.angle) * p.dist}px) scale(0); opacity: 0; }
          }
        `).join("")}
      `}</style>
    </div>
  );
}

export default function CursorEffects() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const segmentsRef = useRef(
    Array.from({ length: SNAKE_LENGTH }, () => ({ x: -200, y: -200 }))
  );
  const frameRef = useRef(null);
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMouseMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const segs = segmentsRef.current;

      // move head toward cursor
      const head = segs[0];
      const dx = mouseRef.current.x - head.x;
      const dy = mouseRef.current.y - head.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        const speed = Math.min(dist * 0.25, 18);
        segs[0] = {
          x: head.x + (dx / dist) * speed,
          y: head.y + (dy / dist) * speed,
        };
      }

      // each segment follows the one before it
      for (let i = 1; i < segs.length; i++) {
        const prev = segs[i - 1];
        const curr = segs[i];
        const ddx = curr.x - prev.x;
        const ddy = curr.y - prev.y;
        const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (ddist > SEGMENT_SIZE) {
          segs[i] = {
            x: prev.x + (ddx / ddist) * SEGMENT_SIZE,
            y: prev.y + (ddy / (ddist === 0 ? 1 : ddist)) * SEGMENT_SIZE,
          };
        }
      }

      // draw snake body
      for (let i = segs.length - 1; i >= 0; i--) {
        const t = i / segs.length;
        const alpha = 1 - t * 0.85;
        const size = SEGMENT_SIZE * (1 - t * 0.55);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (i === 0) {
          // head
          ctx.shadowColor = "#3ddc84";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "#3ddc84";
          ctx.beginPath();
          ctx.arc(segs[i].x, segs[i].y, size / 2 + 2, 0, Math.PI * 2);
          ctx.fill();

          // eyes
          const angle = Math.atan2(
            segs[0].y - (segs[1]?.y ?? segs[0].y),
            segs[0].x - (segs[1]?.x ?? segs[0].x)
          );
          const eyeOffset = size / 2.5;
          const perpX = Math.cos(angle + Math.PI / 2) * eyeOffset * 0.6;
          const perpY = Math.sin(angle + Math.PI / 2) * eyeOffset * 0.6;
          const fwdX = Math.cos(angle) * eyeOffset * 0.4;
          const fwdY = Math.sin(angle) * eyeOffset * 0.4;

          ctx.shadowBlur = 0;
          ctx.fillStyle = "#090c0d";
          ctx.beginPath();
          ctx.arc(segs[0].x + fwdX + perpX, segs[0].y + fwdY + perpY, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(segs[0].x + fwdX - perpX, segs[0].y + fwdY - perpY, 1.8, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // body segments
          const color = i % 3 === 0 ? "#56e8d4" : i % 5 === 0 ? "#e8c252" : "#3ddc84";
          ctx.shadowColor = color;
          ctx.shadowBlur = 10 - t * 8;
          ctx.fillStyle = color;

          ctx.beginPath();
          ctx.save();
          ctx.translate(segs[i].x, segs[i].y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-size / 2.5, -size / 2.5, size / 1.25, size / 1.25);
          ctx.restore();
        }

        ctx.restore();
      }

      // tongue flick
      const now = Date.now();
      if (Math.floor(now / 400) % 3 === 0) {
        const angle = Math.atan2(
          segs[0].y - (segs[1]?.y ?? segs[0].y - 1),
          segs[0].x - (segs[1]?.x ?? segs[0].x - 1)
        );
        const tongueLen = 10;
        const forkLen = 5;
        const tx = segs[0].x + Math.cos(angle) * (SEGMENT_SIZE / 2 + 2);
        const ty = segs[0].y + Math.sin(angle) * (SEGMENT_SIZE / 2 + 2);

        ctx.save();
        ctx.strokeStyle = "#ff5580";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#ff5580";
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        const midX = tx + Math.cos(angle) * tongueLen;
        const midY = ty + Math.sin(angle) * tongueLen;
        ctx.lineTo(midX, midY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(
          midX + Math.cos(angle + 0.5) * forkLen,
          midY + Math.sin(angle + 0.5) * forkLen
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(
          midX + Math.cos(angle - 0.5) * forkLen,
          midY + Math.sin(angle - 0.5) * forkLen
        );
        ctx.stroke();
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  function handleClick(e) {
    const id = Date.now();
    const x = e.clientX;
    const y = e.clientY;
    setClicks((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== id));
    }, 900);
  }

  return (
    <>
      {/* snake canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ mixBlendMode: "screen" }}
      />

      {/* custom cursor */}
      <CustomCursor />

      {/* click burst animations */}
      {clicks.map((c) => (
        <ClickBurst key={c.id} x={c.x} y={c.y} />
      ))}

      {/* hide default cursor everywhere */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* click capture */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        onClickCapture={handleClick}
      />
    </>
  );
}