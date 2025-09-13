import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LayoutGrid, Rows } from 'lucide-react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

const API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE

const ITEMS_PER_PAGE = 6

type EventType = {
  id: number
  slug: string
  title: { rendered: string }
  acf?: {
    event_date?: string
    boat_type?: string
    level?: string
    organizer?: string
    event_location?: string | { address: string }
  }
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string }[]
  }
}

export default function EventsSection() {
  const [events, setEvents] = useState<EventType[]>([])
  const [error, setError] = useState(false)
  const [view, setView] = useState<'grid' | 'scroll'>('scroll')
  const [currentPage, setCurrentPage] = useState(1)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1.5, spacing: 16 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2.5, spacing: 24 } },
      '(min-width: 1024px)': { slides: { perView: 3.5, spacing: 24 } },
    },
  })

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE}/event?per_page=100&_embed`)
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()
        setEvents(data)
        setTimeout(() => {
          instanceRef.current?.update()
        }, 300)
      } catch (err) {
        console.error(err)
        setError(true)
      }
    }
    fetchEvents()
  }, [])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE)

  return (
    <section className="mt-16 px-4 font-sans">
      <div className="flex justify-between items-center">
        <div className="mb-4">
        <h2 className="section-title text-ink">Upcoming Events & Regattas</h2>
          <span className="block h-0.5 w-16 bg-brand-yellow" />
          </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(val) => val && setView(val as 'grid' | 'scroll')}
          className="gap-2"
        >
          <ToggleGroupItem value="scroll" aria-label="Scroll View">
            <Rows className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid View">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {error && <p className="text-red-500">Failed to load events.</p>}

      {view === 'scroll' ? (
      <div className="grid gap-4 md:grid-cols-2">
          {paginatedEvents.map((event) => {
            const formattedDate = event.acf?.event_date
              ? format(new Date(event.acf.event_date), 'MMM dd')
              : 'TBA'
            const locationData = event.acf?.event_location
            const isObject = typeof locationData === 'object' && locationData !== null
            const address = isObject
              ? (locationData as { address: string }).address
              : (locationData as string) ?? 'TBA'
            const boatType = event.acf?.boat_type || ''
            const level = event.acf?.level || ''
            const organizer = event.acf?.organizer || ''

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition p-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                  <div className="text-sm font-bold uppercase text-blue-900">
                    {event.title.rendered}
                  </div>
                  <div className="bg-blue-900 text-white text-xs font-semibold px-2 py-0.5 rounded">
                    {formattedDate}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{address}</div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {boatType && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {boatType}
                    </span>
                  )}
                  {level && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {level}
                    </span>
                  )}
                  {organizer && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {organizer}
                    </span>
                  )}
                </div>
                <Button size="sm" variant="default" className="text-xs" asChild>
                  <a href={`/event/${event.slug}`}>View Details</a>
                </Button>
              </div>
            )
          })}
        </div>
        
      ) : (
        <div ref={sliderRef} className="keen-slider">
          {paginatedEvents.map((event) => {
            const imageUrl =
              event._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/fallback.jpg'
            const formattedDate = event.acf?.event_date
              ? format(new Date(event.acf.event_date), 'MMM dd')
              : 'TBA'
            const locationData = event.acf?.event_location
            const isObject = typeof locationData === 'object' && locationData !== null
            const address = isObject
              ? (locationData as { address: string }).address
              : (locationData as string) ?? 'TBA'

            return (
              <div
                key={event.id}
                className="keen-slider__slide bg-white rounded-lg border shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={event.title.rendered}
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-900 text-white text-xs font-semibold px-2 py-0.5 rounded">
                    {formattedDate}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-blue-900">
                    {event.title.rendered}
                  </h3>
                  <div className="text-xs text-muted-foreground mb-2">{address}</div>
                  <Button size="sm" variant="default" className="text-xs" asChild>
                    <a href={`/event/${event.slug}`}>View Details</a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button asChild>
          <a href="/events">View All Events</a>
        </Button>
      </div>
    </section>
  )
}
