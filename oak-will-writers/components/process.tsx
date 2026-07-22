"use client"

import { motion } from "motion/react"
import { Reveal } from "@/components/reveal"
import { OakDivider } from "@/components/oak-mark"

const steps = [
  { n: "01", title: "Free Consultation", description: "We meet, listen and understand your family, your assets and your wishes." },
  { n: "02", title: "Bespoke Planning", description: "A tailored strategy designed around your circumstances and long-term goals." },
  { n: "03", title: "Drafting & Review", description: "Your documents are carefully prepared, then reviewed together in full." },
  { n: "04", title: "Signing & Secure Storage", description: "Everything is signed correctly, witnessed and stored safely for the future." },
]

export function Process() {
  return (
    <section className="bg-background px-6 py-24 sm:py-32" aria-label="Our process">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Reveal>
            <p className="text-sm uppercase tracking-label text-accent">How it works</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight text-primary sm:text-5xl">
              A calm, considered path from first hello to lasting peace of mind
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <OakDivider className="mt-8" />
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* connecting line on desktop */}
          <span
            className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-start"
            >
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent bg-background font-serif text-lg text-accent">
                {step.n}
              </span>
              <h3 className="mt-5 font-serif text-2xl font-medium text-primary">{step.title}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
