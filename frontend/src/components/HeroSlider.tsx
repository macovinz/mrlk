import { useEffect, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { AutoplayPlugin } from '@/lib/keenAutoplay'

const API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE

// Helper: clamp text by characters
function clampText(str: string, max: number) {
  if (!str) return ''
  return str.length > max ? str.slice(0, Math.max(0, max - 1)).trimEnd() + '…' : str
}

// Responsive character limit based on viewport
function limitForWidth(w: number) {
  if (w < 360) return 26
  if (w < 640) return 34  // <sm
  if (w < 768) return 44  // sm
  if (w < 1024) return 60 // md
  return 80               // lg+
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<any[]>([])
  const [titleLimit, setTitleLimit] = useState<number>(() => limitForWidth(typeof window !== 'undefined' ? window.innerWidth : 1024))

  // Keen slider + autoplay
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      renderMode: 'performance',
      slides: { perView: 1 },
      drag: true,
    },
    [AutoplayPlugin]
  )

  // Fetch slides
  useEffect(() => {
    fetch(`${API_BASE}/posts?sticky=true&per_page=4&_embed&acf_format=standard`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((post: any) => {
          const categories = post._embedded?.['wp:term']?.[0] || []
          return {
            title: post.title.rendered,
            subtitle: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
            image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
            cta: 'Read More',
            link: post.link,
            category: categories[0]?.name || '',
          }
        })
        setSlides(mapped)
      })
      .catch(() => setSlides([]))
  }, [])

  // Update character limit on resize
  useEffect(() => {
    const onResize = () => setTitleLimit(limitForWidth(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (slides.length === 0) return null

  return (
    <div className="relative overflow-hidden">
      <div ref={sliderRef} className="keen-slider h-[80vh]">
        {slides.map((slide, i) => (
          <div key={i} className="keen-slider__slide relative w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover brightness-95"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0" />

            {/* Aligned Slide Content */}
            <div className="relative z-10 h-full flex items-end">
              <div className="container pb-20 md:pb-32">
                <div className="bg-white/30 backdrop-blur-sm p-6 md:p-10 rounded-xl max-w-2xl shadow-xl border border-white/40">
                  {slide.category && (
                    <div className="text-xs font-semibold uppercase tracking-wide text-yellow-400 mb-1">
                      {slide.category}
                    </div>
                  )}
                  <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p
                    className="mt-2 text-sm text-white/90 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: slide.subtitle }}
                  />
                  <a
                    href={slide.link}
                    className="inline-block mt-4 bg-yellow-500 text-blue-950 px-5 py-2 text-sm font-semibold rounded hover:bg-yellow-400 transition shadow-md"
                  >
                    {slide.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Headline bar (responsive char limit + no overlap) */}
      <div className="w-full bg-slate-950/90 backdrop-blur-md shadow-inner border-t border-white/20">
        <div className="container py-3 flex gap-6 overflow-x-auto text-sm">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              title={slide.title} // full title on hover
              onClick={() => slider.current?.moveToIdx(i)}
              className="shrink-0 max-w-[240px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px] text-left font-black text-white hover:underline cursor-pointer truncate"
            >
              {clampText(slide.title, titleLimit)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
