"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Zap } from "lucide-react";

// ── MATRIX RAIN ──────────────────────────────────────────
function MatrixRain({ onClose }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 16);
    const drops = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * canvas.height / 16)
    );

    const CHARS =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789</>{}[]=>const";

    function draw() {
      ctx.fillStyle = "rgba(9,12,13,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * 16;
        const y = drops[i] * 16;

        // head char — bright white
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px monospace";
        ctx.fillText(char, x, y);

        // body chars — green gradient
        ctx.fillStyle = i % 3 === 0 ? "#56e8d4" : "#3ddc84";
        ctx.font = "13px monospace";
        ctx.fillText(
          CHARS[Math.floor(Math.random() * CHARS.length)],
          x,
          y - 16
        );

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    const timeout = setTimeout(onClose, 6000);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[300] pointer-events-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p
            className="text-4xl font-bold font-mono mb-4"
            style={{
              color: "#3ddc84",
              textShadow: "0 0 20px #3ddc84, 0 0 40px #3ddc84",
            }}
          >
            MATRIX MODE
          </p>
          <p className="text-accent-cyan font-mono text-sm">
            There is no spoon...
          </p>
          <button
            onClick={onClose}
            className="mt-6 border border-accent-green px-4 py-2 text-accent-green font-mono text-sm hover:bg-accent-green hover:text-void transition-colors"
          >
            exit matrix
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── AMBIENT SOUND ─────────────────────────────────────────
function useAmbientSound() {
  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const nodesRef = useRef([]);
  const [playing, setPlaying] = useState(false);

  async function start() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;

      // resume if suspended (browser autoplay policy)
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);
      gainRef.current = masterGain;

      const nodes = [];

      // base drone — A1 note
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = "sine";
      drone.frequency.setValueAtTime(55, ctx.currentTime);
      droneGain.gain.setValueAtTime(0.3, ctx.currentTime);
      drone.connect(droneGain);
      droneGain.connect(masterGain);
      drone.start();
      nodes.push(drone);

      // slow LFO wobble on drone
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      lfoGain.gain.setValueAtTime(4, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(drone.frequency);
      lfo.start();
      nodes.push(lfo);

      // harmonic — A2
      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = "triangle";
      harm.frequency.setValueAtTime(110, ctx.currentTime);
      harmGain.gain.setValueAtTime(0.15, ctx.currentTime);
      harm.connect(harmGain);
      harmGain.connect(masterGain);
      harm.start();
      nodes.push(harm);

      // high shimmer — E5
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = "sine";
      shimmer.frequency.setValueAtTime(659, ctx.currentTime);
      shimmerGain.gain.setValueAtTime(0, ctx.currentTime);
      shimmerGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(masterGain);
      shimmer.start();
      nodes.push(shimmer);

      // pad — A3
      const pad = ctx.createOscillator();
      const padGain = ctx.createGain();
      pad.type = "sine";
      pad.frequency.setValueAtTime(220, ctx.currentTime);
      padGain.gain.setValueAtTime(0.1, ctx.currentTime);
      pad.connect(padGain);
      padGain.connect(masterGain);
      pad.start();
      nodes.push(pad);

      // typewriter ticks
      let tickTimeout;
      function tick() {
        if (!ctxRef.current) return;
        try {
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.015, ctx.sampleRate);
          const data = buf.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 150);
          }
          const src = ctx.createBufferSource();
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.4, ctx.currentTime);
          src.buffer = buf;
          src.connect(g);
          g.connect(masterGain);
          src.start();
        } catch (_) {}
        tickTimeout = setTimeout(tick, 1000 + Math.random() * 2000);
      }
      tick();

      nodesRef.current = { oscillators: nodes, tickTimeout };
      setPlaying(true);

    } catch (err) {
      console.error("Audio error:", err);
    }
  }

  function stop() {
    try {
      const { oscillators, tickTimeout } = nodesRef.current || {};
      clearTimeout(tickTimeout);

      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(
          0,
          ctxRef.current.currentTime + 0.5
        );
      }

      setTimeout(() => {
        oscillators?.forEach((n) => {
          try { n.stop(); n.disconnect(); } catch (_) {}
        });
        ctxRef.current?.close();
        ctxRef.current = null;
        gainRef.current = null;
        nodesRef.current = [];
      }, 600);

    } catch (_) {}
    setPlaying(false);
  }

  function toggle() {
    if (playing) stop();
    else start();
  }

  useEffect(() => () => stop(), []);

  return { playing, toggle };
}

// ── VISUALIZER BARS ───────────────────────────────────────
function Visualizer({ playing }) {
  const bars = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div className="flex items-end gap-0.5 h-4">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-accent-green"
          animate={
            playing
              ? {
                  height: [4, 8 + i * 3, 4, 12 - i * 2, 4],
                  opacity: [0.6, 1, 0.7, 1, 0.6],
                }
              : { height: 2, opacity: 0.3 }
          }
          transition={
            playing
              ? {
                  duration: 0.6 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }
              : { duration: 0.3 }
          }
          style={{ minHeight: 2 }}
        />
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────
export default function ExtraEffects() {
  const { playing, toggle } = useAmbientSound();
  const [matrixOn, setMatrixOn] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // show hint after 10s
  useEffect(() => {
    const t = setTimeout(() => {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 4000);
    }, 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* matrix rain */}
      <AnimatePresence>
        {matrixOn && (
          <MatrixRain onClose={() => setMatrixOn(false)} />
        )}
      </AnimatePresence>

      {/* floating controls */}
      <div className="fixed left-4 bottom-10 z-[100] flex flex-col gap-2">

        {/* sound toggle */}
        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 border px-3 py-2 text-[11px] font-mono backdrop-blur-sm transition-colors ${
            playing
              ? "border-accent-green text-accent-green bg-panel/90"
              : "border-border text-ink-muted bg-panel/80 hover:border-accent-green hover:text-accent-green"
          }`}
          style={{
            boxShadow: playing ? "0 0 16px rgba(61,220,132,0.25)" : "none",
          }}
          title="Toggle ambient sound"
        >
          <div className="flex items-center gap-1.5">
            {playing ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <Visualizer playing={playing} />
          </div>
        </motion.button>

        {/* matrix toggle */}
        <motion.button
          onClick={() => setMatrixOn(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 border border-border px-3 py-2 text-[11px] font-mono text-ink-muted bg-panel/80 backdrop-blur-sm hover:border-accent-cyan hover:text-accent-cyan transition-colors"
          title="Activate Matrix mode"
        >
          <Zap size={12} />
          MATRIX
        </motion.button>
      </div>

      {/* hint toast */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="fixed left-20 bottom-10 z-[100] border border-border bg-panel/90 px-3 py-2 text-[11px] font-mono text-ink-muted backdrop-blur-sm"
          >
            🎵 try ambient sound →
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}