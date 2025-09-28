// src/pages/BlogPage.tsx
import { useEffect, useState } from "react";
import BackgroundVideoStack from "@/components/BackgroundVideoStack";
import { GENTLERAIN_BG } from "@/constants/gentlerain";
import { Link } from "react-router-dom";
import { WP_API_BASE, imageFromEmbedded, stripHtml, fmtDate } from "@/lib/wp";
import type { WpPost } from "@/lib/wp";

export default function BlogPage() {
  const [posts, setPosts] = useState<WpPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Fetch 9 latest posts with embedded featured image
        const res = await fetch(`${WP_API_BASE}/posts?per_page=9&_embed=wp:featuredmedia`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: WpPost[] = await res.json();
        if (alive) setPosts(data);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load posts");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

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

        {loading && (
          <div className="mx-auto max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-md">
            <p className="text-white/90">Loading posts…</p>
          </div>
        )}

        {err && !loading && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-300/30 bg-red-400/10 p-6 text-center">
            <p className="text-red-100">Error: {err}</p>
          </div>
        )}

        {!loading && !err && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => {
              const cover = imageFromEmbedded(p) ??
                "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1200&auto=format&fit=crop";
              const excerpt = stripHtml(p.excerpt?.rendered || "");
              return (
                <article
                  key={p.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md"
                >
                  <div className="relative">
                    <img
                      src={cover}
                      alt=""
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-white/70">
                      {fmtDate(p.date)}
                    </p>
                    <h2 className="mt-1 font-heading text-xl leading-snug text-white">
                      {p.title?.rendered ? stripHtml(p.title.rendered) : "Untitled"}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-white/85">
                      {excerpt || "…"}
                    </p>

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
              );
            })}
          </div>
        )}

        {/* Simple pager stub (you can wire ?page=2 etc later) */}
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
