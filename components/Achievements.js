"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

const BADGES = [
  {
    id: "explorer",
    icon: "🔍",
    name: "Explorer",
    desc: "Visited all sections",
    color: "#3ddc84",
    condition: (s) => s.sectionsVisited >= 6,
  },
  {
    id: "snake_charmer",
    icon: "🐍",
    name: "Snake Charmer",
    desc: "Moved mouse 2000px total",
    color: "#56e8d4",
    condition: (s) => s.mouseDistance >= 2000,
  },
  {
    id: "clicker",
    icon: "⚡",
    name: "Power Clicker",
    desc: "Clicked 20 times",
    color: "#e8c252",
    condition: (s) => s.clicks >= 20,
  },
  {
    id: "terminal",
    icon: "💻",
    name: "Hacker",
    desc: "Opened the secret terminal",
    color: "#3ddc84",
    condition: (s) => s.terminalOpened,
  },
  {
    id: "reader",
    icon: "📖",
    name: "Deep Reader",
    desc: "Spent 2+ minutes on portfolio",
    color: "#56e8d4",
    condition: (s) => s.timeSpent >= 120,
  },
  {
    id: "recruiter",
    icon: "💼",
    name: "Recruiter",
    desc: "Opened the contact section",
    color: "#e8c252",
    condition: (s) => s.contactVisited,
  },
  {
    id: "night_owl",
    icon: "🦉",
    name: "Night Owl",
    desc: "Visiting between 10PM–4AM",
    color: "#3ddc84",
    condition: () => {
      const h = new Date().getHours();
      return h >= 22 || h < 4;
    },
  },
  {
    id: "commenter",
    icon: "✍️",
    name: "Commenter",
    desc: "Left a message on the wall",
    color: "#56e8d4",
    condition: (s) => s.messagePosted,
  },
  {
    id: "photographer",
    icon: "📷",
    name: "Shutterbug",
    desc: "Checked out the blog section",
    color: "#e8c252",
    condition: (s) => s.blogVisited,
  },
  {
    id: "speedster",
    icon: "🚀",
    name: "Speedster",
    desc: "Scrolled through in under 30s",
    color: "#3ddc84",
    condition: (s) => s.fastScroll,
  },
];

// global state shared across components
if (typeof window !== "undefined" && !window.__achievementState) {
  window.__achievementState = {
    sectionsVisited: 0,
    mouseDistance: 0,
    clicks: 0,
    terminalOpened: false,
    timeSpent: 0,
    contactVisited: false,
    blogVisited: false,
    messagePosted: false,
    fastScroll: false,
    visitedIds: new Set(),
    unlocked: new Set(),
  };
}

export function trackSection(id) {
  if (typeof window === "undefined") return;
  const s = window.__achievementState;
  if (!s.visitedIds.has(id)) {
    s.visitedIds.add(id);
    s.sectionsVisited = s.visitedIds.size;
  }
  if (id === "contact") s.contactVisited = true;
  if (id === "blog") s.blogVisited = true;
}

export function trackTerminal() {
  if (typeof window === "undefined") return;
  window.__achievementState.terminalOpened = true;
}

export function trackMessage() {
  if (typeof window === "undefined") return;
  window.__achievementState.messagePosted = true;
}

export default function Achievements() {
  const [unlocked, setUnlocked] = useState(new Set());
  const [newBadge, setNewBadge] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const startTime = useRef(Date.now());
  const lastMouse = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = window.__achievementState;

    // time tracker
    const timeInterval = setInterval(() => {
      s.timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    }, 1000);

    // mouse distance
    function onMouseMove(e) {
      if (lastMouse.current) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        s.mouseDistance += Math.sqrt(dx * dx + dy * dy);
      }
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    // click tracker
    function onClick() { s.clicks += 1; }

    // fast scroll detector
    const scrollStart = Date.now();
    let bottomReached = false;
    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.body.scrollHeight;
      if (!bottomReached && scrolled >= total - 200) {
        bottomReached = true;
        if ((Date.now() - scrollStart) / 1000 < 30) {
          s.fastScroll = true;
        }
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll);

    // check badges every second
    const checkInterval = setInterval(() => {
      BADGES.forEach((badge) => {
        if (!s.unlocked.has(badge.id) && badge.condition(s)) {
          s.unlocked.add(badge.id);
          setUnlocked((prev) => new Set([...prev, badge.id]));
          setNewBadge(badge);
          setTimeout(() => setNewBadge(null), 4000);
        }
      });
    }, 1000);

    // night owl check immediately
    const h = new Date().getHours();
    if (h >= 22 || h < 4) {
      if (!s.unlocked.has("night_owl")) {
        s.unlocked.add("night_owl");
        setUnlocked((prev) => new Set([...prev, "night_owl"]));
        setTimeout(() => {
          setNewBadge(BADGES.find((b) => b.id === "night_owl"));
          setTimeout(() => setNewBadge(null), 4000);
        }, 2000);
      }
    }

    return () => {
      clearInterval(timeInterval);
      clearInterval(checkInterval);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const unlockedBadges = BADGES.filter((b) => unlocked.has(b.id));
  const lockedBadges = BADGES.filter((b) => !unlocked.has(b.id));

  return (
    <>
      {/* floating trophy button */}
      <motion.button
        onClick={() => setPanelOpen((v) => !v)}
        className="fixed bottom-10 right-4 z-[100] flex items-center gap-2 border border-border bg-panel/90 backdrop-blur-sm px-3 py-2 text-xs text-ink hover:border-accent-green hover:text-accent-green transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: unlocked.size > 0
            ? "0 0 20px rgba(61,220,132,0.3)"
            : "none",
        }}
      >
        <Trophy size={14} className={unlocked.size > 0 ? "text-accent-amber" : "text-ink-dim"} />
        <span className="font-mono">
          {unlocked.size}/{BADGES.length}
        </span>
      </motion.button>

      {/* new badge toast */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, x: 120, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 z-[101] border bg-panel/95 backdrop-blur-sm px-4 py-3 max-w-[240px]"
            style={{
              borderColor: newBadge.color,
              boxShadow: `0 0 20px ${newBadge.color}40`,
            }}
          >
            <p className="text-[10px] text-ink-muted mb-1 font-mono">
              🏆 achievement unlocked
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{newBadge.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: newBadge.color }}>
                  {newBadge.name}
                </p>
                <p className="text-[11px] text-ink-muted">{newBadge.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* badge panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-[100] w-80 border border-border bg-panel/95 backdrop-blur-sm"
            style={{
              boxShadow: "0 0 40px rgba(61,220,132,0.1)",
            }}
          >
            {/* panel header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Trophy size={13} className="text-accent-amber" />
                <span className="text-[12px] font-semibold text-ink font-mono">
                  achievements
                </span>
                <span className="text-[10px] text-accent-green border border-accent-green/30 px-1.5 py-0.5">
                  {unlocked.size}/{BADGES.length}
                </span>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-ink-dim hover:text-accent-green transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-3 max-h-[420px] overflow-y-auto space-y-1">
              {/* unlocked */}
              {unlockedBadges.length > 0 && (
                <>
                  <p className="text-[10px] text-ink-dim font-mono px-1 mb-2">
                    // unlocked
                  </p>
                  {unlockedBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 px-3 py-2.5 border border-border/60 bg-panel/60"
                      style={{ borderColor: `${badge.color}40` }}
                    >
                      <span className="text-xl shrink-0">{badge.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold" style={{ color: badge.color }}>
                          {badge.name}
                        </p>
                        <p className="text-[10px] text-ink-muted truncate">{badge.desc}</p>
                      </div>
                      <span className="ml-auto text-accent-green text-[11px] shrink-0">✓</span>
                    </motion.div>
                  ))}
                </>
              )}

              {/* locked */}
              {lockedBadges.length > 0 && (
                <>
                  <p className="text-[10px] text-ink-dim font-mono px-1 mt-3 mb-2">
                    // locked
                  </p>
                  {lockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 px-3 py-2.5 border border-border/30 opacity-40"
                    >
                      <span className="text-xl shrink-0 grayscale">{badge.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-ink-muted">
                          {badge.name}
                        </p>
                        <p className="text-[10px] text-ink-dim truncate">{badge.desc}</p>
                      </div>
                      <span className="ml-auto text-ink-dim text-[11px] shrink-0">🔒</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* progress bar */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex justify-between text-[10px] text-ink-dim mb-1.5">
                <span>completion</span>
                <span>{Math.round((unlocked.size / BADGES.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-void border border-border/60 overflow-hidden">
                <motion.div
                  className="h-full bg-accent-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlocked.size / BADGES.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}