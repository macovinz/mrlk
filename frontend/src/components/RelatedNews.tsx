import { useEffect, useMemo, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  _embedded?: { 'wp:featuredmedia'?: { source_url?: string; alt_text?: string }[] }
}

export default function RelatedNews({
  currentId,
  categoryIds = [],
  limit = 3,
  title = 'Related News',
}: {
  currentId?: number
  categoryIds?: number[]
  limit?: number
  title?: string
}) {
  const [items, setItems] = useState<WPPost[]>([])

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: 'performance',
    slides: { perView: 1.1, spacing: 16 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2, spacing: 20 } },
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 24 } },
    },
  })

  useEffect(() => {
    const params = new URLSearchParams({
      per_page: String(Math.max(limit * 3, 6)), // fetch a few extra for the slider
      _embed: '1',
    })
    if (categoryIds.length) params.set('categories', categoryIds.join(','))
    if (currentId) params.set('exclude', String(currentId))

    fetch(`${API_BASE}/posts?${params.toString()}`)
      .then(r => r.json())
      .then((data: WPPost[]) => setItems(data.slice(0, Math.max(limit, 3))))
      .catch(() => setItems([]))
  }, [currentId, limit, categoryIds])

  const prev = () => instanceRef.current?.prev()
  const next = () => instanceRef.current?.next()

  const cards = useMemo(
    () =>
      items.map(p => {
        const img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/fallback.jpg'
        const alt = p._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? p.title?.rendered ?? ''
        const date = p.date ? format(new Date(p.date), 'MMM d, yyyy') : ''
        return (
          <div key={p.id} className="keen-slider__slide">
            <a
              href={`/news/${p.slug}`}
              className="group relative block overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-ink text-white"
            >
              <img
                src={img}
                alt={alt}
                loading="lazy"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <time className="text-[11px] uppercase tracking-wider text-white/85">{date}</time>
                <h3 className="mt-1 font-heading font-black leading-tight text-base md:text-lg line-clamp-2">
                  {p.title?.rendered}
                </h3>
                <div className="mt-2 flex items-center gap-1 text-sm text-white/90 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                  <span>Read article</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </a>
          </div>
        )
      }),
    [items]
  )

  if (!items.length) return null

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-black text-xl md:text-2xl text-ink relative pb-2
                       after:absolute after:left-0 after:bottom-0 after:h-1 after:w-16 after:bg-brand-yellow after:rounded-full">
          {title}
        </h3>

        {/* Desktop arrows */}
        <div className="hidden md:flex gap-2">
          <button
            aria-label="Previous"
            onClick={prev}
            className="h-9 w-9 rounded-full border border-border text-ink hover:bg-muted"
          >
            <ChevronLeft className="mx-auto h-5 w-5" />
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="h-9 w-9 rounded-full border border-border text-ink hover:bg-muted"
          >
            <ChevronRight className="mx-auto h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider">
        {cards}
      </div>

      {/* Mobile arrows */}
      <div className="mt-3 flex justify-end gap-2 md:hidden">
        <button
          aria-label="Previous"
          onClick={prev}
          className="h-9 w-9 rounded-full border border-border text-ink hover:bg-muted"
        >
          <ChevronLeft className="mx-auto h-5 w-5" />
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="h-9 w-9 rounded-full border border-border text-ink hover:bg-muted"
        >
          <ChevronRight className="mx-auto h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
