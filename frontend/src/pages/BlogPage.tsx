// src/pages/BlogPage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;        // ISO or pretty
  cover: string;       // image url
  tags: string[];
  readingTime: string; // "5 min"
};

const POSTS: Post[] = [
  {
    slug: "gratitude-10-things",
    title: "10 Tiny Things I’m Grateful For",
    excerpt:
      "Sunsets over rice, the first sip of coffee, and that small laugh I keep replaying in my head.",
    date: "2025-01-06",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    tags: ["reflection", "gratitude"],
    readingTime: "4 min",
  },
  {
    slug: "kitchen-notes-crispy-garlic",
    title: "Kitchen Notes: Crispy Garlic Everything",
    excerpt:
      "My weeknight upgrade: a jar of golden, crunchy garlic that goes on almost… everything.",
    date: "2024-12-29",
    cover:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
    tags: ["cooking", "pantry"],
    readingTime: "3 min",
  },
  {
    slug: "quiet-sunday-reset",
    title: "A Quiet Sunday Reset",
    excerpt:
      "Laundry tumbling in the background, slow music, and a short list that actually gets done.",
    date: "2024-12-15",
    cover:
      "https://images.unsplash.com/photo-1519681391401-22f1f72f2f01?q=80&w=1200&auto=format&fit=crop",
    tags: ["routine", "calm"],
    readingTime: "5 min",
  },
  {
    slug: "sunset-playlist-winter",
    title: "Sunset Playlist (Winter Edition)",
    excerpt:
      "Warm synths, gentle drums, and a little brass. For golden-hour chopping + stirring.",
    date: "2024-12-03",
    cover:
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1200&auto=format&fit=crop",
    tags: ["music", "sunset"],
    readingTime: "6 min",
  },
  {
    slug: "notes-on-boldness",
    title: "Notes on Being Bold (Softly)",
    excerpt:
      "You can be gentle and still take up space. Some reminders I’m trying on this month.",
    date: "2024-11-22",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    tags: ["mindset", "growth"],
    readingTime: "4 min",
  },
  {
    slug: "family-table-traditions",
    title: "Family Table Traditions I Love",
    excerpt:
      "A bowl that’s always full, an extra seat just in case, and stories that season the rice.",
    date: "2024-11-08",
    cover:
      "https://images.unsplash.com/photo-1514512364185-4c2b3a1a52a4?q=80&w=1200&auto=format&fit=crop",
    tags: ["family", "food"],
    readingTime: "5 min",
  },
];

const ALL_TAGS = Array.from(new Set(POSTS.flatMap((p) => p.tags))).sort();

export default function BlogPage() {
  useEffect(() => {
    document.title = "Sunset Pantry — Notes & Little Recipes for Living";
  }, []);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const featured = POSTS[0];
  const filtered = useMemo(() => {
    return POSTS.slice(1).filter((p) => {
      const matchesTag = activeTag ? p.tags.includes(activeTag) : true;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag]);

  return (
    <main id="blog" className="relative min-h-screen bg-transparent text-white">
      {/* Soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.9]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 120%, #ef6a2f 0%, #ff934d 25%, #ffd2a8 45%, #cfcbe2 70%, #8ea1c7 100%)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.18),transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Title & intro */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold tracking-widest text-white/85">
            BLOG
          </p>
          <h1 className="mt-2 font-heading text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight">
            Sunset Pantry — Notes & Little Recipes for Living
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90 font-body text-lg sm:text-xl">
            Warm, simple posts—kitchen sparks, quiet routines, and sunset
            reflections. A tiny corner for voice and memory.
          </p>
        </motion.header>

        {/* Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="w-72 rounded-full border border-white/20 bg-white/15 px-4 py-2.5 placeholder-white/70 outline-none backdrop-blur-md"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
              ⌕
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full px-3 py-1 text-sm border backdrop-blur-md ${
                activeTag === null
                  ? "border-white/60 bg-white/25"
                  : "border-white/25 bg-white/10 hover:bg-white/20"
              }`}
            >
              All
            </button>
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t === activeTag ? null : t)}
                className={`rounded-full px-3 py-1 text-sm border backdrop-blur-md ${
                  activeTag === t
                    ? "border-white/60 bg-white/25"
                    : "border-white/25 bg-white/10 hover:bg-white/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <img
                src={featured.cover}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-white/70 mb-1">
                Featured
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl leading-tight">
                {featured.title}
              </h2>
              <p className="mt-2 text-white/85">{featured.excerpt}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span>{new Date(featured.date).toLocaleDateString()}</span>
                <span aria-hidden>•</span>
                <span>{featured.readingTime}</span>
                <span aria-hidden>•</span>
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/25 px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  className="rounded-full bg-white/20 px-5 py-2 backdrop-blur-md hover:bg-white/30"
                  href={`/blog/${featured.slug}`}
                >
                  Read post
                </a>
                <a
                  className="rounded-full border border-white/40 px-5 py-2 hover:bg-white/10"
                  href={`/blog/${featured.slug}`}
                >
                  Save
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article
                key={p.slug}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md"
              >
                <div className="relative">
                  <img
                    src={p.cover}
                    alt=""
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-white/70">
                    {new Date(p.date).toLocaleDateString()} • {p.readingTime}
                  </p>
                  <h3 className="mt-1 font-heading text-xl leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-white/85">{p.excerpt}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/25 px-2 py-0.5 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <a
                      className="rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md hover:bg-white/30"
                      href={`/blog/${p.slug}`}
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination stub */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
              Newer
            </button>
            <button className="rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md hover:bg-white/30">
              Older
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
