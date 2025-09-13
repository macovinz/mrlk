
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Facebook, Twitter, Link as LinkIcon, Clock } from 'lucide-react'
import NewsletterSignup from '../components/Newsletter'
import SubmitStory from '../components/SubmitStory'
import RelatedNews from '@/components/RelatedNews'

const API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE

type WPAuthor = { name?: string }
type WPMedia = { source_url?: string; alt_text?: string }
type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  content: { rendered: string }
  categories?: number[]
  _embedded?: {
    author?: WPAuthor[]
    'wp:featuredmedia'?: WPMedia[]
    'wp:term'?: any[][] // [ [categories], [tags] ]
  }
}

export default function NewsArticle() {
  const { slug } = useParams()
  const [post, setPost] = useState<WPPost | null>(null)
  const [related, setRelated] = useState<WPPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load post by slug
  useEffect(() => {
    async function run() {
      setLoading(true)
      setError(null)
      setPost(null)
      setRelated([])
      try {
        const res = await fetch(`${API_BASE}/posts?slug=${encodeURIComponent(slug || '')}&_embed=1`)
        if (!res.ok) throw new Error('Failed to load article')
        const arr = (await res.json()) as WPPost[]
        const p = arr?.[0]
        if (!p) throw new Error('Article not found')
        setPost(p)
        document.title = `${stripHTML(p.title?.rendered || 'News')} | PH Sailing`
      } catch (e: any) {
        setError(e?.message ?? 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [slug])

  // Load related by first category
  useEffect(() => {
    if (!post) return
    const catId = (post.categories && post.categories[0]) || post._embedded?.['wp:term']?.[0]?.[0]?.id
    if (!catId) return
    ;(async () => {
      try {
        const url = `${API_BASE}/posts?per_page=6&categories=${catId}&exclude=${post.id}&_embed=1`
        const res = await fetch(url)
        if (!res.ok) return
        const data = (await res.json()) as WPPost[]
        setRelated(data)
      } catch {}
    })()
  }, [post])

  const heroImg =
    post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? undefined
  const heroAlt =
    post?._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? stripHTML(post?.title?.rendered || '')

  const authorName = post?._embedded?.author?.[0]?.name
  const dateLabel = post?.date ? format(new Date(post.date), 'MMM d, yyyy') : ''
  const cats = (post?._embedded?.['wp:term']?.[0] || []) as { id: number; name: string; slug: string }[]

  const readingTime = useMemo(() => {
    const words = stripHTML(post?.content?.rendered || '').trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 220))
  }, [post?.content?.rendered])

  if (loading) return <div className="container py-16 text-sm text-muted-foreground">Loading…</div>
  if (error) return <div className="container py-16 text-sm text-red-600">{error}</div>
  if (!post) return null

  return (
    <main className="pb-20">
      {/* HERO */}
      <section className="relative h-[48vh] min-h-[360px] bg-ink text-white">
        {heroImg && (
          <img
            src={heroImg}
            alt={heroAlt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        <div className="relative z-10 h-full">
          <div className="container h-full flex items-end pb-8 md:pb-12">
            <div className="max-w-3xl">
              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {cats?.slice(0, 3).map((c) => (
                  <span
                    key={c.id}
                    className="bg-brand-yellow text-ink text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              <h1
                className="text-3xl md:text-5xl font-heading font-black leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/85">
                {dateLabel && <time>{dateLabel}</time>}
                {authorName && <span>• {authorName}</span>}
                <span className="inline-flex items-center gap-1">
                  • <Clock className="h-4 w-4" /> {readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* yellow accent bar */}
        <span className="absolute bottom-0 left-0 right-0 block h-1 bg-brand-yellow" />
      </section>

      {/* Back + Share */}
      <section className="container mt-6 flex items-center justify-between gap-4">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-ink hover:underline underline-offset-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>

        <div className="flex items-center gap-2">
          <ShareButton
            label="Share"
            onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`)}
            icon={<Facebook className="h-4 w-4" />}
          />
          <ShareButton
            label="Tweet"
            onClick={() =>
              openShare(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(
                  stripHTML(post.title.rendered)
                )}`
              )
            }
            icon={<Twitter className="h-4 w-4" />}
          />
          <ShareButton
            label="Copy link"
            onClick={() => copyLink()}
            icon={<LinkIcon className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* ARTICLE */}
      <article className="container max-w-4xl mt-6">
        <div
          className="article-content"
          // simple sanitize: strip <script> tags; WP should already be clean
          dangerouslySetInnerHTML={{ __html: sanitize(post.content.rendered) }}
        />
      </article>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container mt-16">
            <RelatedNews currentId={post.id} categoryIds={post.categories} />
        </section>
      )}

      {/* Newsletter + Submit rows */}
      <section className="container mt-16">
        <NewsletterSignup />
      </section>
      <section className="container mt-10">
        <SubmitStory />
      </section>
    </main>
  )
}

/* ===== Helpers / small UI bits ===== */

function stripHTML(html: string) {
  return html.replace(/<[^>]*>/g, '')
}

function sanitize(html: string) {
  // remove script/style for safety; keep other markup (imgs, iframes still render)
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
}

function openShare(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href)
  } catch {}
}

function ShareButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-muted transition"
    >
      {icon}
      {label}
    </button>
  )
}


