import { Reveal } from "@/components/reveal"
import { OakDivider } from "@/components/oak-mark"

export function Reassurance() {
  return (
    <section className="bg-background px-6 py-28 sm:py-36" aria-label="Our purpose">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <OakDivider className="mb-10" />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-balance font-serif text-3xl font-medium leading-[1.2] text-primary sm:text-4xl md:text-5xl">
            You&apos;re not just protecting assets. You&apos;re protecting your family.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            A well-made plan is a quiet act of love — the certainty that the people you care about will be looked after,
            calmly and without confusion, long after you&apos;re gone.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
