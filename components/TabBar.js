"use client";

import { Circle, X } from "lucide-react";

const TABS = [
  { id: "about", label: "about.tsx" },
  { id: "skills", label: "skills.json" },
  { id: "constellation", label: "constellation.tsx" },
  {/*{ id: "projects", label: "projects/" },*/}
  { id: "experience", label: "experience.md" },
  { id: "github", label: "github-stats.json" },
  { id: "blog", label: "blog/" },
  { id: "messages", label: "messages.log" },
  { id: "visitors", label: "visitor-map.tsx" },
  { id: "contact", label: "contact.tsx" },
];

export default function TabBar({ active, onNavigate }) {
  return (
    <div className="sticky top-0 z-30 bg-panel border-b border-border pl-16 lg:pl-0">
      <div className="flex overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 text-[12px] whitespace-nowrap border-r border-border transition-colors ${
                isActive
                  ? "bg-void text-accent-green border-t-2 border-t-accent-green -mt-px"
                  : "text-ink-muted hover:text-ink hover:bg-panel2/50"
              }`}
            >
              <Circle
                size={6}
                className={isActive ? "fill-accent-green text-accent-green" : "fill-ink-dim text-ink-dim"}
              />
              {t.label}
              <X size={11} className="opacity-0 group-hover:opacity-40" />
            </button>
          );
        })}
      </div>
    </div>
  );
}