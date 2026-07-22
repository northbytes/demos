"use client"

import { motion } from "motion/react"
import { OakLeaf } from "@/components/oak-mark"

const stats = [
  { value: "40+ Years", label: "in Financial Services" },
  { value: "Society of Will Writers", label: "Member" },
  { value: "Diploma", label: "in Wealth Management" },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground" aria-label="Credentials">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.value}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2 px-4 py-10 text-center"
          >
            <OakLeaf className="h-5 w-5 text-accent" />
            <p className="font-serif text-2xl font-medium leading-tight text-[#f5efe2] sm:text-[1.75rem]">
              {stat.value}
            </p>
            <p className="text-sm uppercase tracking-label text-[#f5efe2]/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
