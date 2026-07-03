"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Users, Loader2, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";

// World map SVG paths (simplified continents)
const CONTINENTS = [
  // North America
  "M 80 80 L 180 70 L 200 120 L 180 180 L 120 200 L 80 160 Z",
  // South America
  "M 140 210 L 190 200 L 210 280 L 180 340 L 140 320 L 120 260 Z",
  // Europe
  "M 330 60 L 420 55 L 440 100 L 400 130 L 340 120 L 320 90 Z",
  // Africa
  "M 340 140 L 420 130 L 450 200 L 430 300 L 370 320 L 330 280 L 320 200 Z",
  // Asia
  "M 440 50 L 650 40 L 700 100 L 680 180 L 580 200 L 460 180 L 430 120 Z",
  // Australia
  "M 580 260 L 660 250 L 680 310 L 640 340 L 580 320 Z",
];

function worldToSVG(lat, lng) {
  // convert lat/lng to x/y on our 800x420 viewbox
  const x = ((lng + 180) / 360) * 800;
  const y = ((90 - lat) / 180) * 420;
  return { x, y };
}

function VisitorDot({ lat, lng, country, city, index }) {
  const [hovered, setHovered] = useState(false);
  const { x, y } = worldToSVG(lat, lng);

  return (
    <g>
      {/* outer pulse ring */}
      <circle
        cx={x} cy={y} r={8}
        fill="none"
        stroke="#3ddc84"
        strokeWidth="1"
        opacity="0.3"
      >
        <animate
          attributeName="r"
          values="4;12;4"
          dur={`${2 + index * 0.3}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur={`${2 + index * 0.3}s`}
          repeatCount="indefinite"
        />
      </circle>

      {/* dot */}
      <circle
        cx={x} cy={y} r={4}
        fill="#3ddc84"
        stroke="#090c0d"
        strokeWidth="1"
        style={{
          filter: "drop-shadow(0 0 4px #3ddc84)",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* tooltip */}
      {hovered && (
        <g>
          <rect
            x={x + 8} y={y - 20}
            width={Math.max(city?.length || 0, country?.length || 0) * 7 + 16}
            height={city ? 36 : 22}
            fill="#0e1414"
            stroke="#1c2826"
            strokeWidth="1"
            rx="2"
          />
          <text x={x + 16} y={y - 6} fill="#3ddc84" fontSize="10" fontFamily="monospace">
            {country}
          </text>
          {city && (
            <text x={x + 16} y={y + 8} fill="#5c6b6b" fontSize="9" fontFamily="monospace">
              {city}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

export default function VisitorMap() {
  const [visitors, setVisitors] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tracked, setTracked] = useState(false);
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    async function trackAndLoad() {
      // get visitor location
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data.latitude && data.longitude && !tracked) {
          setTracked(true);
          await supabase.from("visitors").insert([{
            country: data.country_name || "Unknown",
            city: data.city || "",
            lat: data.latitude,
            lng: data.longitude,
          }]);
        }
      } catch (_) {}

      // fetch all visitors
      const { data: allVisitors } = await supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false });

      if (allVisitors) {
        setTotalCount(allVisitors.length);

        // unique countries
        const countries = new Set(allVisitors.map((v) => v.country));
        setCountryCount(countries.size);

        // deduplicate by country for map dots (one dot per country)
        const seen = new Set();
        const unique = allVisitors.filter((v) => {
          if (seen.has(v.country)) return false;
          seen.add(v.country);
          return true;
        });
        setVisitors(unique);

        // recent 5 for the list
        setRecentVisitors(allVisitors.slice(0, 5));
      }

      setLoading(false);
    }

    trackAndLoad();

    // realtime
    const channel = supabase
      .channel("visitors-channel")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "visitors",
      }, (payload) => {
        setTotalCount((v) => v + 1);
        setRecentVisitors((prev) => [payload.new, ...prev].slice(0, 5));
        setVisitors((prev) => {
          const exists = prev.find((v) => v.country === payload.new.country);
          if (exists) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <section id="visitors" className="relative border-b border-border scroll-mt-12">
      <div className="px-4 lg:px-8 pt-3 pb-1 text-[11px] text-ink-dim tracking-wide border-b border-border/60">
        live / visitor-map.tsx
      </div>

      <div className="px-4 lg:px-8 py-8">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-accent-green" />
            <div>
              <h2 className="text-xl font-bold text-ink">
                <span className="code-keyword">const</span>{" "}
                <span className="code-prop">visitors</span>{" "}
                <span className="text-ink">=</span>{" "}
                <span className="text-accent-green">await</span>{" "}
                <span className="text-accent-cyan">fetchWorld()</span>
              </h2>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Every dot is a real person who visited this portfolio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] border border-border px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-ink-muted">live tracking</span>
          </div>
        </div>

        {/* stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="border border-border bg-panel/60 p-3">
            <p className="text-[10px] text-ink-muted font-mono mb-1">total_visitors</p>
            <p className="text-2xl font-bold text-accent-green font-mono">
              {loading ? "..." : totalCount}
            </p>
          </div>
          <div className="border border-border bg-panel/60 p-3">
            <p className="text-[10px] text-ink-muted font-mono mb-1">countries</p>
            <p className="text-2xl font-bold text-accent-cyan font-mono">
              {loading ? "..." : countryCount}
            </p>
          </div>
          <div className="border border-border bg-panel/60 p-3 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-ink-muted font-mono mb-1">you_are</p>
            <p className="text-sm font-bold text-accent-amber font-mono">
              visitor #{loading ? "..." : totalCount}
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-ink-muted text-sm">
            <Loader2 size={16} className="animate-spin text-accent-green" />
            loading world map...
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            {/* world map */}
            <div
              className="relative border border-border bg-panel/30 overflow-hidden"
              style={{ borderRadius: 0 }}
            >
              <svg
                viewBox="0 0 800 420"
                className="w-full"
                style={{ background: "transparent" }}
              >
                {/* grid lines */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0" y1={(i + 1) * 42}
                    x2="800" y2={(i + 1) * 42}
                    stroke="#1c2826" strokeWidth="0.5"
                  />
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={(i + 1) * 53} y1="0"
                    x2={(i + 1) * 53} y2="420"
                    stroke="#1c2826" strokeWidth="0.5"
                  />
                ))}

                {/* equator */}
                <line
                  x1="0" y1="210" x2="800" y2="210"
                  stroke="#3ddc84" strokeWidth="0.5" opacity="0.3"
                />

                {/* continents */}
                {CONTINENTS.map((d, i) => (
                  <path
                    key={i} d={d}
                    fill="#1c2826" stroke="#3ddc84"
                    strokeWidth="0.8" opacity="0.6"
                  />
                ))}

                {/* visitor dots */}
                {visitors.map((v, i) => (
                  v.lat && v.lng ? (
                    <VisitorDot
                      key={v.id}
                      lat={v.lat}
                      lng={v.lng}
                      country={v.country}
                      city={v.city}
                      index={i}
                    />
                  ) : null
                ))}
              </svg>

              {/* corner label */}
              <div className="absolute top-2 left-3 text-[10px] text-ink-dim font-mono">
                world.map {"// hover dots for location"}
              </div>
            </div>

            {/* recent visitors */}
            <div>
              <p className="text-[11px] text-ink-dim font-mono mb-3">
                // recent visitors
              </p>
              <div className="space-y-1">
                <AnimatePresence>
                  {recentVisitors.map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-[12px] border-b border-border/30 py-2 px-2"
                    >
                      <MapPin size={10} className="text-accent-green shrink-0" />
                      <span className="text-ink/80">{v.country}</span>
                      {v.city && (
                        <span className="text-ink-muted">— {v.city}</span>
                      )}
                      <span className="ml-auto text-[10px] text-ink-dim font-mono">
                        {new Date(v.created_at).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}