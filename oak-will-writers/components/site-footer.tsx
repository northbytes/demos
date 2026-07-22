import { OakLeaf } from "@/components/oak-mark"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-secondary px-6 py-14 text-foreground/80">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5 text-primary">
              <OakLeaf className="h-6 w-6 text-accent" />
              <span className="font-serif text-2xl font-medium">Oak Will Writers</span>
            </div>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Bespoke will writing and estate planning across Kent, London and the South East.
            </p>
          </div>

          <div className="text-sm">
            <p className="text-xs uppercase tracking-label text-accent">Contact</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="tel:07931526216" className="transition-colors hover:text-primary">
                  07931 526216
                </a>
              </li>
              <li>
                <a href="mailto:steve@purplecownetwork.co.uk" className="transition-colors hover:text-primary">
                  steve@purplecownetwork.co.uk
                </a>
              </li>
              <li className="text-muted-foreground">McLaren House, 3 Alefe Way, Iwade, Kent ME9 8TX</li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="text-xs uppercase tracking-label text-accent">Accreditation</p>
            <p className="mt-4 text-muted-foreground">Proud member of The Society of Will Writers.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Oak Will Writers. All rights reserved.</p>
          <p className="max-w-xl text-pretty">
            Oak Will Writers is a trading name providing will writing and estate planning services. This website is for
            information only and does not constitute legal or financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
