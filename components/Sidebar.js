"use client";

import { useState } from "react";
import {
  FileCode2,
  FolderOpen,
  Folder,
  Braces,
  FileText,
  Image as ImageIcon,
  X,
  Menu,
} from "lucide-react";

const FILES = [
  { id: "about", label: "about.tsx", icon: FileCode2 },
  { id: "skills", label: "skills.json", icon: Braces },
  { id: "constellation", label: "constellation.tsx", icon: FileCode2 },
  { id: "projects", label: "projects/", icon: Folder, isDir: true },
  { id: "experience", label: "experience.md", icon: FileText },
  { id: "github", label: "github-stats.json", icon: Braces },
  { id: "blog", label: "blog/", icon: ImageIcon, isDir: true },
  { id: "messages", label: "messages.log", icon: FileText },
  { id: "visitors", label: "visitor-map.tsx", icon: FileCode2 },
  { id: "contact", label: "contact.tsx", icon: FileCode2 },
];

export default function Sidebar({ active, onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleClick = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      {/* mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 flex items-center gap-2 bg-panel border border-border px-3 py-2 text-xs text-ink"
        aria-label="Open file explorer"
      >
        <Menu size={14} className="text-accent-green" />
        EXPLORER
      </button>

      {/* overlay for mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-void/80"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-panel border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:flex lg:flex-col`}
      >
        <div className="flex items-center justify-between px-3 h-12 border-b border-border">
          <span className="text-[11px] tracking-[0.2em] text-ink-muted uppercase">
            Explorer
          </span>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-ink-muted hover:text-accent-cyan"
            aria-label="Close file explorer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3 py-2 text-[11px] text-ink-muted tracking-wide flex items-center gap-1.5">
          <FolderOpen size={14} className="text-accent-cyan" />
          manish-kushwaha
        </div>

        <nav className="flex-1 px-2 py-1">
          {FILES.map((f) => {
            const Icon = f.icon;
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleClick(f.id)}
                className={`w-full flex items-center gap-2 pl-6 pr-3 py-1.5 text-[13px] text-left transition-colors border-l-2 ${
                  isActive
                    ? "bg-panel2 border-accent-green text-accent-green"
                    : "border-transparent text-ink-muted hover:text-ink hover:bg-panel2/60"
                }`}
              >
                <Icon size={14} className={isActive ? "text-accent-green" : "text-ink-dim"} />
                {f.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-border text-[10px] text-ink-dim leading-relaxed">
          <p>Manish Kushwaha</p>
          <p>Full Stack Developer</p>
          <p className="text-accent-green">● Ranchi, Jharkhand</p>
        </div>
      </aside>
    </>
  );
}
