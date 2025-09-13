import { useEffect, useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ArrowRight } from 'lucide-react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

const API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  link?: string
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string }[]
    'wp:term'?: Array<Array<{ name?: string }>>
  }
}

export default function LatestNews() {
  const [posts, setPosts] = useState<WPPost[]>([])
  const [error, setError] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: 1.15, spacing: 14 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2.15, spacing: 20 } },
      '(min-width: 1024px)': { slides: { perView: 3.15, spacing: 24 } },
    },
  })

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/posts?per_page=8&_embed`)
        if (!res.ok) throw new Error('News fetch failed')
        const data = (await res.json()) as WPPost[]
        setPosts(data)
        // ensure keen recalculates after images mount
        setTimeout(() => instanceRef.current?.update(), 300)
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
    run()
  }, [])

  const items = useMemo(
    () =>
      posts.map((p) => {
        const image =
          p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/fallback.jpg'
        const cat =
          p._embedded?.['wp:term']?.[0]?.[0]?.name || 'News'
        const title = p.title?.rendered ?? ''
        const excerpt = (p.excerpt?.rendered ?? '').replace(/<[^>]+>/g, '')
        const date = p.date ? format(new Date(p.date), 'MMM dd, yyyy') : ''
        const href = `/news/${p.slug}`
        return { id: p.id, image, cat, title, excerpt, date, href }
      }),
    [posts]
  )

  if (error) {
    return (
      <section className="mt-16">
        <div className="container">
          <h2 className="section-title text-ink">Latest News</h2>
          <p className="text-red-500">Failed to load news.</p>
        </div>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <section className="mt-16">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title text-ink">Latest News</h2>
          <span className="block h-0.5 w-16 bg-brand-yellow" />
        </div>

        <div ref={sliderRef} className="keen-slider">
          {items.map((n) => (
            <div key={n.id} className="keen-slider__slide">
              <a
                href={n.href}
                className="group relative block overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-ink text-white"
              >
                <img
                  src={n.image}
                  alt={n.title}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                {/* category strap */}
                <div className="absolute left-3 top-3">
                  <div className="bg-brand-yellow text-ink text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded">
                    {n.cat}
                  </div>
                </div>

                {/* content */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-heading font-black leading-tight text-base md:text-lg line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/85 line-clamp-2">
                    {n.excerpt}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-wide text-white/80">
                    <span>{n.date}</span>
                    <span className="flex items-center gap-1 text-sm text-white/90 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/news"
            className="inline-flex items-center gap-2 rounded-md bg-brand-yellow px-5 py-2 text-sm font-black uppercase tracking-wide text-ink shadow hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-brand-yellow"
          >
            View All News
          </a>
        </div>
      </div>
    </section>
  )
}
