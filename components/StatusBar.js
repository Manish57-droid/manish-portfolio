"use client";

import { GitBranch, Wifi, CheckCircle2 } from "lucide-react";

export default function StatusBar({ active }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 h-7 bg-accent-green text-void flex items-center justify-between px-3 text-[11px] font-medium">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch size={12} /> main
        </span>
        <span className="hidden sm:flex items-center gap-1">
          <CheckCircle2 size={12} /> build passing
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline">section: {active}</span>
        <span>UTF-8</span>
        <span className="hidden sm:flex items-center gap-1">
          <Wifi size={12} /> Next.js
        </span>
      </div>
    </div>
  );
}
