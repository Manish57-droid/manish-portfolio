"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ParallaxBackground from "../components/ParallaxBackground";
import Sidebar from "../components/Sidebar";
import TabBar from "../components/TabBar";
import StatusBar from "../components/StatusBar";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import Rocket from "../components/Rocket";
import CursorEffects from "../components/CursorEffects";
import Terminal from "../components/Terminal";
import MessagesWall from "../components/MessagesWall";
import GitHubStats from "../components/GitHubStats";
import Achievements, { trackSection, trackTerminal } from "../components/Achievements";
import VisitorMap from "../components/VisitorMap";
import LoadingScreen from "../components/LoadingScreen";
import ExtraEffects from "../components/ExtraEffects";
import Constellation from "../components/Constellation";
import ScrollProgress from "../components/ScrollProgress";
import ThemeToggle from "../components/ThemeToggle";

const SECTION_IDS = ["about", "skills", "constellation", "projects", "experience", "github", "blog", "messages", "visitors", "contact"];


export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState("about");
  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleNavigate = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // backtick key toggles terminal
  useEffect(() => {
  function onKey(e) {
    if (e.key === "`") {
      e.preventDefault();
      setTerminalOpen((v) => !v);
      trackTerminal();
    }
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
          trackSection(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
  return () => observer.disconnect();
}, []);

  return (
    <main className="relative min-h-screen text-ink">
     <AnimatePresence>
      {!loaded && (
      <LoadingScreen onComplete={() => setLoaded(true)} />
        )}
      </AnimatePresence>
      <ParallaxBackground />
      <Rocket />
      <CursorEffects />
      <Achievements />
      <ExtraEffects />
      <ScrollProgress />
      <ThemeToggle />
      <AnimatePresence>
        {terminalOpen && (
          <Terminal onClose={() => setTerminalOpen(false)} />
        )}
      </AnimatePresence>

      <Sidebar active={active} onNavigate={handleNavigate} />

      <div className="lg:pl-64 pb-10">
        <TabBar active={active} onNavigate={handleNavigate} />
        <About />
        <Skills />
        <Constellation />
        <Projects />
        <Experience />
        <GitHubStats />
        <Blog />
        <MessagesWall />
        <VisitorMap />
        <Contact />

        <footer className="px-4 lg:px-8 py-8 text-center text-[11px] text-ink-dim">
          <p>
            built with <span className="text-accent-green">Next.js</span> +{" "}
            <span className="text-accent-cyan">Tailwind</span> +{" "}
            <span className="text-accent-amber">Framer Motion</span>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Manish Kushwaha. All rights reserved.</p>
          <p className="mt-2 text-accent-green/50">
            Press <kbd className="border border-border px-1.5 py-0.5 text-accent-green/70">`</kbd> to open terminal
          </p>
        </footer>
      </div>

      <StatusBar active={active} />
    </main>
  );
}