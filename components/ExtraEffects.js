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

      if (ctx.state === "suspended") await ctx.resume();

      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 3);
      master.connect(ctx.destination);
      gainRef.current = master;

      const nodes = [];

      // reverb convolver for spacious feel
      const convolver = ctx.createConvolver();
      const reverbLen = ctx.sampleRate * 3;
      const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const data = reverbBuf.getChannelData(c);
        for (let i = 0; i < reverbLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2);
        }
      }
      convolver.buffer = reverbBuf;
      const reverbGain = ctx.createGain();
      reverbGain.gain.setValueAtTime(0.4, ctx.currentTime);
      convolver.connect(reverbGain);
      reverbGain.connect(master);

      // deep sub bass pad — very soft
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = "sine";
      bass.frequency.setValueAtTime(40, ctx.currentTime);
      bassGain.gain.setValueAtTime(0.12, ctx.currentTime);
      bass.connect(bassGain);
      bassGain.connect(master);
      bass.start();
      nodes.push(bass);

      // warm mid pad — A2
      const pad1 = ctx.createOscillator();
      const pad1Gain = ctx.createGain();
      pad1.type = "triangle";
      pad1.frequency.setValueAtTime(110, ctx.currentTime);
      pad1Gain.gain.setValueAtTime(0.08, ctx.currentTime);
      pad1.connect(pad1Gain);
      pad1Gain.connect(convolver);
      pad1Gain.connect(master);
      pad1.start();
      nodes.push(pad1);

      // soft harmony — E3
      const pad2 = ctx.createOscillator();
      const pad2Gain = ctx.createGain();
      pad2.type = "sine";
      pad2.frequency.setValueAtTime(165, ctx.currentTime);
      pad2Gain.gain.setValueAtTime(0.06, ctx.currentTime);
      pad2.connect(pad2Gain);
      pad2Gain.connect(convolver);
      pad2Gain.connect(master);
      pad2.start();
      nodes.push(pad2);

      // high crystal shimmer — A4
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = "sine";
      shimmer.frequency.setValueAtTime(440, ctx.currentTime);
      shimmerGain.gain.setValueAtTime(0, ctx.currentTime);
      shimmerGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 4);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(convolver);
      shimmerGain.connect(master);
      shimmer.start();
      nodes.push(shimmer);

      // very slow LFO breathing on pad1
      const lfo1 = ctx.createOscillator();
      const lfo1Gain = ctx.createGain();
      lfo1.type = "sine";
      lfo1.frequency.setValueAtTime(0.05, ctx.currentTime);
      lfo1Gain.gain.setValueAtTime(0.04, ctx.currentTime);
      lfo1.connect(lfo1Gain);
      lfo1Gain.connect(pad1Gain.gain);
      lfo1.start();
      nodes.push(lfo1);

      // slow LFO on shimmer for twinkling effect
      const lfo2 = ctx.createOscillator();
      const lfo2Gain = ctx.createGain();
      lfo2.type = "sine";
      lfo2.frequency.setValueAtTime(0.12, ctx.currentTime);
      lfo2Gain.gain.setValueAtTime(0.02, ctx.currentTime);
      lfo2.connect(lfo2Gain);
      lfo2Gain.connect(shimmerGain.gain);
      lfo2.start();
      nodes.push(lfo2);

      // gentle pitch drift on bass
      const lfo3 = ctx.createOscillator();
      const lfo3Gain = ctx.createGain();
      lfo3.type = "sine";
      lfo3.frequency.setValueAtTime(0.03, ctx.currentTime);
      lfo3Gain.gain.setValueAtTime(1.5, ctx.currentTime);
      lfo3.connect(lfo3Gain);
      lfo3Gain.connect(bass.frequency);
      lfo3.start();
      nodes.push(lfo3);

      // soft pink noise for warmth
      function createPinkNoise() {
        const bufSize = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
        for (let i = 0; i < bufSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886*b0 + white*0.0555179;
          b1 = 0.99332*b1 + white*0.0750759;
          b2 = 0.96900*b2 + white*0.1538520;
          b3 = 0.86650*b3 + white*0.3104856;
          b4 = 0.55000*b4 + white*0.5329522;
          b5 = -0.7616*b5 - white*0.0168980;
          data[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362) * 0.11;
          b6 = white * 0.115926;
        }
        return buf;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = createPinkNoise();
      noiseSource.loop = true;
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);
      noiseGain.gain.setValueAtTime(0.018, ctx.currentTime);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noiseSource.start();
      nodes.push(noiseSource);

      // gentle chime notes every few seconds
      let chimeTimeout;
      const CHIME_NOTES = [523, 659, 784, 880, 1047];
      function playChime() {
        if (!ctxRef.current) return;
        try {
          const note = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
          const osc = ctx.createOscillator();
          const env = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(note, ctx.currentTime);
          env.gain.setValueAtTime(0, ctx.currentTime);
          env.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
          env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          osc.connect(env);
          env.connect(convolver);
          env.connect(master);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 2.5);
        } catch (_) {}
        chimeTimeout = setTimeout(playChime, 3000 + Math.random() * 5000);
      }
      chimeTimeout = setTimeout(playChime, 2000);

      nodesRef.current = { oscillators: nodes, chimeTimeout };
      setPlaying(true);

    } catch (err) {
      console.error("Audio error:", err);
    }
  }

  function stop() {
    try {
      const { oscillators, chimeTimeout } = nodesRef.current || {};
      clearTimeout(chimeTimeout);

      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(
          0, ctxRef.current.currentTime + 1.5
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
      }, 1600);

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