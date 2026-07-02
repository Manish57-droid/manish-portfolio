"use client";

import { motion } from "framer-motion";
import SectionFrame from "./SectionFrame";

const SKILL_GROUPS = [
  {
    key: "frontend",
    items: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    ],
  },
  {
    key: "backend",
    items: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "REST APIs", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    ],
  },
  {
    key: "cloud_devops",
    items: [
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
    ],
  },
  {
    key: "data_ai_tools",
    items: [
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
      { name: "Pandas", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
      { name: "Orange", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
    ],
  },
];

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
};

export default function Skills() {
  return (
    <SectionFrame id="skills" path="src / skills.json" lineCount={22}>
      <style>{`
        .skill-card {
          position: relative;
          overflow: hidden;
        }
        .skill-card::before,
        .skill-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          opacity: 0;
        }
        .skill-card:hover::before {
          opacity: 0.7;
          animation: skill-glitch-1 0.4s steps(1) infinite;
        }
        .skill-card:hover::after {
          opacity: 0.5;
          animation: skill-glitch-2 0.3s steps(1) infinite;
        }
        @keyframes skill-glitch-1 {
          0%   { clip-path: inset(0 0 90% 0); transform: translate(-3px, 0); background: rgba(61,220,132,0.08); }
          25%  { clip-path: inset(40% 0 40% 0); transform: translate(3px, 0); background: rgba(86,232,212,0.08); }
          50%  { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 0); background: rgba(61,220,132,0.08); }
          75%  { clip-path: inset(20% 0 60% 0); transform: translate(2px, 0); background: rgba(232,194,82,0.05); }
          100% { clip-path: inset(85% 0 5% 0);  transform: translate(-3px, 0); background: rgba(86,232,212,0.08); }
        }
        @keyframes skill-glitch-2 {
          0%   { clip-path: inset(50% 0 30% 0); transform: translate(3px, 0); background: rgba(86,232,212,0.06); }
          33%  { clip-path: inset(10% 0 75% 0); transform: translate(-3px, 0); background: rgba(61,220,132,0.06); }
          66%  { clip-path: inset(80% 0 5% 0);  transform: translate(2px, 0);  background: rgba(232,194,82,0.04); }
          100% { clip-path: inset(30% 0 55% 0); transform: translate(-2px, 0); background: rgba(86,232,212,0.06); }
        }
        .skill-icon {
          transition: all 0.3s ease;
          filter: grayscale(30%) brightness(0.9);
        }
        .skill-card:hover .skill-icon {
          filter: grayscale(0%) brightness(1.2) drop-shadow(0 0 6px #3ddc84);
          animation: icon-glitch 0.4s steps(2) infinite;
        }
        @keyframes icon-glitch {
          0%   { transform: translate(0, 0); filter: grayscale(0%) brightness(1.2) drop-shadow(0 0 6px #3ddc84) hue-rotate(0deg); }
          25%  { transform: translate(-2px, 0); filter: grayscale(0%) brightness(1.4) drop-shadow(0 0 8px #56e8d4) hue-rotate(20deg); }
          50%  { transform: translate(2px, 0); filter: grayscale(0%) brightness(1.2) drop-shadow(0 0 6px #3ddc84) hue-rotate(-20deg); }
          75%  { transform: translate(-1px, 0); filter: grayscale(0%) brightness(1.5) drop-shadow(0 0 10px #e8c252) hue-rotate(10deg); }
          100% { transform: translate(0, 0); filter: grayscale(0%) brightness(1.2) drop-shadow(0 0 6px #3ddc84) hue-rotate(0deg); }
        }
        .skill-name {
          transition: all 0.2s;
        }
        .skill-card:hover .skill-name {
          color: #3ddc84;
          text-shadow: 0 0 8px #3ddc84, -1px 0 #56e8d4, 1px 0 #e8c252;
          animation: name-flicker 0.3s steps(1) infinite;
        }
        @keyframes name-flicker {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.85; }
        }
      `}</style>

      <p className="text-sm mb-4">{"{"}</p>
      <div className="pl-4 space-y-7">
        {SKILL_GROUPS.map((group) => (
          <div key={group.key}>
            <p className="text-sm mb-3">
              <span className="code-prop">&quot;{group.key}&quot;</span>: [
            </p>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ staggerChildren: 0.06 }}
              className="pl-4 flex flex-wrap gap-3 mb-2"
            >
              {group.items.map((skill) => (
                <motion.div
                  variants={item}
                  key={skill.name}
                  className="skill-card flex items-center gap-2.5 border border-border bg-panel/60 px-3 py-2 hover:border-accent-green/70 transition-colors cursor-default"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    width={22}
                    height={22}
                    className="skill-icon w-[22px] h-[22px] object-contain"
                    style={
                      /* GitHub and Express icons are dark — invert them */
                      skill.name === "GitHub" || skill.name === "Express"
                        ? { filter: "invert(1) grayscale(30%) brightness(0.9)" }
                        : {}
                    }
                  />
                  <span className="skill-name code-string text-sm whitespace-nowrap">
                    &quot;{skill.name}&quot;
                  </span>
                </motion.div>
              ))}
            </motion.div>
            <p className="text-sm">],</p>
          </div>
        ))}
      </div>
      <p className="text-sm mt-4">{"}"}</p>
    </SectionFrame>
  );
}