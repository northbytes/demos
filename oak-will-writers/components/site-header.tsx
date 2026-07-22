"use client"

import { useEffect, useState } from "react"
import { OakLeaf } from "@/components/oak-mark"

const links = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-white/10 bg-primary/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5 text-[#f5efe2]">
          <OakLeaf className="h-6 w-6 text-accent" />
          <span className="font-serif text-xl font-medium tracking-wide">Oak Will Writers</span>
        </a>
        <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#f5efe2]/80 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-[#1c1c1c] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5efe2]"
        >
          Free Consultation
        </a>
      </div>
    </header>
  )
}
