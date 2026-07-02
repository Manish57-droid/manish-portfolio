"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, Send, Loader2, Terminal, Globe } from "lucide-react";
import { supabase } from "../lib/supabase";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function generateHash() {
  return Math.random().toString(16).slice(2, 9);
}

const PLACEHOLDER_MESSAGES = [
  "Amazing portfolio! Love the snake cursor 🐍",
  "The terminal easter egg is genius!",
  "Fellow developer here — great work Manish!",
  "Reached out on LinkedIn 👋",
  "The glitch effects are insane!",
];

export default function MessagesWall() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const listRef = useRef(null);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) setError(error.message);
    else {
      setMessages(data || []);
      setVisitorCount(data?.length || 0);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();

    // try to get country from IP
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => setCountry(d.country_name || ""))
      .catch(() => setCountry(""));

    // realtime subscription
    const channel = supabase
      .channel("messages-channel")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, (payload) => {
        setMessages((prev) => [payload.new, ...prev]);
        setVisitorCount((v) => v + 1);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setPosting(true);
    setError(null);

    const { error: insertError } = await supabase.from("messages").insert([{
      name: name.trim(),
      message: message.trim(),
      country: country || "Unknown",
    }]);

    if (insertError) {
      setError("Failed to post: " + insertError.message);
    } else {
      setName("");
      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setPosting(false);
  }

  return (
    <section id="messages" className="relative border-b border-border scroll-mt-12">
      <div className="px-4 lg:px-8 pt-3 pb-1 text-[11px] text-ink-dim tracking-wide border-b border-border/60">
        git / messages.log
      </div>

      <div className="px-4 lg:px-8 py-8">

        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={16} className="text-accent-green" />
              <h2 className="text-xl font-bold text-ink">
                <span className="code-keyword">git</span>{" "}
                <span className="text-accent-green">log</span>{" "}
                <span className="text-ink-muted text-sm">--visitors</span>
              </h2>
            </div>
            <p className="text-xs text-ink-muted">
              {loading ? "Fetching commits..." : (
                <>
                  <span className="text-accent-green font-semibold">{visitorCount}</span>
                  {" "}developer{visitorCount !== 1 ? "s" : ""} left a message
                </>
              )}
            </p>
          </div>

          {/* live indicator */}
          <div className="flex items-center gap-2 text-[11px] text-ink-muted border border-border px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            live · updates in real-time
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* form */}
          <div>
            <div className="border border-border bg-panel/60">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-panel">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[11px] text-ink-muted font-mono">
                  new-commit.msg
                </span>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-[11px] text-accent-cyan mb-1.5 font-mono">
                    author.name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='"Your name"'
                    maxLength={40}
                    className="w-full bg-transparent border border-border px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:outline-none focus:border-accent-green transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-accent-cyan mb-1.5 font-mono">
                    commit.message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`"${PLACEHOLDER_MESSAGES[Math.floor(Math.random() * PLACEHOLDER_MESSAGES.length)]}"`}
                    maxLength={140}
                    rows={3}
                    className="w-full bg-transparent border border-border px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:outline-none focus:border-accent-green transition-colors resize-none font-mono"
                  />
                  <p className="text-[10px] text-ink-dim text-right mt-1">
                    {message.length}/140
                  </p>
                </div>

                {country && (
                  <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                    <Globe size={11} className="text-accent-cyan" />
                    Auto-detected: <span className="text-accent-cyan">{country}</span>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-400 border border-red-400/30 px-3 py-2">
                    {error}
                  </p>
                )}

                <AnimatePresence>
                  {success && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-accent-green border border-accent-green/30 px-3 py-2"
                    >
                      ✓ Commit pushed successfully! Thanks for visiting.
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={posting || !name.trim() || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-accent-green text-void px-4 py-2.5 text-sm font-semibold hover:bg-accent-cyan transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {posting
                    ? <><Loader2 size={14} className="animate-spin" /> pushing...</>
                    : <><Send size={14} /> git commit -m &quot;message&quot;</>
                  }
                </button>
              </form>
            </div>

            <p className="text-[10px] text-ink-dim mt-3 pl-1">
              Your message will appear instantly for all visitors worldwide.
            </p>
          </div>

          {/* messages list */}
          <div className="space-y-0 max-h-[420px] overflow-y-auto pr-1" ref={listRef}>
            {loading && (
              <div className="flex items-center gap-2 text-ink-muted text-sm py-8 justify-center">
                <Loader2 size={14} className="animate-spin text-accent-green" />
                fetching commits...
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="text-center py-10 border border-dashed border-border">
                <GitCommit size={24} className="mx-auto mb-3 text-ink-dim/40" />
                <p className="text-sm text-ink-muted">No commits yet.</p>
                <p className="text-xs text-ink-dim mt-1">Be the first to leave a message!</p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i < 5 ? i * 0.05 : 0 }}
                  className="border-b border-border/40 py-3 group hover:bg-panel/40 px-2 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <GitCommit
                      size={14}
                      className="text-accent-green mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                        <span className="text-[11px] text-accent-green font-mono">
                          {generateHash()}
                        </span>
                        <span className="text-[12px] font-semibold text-ink truncate">
                          {msg.name}
                        </span>
                        {msg.country && msg.country !== "Unknown" && (
                          <span className="text-[10px] text-ink-dim flex items-center gap-1">
                            <Globe size={9} />
                            {msg.country}
                          </span>
                        )}
                        <span className="text-[10px] text-ink-dim ml-auto">
                          {timeAgo(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-[12px] text-ink/80 leading-relaxed break-words">
                        &quot;{msg.message}&quot;
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}