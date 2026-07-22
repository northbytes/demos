"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { Reveal } from "@/components/reveal"
import { OakLeaf } from "@/components/oak-mark"

const credentials = [
  "40 years in financial services advisory",
  "Founder of three property, mortgage & wealth firms",
  "Diploma in Wealth Management",
  "Member, The Society of Will Writers",
]

export function AboutSteve() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // Gentle parallax lift on the panel.
  const panelY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="about" className="bg-secondary px-6 py-24 sm:py-32" aria-label="About Steve Baker">
      <div ref={ref} className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="order-2 md:order-1">
          <span className="flex items-center gap-3 text-sm uppercase tracking-label text-accent">
            <OakLeaf className="h-5 w-5" />
            The person behind the plan
          </span>
          <h2 className="mt-5 text-balance font-serif text-4xl font-medium leading-tight text-primary sm:text-5xl">
            Steve Baker
          </h2>
          <div className="mt-6 space-y-5 text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg">
            <p>
              A 40-year veteran of the financial services advisory sector, Steve Baker has founded and managed three
              successful businesses in property, mortgage finance and wealth management.
            </p>
            <p>
              He now brings his Diploma in Wealth Management to bespoke, individual will and estate planning — ensuring
              your hard-earned assets pass quickly, tax-efficiently and safely to the people you love.
            </p>
          </div>
          <a
            href="#contact"
            className="mt-9 inline-flex items-center gap-2 border-b border-accent pb-1 text-sm font-medium uppercase tracking-wide text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Arrange a conversation
            <span aria-hidden="true">&rarr;</span>
          </a>
        </Reveal>

        <Reveal className="order-1 md:order-2" y={40}>
          <div className="relative mx-auto w-full max-w-md">
            {/* Outer brass frame */}
            <div className="absolute -inset-3 rounded-[1.75rem] border border-accent/40" aria-hidden="true" />

            <motion.div
              style={{ y: panelY }}
              className="relative overflow-hidden rounded-2xl bg-primary px-8 py-12 text-center shadow-xl shadow-primary/20 sm:px-10 sm:py-14"
            >
              {/* Faint oak watermark */}
              <OakLeaf
                className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-accent/10"
                aria-hidden="true"
              />

              {/* Monogram */}
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-accent/50">
                <span className="font-serif text-4xl font-medium tracking-wide text-accent">SB</span>
              </div>

              <p className="relative mt-8 font-serif text-3xl font-medium text-[#f5efe2]">Steve Baker</p>
              <p className="relative mt-2 text-xs uppercase tracking-label text-accent">
                Founder &amp; Estate Planning Adviser
              </p>

              <span className="relative mx-auto mt-8 block h-px w-16 bg-[#f5efe2]/20" aria-hidden="true" />

              <ul className="relative mt-8 space-y-4 text-left">
                {credentials.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <OakLeaf className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm leading-relaxed text-[#f5efe2]/85">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
