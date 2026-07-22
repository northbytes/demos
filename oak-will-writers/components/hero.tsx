"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { OakLeaf } from "@/components/oak-mark"

/** One word whose opacity ramps up as scroll progress passes its slot. */
function Word({ progress, range, word }: { progress: MotionValue<number>; range: [number, number]; word: string }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  )
}

/** Apple-style scroll-tied text reveal: words brighten one after another. */
function WordReveal({
  progress,
  range,
  text,
}: {
  progress: MotionValue<number>
  range: [number, number]
  text: string
}) {
  const words = text.split(" ")
  const [start, end] = range
  const step = (end - start) / words.length
  return (
    <>
      {words.map((word, i) => (
        <Word key={i} progress={progress} range={[start + i * step, start + (i + 1) * step]} word={word} />
      ))}
    </>
  )
}

/** A statement pinned over the video that fades in/out at a scroll range. */
function Chapter({
  progress,
  range,
  className,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number, number, number]
  className: string
  children: React.ReactNode
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0])
  const y = useTransform(progress, [range[0], range[3]], [30, -30])
  // visibility gates pointer events so hidden chapters never block clicks
  const visibility = useTransform(opacity, (v) => (v > 0.01 ? "visible" : "hidden"))
  return (
    <motion.div style={{ opacity, y, visibility }} className={`absolute inset-0 flex px-6 sm:px-12 lg:px-20 ${className}`}>
      {children}
    </motion.div>
  )
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  // Track scroll progress across the tall hero container.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Content is visible at the top, then fades/rises out as you scroll past.
  const contentOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2], [1, 1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.2], [0, -60])
  const contentVisibility = useTransform(contentOpacity, (v) => (v > 0.01 ? "visible" : "hidden"))
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  /**
   * Smooth scrubbing: instead of seeking the video on every scroll event
   * (which is jerky because scroll fires in coarse bursts), we run a
   * continuous rAF loop that eases the video's currentTime toward the
   * scroll-derived target. The lerp smooths out the coarse scroll input
   * so playback glides rather than snapping frame to frame.
   */
  useEffect(() => {
    if (reduceMotion) return
    let raf = 0

    const tick = () => {
      const video = videoRef.current
      // Read duration off the element each frame: relying on the
      // loadedmetadata event misses it when the cached video loads
      // before React hydration attaches the handler.
      const duration = video?.duration ?? 0
      if (video && video.readyState >= 1 && Number.isFinite(duration) && duration > 0) {
        const target = Math.min(duration, Math.max(0, scrollYProgress.get() * duration))
        const current = video.currentTime
        const diff = target - current
        // Ease toward the target; snap when close enough to avoid micro-seeks.
        if (Math.abs(diff) > 0.01 && !video.seeking) {
          video.currentTime = current + diff * 0.15
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion, scrollYProgress])

  return (
    <section ref={containerRef} className="relative h-[300vh] max-md:h-[240vh]" aria-label="Oak Will Writers introduction">
      {/* Pinned, full-viewport video stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          poster="/demos/oak-will-writers/site/hero-oak-poster.jpg"
        >
          {/* basePath doesn't rewrite plain DOM src attrs, so prefix by hand */}
          <source src="/demos/oak-will-writers/site/hero-oak.mp4" type="video/mp4" />
        </video>

        {/* Gradient scrims (top + bottom) and vignette for legibility */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,31,24,0.72) 0%, rgba(11,31,24,0.15) 28%, rgba(11,31,24,0.15) 55%, rgba(11,31,24,0.82) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ boxShadow: "inset 0 0 220px 60px rgba(11,31,24,0.55)" }}
        />

        {/* Hero content */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY, visibility: contentVisibility }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="flex items-center gap-3 text-accent">
            <span className="h-px w-10 bg-current opacity-50" />
            <OakLeaf className="h-6 w-6" />
            <span className="h-px w-10 bg-current opacity-50" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-label text-[#f5efe2]/80 sm:text-sm">
            Oak Will Writers &middot; Est. in service, built on trust
          </p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl font-medium leading-[1.05] text-[#f5efe2] sm:text-6xl md:text-7xl lg:text-8xl">
            A Legacy That Lasts Generations.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[#f5efe2]/85 sm:text-lg">
            Bespoke will writing and estate planning across Kent, London and the South East — protecting what matters
            most to you.
          </p>
          <a
            href="#contact"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-medium tracking-wide text-[#1c1c1c] shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5efe2] focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Book a Free Consultation
          </a>
        </motion.div>

        {/* Scroll-tied statements: words brighten as the film plays underneath */}
        <Chapter progress={scrollYProgress} range={[0.22, 0.27, 0.56, 0.62]} className="items-end justify-start pb-28">
          <div className="max-w-2xl text-left">
            <p className="flex items-center gap-2 text-xs uppercase tracking-label text-accent">
              <OakLeaf className="h-4 w-4" /> The person behind the plan
            </p>
            <p className="mt-4 font-serif text-3xl font-medium leading-[1.15] text-[#f5efe2] sm:text-4xl md:text-5xl">
              <WordReveal
                progress={scrollYProgress}
                range={[0.27, 0.45]}
                text="Forty years of financial wisdom, devoted to one thing — your family's tomorrow."
              />
            </p>
          </div>
        </Chapter>
        <Chapter progress={scrollYProgress} range={[0.64, 0.69, 0.94, 0.99]} className="items-end justify-end pb-28">
          <div className="max-w-2xl text-left sm:text-right">
            <p className="flex items-center gap-2 text-xs uppercase tracking-label text-accent sm:justify-end">
              <OakLeaf className="h-4 w-4" /> Kent, London &amp; the South East
            </p>
            <p className="mt-4 font-serif text-3xl font-medium leading-[1.15] text-[#f5efe2] sm:text-4xl md:text-5xl">
              <WordReveal
                progress={scrollYProgress}
                range={[0.69, 0.85]}
                text="Handled personally, from first conversation to signed will."
              />
            </p>
          </div>
        </Chapter>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#f5efe2]/70"
        >
          <span className="text-[10px] uppercase tracking-label">Scroll</span>
          <motion.span
            className="h-8 w-px bg-current"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </div>
    </section>
  )
}
