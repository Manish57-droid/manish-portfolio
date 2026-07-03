"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, MapPin, Moon, Sun, Coffee, Code2, Zap } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// availability schedule — edit freely
const AVAILABILITY = {
  0: { available: false, label: "Weekend Rest",     hours: null },
  1: { available: true,  label: "Open to work",     hours: "9AM – 6PM" },
  2: { available: true,  label: "Open to work",     hours: "9AM – 6PM" },
  3: { available: true,  label: "Open to work",     hours: "9AM – 6PM" },
  4: { available: true,  label: "Open to work",     hours: "9AM – 6PM" },
  5: { available: true,  label: "Open to work",     hours: "9AM – 2PM" },
  6: { available: false, label: "Weekend Rest",     hours: null },
};

function getTimeOfDay(hour) {
  if (hour >= 5  && hour < 12) return { label: "Morning",   icon: Coffee, color: "#e8c252" };
  if (hour >= 12 && hour < 17) return { label: "Afternoon", icon: Sun,    color: "#3ddc84" };
  if (hour >= 17 && hour < 21) return { label: "Evening",   icon: Code2,  color: "#56e8d4" };
  return                               { label: "Night",     icon: Moon,   color: "#8b7cf8" };
}

function getStatus(hour, dayOfWeek) {
  const avail = AVAILABILITY[dayOfWeek];
  if (!avail.available) return { label: "Weekend 🌿",   color: "#5c6b6b", dot: "#5c6b6b" };
  if (hour >= 9  && hour < 18) return { label: "Working 🟢",   color: "#3ddc84", dot: "#3ddc84" };
  if (hour >= 18 && hour < 22) return { label: "Winding down", color: "#e8c252", dot: "#e8c252" };
  return                               { label: "Sleeping 💤",  color: "#5c6b6b", dot: "#5c6b6b" };
}

export default function LiveClock() {
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted || !time) return null;

  const hours   = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const day     = time.getDay();
  const date    = time.getDate();
  const month   = MONTHS[time.getMonth()];
  const year    = time.getFullYear();

  const h12    = hours % 12 || 12;
  const ampm   = hours >= 12 ? "PM" : "AM";
  const minStr = String(minutes).padStart(2, "0");
  const secStr = String(seconds).padStart(2, "0");

  const timeOfDay = getTimeOfDay(hours);
  const status    = getStatus(hours, day);
  const avail     = AVAILABILITY[day];

  // week calendar
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="border border-border bg-panel/60 overflow-hidden">
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-accent-green" />
          <span className="text-[11px] text-ink-muted font-mono">live-clock.ts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: status.dot }}
          />
          <span className="text-[10px] font-mono" style={{ color: status.color }}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid sm:grid-cols-2 gap-6">

          {/* clock */}
          <div>
            <div className="flex items-start gap-2 mb-1">
              <MapPin size={11} className="text-ink-muted mt-1 shrink-0" />
              <span className="text-[11px] text-ink-muted font-mono">
                Ranchi, Jharkhand, India · IST (UTC+5:30)
              </span>
            </div>

            {/* big time display */}
            <div className="mt-4 mb-3">
              <div className="flex items-baseline gap-1 font-mono">
                <motion.span
                  key={h12}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold text-ink"
                >
                  {h12}
                </motion.span>
                <span className="text-3xl font-bold text-accent-green animate-blink">:</span>
                <motion.span
                  key={minutes}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold text-ink"
                >
                  {minStr}
                </motion.span>
                <span className="text-3xl font-bold text-border">:</span>
                <motion.span
                  key={seconds}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl font-bold text-ink-muted"
                >
                  {secStr}
                </motion.span>
                <span className="text-lg font-bold text-accent-cyan ml-1">{ampm}</span>
              </div>

              <p className="text-[12px] text-ink-muted font-mono mt-1">
                {DAYS[day]}, {date} {month} {year}
              </p>
            </div>

            {/* time of day */}
            <div
              className="inline-flex items-center gap-2 border px-3 py-1.5 text-[12px] font-mono"
              style={{
                borderColor: `${timeOfDay.color}40`,
                color: timeOfDay.color,
              }}
            >
              <timeOfDay.icon size={13} />
              {timeOfDay.label} in Ranchi
            </div>

            {/* second progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-ink-dim font-mono mb-1">
                <span>minute progress</span>
                <span>{seconds}s / 60s</span>
              </div>
              <div className="w-full h-1 bg-void border border-border/60 overflow-hidden">
                <motion.div
                  className="h-full bg-accent-green"
                  animate={{ width: `${(seconds / 60) * 100}%` }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </div>
            </div>
          </div>

          {/* availability calendar */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={12} className="text-accent-cyan" />
              <span className="text-[11px] text-ink-muted font-mono">
                availability.schedule
              </span>
            </div>

            {/* week view */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map((d, i) => {
                const isToday   = i === day;
                const dayAvail  = AVAILABILITY[i];
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-mono ${isToday ? "text-accent-green" : "text-ink-dim"}`}>
                      {d}
                    </span>
                    <div
                      className={`w-8 h-8 flex items-center justify-center text-[11px] font-mono border transition-colors ${
                        isToday
                          ? "border-accent-green bg-accent-green/10 text-accent-green"
                          : dayAvail.available
                          ? "border-border/60 text-ink-muted hover:border-accent-green/40"
                          : "border-border/30 text-ink-dim/40"
                      }`}
                    >
                      {dayAvail.available ? (
                        <Zap size={10} className={isToday ? "text-accent-green" : "text-ink-dim"} />
                      ) : (
                        <span className="text-[8px]">—</span>
                      )}
                    </div>
                    {isToday && (
                      <span className="w-1 h-1 rounded-full bg-accent-green" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* today's status */}
            <div
              className="border px-3 py-3 mb-3"
              style={{ borderColor: `${status.dot}30` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-ink-muted font-mono">today</span>
                <span
                  className="text-[11px] font-semibold font-mono"
                  style={{ color: status.color }}
                >
                  {status.label}
                </span>
              </div>
              <p className="text-[12px] text-ink/80">
                {avail.available
                  ? `Available ${avail.hours} IST`
                  : "Taking a break — back Monday!"}
              </p>
            </div>

            {/* quick availability legend */}
            <div className="space-y-1.5">
              {[
                { color: "#3ddc84", label: "Mon–Fri  ·  Available 9AM–6PM IST" },
                { color: "#e8c252", label: "Saturday  ·  Limited 9AM–2PM IST" },
                { color: "#5c6b6b", label: "Sunday  ·  Rest day" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2 text-[11px] text-ink-muted">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                  {row.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}