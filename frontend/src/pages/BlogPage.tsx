import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Newsletter from '@/components/Newsletter'
import SubmitStory from '@/components/SubmitStory'

const API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE

type WPPost = {
  id: number
  slug: string
  date: string
  link: string
  title: { rendered: string }
  excerpt?: { rendered?: string }
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string; alt_text?: string }[]
  }
}

type WPCategory = { id: number; name: string; slug: string; count: number }

export default function NewsPage() {
  const [posts, setPosts] = useState<WPPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [cats, setCats] = useState<WPCategory[]>([])
  const [activeCat, setActiveCat] = useState<number | 'all'>('all')

  // fetch categories for pills
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/categories?per_page=100&orderby=count&order=desc&_fields=id,name,slug,count`
        )
        const data = (await res.json()) as WPCategory[]
        // filter out zero-count/uncategorized if you like
        const filtered = data.filter(c => c.count > 0 && c.slug !== 'uncategorized')
        setCats(filtered)
      } catch (e) {
        // non-blocking if categories fail
        console.warn('Failed to load categories', e)
      }
    })()
  }, [])

  // fetch posts (filtered by active category)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const base = `${API_BASE}/posts?per_page=13&_embed`
        const url =
          activeCat === 'all' ? base : `${base}&categories=${activeCat}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to load posts')
        const data = (await res.json()) as WPPost[]
        setPosts(data)
      } catch (e: any) {
        setError(e?.message ?? 'Something went wrong')
      } finally {
        setLoading(false)
      }
    })()
  }, [activeCat])

  const featured = posts[0]
  const latest = useMemo(() => posts.slice(1), [posts])

  return (
    <main className="pb-20">
            {/* Page header */}
      <section className="bg-ink text-white">
        <div className="container py-10 md:py-12">
          <h1 className="uppercase section-title text-white">Latest News</h1>
          <span className="mt-3 block h-1 w-20 bg-brand-yellow" />
        </div>
      </section>
      <section className="container mt-8">

        {/* Category pills */}
        <div className="mt-6 -mx-1 overflow-x-auto">
          <div className="flex items-center gap-2 px-1 pb-1">
            <Pill
              label="All"
              active={activeCat === 'all'}
              onClick={() => setActiveCat('all')}
            />
            {cats.map(c => (
              <Pill
                key={c.id}
                label={c.name}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        {loading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        {/* Content (unchanged layout: Featured + grid) */}
        {!loading && !error && posts.length > 0 && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Featured (same height as cards beside it on large screens) */}
            <article className="lg:col-span-2">
              <NewsCardBig post={featured} />
            </article>

            {/* Right-hand column shows the first three latest at same total height */}
            <div className="grid content-start gap-6">
              {latest.slice(0, 3).map(p => (
                <NewsCard key={p.id} post={p} />
              ))}
            </div>

            {/* Rest of the posts below, full width grid */}
            {latest.slice(3).length > 0 && (
              <div className="lg:col-span-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latest.slice(3).map(p => (
                  <NewsCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Keep these as separate rows/components per your spec */}
      <section className="container mt-10">
        <Newsletter />
      </section>
      <section className="container mt-10">
        <SubmitStory />
      </section>
    </main>
  )
}

/* === UI bits === */

function Pill({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition',
        'focus:outline-none focus:ring-2 ring-brand-yellow',
        active
          ? 'bg-ink text-white border-ink'
          : 'bg-white text-ink border-border hover:bg-muted'
      )}
    >
      {label}
    </button>
  )
}

function NewsCard({ post }: { post: WPPost }) {
  const img =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/fallback.jpg'
  const alt = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? post.title?.rendered ?? ''
  const date = post.date ? format(new Date(post.date), 'MMM d, yyyy') : ''
  return (
    <a
      href={`/news/${post.slug}`}
      className="group relative block overflow-hidden rounded-md ring-1 ring-foreground/10 bg-ink text-white"
    >
      <img
        src={img}
        alt={alt}
        loading="lazy"
        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <time className="text-[11px] uppercase tracking-wider text-white/85">
          {date}
        </time>
        <h3 className="mt-1 font-heading font-black leading-tight text-base md:text-lg line-clamp-2">
          {post.title?.rendered}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-white/90 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <span>Read article</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </a>
  )
}

function NewsCardBig({ post }: { post: WPPost }) {
  const img =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/fallback.jpg'
  const alt = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? post.title?.rendered ?? ''
  const date = post.date ? format(new Date(post.date), 'MMM d, yyyy') : ''
  return (
    <a
      href={`/news/${post.slug}`}
      className="group relative block overflow-hidden rounded-md ring-1 ring-foreground/10 bg-ink text-white h-full"
    >
      <img
        src={img}
        alt={alt}
        className="h-[28rem] w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <time className="text-[11px] uppercase tracking-wider text-white/85">
          {date}
        </time>
        <h2 className="mt-1 text-2md md:text-3md font-heading font-black leading-tight line-clamp-2">
          {post.title?.rendered}
        </h2>
        <p className="mt-2 hidden md:block text-sm text-white/90 line-clamp-3">
          {/* If you prefer excerpts, you can show a cleaned one here */}
        </p>
      </div>
    </a>
  )
}
