import { Reveal } from "@/components/reveal"
import { OakLeaf } from "@/components/oak-mark"
import { BadgeCheck, BookOpen, HandHeart } from "lucide-react"

const points = [
  {
    icon: BadgeCheck,
    title: "Independent self-regulation",
    description:
      "Members work within a recognised regulatory framework, held to standards well above those of unregulated will writers.",
  },
  {
    icon: BookOpen,
    title: "A strict code of practice",
    description:
      "Clear, ethical conduct is required at every stage — transparent advice, fair pricing and your interests first.",
  },
  {
    icon: HandHeart,
    title: "A client guarantee",
    description:
      "Your work is backed by the Society's guarantee, giving you confidence and recourse should you ever need it.",
  },
]

export function Society() {
  return (
    <section className="bg-secondary px-6 py-24 sm:py-32" aria-label="Society of Will Writers membership">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <span className="flex items-center gap-3 text-sm uppercase tracking-label text-accent">
            <OakLeaf className="h-5 w-5" />
            Assurance you can trust
          </span>
          <h2 className="mt-5 text-balance font-serif text-4xl font-medium leading-tight text-primary sm:text-5xl">
            Why choose a Society of Will Writers member
          </h2>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg">
            Choosing an accredited professional means your plan is prepared with care, competence and accountability —
            not left to chance. It is the difference between a document and genuine, lasting protection.
          </p>
        </Reveal>

        <ul className="flex flex-col gap-6">
          {points.map((point, i) => {
            const Icon = point.icon
            return (
              <Reveal as="li" key={point.title} delay={i * 0.1}>
                <div className="flex gap-5 rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/5 text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-primary">{point.title}</h3>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
