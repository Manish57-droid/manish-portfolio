"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download, ArrowDownToLine, User } from "lucide-react";
import Image from "next/image";
import SectionFrame from "./SectionFrame";
import Tilt3D from "./Tilt3D";
import LiveClock from "./LiveClock";

export default function About() {
  const ref = useRef(null);
  const [imgError, setImgError] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <SectionFrame id="about" path="src / about.tsx" lineCount={20}>
      <div className="flex flex-col xl:flex-row gap-10 xl:gap-16 items-start">

        {/* left: code content */}
        <motion.div ref={ref} style={{ y, opacity }} className="flex-1 min-w-0">
          <p className="code-comment text-sm mb-1">{"/**"}</p>
          <p className="code-comment text-sm mb-1">{" * Hello, world. Scroll to compile the rest of me."}</p>
          <p className="code-comment text-sm mb-5">{" */"}</p>

          <p className="text-sm leading-7">
            <span className="code-keyword">const</span>{" "}
            <span className="code-prop">developer</span> = {"{"}
          </p>

          <div className="pl-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-3 mb-2 depth-text">
              <span className="text-ink">Manish</span>{" "}
              <span
                className="text-accent-green glitch-name inline-block relative"
                data-text="Kushwaha"
              >
                Kushwaha
                <span
                  className="glitch-name-layer3 text-accent-green"
                  aria-hidden="true"
                  data-text="Kushwaha"
                >
                  Kushwaha
                </span>
              </span>
              <span className="text-accent-cyan animate-blink glitch-rgb">_</span>
            </h1>

            <p className="text-sm mb-5">
              <span className="code-prop">role</span>:{" "}
              <span className="code-string">&quot;Full Stack Developer&quot;</span>,
            </p>

            <p className="text-sm mb-1">
              <span className="code-prop">location</span>:{" "}
              <span className="code-string">&quot;Ranchi, Jharkhand, India&quot;</span>,
            </p>

            <p className="text-sm mb-5">
              <span className="code-prop">certification</span>:{" "}
              <span className="code-string">&quot;AWS Certified Cloud Practitioner&quot;</span>,
            </p>

            <p className="text-sm mb-2">
              <span className="code-prop">bio</span>:{" "}
              <span className="code-string">{"`"}</span>
            </p>
            <p className="max-w-xl text-base leading-relaxed text-ink/90 pl-4 border-l border-border mb-2">
              I build full stack web applications end-to-end — from REST APIs
              and databases to polished, responsive interfaces — and deploy them
              on AWS with an eye for scalability and clean architecture.
              Alongside development, I work with data tools like NumPy, Pandas
              and Orange to explore AI-driven workflows. I enjoy turning
              ambiguous problems into shipped products, one well-tested commit
              at a time.
            </p>
            <p className="text-sm mb-5">
              <span className="code-string">{"`"}</span>,
            </p>
          </div>

          <p className="text-sm">{"}"}</p>

          <div className="flex flex-wrap items-center gap-4 mt-7">
            
             <a href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 bg-accent-green text-void px-5 py-2.5 text-sm font-semibold hover:bg-accent-cyan transition-colors"
            >
              <Download size={16} />
              download resume.pdf
            </a>
            
             <a href="#contact"
              className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent-cyan hover:text-accent-cyan transition-colors"
            >
              <ArrowDownToLine size={16} />
              get in touch
            </a>
          </div>
          
          {/* Live clock */ }
          <div className="mt-8">
            <LiveClock />
          </div>
        </motion.div>

        {/* right: profile image */}
        <motion.div
          style={{ y: yImg }}
          className="w-full xl:w-72 2xl:w-80 shrink-0 self-start sticky top-20"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tilt3D intensity={20} className="relative">

            <span className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-accent-green z-10" />
            <span className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-accent-cyan z-10" />
            <span className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-accent-cyan z-10" />
            <span className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-accent-green z-10" />

            <div className="relative overflow-hidden border border-border aspect-[3/4] bg-panel">
              <Image
                src="/profile.png"
                alt="Manish Kushwaha"
                fill
                className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                onError={() => setImgError(true)}
              />
              {imgError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-dim pointer-events-none">
                  <User size={48} strokeWidth={1} className="text-ink-dim/40" />
                  <p className="text-[11px] text-accent-cyan/70 font-mono">/public/profile.png</p>
                </div>
              )}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, #3ddc84 2px, #3ddc84 3px)",
                }}
              />
              <div className="absolute inset-0 bg-accent-green/10 hover:bg-transparent transition-colors duration-700 pointer-events-none" />
            </div>

            <div className="mt-3 border border-border bg-panel px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-xs text-ink font-semibold">Manish Kushwaha</p>
                <p className="text-[11px] text-ink-muted">Full Stack Developer</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-accent-green border border-accent-green/30 px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                available
              </span>
            </div>

          </Tilt3D>
        </motion.div>

      </div>
    </SectionFrame>
  );
}