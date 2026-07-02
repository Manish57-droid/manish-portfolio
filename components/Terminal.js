"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square } from "lucide-react";

const RESPONSES = {
  whoami: () => `
<green>Manish Kushwaha</green>
<cyan>Full Stack Developer & AWS Certified Cloud Practitioner</cyan>
Location  : Ranchi, Jharkhand, India
Status    : <green>Available for opportunities</green>
Passion   : Building things that matter, one commit at a time
`,

  help: () => `
Available commands:

  <green>whoami</green>          — who is this guy?
  <green>ls projects</green>     — list all projects
  <green>cat skills.txt</green>  — view tech stack
  <green>cat bio.txt</green>     — read full bio
  <green>git log</green>         — work history
  <green>contact</green>         — get in touch
  <green>hire manish</green>     — best decision you'll make today
  <green>sudo make_me_coffee</green> — ☕
  <green>easter</green>          — 🥚
  <green>clear</green>           — clear terminal
  <green>exit</green>            — close terminal
`,

  "ls projects": () => `
drwxr-xr-x  EcoTrack        <cyan>React · Node.js · MongoDB · AWS S3</cyan>
drwxr-xr-x  DevBoard        <cyan>Next.js · Express · PostgreSQL · EC2</cyan>
drwxr-xr-x  DataLens        <cyan>Python · Pandas · NumPy · Flask</cyan>
<dim>→ Run <green>cat projects/[name]</green> for details</dim>
`,

  "cat projects/ecotrack": () => `
<green>EcoTrack</green> — Carbon Footprint Tracker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A full stack app where users log daily activity
and get AI-assisted suggestions to reduce emissions.
Stack  : React, Node.js, MongoDB, AWS S3
Status : <cyan>Live</cyan>
GitHub : github.com/Manish57-droid
`,

  "cat projects/devboard": () => `
<green>DevBoard</green> — Kanban Project Manager
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Real-time Kanban tool with role-based access
and deployment on AWS using EC2 and RDS.
Stack  : Next.js, Express, PostgreSQL, AWS EC2
Status : <cyan>Live</cyan>
GitHub : github.com/Manish57-droid
`,

  "cat projects/datalens": () => `
<green>DataLens</green> — Data Analysis Playground
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Upload CSVs, clean and visualize datasets using
Pandas, NumPy and Orange-powered workflows.
Stack  : Python, Pandas, NumPy, Flask
Status : <cyan>In Progress</cyan>
GitHub : github.com/Manish57-droid
`,

  "cat skills.txt": () => `
<green>// skills.txt</green>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend  : React ████████░░  Next.js ███████░░░
Backend   : Node.js ████████░  Express ███████░░░
Database  : MongoDB ███████░░  SQL ██████░░░░
Cloud     : AWS ████████░░  (Certified ✓)
DevOps    : Git ████████░░  Linux ██████░░░░
AI/Data   : Python ███████░░  Pandas ██████░░░░
           : NumPy ██████░░░░  Orange █████░░░░░
`,

  "cat bio.txt": () => `
<green>// bio.txt</green>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I build full stack web applications end-to-end —
from REST APIs and databases to polished, responsive
interfaces — and deploy them on AWS with an eye for
scalability and clean architecture.

Alongside development, I work with data tools like
NumPy, Pandas and Orange to explore AI-driven workflows.

I enjoy turning ambiguous problems into shipped
products, one well-tested commit at a time.

Also: I love photography 📷
`,

  "git log": () => `
<green>commit a3f9c12</green> — AWS Certified Cloud Practitioner ✓
<green>commit b7e2d45</green> — Shipped DataLens v1.0
<green>commit c8f3e91</green> — Deployed DevBoard to AWS EC2
<green>commit d4a1b72</green> — Completed B.Tech in CS Engineering
<green>commit e9c5f83</green> — Built first full stack app
<green>commit f2b8d64</green> — Wrote first line of code
<dim>→ And so the journey began...</dim>
`,

  contact: () => `
<green>// Let's build something together</green>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email    : <cyan>manishkushwaha572000@gmail.com</cyan>
GitHub   : <cyan>github.com/Manish57-droid</cyan>
LinkedIn : <cyan>linkedin.com/in/manish-kushwaha-web-developer</cyan>
Instagram: <cyan>instagram.com/manish.kushwaha__</cyan>
`,

  "hire manish": () => `
<green>
███████╗███╗   ███╗ █████╗ ██████╗ ████████╗    
██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝    
███████╗██╔████╔██║███████║██████╔╝   ██║       
╚════██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║       
███████║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║       
╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       
</green>
<cyan>Excellent choice. Redirecting to contact form...</cyan>
<dim>→ Scroll down to the contact section or email:</dim>
<green>manishkushwaha572000@gmail.com</green>
`,

  "sudo make_me_coffee": () => `
[sudo] password for visitor: ********
Authenticating... <green>✓</green>

<cyan>Brewing coffee...</cyan>
█░░░░░░░░░  10%  — Heating water
███░░░░░░░  30%  — Grinding beans  
█████░░░░░  50%  — Extracting espresso
███████░░░  70%  — Adding milk foam
██████████  100% — <green>☕ Coffee ready!</green>

<dim>Note: This is a virtual coffee. Real coffee requires
      you to visit Ranchi, Jharkhand, India.</dim>
`,

  easter: () => `
<green>🥚 You found it!</green>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<cyan>
    /\\_/\\  
   ( o.o ) 
    > ^ <  
</cyan>
You are one of the few who explore deeply.
That's exactly the kind of curiosity I bring to code.

<dim>Try: <green>hire manish</green></dim>
`,

  clear: () => "__CLEAR__",
  exit: () => "__EXIT__",

  "": () => "",
};

function UNKNOWN(cmd) {
  return `<dim>command not found: ${cmd}</dim>
<dim>Type <green>help</green> for available commands.</dim>`;
}

function parseOutput(text) {
  if (!text) return null;
  const html = text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&lt;green&gt;(.*?)&lt;\/green&gt;/gs, '<span class="text-accent-green">$1</span>')
    .replace(/&lt;cyan&gt;(.*?)&lt;\/cyan&gt;/gs, '<span class="text-accent-cyan">$1</span>')
    .replace(/&lt;dim&gt;(.*?)&lt;\/dim&gt;/gs, '<span class="text-ink-muted">$1</span>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const BOOT_LINES = [
  { text: "Initializing Manish.exe...", delay: 0 },
  { text: "Loading kernel modules... ✓", delay: 300 },
  { text: "Mounting AWS credentials... ✓", delay: 600 },
  { text: "Importing { skills } from './manish'... ✓", delay: 900 },
  { text: "Starting portfolio services... ✓", delay: 1200 },
  { text: "All systems operational. Type 'help' to begin.", delay: 1500, green: true },
];

export default function Terminal({ onClose }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booting, setBooting] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // boot sequence
  useEffect(() => {
    BOOT_LINES.forEach(({ text, delay, green }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { type: "boot", text, green }]);
        if (delay === 1500) setBooting(false);
      }, delay);
    });
  }, []);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // focus input
  useEffect(() => {
    if (!booting) inputRef.current?.focus();
  }, [booting]);

  function handleSubmit(e) {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    setLines((prev) => [
      ...prev,
      { type: "input", text: input.trim() },
    ]);
    setHistory((prev) => [input.trim(), ...prev]);
    setHistoryIndex(-1);
    setInput("");

    const fn = RESPONSES[cmd];
    if (fn) {
      const result = fn();
      if (result === "__CLEAR__") {
        setLines([]);
        return;
      }
      if (result === "__EXIT__") {
        onClose();
        return;
      }
      setLines((prev) => [...prev, { type: "output", text: result }]);
    } else if (cmd !== "") {
      setLines((prev) => [...prev, { type: "output", text: UNKNOWN(cmd) }]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setInput(history[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInput(next === -1 ? "" : history[next]);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(9,12,13,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-3xl border border-border bg-void shadow-2xl flex flex-col"
        style={{
          height: "min(600px, 85vh)",
          boxShadow: "0 0 60px rgba(61,220,132,0.15), 0 0 120px rgba(61,220,132,0.05)",
        }}
      >
        {/* title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-panel shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110" />
            <button className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <button className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[12px] text-ink-muted font-mono">
            manish@portfolio:~$
          </span>
          <button onClick={onClose} className="text-ink-dim hover:text-accent-green transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* output area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed space-y-1"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i}>
              {line.type === "boot" && (
                <p className={line.green ? "text-accent-green" : "text-ink-muted"}>
                  {line.text}
                </p>
              )}
              {line.type === "input" && (
                <p>
                  <span className="text-accent-green">manish@portfolio</span>
                  <span className="text-ink-muted">:</span>
                  <span className="text-accent-cyan">~</span>
                  <span className="text-ink-muted">$ </span>
                  <span className="text-ink">{line.text}</span>
                </p>
              )}
              {line.type === "output" && (
                <div className="text-ink/85 whitespace-pre-wrap pl-2 border-l border-border/40 ml-1 my-1">
                  {parseOutput(line.text)}
                </div>
              )}
            </div>
          ))}

          {/* input line */}
          {!booting && (
            <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-1">
              <span className="text-accent-green shrink-0">manish@portfolio</span>
              <span className="text-ink-muted">:</span>
              <span className="text-accent-cyan shrink-0">~</span>
              <span className="text-ink-muted shrink-0">$ </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-ink focus:outline-none caret-accent-green min-w-0"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </form>
          )}
          <div ref={bottomRef} />
        </div>

        {/* status bar */}
        <div className="px-4 py-1.5 border-t border-border bg-panel shrink-0 flex items-center justify-between">
          <span className="text-[10px] text-ink-dim font-mono">
            Press <kbd className="border border-border px-1 py-0.5 text-accent-green">`</kbd> to toggle  ·  <span className="text-accent-green">↑↓</span> history  ·  <span className="text-accent-green">help</span> for commands
          </span>
          <span className="text-[10px] text-accent-green font-mono">● connected</span>
        </div>
      </div>
    </motion.div>
  );
}