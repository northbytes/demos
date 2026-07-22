"use client"

import { motion } from "motion/react"
import { ScrollText, ShieldCheck, Landmark, Coins } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { OakDivider } from "@/components/oak-mark"

const services = [
  {
    icon: ScrollText,
    title: "Wills",
    description: "Bespoke wills drafted around your family, your wishes and your peace of mind.",
  },
  {
    icon: ShieldCheck,
    title: "Lasting Powers of Attorney",
    description: "Trusted people empowered to act for you should you ever be unable to.",
  },
  {
    icon: Landmark,
    title: "Trusts",
    description: "Protect assets for children, vulnerable loved ones and future generations.",
  },
  {
    icon: Coins,
    title: "Inheritance Tax (IHT) Planning",
    description: "Pass on more of what you have built, structured tax-efficiently and safely.",
  },
]

export function Services() {
  return (
    <section id="services" className="bg-background px-6 py-24 sm:py-32" aria-label="Our services">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Reveal>
            <p className="text-sm uppercase tracking-label text-accent">What we do</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight text-primary sm:text-5xl">
              Considered advice for every branch of your estate
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <OakDivider className="mt-8" />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-accent/15 group-hover:text-accent">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-serif text-2xl font-medium text-primary">{service.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
