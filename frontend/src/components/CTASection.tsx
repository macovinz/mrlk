import { Ban, GraduationCap, Trophy, Compass, Ruler } from 'lucide-react'

const links = [
  { title: 'Anti-Doping',     Icon: Ban,            description: 'Stay informed and clean while competing.', href: 'https://d7qh6ksdplczd.cloudfront.net/sailing/wp-content/uploads/2024/01/04142747/Appendix-2-ANTI-DOPING-RULES.pdf' },
  { title: 'Development',     Icon: GraduationCap,  description: 'Training resources, courses, and programs.', href: '/development' },
  { title: 'Rankings',        Icon: Trophy,         description: 'See current national and class rankings.', href: '/ranking' },
  { title: 'Crew Directory',  Icon: Compass,        description: 'Find or enlist as a crew for upcoming regattas.', href: '/directory' },
  { title: 'IRC Rating',      Icon: Ruler,          description: 'Apply first-time or renew your IRC certificate.', href: '/irc-rating' },
]

export default function QuickCTA() {
  return (
    <section className="mt-16 px-4">
      <h2 className="text-2xl font-heading mb-4">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {links.map(({ title, Icon, description, href }, i) => (
          <a
            key={i}
            href={href}
            className="group border border-border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 ring-brand-yellow"
          >
            {/* Big, line-only icon in brand yellow */}
            <Icon
              className="h-12 w-12 md:h-14 md:w-14 text-brand-yellow"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <h3 className="mt-3 text-lg font-semibold text-gray-800 group-hover:text-ink">
              {title}
            </h3>

            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
