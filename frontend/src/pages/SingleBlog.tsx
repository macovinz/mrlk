// src/pages/SingleBlog.tsx
import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import BackgroundVideoStack from "@/components/BackgroundVideoStack";
import { GENTLERAIN_BG } from "@/constants/gentlerain";
import { POSTS } from "@/data/posts";

// tiny markdown-to-html (very light, no deps)
function mdToHtml(md: string): string {
  let s = md;

  // Blockquote
  s = s.replace(
    /^>\s?(.*)$/gim,
    '<blockquote class="border-l-4 pl-4 italic text-slate-600">$1</blockquote>'
  );

  // Headings
  s = s.replace(/^###\s?(.*)$/gim, "<h3>$1</h3>");
  s = s.replace(/^##\s?(.*)$/gim, "<h2>$1</h2>");
  s = s.replace(/^#\s?(.*)$/gim, "<h1>$1</h1>");

  // Bold / italic
  s = s.replace(/\*\*(.+?)\*\*/gim, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/gim, "<em>$1</em>");

  // Lists (turn "- item" lines into <li>, then wrap consecutive lis with <ul>)
  s = s.replace(/^\s*-\s+(.*)$/gim, "<li>$1</li>");
  s = s.replace(
    /(?:^|\n)((?:<li>.*<\/li>\s*)+)/gim,
    (_match: string, group: string) => `\n<ul class="list-disc pl-5 space-y-1">${group}</ul>`
  );

  // Paragraphs for remaining lines that aren't already HTML blocks
  s = s.replace(
    /^(?!<(?:h\d|ul|li|blockquote))(.+)$/gim,
    "<p>$1</p>"
  );

  return s;
}

// rough reading time (200 wpm)
function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}


export default function SingleBlog() {
  const { slug } = useParams();

  const post = useMemo(
    () => POSTS.find((p) => p.slug === slug),
    [slug]
  );

  useEffect(() => {
    document.title = post
      ? `${post.title} — Stories at Sunset`
      : "Post not found — Stories at Sunset";
  }, [post]);

  if (!post) {
    return (
      <main className="relative min-h-screen text-white">
        <BackgroundVideoStack src={GENTLERAIN_BG} />
        <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-8">
            <h1 className="text-2xl font-heading">Post not found</h1>
            <p className="mt-2 text-white/90">That link might be broken or the post was moved.</p>
            <Link className="mt-6 inline-block rounded-full bg-white/20 px-4 py-2 hover:bg-white/30" to="/blog">
              Back to the blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const rt = readingTime(`${post.title} ${post.excerpt} ${post.body}`);
  const html = mdToHtml(post.body);

  return (
    <main className="relative min-h-screen">
      {/* Background video (Gentlerain vibe) */}
      <BackgroundVideoStack src={GENTLERAIN_BG} />
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
          <Link to="/blog" className="hover:underline">Blog</Link>
          <span aria-hidden className="mx-2">/</span>
          <span className="opacity-90">{post.title}</span>
        </nav>

        {/* Card: light background for readability */}
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Cover */}
          <div className="relative">
            <img
              src={post.cover}
              alt=""
              className="h-72 w-full object-cover"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
          </div>

          {/* Text */}
          <div className="p-6 sm:p-10">
            <header className="mb-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                {new Date(post.date).toLocaleDateString()} • {rt} min read
              </p>
              <h1 className="mt-2 font-heading text-3xl sm:text-4xl leading-tight text-slate-900">
                {post.title}
              </h1>
              {post.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            {/* Body (markdown → HTML) */}
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Footer actions */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/blog"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
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
