"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import SectionFrame from "./SectionFrame";
import Tilt3D from "./Tilt3D";

const PROJECTS = [
  {
    file: "Lingo.tsx",
    name: "Lingo",
    desc: "A full stack clone of Duolingo, built with React, Node.js, and MongoDB, deployed on AWS S3. It features user authentication, interactive language lessons, and progress tracking.",
    stack: ["React", "Node.js", "MongoDB", "AWS S3"],
    github: "https://github.com/Manish57-droid/lingo",
    live: "https://lingo-sand.vercel.app/",
  },
  {
    file: "Kesh-Fitness.tsx",
    name: "Kesh-Fitness",
    desc: "A gym management web application that allows users to track their workouts, manage memberships, and schedule classes. Built with Next.js, Express, and PostgreSQL.",
    stack: ["Next.js", "Express", "PostgreSQL", "AWS EC2"],
    github: "https://github.com/Manish57-droid/kesh-fitness",
    live: "https://kesh-fitness.vercel.app/",
  },
  {
    file: "datalens.tsx",
    name: "DataLens",
    desc: "A data analysis playground that uses Pandas and NumPy on the backend to clean and visualize uploaded CSV datasets, with Orange-powered workflow templates.",
    stack: ["Python", "Pandas", "NumPy", "Flask"],
    github: "https://github.com/Manish57-droid",
    live: "#",
  },
];

export default function Projects() {
  return (
    <SectionFrame id="projects" path="src / projects /" lineCount={34}>
      <p className="code-comment text-sm mb-8">
        {"// a few things I've shipped — replace with real links anytime"}
      </p>

      <div className="space-y-6">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.file}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Tilt3D className="border border-border bg-panel/40 hover:border-accent-green/60 transition-colors">
            </Tilt3D>
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-panel">
              <span className="text-[12px] text-ink-muted">{p.file}</span>
              <span className="text-[11px] text-ink-dim">0{i + 1}</span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-ink mb-2">
                <span className="code-keyword">function</span>{" "}
                <span className="text-accent-green">{p.name}</span>
                <span className="text-ink">()</span>
              </h3>
              <p className="text-sm text-ink/80 leading-relaxed mb-4 max-w-2xl">
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] text-accent-cyan border border-border px-2 py-1"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent-green transition-colors"
                >
                  <Github size={15} /> source
                </a>
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent-cyan transition-colors"
                >
                  <ExternalLink size={15} /> live demo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionFrame>
  );
}
