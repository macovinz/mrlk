
import { Mail, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SubmitStory() {
  return (
    <section className="bg-white">
      <div className="container pb-12">
        <div className="rounded-md overflow-hidden ring-1 ring-border bg-ink text-white">
          <div className="h-1 bg-brand-yellow" />
          <div className="p-6 md:p-8">
            <h3 className="font-heading font-black text-2xl">Submit your story</h3>
            <p className="mt-2 text-sm text-white/85">
              Racing report? Club announcement? Share it with the community and we’ll feature the best.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                <a href="/submit">
                  <UploadCloud className="h-4 w-4" />
                  Pitch a post
                </a>
              </Button>
              <Button asChild className="font-bold uppercase">
                <a href="mailto:editor@sailing.ph">
                  <Mail className="h-4 w-4" />
                  Email the editor
                </a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/70">
              Tip: Include results PDF, 2–4 photos, and a 1–2 paragraph summary.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
