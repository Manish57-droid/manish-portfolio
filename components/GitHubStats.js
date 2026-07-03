"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, Code2, Activity, Loader2, ExternalLink } from "lucide-react";

const USERNAME = "Manish57-droid";
const TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python:     "#3572A5",
  HTML:       "#e34c26",
  CSS:        "#563d7c",
  Shell:      "#89e051",
  Java:       "#b07219",
  default:    "#3ddc84",
};

async function ghFetch(url) {
  const res = await fetch(`https://api.github.com${url}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

function Bar({ label, percent, color }) {
  return (
    <div className="flex items-center gap-3 text-[12px]">
      <span className="text-ink-muted w-24 shrink-0 truncate font-mono">{label}</span>
      <div className="flex-1 h-2 bg-panel border border-border/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-ink-dim w-10 text-right">{percent.toFixed(1)}%</span>
    </div>
  );
}

function StatBox({ label, value, sub, color = "text-accent-green" }) {
  return (
    <div className="border border-border bg-panel/60 p-3 flex flex-col gap-1">
      <span className="text-[10px] text-ink-muted font-mono uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
      {sub && <span className="text-[10px] text-ink-dim">{sub}</span>}
    </div>
  );
}

export default function GitHubStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // user profile
        const user = await ghFetch(`/users/${USERNAME}`);

        // repos
        const repos = await ghFetch(
          `/users/${USERNAME}/repos?per_page=100&sort=updated`
        );

        // top repos by stars
        const topRepos = [...repos]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 4);

        // language breakdown
        const langMap = {};
        let langTotal = 0;
        await Promise.all(
          repos.slice(0, 20).map(async (repo) => {
            try {
              const langs = await ghFetch(`/repos/${USERNAME}/${repo.name}/languages`);
              Object.entries(langs).forEach(([lang, bytes]) => {
                langMap[lang] = (langMap[lang] || 0) + bytes;
                langTotal += bytes;
              });
            } catch (_) {}
          })
        );

        const languages = Object.entries(langMap)
          .map(([name, bytes]) => ({
            name,
            percent: (bytes / langTotal) * 100,
            color: LANG_COLORS[name] || LANG_COLORS.default,
          }))
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 6);

        // contribution count this year via events (approximation)
        const events = await ghFetch(
          `/users/${USERNAME}/events/public?per_page=100`
        );
        const pushEvents = events.filter((e) => e.type === "PushEvent");
        const commitCount = pushEvents.reduce(
          (sum, e) => sum + (e.payload?.commits?.length || 0),
          0
        );

        setStats({
          user,
          topRepos,
          languages,
          totalRepos: repos.length,
          totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
          totalForks: repos.reduce((s, r) => s + r.forks_count, 0),
          recentCommits: commitCount,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section id="github" className="relative border-b border-border scroll-mt-12">
      <div className="px-4 lg:px-8 pt-3 pb-1 text-[11px] text-ink-dim tracking-wide border-b border-border/60">
        live / github-stats.json
      </div>

      <div className="px-4 lg:px-8 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Github size={20} className="text-accent-green" />
            <div>
              <h2 className="text-xl font-bold text-ink">
                <span className="code-keyword">fetch</span>
                <span className="text-accent-cyan">(</span>
                <span className="code-string">&quot;github://Manish57-droid&quot;</span>
                <span className="text-accent-cyan">)</span>
              </h2>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Live data pulled from GitHub API
              </p>
            </div>
          </div>
          
            <a href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent-green transition-colors border border-border px-3 py-1.5"
          >
            <ExternalLink size={11} />
            view profile
          </a>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-ink-muted text-sm">
            <Loader2 size={16} className="animate-spin text-accent-green" />
            fetching github data...
          </div>
        )}

        {error && (
          <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error} — check your GitHub token in .env.local
          </div>
        )}

        {stats && (
          <div className="space-y-8">

            {/* stat boxes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <StatBox
                label="public repos"
                value={stats.totalRepos}
                sub="and counting..."
                color="text-accent-green"
              />
              <StatBox
                label="total stars"
                value={stats.totalStars}
                sub="across all repos"
                color="text-accent-amber"
              />
              <StatBox
                label="total forks"
                value={stats.totalForks}
                sub="people forked my work"
                color="text-accent-cyan"
              />
              <StatBox
                label="recent commits"
                value={stats.recentCommits}
                sub="from public events"
                color="text-accent-green"
              />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* language breakdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={14} className="text-accent-cyan" />
                  <h3 className="text-sm font-semibold text-ink">
                    <span className="code-prop">languages</span>
                    <span className="text-ink-muted text-xs ml-2">// by bytes written</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {stats.languages.map((lang) => (
                    <Bar
                      key={lang.name}
                      label={lang.name}
                      percent={lang.percent}
                      color={lang.color}
                    />
                  ))}
                </div>

                {/* language dots legend */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {stats.languages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: lang.color }} />
                      {lang.name}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* top repos */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-accent-green" />
                  <h3 className="text-sm font-semibold text-ink">
                    <span className="code-prop">top_repos</span>
                    <span className="text-ink-muted text-xs ml-2">// by stars</span>
                  </h3>
                </div>
                <div className="space-y-2">
                  {stats.topRepos.map((repo, i) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between border border-border bg-panel/40 px-3 py-2.5 hover:border-accent-green/60 hover:bg-panel/80 transition-all group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-ink-dim text-[11px] font-mono w-4 shrink-0">
                          0{i + 1}
                        </span>
                        <span className="text-sm text-ink group-hover:text-accent-green transition-colors truncate">
                          {repo.name}
                        </span>
                        {repo.language && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 border border-border shrink-0"
                            style={{ color: LANG_COLORS[repo.language] || LANG_COLORS.default }}
                          >
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                          <Star size={10} className="text-accent-amber" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                          <GitFork size={10} />
                          {repo.forks_count}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* profile bio */}
                {stats.user.bio && (
                  <div className="mt-4 border border-border/60 px-3 py-2.5 bg-panel/30">
                    <p className="text-[11px] text-ink-muted font-mono">
                      <span className="code-comment">// github bio</span>
                    </p>
                    <p className="text-[12px] text-ink/80 mt-1 leading-relaxed">
                      {stats.user.bio}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* followers row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 text-[12px] text-ink-muted border-t border-border/40 pt-4"
            >
              <span>
                <span className="text-accent-green font-semibold">{stats.user.followers}</span>{" "}
                followers
              </span>
              <span>
                <span className="text-accent-cyan font-semibold">{stats.user.following}</span>{" "}
                following
              </span>
              {stats.user.location && (
                <span>📍 {stats.user.location}</span>
              )}
              {stats.user.company && (
                <span>🏢 {stats.user.company}</span>
              )}
              <span className="ml-auto text-[10px] text-ink-dim">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}