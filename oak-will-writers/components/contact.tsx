"use client"

import { useState, type FormEvent } from "react"
import { Reveal } from "@/components/reveal"
import { OakLeaf } from "@/components/oak-mark"
import { Phone, Mail, MapPin, Check } from "lucide-react"

const details = [
  { icon: Phone, label: "Phone", value: "07931 526216", href: "tel:07931526216" },
  { icon: Mail, label: "Email", value: "steve@purplecownetwork.co.uk", href: "mailto:steve@purplecownetwork.co.uk" },
  {
    icon: MapPin,
    label: "Address",
    value: "McLaren House, 3 Alefe Way, Iwade, Kent ME9 8TX",
    href: "https://maps.google.com/?q=McLaren House, 3 Alefe Way, Iwade, Kent ME9 8TX",
  },
]

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-primary px-6 py-24 text-primary-foreground sm:py-32">
      {/* faint oak-branch watermark */}
      <OakLeaf
        className="pointer-events-none absolute -right-16 -top-10 h-96 w-96 rotate-12 text-white/[0.04]"
      />
      <OakLeaf
        className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 -rotate-12 text-white/[0.04]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <span className="flex items-center gap-3 text-sm uppercase tracking-label text-accent">
              <OakLeaf className="h-5 w-5" />
              Let&apos;s begin
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance font-serif text-4xl font-medium leading-tight text-[#f5efe2] sm:text-5xl">
              Start Your Family&apos;s Estate Plan Today
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-[#f5efe2]/80">
              Book a free, no-obligation consultation. We&apos;ll talk through your wishes and show you exactly how to
              protect the people you love.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-10 space-y-5">
              {details.map((d) => {
                const Icon = d.icon
                return (
                  <li key={d.label}>
                    <a
                      href={d.href}
                      target={d.label === "Address" ? "_blank" : undefined}
                      rel={d.label === "Address" ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 focus-visible:outline-none"
                    >
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-accent transition-colors group-hover:border-accent">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-label text-[#f5efe2]/60">{d.label}</span>
                        <span className="block text-[#f5efe2] transition-colors group-hover:text-accent group-focus-visible:text-accent">
                          {d.value}
                        </span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={40}>
          <div className="rounded-2xl border border-white/12 bg-[#f5efe2] p-8 text-foreground shadow-2xl shadow-black/30 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-serif text-2xl font-medium text-primary">Thank you</h3>
                <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                  Your message has been received. Steve will be in touch personally within one working day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Field id="name" label="Name" type="text" autoComplete="name" />
                <Field id="email" label="Email" type="email" autoComplete="email" />
                <Field id="phone" label="Phone" type="tel" autoComplete="tel" />
                <div>
                  <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-label text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/30"
                    placeholder="Tell us a little about what you'd like to protect."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5efe2]"
                >
                  Book a Free Consultation
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  No obligation. Your details are kept private and never shared.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  type,
  autoComplete,
}: {
  id: string
  label: string
  type: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-label text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </div>
  )
}
