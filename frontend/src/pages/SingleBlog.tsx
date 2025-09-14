// src/pages/SingleBlog.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/** --- Demo data (match slugs used in BlogPage) --- */
type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  tags: string[];
  readingTime: string;
  content: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "quote"; text: string }
    | { type: "img"; src: string; alt?: string; caption?: string }
    | { type: "ul"; items: string[] }
  >;
};

const POSTS: Post[] = [
  {
    slug: "gratitude-10-things",
    title: "10 Tiny Things I’m Grateful For",
    excerpt:
      "Sunsets over rice, the first sip of coffee, and that small laugh I keep replaying in my head.",
    date: "2025-01-06",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    tags: ["reflection", "gratitude"],
    readingTime: "4 min",
    content: [
      {
        type: "p",
        text:
          "I’m collecting the tiniest moments that keep me soft—things so small they almost slip past. Naming them is like pinning golden-hour light to a page.",
      },
      { type: "h2", text: "Today’s Ten" },
      {
        type: "ul",
        items: [
          "Sunset that looked like mango and lavender.",
          "The way garlic smells at the exact second it hits warm oil.",
          "A text that just says “home yet?”",
          "A recipe smudge on the page from last year.",
          "Quiet rain that edits the world into fewer lines.",
          "The first laugh I hear from the kitchen.",
          "My own handwriting being kind to me.",
          "A song I forgot I loved.",
          "A clean pillowcase.",
          "A plan that can be moved to tomorrow without guilt.",
        ],
      },
      {
        type: "p",
        text:
          "If you try this: write your ten without thinking too hard. The point is not to be profound—it’s to be present.",
      },
      { type: "quote", text: "Gratitude is a way of time travel. It returns you to what mattered." },
      {
        type: "img",
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
        alt: "Soft golden light over a table",
        caption: "A table where the day settles into something gentle.",
      },
      {
        type: "p",
        text:
          "I keep a running note called “little list” on my phone and a paper one on the fridge. Both count. Pick one place and let it catch the glow.",
      },
    ],
  },
  // You can add more posts here…
];

/** --- Page --- */
export default function SingleBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = useMemo(() => POSTS.find((p) => p.slug === slug), [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — Sunset Pantry`;
  }, [post]);

  // Reading progress
  const articleRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY - (el.offsetTop - 80), 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!post) {
    return (
      <main className="relative min-h-[60vh] grid place-items-center text-slate-900">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500">404</p>
          <h1 className="mt-1 text-3xl font-heading">Post not found</h1>
          <button
            onClick={() => navigate("/blog")}
            className="mt-6 rounded-full border border-slate-300 px-5 py-2 text-slate-800 hover:bg-slate-50"
          >
            Back to blog
          </button>
        </div>
      </main>
    );
  }

  // Simple prev/next from POSTS order
  const index = POSTS.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? POSTS[index - 1] : null;
  const next = index < POSTS.length - 1 ? POSTS[index + 1] : null;

  return (
    <main className="relative min-h-screen text-slate-900">
      {/* Gradient scene (page background) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 120%, #ef6a2f 0%, #ff934d 25%, #ffd2a8 45%, #cfcbe2 70%, #8ea1c7 100%)",
        }}
      />
      {/* A subtle soft-light grain so white panels feel tactile */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "soft-light",
          opacity: 0.18,
        }}
      />

      {/* Reading progress bar */}
      <div className="fixed left-0 right-0 top-[56px] z-30 h-1 bg-transparent">
        <div
          className="h-full bg-[oklch(76.9%_0.188_70.08)] transition-[width]"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-slate-600">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/blog" className="hover:underline">
            Sunset Pantry
          </Link>{" "}
          / <span className="text-slate-800">{post.title}</span>
        </nav>

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md"
        >
          <div className="relative aspect-[16/9] w-full">
            <img src={post.cover} alt="" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString()}
              </time>
              <span aria-hidden>•</span>
              <span>{post.readingTime} read</span>
              <span aria-hidden>•</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-300/70 bg-white/60 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="mt-3 font-heading text-3xl sm:text-4xl leading-[1.15] tracking-tight text-slate-900">
              {post.title}
            </h1>
            <p className="mt-2 text-slate-700">{post.excerpt}</p>
          </div>
        </motion.div>

        {/* Article */}
        <article ref={articleRef} className="mt-8">
          <div className="rounded-2xl border border-black/5 bg-white/85 p-6 sm:p-8 leading-relaxed text-slate-800 backdrop-blur-md">
            {post.content.map((block, i) => {
              if (block.type === "p") {
                return (
                  <p key={i} className="mb-5 text-[1.05rem]">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "h2") {
                return (
                  <h2
                    key={i}
                    className="mt-8 mb-3 font-heading text-2xl sm:text-3xl text-slate-900"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="my-6 border-l-4 border-amber-300/80 pl-4 italic text-slate-700"
                  >
                    “{block.text}”
                  </blockquote>
                );
              }
              if (block.type === "img") {
                return (
                  <figure key={i} className="my-6 overflow-hidden rounded-xl border border-black/5">
                    <img src={block.src} alt={block.alt || ""} className="w-full object-cover" />
                    {block.caption ? (
                      <figcaption className="bg-white/80 p-3 text-center text-sm text-slate-600">
                        {block.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="mb-5 ml-5 list-disc space-y-2 text-[1.05rem]">
                    {block.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>
        </article>

        {/* Footer actions */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Share:</span>
            <a
              className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-sm hover:bg-white"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>
            <a
              className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-sm hover:bg-white"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-sm hover:bg-white"
            >
              Copy link
            </button>
          </div>

          <div className="flex items-center gap-2">
            {prev && (
              <Link
                to={`/blog/${prev.slug}`}
                className="rounded-full border border-slate-300/70 bg-white/70 px-4 py-2 text-sm text-slate-800 hover:bg-white"
              >
                ← {prev.title}
              </Link>
            )}
            {next && (
              <Link
                to={`/blog/${next.slug}`}
                className="rounded-full border border-slate-300/70 bg-white/70 px-4 py-2 text-sm text-slate-800 hover:bg-white"
              >
                {next.title} →
              </Link>
            )}
          </div>
        </div>

        {/* Back to blog */}
        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="rounded-full border border-slate-300/70 bg-white/70 px-5 py-2 text-slate-800 hover:bg-white"
          >
            Back to Sunset Pantry
          </Link>
        </div>
      </div>
    </main>
  );
}
