"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenSquare, Camera, X, ChevronLeft, ChevronRight, Trash2, Send, Loader2, ZoomIn } from "lucide-react";
import SectionFrame from "./SectionFrame";
import { supabase } from "../lib/supabase";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function isOld(dateStr) {
  return Date.now() - new Date(dateStr).getTime() > ONE_WEEK;
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [writing, setWriting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [modalBlog, setModalBlog] = useState(null);
  const fileRef = useRef(null);

  async function fetchBlogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setBlogs(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchBlogs(); }, []);

  useEffect(() => {
    if (blogs.length <= 2) return;
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % blogs.length);
    }, 5000);
    return () => clearInterval(id);
  }, [blogs.length]);

  // close modal on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setModalBlog(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handlePost() {
    if (!title.trim() && !content.trim()) return;
    setPosting(true);
    setError(null);
    let image_url = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filename = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filename, imageFile, { upsert: true });
      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setPosting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(filename);
      image_url = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("blogs").insert([{
      title: title.trim() || "Untitled",
      content: content.trim(),
      image_url,
    }]);

    if (insertError) {
      setError("Failed to post: " + insertError.message);
    } else {
      setTitle(""); setContent(""); setImageFile(null);
      setImagePreview(null); setWriting(false); setCarouselIndex(0);
      await fetchBlogs();
    }
    setPosting(false);
  }

  async function handleDelete(e, id, image_url) {
    e.stopPropagation();
    if (image_url) {
      const filename = image_url.split("/").pop();
      await supabase.storage.from("blog-images").remove([filename]);
    }
    await supabase.from("blogs").delete().eq("id", id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    if (modalBlog?.id === id) setModalBlog(null);
    setCarouselIndex(0);
  }

  const showCarousel = blogs.length > 2;

  return (
    <SectionFrame id="blog" path="content / blog /" lineCount={14}>
      <style>{`
        .blog-card-old { transform: scale(0.93); opacity: 0.7; transition: transform 0.5s ease, opacity 0.5s ease; }
        .blog-card-old:hover { transform: scale(0.96); opacity: 0.9; }
        .blog-glitch { position: relative; }
        .blog-glitch::before {
          content: attr(data-text); position: absolute; inset: 0;
          color: #56e8d4; animation: blog-g1 4s steps(1) infinite; opacity: 0.5;
        }
        @keyframes blog-g1 {
          0%,100% { clip-path: inset(0 0 95% 0); transform: translateX(-2px); }
          25%      { clip-path: inset(40% 0 40% 0); transform: translateX(2px); }
          50%      { clip-path: inset(70% 0 15% 0); transform: translateX(-2px); }
          75%      { clip-path: inset(20% 0 65% 0); transform: translateX(1px); }
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .blog-card-wrap { cursor: pointer; }
        .blog-img-square {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(9,12,13,0.92);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal-box {
          background: #0e1414;
          border: 1px solid #1c2826;
          max-width: 720px; width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
      `}</style>

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ink blog-glitch" data-text="// Blog & Photography">
            <span className="code-comment text-lg">// Blog &amp; Photography</span>
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            {loading ? "Loading posts..." : blogs.length === 0
              ? "No posts yet — write your first one"
              : `${blogs.length} post${blogs.length > 1 ? "s" : ""} published`}
          </p>
        </div>
        <button
          onClick={() => setWriting((v) => !v)}
          className="flex items-center gap-2 border border-border px-4 py-2 text-sm text-ink hover:border-accent-green hover:text-accent-green transition-colors"
        >
          {writing ? <X size={14} /> : <PenSquare size={14} />}
          {writing ? "cancel" : "new post"}
        </button>
      </div>

      {error && (
        <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* editor */}
      <AnimatePresence>
        {writing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="border border-border bg-panel/80">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-panel">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[11px] text-ink-muted font-mono">new-post.mdx</span>
              </div>
              <div className="p-4 space-y-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="# Post title..."
                  className="w-full bg-transparent border-b border-border pb-2 text-lg font-bold text-ink placeholder:text-ink-dim focus:outline-none focus:border-accent-green transition-colors"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={5}
                  className="w-full bg-transparent text-sm text-ink/90 placeholder:text-ink-dim resize-none focus:outline-none leading-relaxed"
                />
                {imagePreview && (
                  <div className="relative w-32 h-32 border border-border overflow-hidden">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-1 right-1 bg-void/80 border border-border p-0.5 text-ink-muted hover:text-accent-green"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 text-xs text-ink-muted hover:text-accent-cyan transition-colors"
                  >
                    <Camera size={14} />
                    add photo
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  <button
                    onClick={handlePost}
                    disabled={posting || (!title.trim() && !content.trim())}
                    className="flex items-center gap-2 bg-accent-green text-void px-4 py-1.5 text-sm font-semibold hover:bg-accent-cyan transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {posting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    {posting ? "publishing..." : "publish()"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-2 text-ink-muted text-sm">
          <Loader2 size={16} className="animate-spin text-accent-green" />
          fetching posts...
        </div>
      )}

      {/* empty */}
      {!loading && blogs.length === 0 && !writing && (
        <div className="border border-dashed border-border p-8 text-center">
          <Camera size={28} className="mx-auto mb-3 text-ink-dim/40" />
          <p className="text-sm text-ink-muted">Your blog posts and photography will live here.</p>
          <p className="text-xs text-ink-dim mt-1">Hit &quot;new post&quot; to write your first entry.</p>
        </div>
      )}

      {/* carousel for 3+ posts */}
      {!loading && showCarousel && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-ink-dim font-mono">{carouselIndex + 1} / {blogs.length}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCarouselIndex((i) => (i - 1 + blogs.length) % blogs.length)}
                className="border border-border p-1.5 text-ink-muted hover:text-accent-green hover:border-accent-green transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCarouselIndex((i) => (i + 1) % blogs.length)}
                className="border border-border p-1.5 text-ink-muted hover:text-accent-green hover:border-accent-green transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 mb-4">
            {blogs.map((_, i) => (
              <button key={i} onClick={() => setCarouselIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === carouselIndex ? "w-6 bg-accent-green" : "w-2 bg-border hover:bg-ink-dim"}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* blog grid */}
      {!loading && blogs.length > 0 && (
        <div className="blog-grid">
          <AnimatePresence>
            {(showCarousel ? [blogs[carouselIndex]] : blogs).map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className={`blog-card-wrap border border-border bg-panel/60 hover:border-accent-green/60 transition-all duration-300 ${isOld(blog.created_at) ? "blog-card-old" : ""}`}
                onClick={() => setModalBlog(blog)}
              >
                {/* square image */}
                {blog.image_url && (
                  <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="blog-img-square"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 right-2 text-accent-green opacity-70">
                      <ZoomIn size={14} />
                    </div>
                  </div>
                )}

                {/* card content */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                      <span className="text-[10px] text-ink-muted font-mono truncate max-w-[120px]">
                        {blog.title.toLowerCase().replace(/\s+/g, "-")}.mdx
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-ink-dim">{timeAgo(blog.created_at)}</span>
                      <button
                        onClick={(e) => handleDelete(e, blog.id, blog.image_url)}
                        className="text-ink-dim hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-ink mb-1 line-clamp-1">{blog.title}</h3>
                  {blog.content && (
                    <p className="text-[11px] text-ink/70 line-clamp-2 leading-relaxed">{blog.content}</p>
                  )}
                  {isOld(blog.created_at) && (
                    <span className="inline-block mt-2 text-[9px] text-accent-amber border border-accent-amber/30 px-1.5 py-0.5">
                      archived
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* modal */}
      <AnimatePresence>
        {modalBlog && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalBlog(null)}
          >
            <motion.div
              className="modal-box"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* modal top bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-panel sticky top-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-green" />
                  <span className="text-[11px] text-ink-muted font-mono">
                    {modalBlog.title.toLowerCase().replace(/\s+/g, "-")}.mdx
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-ink-dim">{timeAgo(modalBlog.created_at)}</span>
                  <button onClick={() => setModalBlog(null)} className="text-ink-muted hover:text-accent-green transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* full image */}
              {modalBlog.image_url && (
                <div className="w-full border-b border-border">
                  <img
                    src={modalBlog.image_url}
                    alt={modalBlog.title}
                    className="w-full object-contain max-h-[60vh]"
                  />
                </div>
              )}

              {/* full content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-ink mb-4">{modalBlog.title}</h2>
                {modalBlog.content && (
                  <p className="text-sm text-ink/85 leading-relaxed whitespace-pre-wrap">
                    {modalBlog.content}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionFrame>
  );
}