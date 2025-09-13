import { useEffect, useState } from "react"

const API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE

type WPCategory = {
  id: number
  name: string
  slug: string
  count: number
}

export function CategoryPills({
  selected,
  onChange,
  includeAll = true,
}: {
  selected: number | null
  onChange: (id: number | null) => void
  includeAll?: boolean
}) {
  const [cats, setCats] = useState<WPCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let done = false
    async function run() {
      try {
        const res = await fetch(
          `${API_BASE}/categories?per_page=24&orderby=count&order=desc&_fields=id,name,slug,count`
        )
        const data = await res.json()
        if (!done) setCats(data.filter((c: WPCategory) => c.count > 0))
      } catch {
        // swallow – show nothing if it fails
      } finally {
        if (!done) setLoading(false)
      }
    }
    run()
    return () => {
      done = true
    }
  }, [])

  if (loading && cats.length === 0) {
    return (
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="h-8 w-20 rounded-full bg-foreground/10 animate-pulse"
          />
        ))}
      </div>
    )
  }

  const items = includeAll ? [{ id: -1, name: "All", slug: "all", count: 1 }, ...cats] : cats

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      {items.map((c) => {
        const isActive = selected === null ? c.id === -1 : selected === c.id
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(c.id === -1 ? null : c.id)}
            className={[
              "whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wide transition",
              "ring-1 ring-foreground/10 bg-white text-ink hover:bg-white/80",
              isActive && "bg-brand-yellow text-ink ring-transparent",
            ].join(" ")}
          >
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
