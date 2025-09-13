import { useMemo, useState } from 'react'
import {
  addDays, addMonths, endOfMonth, endOfWeek, format as fmt,
  isSameDay, isSameMonth, isWithinInterval, startOfMonth, startOfWeek
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

/** Minimal shape the calendar needs */
export type CalendarEvent = {
  id: number
  slug: string
  title?: { rendered?: string }
  acf?: {
    event_date?: string
    event_end_date?: string
    organizer?: string
    boat_type?: string
    level?: string
    event_location?: string | { address?: string }
  }
}

export default function EventsCalendar({ events }: { events: CalendarEvent[] }) {
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()))
  const [openDay, setOpenDay] = useState<Date | null>(null)

  // Build calendar grid (Mon–Sun)
  const monthStart = useMemo(() => startOfMonth(month), [month])
  const monthEnd   = useMemo(() => endOfMonth(month), [month])
  const gridStart  = useMemo(() => startOfWeek(monthStart, { weekStartsOn: 1 }), [monthStart])
  const gridEnd    = useMemo(() => endOfWeek(monthEnd, { weekStartsOn: 1 }), [monthEnd])

  const days: Date[] = []
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d)

  const dayEvents = (day: Date) =>
    events
      .filter((e) => {
        const s = safeDate(e.acf?.event_date)
        if (!s) return false
        const eend = safeDate(e.acf?.event_end_date) || s
        return isWithinInterval(day, { start: atStartOfDay(s), end: atEndOfDay(eend) })
      })
      .sort((a, b) => (a.title?.rendered || '').localeCompare(b.title?.rendered || ''))

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="rounded-md border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b">
        <div>
          <h3 className="font-heading font-black text-xl text-ink">{fmt(month, 'MMMM yyyy')}</h3>
          <span className="mt-1 block h-1 w-16 bg-brand-yellow rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMonth(addMonths(month, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setMonth(addMonths(month, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="default" onClick={() => setMonth(startOfMonth(new Date()))}>Today</Button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-[11px] uppercase tracking-wider text-ink/70 px-2 md:px-3 py-2 border-b">
        {weekLabels.map((w) => <div key={w} className="px-1 md:px-2 py-1">{w}</div>)}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-border">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month)
          const today = isSameDay(day, new Date())
          const eventsForDay = dayEvents(day)
          return (
            <div key={day.toISOString()} className="min-h-[7.5rem] md:min-h-[9rem] bg-white p-2 md:p-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${inMonth ? 'text-ink' : 'text-ink/40'}`}>
                  {fmt(day, 'd')}
                </span>
                {today && <span className="ml-auto inline-flex h-2 w-2 rounded-full bg-brand-yellow" />}
              </div>

              <div className="mt-1.5 flex-1 space-y-1 overflow-hidden">
                {eventsForDay.slice(0, 3).map((e) => (
                  <a
                    key={e.id}
                    href={`/event/${e.slug}`}
                    className="block truncate rounded-sm border border-ink/10 bg-ink/[0.04] px-1.5 py-1 text-[11px] leading-tight text-ink hover:bg-ink/[0.06]"
                    title={stripHTML(e.title?.rendered || '')}
                  >
                    <span className="font-semibold">
                      {shorten(stripHTML(e.title?.rendered || ''), 48)}
                    </span>
                    {e.acf?.boat_type && <span className="ml-1 text-ink/70">• {e.acf.boat_type}</span>}
                  </a>
                ))}
                {eventsForDay.length > 3 && (
                  <button
                    onClick={() => setOpenDay(day)}
                    className="text-[11px] text-ink/70 hover:text-ink underline underline-offset-2"
                  >
                    +{eventsForDay.length - 3} more
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Day modal */}
      <DayModal
        open={!!openDay}
        onOpenChange={(o) => !o && setOpenDay(null)}
        date={openDay || new Date()}
        events={openDay ? dayEvents(openDay) : []}
      />
    </div>
  )
}

function DayModal({
  open, onOpenChange, date, events,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date
  events: CalendarEvent[]
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading font-black">
            {fmt(date, 'EEEE, MMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => {
              const dateLabel = formatDateRange(e.acf?.event_date, e.acf?.event_end_date)
              const locRaw = e.acf?.event_location
              const location = typeof locRaw === 'object' && (locRaw as any)?.address
                ? (locRaw as any).address.split(',')[0]
                : (locRaw as string) || 'TBA'
              return (
                <li key={e.id} className="rounded-md border p-3 hover:bg-muted/50 transition">
                  <a href={`/event/${e.slug}`} className="block">
                    <div className="text-sm font-heading font-bold text-ink">
                      {stripHTML(e.title?.rendered || '')}
                    </div>
                    <div className="mt-1 text-xs text-ink/70">
                      {dateLabel} • {location}
                    </div>
                    {(e.acf?.boat_type || e.acf?.level || e.acf?.organizer) && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {e.acf?.boat_type && <BadgePill label={e.acf.boat_type} />}
                        {e.acf?.level && <BadgePill label={e.acf.level} />}
                        {e.acf?.organizer && <BadgePill label={e.acf.organizer} />}
                      </div>
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* Small pill */
function BadgePill({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-wide rounded-full border border-ink/15 bg-ink/[0.04] text-ink px-2 py-0.5">
      {label}
    </span>
  )
}

/* Helpers */
function safeDate(v?: string) {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}
function atStartOfDay(d: Date) {
  const x = new Date(d); x.setHours(0,0,0,0); return x
}
function atEndOfDay(d: Date) {
  const x = new Date(d); x.setHours(23,59,59,999); return x
}
function shorten(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}
function stripHTML(html: string) {
  return html.replace(/<[^>]+>/g, '')
}
function safeFmt(dateStr: string, fmtStr: string) {
  try { return fmt(new Date(dateStr), fmtStr) } catch { return '' }
}
function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return ''
  if (start && !end) return safeFmt(start, 'MMM d, yyyy')
  if (!start && end) return safeFmt(end, 'MMM d, yyyy')
  try {
    const s = new Date(start as string)
    const e = new Date(end as string)
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
      return `${fmt(s, 'MMM d')} – ${fmt(e, 'd, yyyy')}`
    }
    if (s.getFullYear() === e.getFullYear()) {
      return `${fmt(s, 'MMM d')} – ${fmt(e, 'MMM d, yyyy')}`
    }
    return `${fmt(s, 'MMM d, yyyy')} – ${fmt(e, 'MMM d, yyyy')}`
  } catch {
    return ''
  }
}
