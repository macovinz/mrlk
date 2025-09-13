import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { Rows, CalendarRange, CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import EventsCalendar from '@/components/EventsCalendar'

type WPEvent = {
  id: number
  slug: string
  title: { rendered: string }
  acf?: {
    event_date?: string
    event_end_date?: string
    organizer?: string
    boat_type?: string
    level?: string
    event_location?: string | { address: string }
  }
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string }[]
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<WPEvent[]>([])
  const [error, setError] = useState(false)

  const [search, setSearch] = useState('')
  const [boatType, setBoatType] = useState('All')
  const [level, setLevel] = useState('All')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [sort, setSort] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_WORDPRESS_API_BASE}/event?per_page=100&_embed&acf_format=standard`
        )
        if (!res.ok) throw new Error('Network error')
        const data = (await res.json()) as WPEvent[]
        setEvents(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        setError(true)
      }
    })()
  }, [])

  const filteredEvents = useMemo(() => {
    const today = startOfToday()
    return (Array.isArray(events) ? events : [])
      .filter(e => {
        const titleMatch = (e.title?.rendered ?? '').toLowerCase().includes(search.toLowerCase())
        const boatMatch = boatType === 'All' || e.acf?.boat_type === boatType
        const levelMatch = level === 'All' || e.acf?.level === level
        return titleMatch && boatMatch && levelMatch
      })
      .filter(e => {
        // Use end date when available so multi-day events still show as upcoming while ongoing.
        const start = safeDate(e.acf?.event_date)
        const end = safeDate(e.acf?.event_end_date) ?? start
        if (sort === 'upcoming') {
          return !!end && end >= today
        }
        // Past: if no valid end/start, treat as past so it doesn’t break the UI
        return !end || end < today
      })
  }, [events, search, boatType, level, sort])

  const displayEvents = useMemo(() => {
    const arr = filteredEvents.slice()
    arr.sort((a, b) => {
      const aT = safeDate(a.acf?.event_date)?.getTime() ?? 0
      const bT = safeDate(b.acf?.event_date)?.getTime() ?? 0
      return sort === 'upcoming' ? aT - bT : bT - aT
    })
    return arr
  }, [filteredEvents, sort])

  return (
    <main className="pb-16">
      {/* Header with ocean-style underline */}
      <section className="bg-ink text-white">
        <div className="container py-10 md:py-12">
          <h1 className="section-title text-white uppercase">Philippine Sailing Events</h1>
          <span className="mt-3 block h-1 w-20 bg-brand-yellow" />
          <p className="mt-3 max-w-2xl text-sm text-white/85">
            Discover regattas, championships, and training events across the Philippines.
          </p>
        </div>
      </section>

      <section className="container mt-8">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-span-1 md:col-span-2"
          />

          <Select value={boatType} onValueChange={setBoatType}>
            <SelectTrigger><SelectValue placeholder="Boat Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Dinghy">Dinghy</SelectItem>
              <SelectItem value="Keelboat">Keelboat</SelectItem>
              <SelectItem value="Offshore">Offshore</SelectItem>
              <SelectItem value="Windsurf">Windsurf</SelectItem>
            </SelectContent>
          </Select>

          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Club Race">Club Race</SelectItem>
              <SelectItem value="Nationals">Nationals</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="Offshore">Offshore</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View & Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as 'list' | 'calendar')}
            className="gap-2"
          >
            <ToggleGroupItem value="list" className="h-9 w-9 rounded-md border border-border text-ink data-[state=on]:bg-ink data-[state=on]:text-white">
              <Rows className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" className="h-9 w-9 rounded-md border border-border text-ink data-[state=on]:bg-ink data-[state=on]:text-white">
              <CalendarRange className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={sort}
            onValueChange={(v) => v && setSort(v as 'upcoming' | 'past')}
            className="gap-2"
          >
            <ToggleGroupItem value="upcoming" className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide border-border text-ink data-[state=on]:bg-ink data-[state=on]:text-white">
              Upcoming
            </ToggleGroupItem>
            <ToggleGroupItem value="past" className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide border-border text-ink data-[state=on]:bg-ink data-[state=on]:text-white">
              Past
            </ToggleGroupItem>
          </ToggleGroup>

          <a href="/ical-feed.ics" className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline">
            <CalendarDays className="h-4 w-4" />
            Subscribe via iCal
          </a>
        </div>

        {error && <p className="text-red-600">Failed to load events.</p>}

        {viewMode === 'list' ? (
          displayEvents.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No matching events.</div>
          )
        ) : (
          <EventsCalendar events={displayEvents} />
        )}
      </section>
    </main>
  )
}

/* ===== Helpers (dates / formatting) ===== */
function safeDate(v?: string | null) {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}
function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
function safeFmt(dateStr: string, fmtStr: string) {
  try { return format(new Date(dateStr), fmtStr) } catch { return '' }
}
function stripHTML(html: string) {
  return html.replace(/<[^>]+>/g, '')
}

/* ===== Card ===== */
function EventCard({ event }: { event: WPEvent }) {
  const img = event._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/fallback.jpg'
  const title = event.title?.rendered ?? ''
  const start = event.acf?.event_date
  const end = event.acf?.event_end_date
  const dateLabel = formatDateRange(start, end)

  const locRaw = event.acf?.event_location
  const location =
    typeof locRaw === 'object' && (locRaw as any)?.address
      ? (locRaw as any).address.split(',')[0]
      : (locRaw as string) || 'TBA'

  const boat = event.acf?.boat_type || ''
  const lvl = event.acf?.level || ''
  const org = event.acf?.organizer || ''

  return (
    <div className="bg-white rounded-md border shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative">
        <img src={img} alt={stripHTML(title)} className="h-40 w-full object-cover" loading="lazy" />
        {dateLabel && (
          <div className="absolute top-2 right-2 bg-brand-yellow text-ink text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded">
            {dateLabel}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* tags */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {boat && <BadgePill label={boat} />}
          {lvl && <BadgePill label={lvl} />}
          {org && <BadgePill label={org} />}
        </div>

        {/* title */}
        <h3
          className="font-heading font-extrabold leading-snug text-[17px] text-ink"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {/* location */}
        <div className="mt-1 flex items-center gap-1 text-[12px] uppercase tracking-wide text-muted">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-ink/80">{location}</span>
        </div>

        {/* CTA */}
        <div className="mt-3">
          <Button size="sm" asChild>
            <a href={`/event/${event.slug}`} className="inline-flex items-center">
              View Event
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

function BadgePill({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-wide rounded-full border border-ink/15 bg-ink/[0.04] text-ink px-2 py-0.5">
      {label}
    </span>
  )
}

function formatDateRange(start?: string, end?: string) {
  const s = safeDate(start)
  const e = safeDate(end)
  if (!s && !e) return ''
  if (s && !e) return safeFmt(start!, 'MMM d, yyyy')
  if (!s && e) return safeFmt(end!, 'MMM d, yyyy')
  // both exist:
  try {
    if (s!.getFullYear() === e!.getFullYear() && s!.getMonth() === e!.getMonth()) {
      return `${format(s!, 'MMM d')} – ${format(e!, 'd, yyyy')}`
    }
    if (s!.getFullYear() === e!.getFullYear()) {
      return `${format(s!, 'MMM d')} – ${format(e!, 'MMM d, yyyy')}`
    }
    return `${format(s!, 'MMM d, yyyy')} – ${format(e!, 'MMM d, yyyy')}`
  } catch {
    return ''
  }
}
