
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Newsletter() {
  return (
    <section className="bg-slate-50">
      <div className="container pb-12">
        <div className="rounded-md overflow-hidden ring-1 ring-border bg-white">
          <div className="h-1 bg-brand-yellow" />
          <div className="p-6 md:p-8">
            <h3 className="font-heading font-black text-ink text-2xl">Subscribe for updates</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get the latest results, stories, and photos straight to your inbox.
            </p>
            <form
              className="mt-4 flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!') }}
            >
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                id="email"
                required
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-brand-yellow"
              />
              <Button type="submit" className="font-bold uppercase">
                <Mail className="h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
