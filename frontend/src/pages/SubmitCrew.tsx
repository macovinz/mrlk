// src/pages/SubmitCrew.tsx
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { ArrowRight, ShieldCheck, User, Sailboat, CalendarDays, MapPin, Info, Link as LinkIcon, Mail, MessageSquareHeart } from 'lucide-react'

type Role = 'crew' | 'skipper'
type PositionsKey =
  | 'helm' | 'tactician' | 'main' | 'jibSpin' | 'bow' | 'mast' | 'pit' | 'grinder' | 'shore' | 'media'
type AvailabilityKey = 'weekends' | 'weeknights' | 'regattas' | 'delivery'
type BoatTypeKey = 'dinghy' | 'keelboat' | 'offshore' | 'windsurf' | 'foiling' | 'oneDesign'
type CertKey = 'firstAid' | 'vhf' | 'stcw' | 'sas'

const positions: Record<PositionsKey, string> = {
  helm: 'Helm',
  tactician: 'Tactician',
  main: 'Main',
  jibSpin: 'Jib/Spin Trimmer',
  bow: 'Bow',
  mast: 'Mast',
  pit: 'Pit',
  grinder: 'Grinder',
  shore: 'Shore Crew',
  media: 'Media/Content',
}

const availability: Record<AvailabilityKey, string> = {
  weekends: 'Weekends',
  weeknights: 'Weeknights',
  regattas: 'Regattas only',
  delivery: 'Deliveries',
}

const boatTypes: Record<BoatTypeKey, string> = {
  dinghy: 'Dinghy',
  keelboat: 'Keelboat',
  offshore: 'Offshore',
  windsurf: 'Windsurf',
  foiling: 'Foiling',
  oneDesign: 'One-Design',
}

const certs: Record<CertKey, string> = {
  firstAid: 'First Aid',
  vhf: 'VHF/SRC',
  stcw: 'STCW',
  sas: 'Safety at Sea',
}

type FormState = {
  role: Role
  name: string
  email: string
  phone?: string
  whatsapp?: string
  homePort?: string
  region?: string
  summary: string
  experienceYears?: string
  positions: Partial<Record<PositionsKey, boolean>>
  availability: Partial<Record<AvailabilityKey, boolean>>
  boatTypes: Partial<Record<BoatTypeKey, boolean>>
  certs: Partial<Record<CertKey, boolean>>
  fromDate?: string
  toDate?: string
  travelOk: boolean
  gearOk: boolean
  links?: string
  consentDirectory: boolean
  agreeCode: boolean
  newsletterOptIn: boolean
  honeypot?: string // anti-spam
}

export default function SubmitCrew() {
  const [form, setForm] = useState<FormState>({
    role: 'crew',
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    homePort: '',
    region: '',
    summary: '',
    experienceYears: '',
    positions: {},
    availability: {},
    boatTypes: {},
    certs: {},
    fromDate: '',
    toDate: '',
    travelOk: true,
    gearOk: true,
    links: '',
    consentDirectory: true,
    agreeCode: false,
    newsletterOptIn: false,
    honeypot: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  // persist draft locally (simple)
  useEffect(() => {
    try {
      localStorage.setItem('phs_crew_submit_draft', JSON.stringify(form))
    } catch {}
  }, [form])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('phs_crew_submit_draft')
      if (raw) setForm((f) => ({ ...f, ...JSON.parse(raw) }))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isSkipper = form.role === 'skipper'

  const canSubmit = useMemo(() => {
    const required = !!form.name && !!form.email && !!form.summary && form.agreeCode
    return required && !form.honeypot
  }, [form])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }
  function toggleNested<T extends object>(obj: T, key: keyof T) {
    return { ...obj, [key]: !obj[key] }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      setErrorMsg('Please complete the required fields and agree to the Code of Conduct.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    try {
      // 💡 Backend stub — wire up later to a WP endpoint
      // const res = await fetch('/wp-json/phs/v1/crew-submissions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form),
      // })
      // if (!res.ok) throw new Error('Submission failed')
      console.log('Crew submission payload:', form)
      setStatus('success')
      // Optionally clear (keep name/email for convenience)
      setForm((f) => ({ ...f, summary: '', links: '' }))
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.message || 'Something went wrong.')
    }
  }

  return (
    <main className="pb-16">
      {/* Ocean-style hero */}
      <section className="bg-ink text-white">
        <div className="container py-10 md:py-12">
          <h1 className="section-title text-white uppercase">Submit Crew / Crew Wanted</h1>
          <span className="mt-3 block h-1 w-20 bg-brand-yellow" />
          <p className="mt-3 max-w-2xl text-sm text-white/85">
            Post a crew profile or a crew callout for your boat. Listings appear in the Crew Directory and may be shared on our channels.
          </p>
        </div>
      </section>

      <section className="container mt-8">
        <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-3">
          {/* Form (2 cols) */}
          <div className="md:col-span-2 space-y-8">
            {/* Role */}
            <section>
              <h2 className="font-heading font-bold text-xl text-ink flex items-center gap-2">
                <User className="h-5 w-5" /> What are you posting?
              </h2>
              <span className="mt-2 mb-4 block h-1 w-16 bg-brand-yellow rounded-full" />
              <ToggleGroup
                type="single"
                value={form.role}
                onValueChange={(v) => v && update('role', v as Role)}
                className="gap-2"
              >
                <ToggleGroupItem value="crew" className="h-9 rounded-md border border-border text-ink data-[state=on]:bg-ink data-[state=on]:text-white">
                  I’m Crew (looking for a boat)
                </ToggleGroupItem>
                <ToggleGroupItem value="skipper" className="h-9 rounded-md border border-border text-ink data-[state=on]:bg-ink data-[state=on]:text-white">
                  I’m a Skipper/Boat (looking for crew)
                </ToggleGroupItem>
              </ToggleGroup>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-heading font-bold text-xl text-ink flex items-center gap-2">
                <Mail className="h-5 w-5" /> Contact details
              </h2>
              <span className="mt-2 mb-4 block h-1 w-16 bg-brand-yellow rounded-full" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Full name *"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
                <Input
                  placeholder="Phone (optional)"
                  value={form.phone || ''}
                  onChange={(e) => update('phone', e.target.value)}
                />
                <Input
                  placeholder="WhatsApp (optional)"
                  value={form.whatsapp || ''}
                  onChange={(e) => update('whatsapp', e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <Input
                  placeholder={isSkipper ? 'Home port / Marina' : 'Home port / City'}
                  value={form.homePort || ''}
                  onChange={(e) => update('homePort', e.target.value)}
                />
                <Select value={form.region || ''} onValueChange={(v) => update('region', v)}>
                  <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Luzon">Luzon</SelectItem>
                    <SelectItem value="Visayas">Visayas</SelectItem>
                    <SelectItem value="Mindanao">Mindanao</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Experience & Roles */}
            <section>
              <h2 className="font-heading font-bold text-xl text-ink flex items-center gap-2">
                <Sailboat className="h-5 w-5" /> Experience & Roles
              </h2>
              <span className="mt-2 mb-4 block h-1 w-16 bg-brand-yellow rounded-full" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  value={form.experienceYears || ''}
                  onValueChange={(v) => update('experienceYears', v)}
                >
                  <SelectTrigger><SelectValue placeholder="Years of experience" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0–1</SelectItem>
                    <SelectItem value="2-3">2–3</SelectItem>
                    <SelectItem value="4-6">4–6</SelectItem>
                    <SelectItem value="7-10">7–10</SelectItem>
                    <SelectItem value="10+">10+</SelectItem>
                  </SelectContent>
                </Select>

                <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                  {Object.entries(positions).map(([k, label]) => (
                    <label key={k} className="inline-flex items-center gap-2 text-sm text-ink">
                      <Checkbox
                        checked={!!form.positions[k as PositionsKey]}
                        onCheckedChange={() => update('positions', toggleNested(form.positions, k as PositionsKey))}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(boatTypes).map(([k, label]) => (
                    <label key={k} className="inline-flex items-center gap-2 text-sm text-ink">
                      <Checkbox
                        checked={!!form.boatTypes[k as BoatTypeKey]}
                        onCheckedChange={() => update('boatTypes', toggleNested(form.boatTypes, k as BoatTypeKey))}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(certs).map(([k, label]) => (
                    <label key={k} className="inline-flex items-center gap-2 text-sm text-ink">
                      <Checkbox
                        checked={!!form.certs[k as CertKey]}
                        onCheckedChange={() => update('certs', toggleNested(form.certs, k as CertKey))}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Availability & Dates */}
            <section>
              <h2 className="font-heading font-bold text-xl text-ink flex items-center gap-2">
                <CalendarDays className="h-5 w-5" /> Availability
              </h2>
              <span className="mt-2 mb-4 block h-1 w-16 bg-brand-yellow rounded-full" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  type="date"
                  value={form.fromDate || ''}
                  onChange={(e) => update('fromDate', e.target.value)}
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={form.toDate || ''}
                  onChange={(e) => update('toDate', e.target.value)}
                  placeholder="To"
                />
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-ink">
                    <Switch checked={form.travelOk} onCheckedChange={(v) => update('travelOk', !!v)} />
                    Can travel
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-ink">
                    <Switch checked={form.gearOk} onCheckedChange={(v) => update('gearOk', !!v)} />
                    Has own basic gear
                  </label>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(availability).map(([k, label]) => (
                  <label key={k} className="inline-flex items-center gap-2 text-sm text-ink">
                    <Checkbox
                      checked={!!form.availability[k as AvailabilityKey]}
                      onCheckedChange={() => update('availability', toggleNested(form.availability, k as AvailabilityKey))}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            {/* Summary / Listing copy */}
            <section>
              <h2 className="font-heading font-bold text-xl text-ink flex items-center gap-2">
                <MessageSquareHeart className="h-5 w-5" /> {isSkipper ? 'Crew you’re looking for' : 'Your crew profile'}
              </h2>
              <span className="mt-2 mb-4 block h-1 w-16 bg-brand-yellow rounded-full" />
              <Textarea
                rows={6}
                placeholder={isSkipper
                  ? 'Tell us about your boat, event(s), and what positions/experience you need…'
                  : 'Tell skippers about your sailing background, strengths, and what you’re looking for…'
                }
                value={form.summary}
                onChange={(e) => update('summary', e.target.value)}
                required
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Input
                    placeholder="Links (CV, social, results) — separate with commas"
                    value={form.links || ''}
                    onChange={(e) => update('links', e.target.value)}
                  />
                  <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-70" />
                </div>
                <div className="relative">
                  <Input
                    name="company" // honeypot
                    className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none"
                    tabIndex={-1}
                    onChange={(e) => update('honeypot', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Consent & actions */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-ink">
                  <Checkbox
                    checked={form.consentDirectory}
                    onCheckedChange={(v: any) => update('consentDirectory', !!v)}
                  />
                  Show this listing in the Crew Directory
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-ink">
                  <Checkbox
                    checked={form.newsletterOptIn}
                    onCheckedChange={(v: any) => update('newsletterOptIn', !!v)}
                  />
                  Email me new crew/boat matches
                </label>
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-ink-80">
                <ShieldCheck className="h-4 w-4 mt-0.5" />
                <p>
                  By submitting, you agree to our community Code of Conduct and anti-doping policy.
                  Please don’t post sensitive personal information. Your contact details are shared only for crew coordination.
                </p>
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-sm text-ink">
                <Checkbox
                  checked={form.agreeCode}
                  onCheckedChange={(v: any) => update('agreeCode', !!v)}
                />
                I agree to the Code of Conduct & anti-doping policy
              </label>

              {/* reCAPTCHA placeholder */}
              <div className="mt-4 rounded-md border border-dashed p-3 text-xs text-ink-70">
                reCAPTCHA widget placeholder
              </div>

              {/* Submit */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={!canSubmit || status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting…' : 'Submit Listing'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {status === 'success' && (
                  <span className="text-sm text-green-700">Thanks! Your submission has been received.</span>
                )}
                {status === 'error' && (
                  <span className="text-sm text-red-600">{errorMsg || 'Submission failed.'}</span>
                )}
                {!canSubmit && status !== 'success' && (
                  <span className="text-sm text-ink-70">Fill required fields (*) and tick the agreement to enable submit.</span>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar (Guidelines + Preview) */}
          <aside className="space-y-8">
            <section className="rounded-md border border-white/10 bg-ink text-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded bg-brand-yellow text-ink">
                  <Info className="h-4 w-4" />
                </div>
                <h4 className="font-semibold uppercase text-sm tracking-wide">Posting Guidelines</h4>
              </div>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Keep it concise and specific (positions, dates, boat type).</li>
                <li>• Share contact methods you actively monitor.</li>
                <li>• Safety first: PFDs and compliance with NOR/SIs.</li>
                <li>• Respect anti-doping and community standards.</li>
              </ul>
            </section>

            <section className="rounded-md border bg-white p-4">
              <h4 className="font-heading font-semibold uppercase text-sm tracking-wide mb-3">Live Preview</h4>
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider">
                  {form.role === 'crew' ? 'Crew Profile' : 'Crew Wanted'}
                </div>
                <h3 className="font-heading font-extrabold text-ink text-lg leading-snug">
                  {form.name || 'Your name'}
                </h3>
                {(form.homePort || form.region) && (
                  <div className="flex items-center gap-1 text-[12px] uppercase tracking-wide text-ink-70">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{[form.homePort, form.region].filter(Boolean).join(' • ')}</span>
                </div>
                )}
                <div className="mt-2 text-sm text-ink-90 line-clamp-5 whitespace-pre-wrap">
                  {form.summary || 'Your summary will appear here…'}
                </div>
                {form.links && (
                  <div className="mt-2 text-[12px]">
                    <span className="font-semibold">Links:</span>{' '}
                    {form.links.split(',').map((u, i) => (
                      <a key={i} href={u.trim()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-2 decoration-[var(--brand-yellow)] mr-2">
                        {u.trim()}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 h-1 w-full bg-brand-yellow" />
            </section>
          </aside>
        </form>
      </section>
    </main>
  )
}
