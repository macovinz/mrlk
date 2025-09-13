import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  CalendarDays,
  MapPin,
  Flag,
  Sailboat,
  FileText,
  Trophy,
  User,
  Share2,
  CalendarPlus,
  Megaphone,
  Image as ImageIcon,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

type ImageItem = { url: string; alt?: string; title?: string; thumb?: string }
type ResultRow = {
  position?: number
  team_name?: string
  team_code?: string
  logo_url?: string
  elapsed_time?: string
  total_points?: number
}
type UpdateLink = { title: string; url: string; time?: string; host?: string; isExternal?: boolean }

export default function SingleEventPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      try {
        // IMPORTANT: ask ACF for formatted values
        const res = await fetch(
          `${import.meta.env.VITE_WORDPRESS_API_BASE}/event?slug=${slug}&_embed&acf_format=standard`
        )
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()
        setEvent(data?.[0])
      } catch (err) {
        console.error(err)
        setError(true)
      }
    }
    fetchEvent()
  }, [slug])

  if (error) return <p className="text-red-500 p-4">Failed to load event.</p>
  if (!event) return <p className="p-4">Loading event...</p>

  const titleHtml = event.title?.rendered ?? ''
  const imageUrl = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/fallback.jpg'
  const startDate: string | undefined = event.acf?.event_date
  const endDate: string | undefined = event.acf?.event_end_date
  const organizer = event.acf?.organizer || ''
  const boatType = event.acf?.boat_type || ''
  const boatClass = normalizeToList(event.acf?.boat_class).join(' • ') // checkbox → list
  const level = event.acf?.level || ''
  const location =
    typeof event.acf?.event_location === 'object'
      ? event.acf?.event_location?.address ?? 'TBA'
      : event.acf?.event_location || 'TBA'

  const mapSrc = getMapSrc(event.acf?.event_location)
  const mapLink = getMapLink(event.acf?.event_location)

  /* ===== Normalizers (accept strings/arrays/objects; skip bare IDs) ===== */

  const images: ImageItem[] = toArray<any>(event.acf?.regatta_media)
    .map((m) => {
      const node = m?.image || m
      if (typeof node === 'string') {
        return { url: node, alt: stripHTML(titleHtml), title: '' }
      }
      const url = node?.url || node?.source_url || ''
      if (!isUrl(url)) return null
      return {
        url,
        alt: node?.alt || node?.alt_text || node?.title || stripHTML(titleHtml),
        title: node?.title || m?.title || '',
        thumb: node?.sizes?.medium || url,
      }
    })
    .filter(Boolean) as ImageItem[]

  const regattaDocs = toArray<any>(event.acf?.regatta_documents)
    .map((d) => {
      if (isUrl(d)) return { url: d as string, title: titleFromUrl(d as string) }
      const file = d?.file || d
      const url = file?.url || file?.source_url || d?.url
      if (isUrl(url)) {
        const title = d?.title || file?.title || file?.filename || titleFromUrl(url)
        return { url, title }
      }
      return null
    })
    .filter(Boolean) as { url: string; title: string }[]

    // NOTICE BOARD: supports repeater [{title,url}], relationship posts, or a single URL/string
  const notices = toArray<any>(event.acf?.notice_board)
  .map((n) => {
    if (isUrl(n)) return { title: titleFromUrl(n as string), url: n as string }

    const url =
      n?.url || n?.link || n?.guid?.rendered ||
      (typeof n?.ID === 'number' ? `/?p=${n.ID}` : undefined)

    const title =
      n?.title?.rendered ||
      n?.title ||
      n?.post_title ||
      (url ? titleFromUrl(url) : 'Amendments/Notices will be posted here')

    return url ? { title, url } : { title }
  })
  .filter((x) => x.title || x.url) as { title: string; url?: string }[]


  const updates: UpdateLink[] = toArray<any>(event.acf?.regatta_updates)
    .map((u) => {
      if (isUrl(u)) return toUpdate(u as string)
      const url = u?.url || u?.link || u?.guid?.rendered || u?.permalink
      if (!isUrl(url)) return null
      const title = u?.title?.rendered || u?.title || u?.post_title || titleFromUrl(url)
      const time = u?.time || u?.date || u?.post_date
      return toUpdate(url, title, time)
    })
    .filter(Boolean) as UpdateLink[]

  // Prefer the WYSIWYG for results (as requested). If empty, you can still use rows later.
  const resultsHtml: string | undefined = event.acf?.regatta_results
  const resultsRows: ResultRow[] = toArray(event.acf?.regatta_results_rows)

  /* ===== Render ===== */

  return (
    <section className="container py-10 overflow-x-hidden isolate">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 min-w-0">
        {/* Main */}
        <div className="md:col-span-3 order-first">
          {/* Featured image (contained height) */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden rounded-md mb-6">
            <img
              src={imageUrl}
              alt={stripHTML(titleHtml)}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Title */}
          <h1
            className="font-heading font-black text-3xl md:text-4xl text-ink leading-tight tracking-tight"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
          <span className="mt-3 mb-4 block h-1 w-20 bg-brand-yellow rounded-full" />

          {/* WP content/excerpt under title */}
          {(event.content?.rendered || event.excerpt?.rendered) && (
            <div
              className="article-content mt-4"
              dangerouslySetInnerHTML={{
                __html: sanitizeWp(event.content?.rendered || event.excerpt?.rendered || ''),
              }}
            />
          )}

          {/* Overview (mobile) */}
          <div className="md:hidden mb-8">
            <OverviewCard
              startDate={startDate}
              endDate={endDate}
              organizer={organizer}
              boatType={boatType}
              boatClass={boatClass}
              level={level}
            />
          </div>

          {/* === Media (images only) === */}
          <Section icon={<ImageIcon className="h-5 w-5" />} title="Media">
            {images.length === 0 ? (
              <p className="text-sm text-ink-80 italic">Images will appear here.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, i) => (
                  <a
                    key={i}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-md ring-1 ring-foreground/10 bg-ink text-white"
                  >
                    <img
                      src={img.thumb || img.url}
                      alt={img.alt || 'Media'}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {img.title && (
                      <div className="absolute inset-x-0 bottom-0 p-3 text-sm font-medium">
                        {img.title}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            )}
          </Section>

          {/* === Regatta Updates (card news grid) === */}
          <Section title="Regatta Updates" icon={<Megaphone className="h-5 w-5" />}>
            {updates.length === 0 ? (
              <p className="text-sm text-ink-80 italic">Race-day updates will be posted here.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {updates
                  .slice()
                  .sort((a, b) => (new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()))
                  .map((u, i) => (
                    <a
                      key={i}
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block overflow-hidden rounded-md ring-1 ring-foreground/10 bg-ink text-white capitalize"
                    >
                      {/* background sheen */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/10 to-transparent" />
                      <div className="p-5 relative z-10">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/85">
                          <span className="inline-block rounded bg-brand-yellow text-ink font-black px-2 py-1">
                            {u.time ? timeLabel(u.time) : 'Update'}
                          </span>
                          {u.host && (
                            <span className="opacity-80">{u.host}</span>
                          )}
                          {u.isExternal && <ExternalLink className="h-3.5 w-3.5 opacity-80" />}
                        </div>
                        <h3 className="mt-2 font-heading font-black leading-tight text-base md:text-lg">
                          {u.title}
                        </h3>
                        <div className="mt-3 flex items-center gap-1 text-sm text-white/90 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                          <span>Read update</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </a>
                  ))}
              </div>
            )}
          </Section>

          {/* === Rankings & Results === */}
          <Section icon={<Trophy className="h-5 w-5" />} title="Rankings & Results">
            {resultsHtml ? (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: sanitizeWp(resultsHtml) }}
              />
            ) : resultsRows.length ? (
              <ResultsTable rows={resultsRows} />
            ) : (
              <p className="text-sm text-ink-80 italic">Results will be posted once available.</p>
            )}
          </Section>
        </div>

        {/* Sidebar (desktop) */}
        <aside className="hidden md:block md:order-1 md:col-span-1 space-y-6">
          <SidebarShell title="Event Overview" icon={<Flag className="h-4 w-4" />}>
            <OverviewList
              startDate={startDate}
              endDate={endDate}
              organizer={organizer}
              boatType={boatType}
              boatClass={boatClass}
              level={level}
            />
          </SidebarShell>

          <SidebarShell title="Regatta Documents" icon={<FileText className="h-4 w-4" />}>
            {regattaDocs.length ? (
              <ul className="space-y-2 text-sm">
                {regattaDocs.map((doc, i) => (
                  <li key={i}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="underline underline-offset-4 decoration-2 decoration-[var(--brand-yellow)] hover:opacity-90"
                    >
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm/6 text-white/70 italic">No documents available.</p>
            )}
          </SidebarShell>

          {/* Notice Board (optional) */}
          {notices.length > 0 && (
          <SidebarShell title="Notice Board" icon={<Megaphone className="h-5 w-5" />}>
            <ul className="space-y-2 text-sm">
              {notices.map((n, i) => (
              <li key={i}>
                {n.url ? (
                <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-2 decoration-[var(--brand-yellow)] hover:opacity-90"
              >
                {n.title}
              </a>
            ) : (
              <span>{n.title}</span>
            )}
          </li>
        ))}
      </ul>
      </SidebarShell>
  )}

          {mapSrc && (
            <SidebarShell title="Venue Map" icon={<MapPin className="h-4 w-4" />}>
              <div className="relative w-full pt-[56.25%] overflow-hidden rounded">
                <iframe
                  src={mapSrc}
                  className="absolute inset-0 h-full w-full rounded"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Venue map"
                />
              </div>
              <div className="mt-2 text-xs text-white/80">{location}</div>
              {mapLink && (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block underline underline-offset-4 decoration-2 decoration-[var(--brand-yellow)] hover:opacity-90 text-xs"
                >
                  Open in Google Maps
                </a>
              )}
            </SidebarShell>
          )}
        </aside>
      </div>

      <div className="mt-20">
      </div>
    </section>
  )
}

/* ——— Reusable bits ——— */

function OverviewCard(props: {
  startDate?: string
  endDate?: string
  organizer?: string
  boatType?: string
  boatClass?: string
  level?: string
}) {
  return (
    <div className="rounded-md border border-white/10 bg-ink text-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded bg-brand-yellow text-ink">
          <Flag className="h-4 w-4" />
        </div>
        <h4 className="font-semibold uppercase text-sm tracking-wide">Event Overview</h4>
      </div>

      <OverviewList {...props} />

      <div className="mt-4 flex gap-3">
        <button className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/90 hover:text-white transition">
          <CalendarPlus className="h-4 w-4" />
          Add to Calendar
        </button>
        <button className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/90 hover:text-white transition">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  )
}

function OverviewList({
  startDate,
  endDate,
  organizer,
  boatType,
  boatClass,
  level,
}: {
  startDate?: string
  endDate?: string
  organizer?: string
  boatType?: string
  boatClass?: string
  level?: string
}) {
  return (
    <div className="space-y-2">
      {startDate && (
        <Row>
          <CalendarDays className="h-4 w-4" />
          <span>Date: {dateRangeLabel(startDate, endDate)}</span>
        </Row>
      )}
      {organizer && (
        <Row>
          <User className="h-4 w-4" />
          <span>Organizer: {organizer}</span>
        </Row>
      )}
      {boatType && (
        <Row>
          <Sailboat className="h-4 w-4" />
          <span>Boat Type: {boatType}</span>
        </Row>
      )}
      {boatClass && (
        <Row>
          <span className="inline-flex h-4 w-4 items-center justify-center">⚓</span>
          <span>Class: {boatClass}</span>
        </Row>
      )}
      {level && (
        <Row>
          <Flag className="h-4 w-4" />
          <span>Level: {level}</span>
        </Row>
      )}
    </div>
  )
}

function SidebarShell({
  title,
  icon,
  children,
}: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-white/10 bg-ink text-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded bg-brand-yellow text-ink">
          {icon}
        </div>
        <h4 className="font-semibold uppercase text-sm tracking-wide">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 font-heading font-bold text-xl text-ink">
        {icon}
        {title}
      </h2>
      <span className="mt-2 mb-4 block h-1 w-16 bg-brand-yellow rounded-full" />
      <div>{children}</div>
    </section>
  )
}

function ResultsTable({ rows }: { rows: ResultRow[] }) {
  const sorted = rows.slice().sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-white">
      <table className="w-full text-[13px] leading-tight">
        <thead>
          <tr className="text-ink">
            <th colSpan={2} className="text-left uppercase tracking-wider text-[11px] font-bold px-3 py-2.5 border-b">Position</th>
            <th className="text-left uppercase tracking-wider text-[11px] font-bold px-3 py-2.5 border-b">Team</th>
            <th className="text-left uppercase tracking-wider text-[11px] font-bold px-3 py-2.5 border-b">Elapsed Time</th>
            <th className="text-left uppercase tracking-wider text-[11px] font-bold px-3 py-2.5 border-b">Total Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={i} className="odd:bg-[color-mix(in_oklch,var(--brand-ink)_4%,white)]">
              <td className="px-3 py-2.5 font-extrabold">{r.position ?? '-'}</td>
              <td className="px-3 py-2.5">
                {r.logo_url ? (
                  <img src={r.logo_url} alt={r.team_name || ''} className="h-6 w-auto object-contain" />
                ) : (
                  <span className="inline-block h-6 w-6 bg-[color-mix(in_oklch,var(--brand-ink)_8%,white)] rounded" />
                )}
              </td>
              <td className="px-3 py-2.5">
                <div className="font-semibold text-ink">{r.team_name || '-'}</div>
                {r.team_code && (
                  <div className="text-[11px] uppercase tracking-wider text-ink-70">{r.team_code}</div>
                )}
              </td>
              <td className="px-3 py-2.5 text-ink-80" dangerouslySetInnerHTML={{ __html: r.elapsed_time || '-' }} />
              <td className="px-3 py-2.5 font-extrabold">{r.total_points ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-1 w-full bg-brand-yellow" />
    </div>
  )
}

/* ——— Utils ——— */

function toArray<T>(val: any): T[] {
  if (val == null) return []
  return Array.isArray(val) ? (val as T[]) : [val as T]
}
function normalizeToList(val: any): string[] {
  if (val == null) return []
  if (Array.isArray(val)) return val.map(String).filter(Boolean)
  return [String(val)]
}
function isUrl(v: any) {
  return typeof v === 'string' && /^https?:\/\//i.test(v)
}
function titleFromUrl(u: string) {
  try {
    const { hostname, pathname } = new URL(u)
    const base = pathname.split('/').filter(Boolean).pop() || hostname
    return base.replace(/[-_]+/g, ' ').replace(/\.(pdf|docx?|pptx?)$/i, '').trim()
  } catch { return 'Document' }
}
function toUpdate(url: string, title?: string, time?: string): UpdateLink {
  let host = ''
  let isExternal = false
  try {
    const u = new URL(url)
    host = u.hostname.replace(/^www\./, '')
    isExternal = typeof window !== 'undefined' ? u.hostname !== window.location.hostname : true
  } catch { /* ignore */ }
  return { url, title: title || titleFromUrl(url), time, host, isExternal }
}

function sanitizeWp(html: string) {
  return html?.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') ?? ''
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="text-sm flex items-center gap-2 text-white/90">{children}</div>
}
function dateRangeLabel(start?: string, end?: string) {
  try {
    if (start && end) {
      const s = new Date(start)
      const e = new Date(end)
      if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
        return `${format(s, 'MMM d')} – ${format(e, 'd, yyyy')}`
      }
      if (s.getFullYear() === e.getFullYear()) {
        return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`
      }
      return `${format(s, 'MMM d, yyyy')} – ${format(e, 'MMM d, yyyy')}`
    }
    if (start && !end) return format(new Date(start), 'MMM d, yyyy')
    if (!start && end) return format(new Date(end), 'MMM d, yyyy')
    return 'TBA'
  } catch {
    return 'TBA'
  }
}
function timeLabel(raw?: string) {
  if (!raw) return 'Update'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return format(d, 'HH:mm')
}
function stripHTML(html: string) {
  return html.replace(/<[^>]+>/g, '')
}
function getMapSrc(loc: any): string | null {
  if (!loc) return null
  const addr = typeof loc === 'object' ? loc.address || '' : String(loc)
  const lat = typeof loc === 'object' ? (loc.lat ?? loc.latitude) : undefined
  const lng = typeof loc === 'object' ? (loc.lng ?? loc.longitude) : undefined
  if (lat && lng) return `https://www.google.com/maps?output=embed&q=${lat},${lng}`
  if (addr) return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(addr)}`
  return null
}
function getMapLink(loc: any): string | null {
  if (!loc) return null
  const addr = typeof loc === 'object' ? loc.address || '' : String(loc)
  const lat = typeof loc === 'object' ? (loc.lat ?? loc.latitude) : undefined
  const lng = typeof loc === 'object' ? (loc.lng ?? loc.longitude) : undefined
  if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  if (addr) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`
  return null
}
