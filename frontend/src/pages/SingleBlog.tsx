// src/pages/SingleBlog.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BackgroundGradientAnimation from "@/components/BackgroundGradientAnimation";
import { WP_API_BASE, imageFromEmbedded, stripHtml, fmtDate } from "@/lib/wp";
import type { WpPost } from "@/lib/wp";


// rough reading time (200 wpm)
function readingTimeFromHtml(html: string, title: string): number {
  const text = stripHtml(title + " " + html);
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function SingleBlog() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<WpPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`${WP_API_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: WpPost[] = await res.json();
        if (!data?.length) throw new Error("Not found");
        if (alive) setPost(data[0]);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load post");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => {
    document.title = post
      ? `${stripHtml(post.title?.rendered || "Post")} — Stories at Sunset`
      : "Post — Stories at Sunset";
  }, [post]);

  if (loading) {
    return (
      <main className="relative min-h-screen text-white">
        <BackgroundGradientAnimation/>
        <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-8 text-center">
            Loading…
          </div>
        </div>
      </main>
    );
  }

  if (err || !post) {
    return (
      <main className="relative min-h-screen text-white">
        <BackgroundGradientAnimation/>
        <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-8">
            <h1 className="text-2xl font-heading">Post not found</h1>
            <p className="mt-2 text-white/90">
              That link might be broken or the post was moved.
            </p>
            <Link
              className="mt-6 inline-block rounded-full bg-white/20 px-4 py-2 hover:bg-white/30"
              to="/blog"
            >
              Back to the blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const cover = imageFromEmbedded(post);
  const title = stripHtml(post.title?.rendered || "Untitled");
  const contentHtml = post.content?.rendered || "";
  const rt = readingTimeFromHtml(contentHtml, title);

  return (
    <main className="relative min-h-screen">
      {/* Background video (Gentlerain vibe) */}
      <BackgroundGradientAnimation/>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.9]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 120%, #ef6a2f 0%, #ff934d 25%, #ffd2a8 45%, #cfcbe2 70%, #8ea1c7 100%)",
        }}
      />

      {/* Page container; pad for fixed header */}
      <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        {/* Top meta / breadcrumb */}
        <nav className="mb-4 text-sm text-white/85">
          <Link to="/blog" className="hover:underline">
            Blog
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="opacity-90">{title}</span>
        </nav>

        {/* Card: light background for readability */}
        <article className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md text-white">
          {/* Cover */}
          {cover ? (
            <div className="relative">
              <img
                src={cover}
                alt=""
                className="h-72 w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
            </div>
          ) : null}

          {/* Text */}
         <div className="p-6 sm:p-10">
    <header className="mb-5">
      <p className="text-xs uppercase tracking-widest text-white/70">
        {fmtDate(post.date)} • {rt} min read
      </p>
      <h1 className="mt-2 font-heading text-3xl sm:text-4xl leading-tight text-white">
        {title}
      </h1>
    </header>

    {/* Body from WP */}
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />

            {/* Footer actions */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
      <Link
        to="/blog"
        className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
      >
        ← Back to all posts
      </Link>
      <a
        href="#top"
        className="rounded-full bg-amber-500 px-4 py-2 text-sm text-white hover:brightness-105"
      >
        Top
      </a>
    </div>
  </div>
</article>
      </div>
    </main>
  );
}
