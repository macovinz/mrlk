// src/pages/About.tsx
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sailboat, Trophy, Users, GraduationCap, Anchor, Globe2, HeartHandshake, Compass,
} from 'lucide-react'
import NewsletterSignup from '@/components/Newsletter'

export default function AboutPage() {
  return (
    <main className="pb-20">
      {/* HERO (Ocean style) */}
      <section className="relative bg-ink text-white">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="section-title text-white uppercase">About the Philippine Sailing Circuit</h1>
            <span className="mt-3 block h-1 w-20 bg-brand-yellow" />
            <p className="mt-4 text-sm md:text-base text-white/85">
              We champion grassroots to grand prix sailing across the archipelago—connecting clubs,
              sailors, and events to grow the sport with world-class standards and Filipino grit.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge className="text-[11px] font-black uppercase tracking-wider bg-brand-yellow text-ink">National Network</Badge>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider border-white/25 text-white/90">Volunteer-Led</Badge>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider border-white/25 text-white/90">Inclusive</Badge>
            </div>

            <div className="mt-6 flex gap-3">
              <Button asChild>
                <a href="/events">Explore Events</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/crew/submit">Join as Crew / Owner</a>
              </Button>
            </div>
          </div>
        </div>
        <span className="absolute bottom-0 left-0 right-0 block h-1 bg-brand-yellow" />
      </section>

      {/* QUICK STATS */}
      <section className="container mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Sailboat className="h-5 w-5" />} label="Active Clubs" value="35+" />
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Annual Regattas" value="50+" />
          <StatCard icon={<Users className="h-5 w-5" />} label="Registered Sailors" value="1,500+" />
          <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Training Programs" value="Nationwide" />
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="container mt-12 grid gap-8 lg:grid-cols-2">
        <Panel
          title="Our Mission"
          icon={<Anchor className="h-5 w-5" />}
          body={
            <p className="text-ink-90">
              To develop Philippine sailing through safe, fair, and exciting competition; enable pathways
              from youth to elite; and promote coastal stewardship through every race we run.
            </p>
          }
        />
        <Panel
          title="Our Vision"
          icon={<Globe2 className="h-5 w-5" />}
          body={
            <p className="text-ink-90">
              A vibrant, connected sailing nation—recognized across Asia for talent, race management, and
              spectacular events in our world-class waters.
            </p>
          }
        />
      </section>

      {/* WHAT WE DO */}
      <section className="container mt-12">
        <h2 className="section-title text-ink">What We Do</h2>
        <span className="block h-1 w-20 bg-brand-yellow mb-6" />
        <div className="grid gap-6 md:grid-cols-3">
          <ServiceCard
            icon={<Compass className="h-6 w-6" />}
            title="Race Management"
            points={[
              'Nationwide race calendar & NOR templates',
              'America’s Cup–inspired presentation & results',
              'Safety, fairness, and fun at the core',
            ]}
          />
          <ServiceCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="Pathways & Training"
            points={[
              'Youth & grassroots support',
              'Coaching clinics and seminars',
              'Crew/owner matching tools',
            ]}
          />
          <ServiceCard
            icon={<HeartHandshake className="h-6 w-6" />}
            title="Partnerships & Promotion"
            points={[
              'Club directory & venue guides',
              'Sponsor integration & media',
              'Sustainability initiatives',
            ]}
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="container mt-12">
        <h2 className="section-title text-ink">Milestones</h2>
        <span className="block h-1 w-20 bg-brand-yellow mb-6" />
        <ol className="relative border-l border-border pl-6 space-y-6">
          {[
            { year: '2018', title: 'Circuit Launch', text: 'First consolidated national calendar goes live.' },
            { year: '2020', title: 'Digital Results', text: 'Modern scoring UI and live updates introduced.' },
            { year: '2023', title: 'Youth Expansion', text: 'Scholarships and junior series across regions.' },
            { year: '2025', title: 'Sustainability Push', text: 'Green regatta checklist adopted nationwide.' },
          ].map((t, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[9px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-yellow ring-2 ring-white" />
              <div className="text-xs font-bold uppercase tracking-wide text-ink/70">{t.year}</div>
              <div className="font-heading font-black text-ink">{t.title}</div>
              <p className="text-sm text-ink-80">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TEAM */}
      <section className="container mt-12">
        <h2 className="section-title text-ink">Leadership & Volunteers</h2>
        <span className="block h-1 w-20 bg-brand-yellow mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <TeamCard key={m.name} {...m} />
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="container mt-12">
        <h2 className="section-title text-ink">Partner Clubs & Organizations</h2>
        <span className="block h-1 w-20 bg-brand-yellow mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/2] rounded-md border border-border bg-white grid place-items-center">
              <span className="text-xs text-ink/60">Logo {i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA ROWS */}
      <section className="container mt-12 grid gap-6 lg:grid-cols-2">
        <CTA
          title="Host a Regatta"
          body="Clubs and LGUs: bring a sanctioned event to your waters. We’ll guide you from NOR to prize-giving."
          primary={{ href: '/contact', label: 'Contact Us' }}
          secondary={{ href: '/resources', label: 'View Resources' }}
        />
        <CTA
          title="Join the Community"
          body="Skippers, crew, volunteers—be part of the circuit. Find boats, teams, and training."
          primary={{ href: '/crew/submit', label: 'Submit Listing' }}
          secondary={{ href: '/crew', label: 'Browse Directory' }}
        />
      </section>

      {/* NEWSLETTER */}
      <section className="container mt-16">
        <NewsletterSignup />
      </section>
    </main>
  )
}

/* ---------- Small, reusable UI bits ---------- */

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-white p-5">
      <div className="flex items-center gap-2 text-ink">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-ink/5 text-ink">
          {icon}
        </div>
        <div className="text-xs uppercase tracking-wide text-ink/70">{label}</div>
      </div>
      <div className="mt-2 text-2xl font-heading font-black text-ink">{value}</div>
    </div>
  )
}

function Panel({ title, icon, body }: { title: string; icon: React.ReactNode; body: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex h-7 w-7 items-center justify-center rounded bg-brand-yellow text-ink">
          {icon}
        </div>
        <h3 className="font-heading font-bold text-xl text-ink">{title}</h3>
      </div>
      <div className="text-sm">{body}</div>
    </div>
  )
}

function ServiceCard({ icon, title, points }: { icon: React.ReactNode; title: string; points: string[] }) {
  return (
    <div className="rounded-md border border-border bg-white p-6 flex flex-col">
      <div className="flex items-center gap-2 text-ink">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-ink/5">
          {icon}
        </div>
        <h3 className="font-heading font-bold text-lg">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2 text-sm list-disc pl-5">
        {points.map((p, i) => <li key={i} className="text-ink-90">{p}</li>)}
      </ul>
      <span className="mt-4 block h-1 w-full bg-brand-yellow/60 rounded" />
    </div>
  )
}

type TeamMember = {
  name: string
  role: string
  club?: string
  avatar?: string
}
const TEAM: TeamMember[] = [
  { name: 'Alex Santos', role: 'Race Director', club: 'Subic Bay', avatar: '' },
  { name: 'Maya Dizon', role: 'Youth Pathways Lead', club: 'Tali Beach', avatar: '' },
  { name: 'J.P. Lim', role: 'Chief Measurer', club: 'Puerto Galera', avatar: '' },
  { name: 'Rhea Tan', role: 'Partnerships', club: 'Manila Bay', avatar: '' },
  { name: 'Ken Navarro', role: 'Results & Tech', club: 'Cebu', avatar: '' },
  { name: 'Leah Cruz', role: 'Sustainability', club: 'Boracay', avatar: '' },
]

function TeamCard({ name, role, club, avatar }: TeamMember) {
  return (
    <div className="rounded-md border border-border bg-white p-5 flex items-center gap-4">
      <div className="h-14 w-14 rounded-full bg-ink/5 grid place-items-center text-ink font-heading font-black">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>{initials(name)}</span>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-heading font-black text-ink truncate">{name}</div>
        <div className="text-sm text-ink-80">{role}</div>
        {club && <div className="text-[12px] uppercase tracking-wide text-ink/60">{club}</div>}
      </div>
    </div>
  )
}

function CTA({
  title, body, primary, secondary,
}: {
  title: string
  body: string
  primary: { href: string; label: string }
  secondary?: { href: string; label: string }
}) {
  return (
    <div className="rounded-md border border-border bg-white p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-heading font-bold text-xl text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink-90">{body}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild><a href={primary.href}>{primary.label}</a></Button>
        {secondary && (
          <Button variant="outline" asChild>
            <a href={secondary.href}>{secondary.label}</a>
          </Button>
        )}
      </div>
    </div>
  )
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase()
}
