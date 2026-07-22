"use client"

import { motion } from "motion/react"
import { Reveal } from "@/components/reveal"
import { MapPin } from "lucide-react"

const postcodes = ["ME", "TN", "CT", "BR", "SE", "BN", "RH", "GU", "DA", "CM"]

export function Areas() {
  return (
    <section className="bg-primary px-6 py-24 text-primary-foreground sm:py-32" aria-label="Areas covered">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="flex items-center justify-center gap-3 text-sm uppercase tracking-label text-accent">
            <MapPin className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            Where we work
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight text-[#f5efe2] sm:text-5xl">
            Serving Kent, London &amp; the South East
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-[#f5efe2]/75">
            Home visits and consultations arranged across the following postcode areas — and often a little beyond.
          </p>
        </Reveal>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {postcodes.map((code, i) => (
            <motion.li
              key={code}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 font-serif text-lg text-[#f5efe2] transition-colors hover:border-accent hover:text-accent"
            >
              {code}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
