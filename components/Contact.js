"use client";

import { useState } from "react";
import { Github, Linkedin, Instagram, Mail, Send } from "lucide-react";
import SectionFrame from "./SectionFrame";

const SOCIALS = [
  {
    label: "github",
    value: "Manish57-droid",
    href: "https://github.com/Manish57-droid",
    icon: Github,
  },
  {
    label: "linkedin",
    value: "manish-kushwaha-web-developer",
    href: "https://www.linkedin.com/in/manish-kushwaha-web-developer/",
    icon: Linkedin,
  },
  {
    label: "instagram",
    value: "manish.kushwaha__",
    href: "https://www.instagram.com/manish.kushwaha__/",
    icon: Instagram,
  },
  {
    label: "email",
    value: "manishkushwaha572000@gmail.com",
    href: "mailto:manishkushwaha572000@gmail.com",
    icon: Mail,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || "someone"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:manishkushwaha572000@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <SectionFrame id="contact" path="src / contact.tsx" lineCount={32}>
      <p className="code-comment text-sm mb-8">
        {"// fill this in — it opens your email client with the message ready to send"}
      </p>

      <div className="grid lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
          <div>
            <label htmlFor="name" className="block text-xs text-accent-cyan mb-1.5">
              name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder='"Your name"'
              className="w-full bg-panel border border-border px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent-green focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs text-accent-cyan mb-1.5">
              email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder='"you@example.com"'
              className="w-full bg-panel border border-border px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent-green focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-xs text-accent-cyan mb-1.5">
              message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              placeholder="&quot;Let's build something...&quot;"
              className="w-full bg-panel border border-border px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-accent-green focus:outline-none transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-accent-green text-void px-5 py-2.5 text-sm font-semibold hover:bg-accent-cyan transition-colors"
          >
            <Send size={15} />
            send mail()
          </button>
        </form>

        {/* terminal panel with socials */}
        <div className="border border-border bg-panel/60 max-w-md w-full self-start">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-panel">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-[11px] text-ink-muted">terminal — socials</span>
          </div>
          <div className="p-4 text-sm font-mono space-y-3">
            <p className="text-ink-muted">
              <span className="text-accent-green">manish@portfolio</span>:
              <span className="text-accent-cyan">~</span>$ ls socials/
            </p>
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 pl-4 py-1 group"
                >
                  <Icon size={15} className="text-ink-dim group-hover:text-accent-green transition-colors" />
                  <span className="text-ink/70 group-hover:text-ink transition-colors">
                    {s.label}:
                  </span>
                  <span className="text-accent-cyan group-hover:underline truncate">
                    {s.value}
                  </span>
                </a>
              );
            })}
            <p className="text-ink-muted pt-1">
              <span className="text-accent-green">manish@portfolio</span>:
              <span className="text-accent-cyan">~</span>$
              <span className="animate-blink">_</span>
            </p>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
