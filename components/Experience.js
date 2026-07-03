"use client";

import { motion } from "framer-motion";
import SectionFrame from "./SectionFrame";

const TIMELINE = [
  {
    tag: "v3.0.0",
    date: "2024 — Present",
    title: "Full Stack Developer (Freelance / Contract)",
    desc: "Designing and building full stack web applications for clients, handling everything from database schema to deployment on AWS.",
  },
  {
    tag: "v2.1.0",
    date: "2024",
    title: "AWS Certified Cloud Practitioner",
    desc: "Earned AWS certification, deepening hands-on experience with EC2, S3, RDS and IAM for deploying production-ready applications.",
  },
  {
    tag: "v2.0.0",
    date: "2020 — 2024",
    title: "B.Tech in Computer Science Engineering",
    desc: "Studied core CS fundamentals — data structures, algorithms, databases and operating systems — while building side projects.",
  },
  {
    tag: "v1.0.0",
    date: "2020",
    title: "Started the journey",
    desc: "Wrote my first lines of code and got hooked on building things for the web.",
  },
];

export default function Experience() {
  return (
    <SectionFrame id="experience" path="docs / experience.md" lineCount={26}>
      <p className="code-comment text-sm mb-8"># Experience &amp; Education</p>

      <div className="relative pl-6 border-l border-border space-y-10">
        {TIMELINE.map((t, i) => (
          <motion.div
            key={t.tag}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative"
          >
            <span className="absolute -left-[29px] top-1 w-3 h-3 bg-void border-2 border-accent-green" />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
              <span className="text-accent-cyan text-xs font-semibold">{t.tag}</span>
              <span className="text-ink-dim text-xs">{t.date}</span>
            </div>
            <h3 className="text-lg font-bold text-ink mb-1.5">{t.title}</h3>
            <p className="text-sm text-ink/80 leading-relaxed max-w-2xl">{t.desc}</p>
          </motion.div>
        ))}
      </div>
    </SectionFrame>
  );
}
