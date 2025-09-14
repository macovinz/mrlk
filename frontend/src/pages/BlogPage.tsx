// src/pages/BlogPage.tsx
import BackgroundVideoStack from "@/components/BackgroundVideoStack";
import { GENTLERAIN_BG } from "@/constants/gentlerain";
import { Link } from "react-router-dom";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  tags?: string[];
};

const POSTS: Post[] = [
  {
    slug: "rice-and-quiet-mornings",
    title: "Rice & Quiet Mornings",
    excerpt:
      "How the first pot of the day sets the tone — and three ways to keep breakfasts gentle.",
    date: "2025-01-06",
    cover:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
    tags: ["kitchen", "routine"],
  },
  {
    slug: "how-to-keep-a-sunset",
    title: "How to Keep a Sunset",
    excerpt:
      "A jar of notes, a better camera roll, and why we save the small things.",
    date: "2024-12-19",
    cover:
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1200&auto=format&fit=crop",
    tags: ["sunsets", "memory"],
  },
  {
    slug: "play-lists-not-playlists",
    title: "Play Lists, Not Playlists",
    excerpt:
      "Tiny games to make weekends feel longer (and more yours).",
    date: "2024-11-30",
    cover:
      "https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1200&auto=format&fit=crop",
    tags: ["fun", "habits"],
  },
];

const fmt = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export default function BlogPage() {
  return (
    <main className="relative min-h-screen">
      <BackgroundVideoStack src={GENTLERAIN_BG} />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-24">
        <header className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-widest text-white/85">BLOG</p>
          <h1 className="mt-2 font-heading text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight text-white drop-shadow">
            Sunset Pantry
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90 font-body text-lg sm:text-xl">
            Little notes, recipes, and evening thoughts — kept warm for later.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
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
                <p className="text-xs uppercase tracking-widest text-white/70">{fmt(p.date)}</p>
                <h2 className="mt-1 font-heading text-xl leading-snug text-white">{p.title}</h2>
                <p className="mt-2 line-clamp-2 text-white/85">{p.excerpt}</p>

                {p.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/80">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4">
                  <Link
                    to={`/blog/${p.slug}`}
                    className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md hover:bg-white/30"
                  >
                    Read
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10">
            Newer
          </button>
          <button className="rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-md hover:bg-white/30">
            Older
          </button>
        </div>
      </section>
    </main>
  );
}
