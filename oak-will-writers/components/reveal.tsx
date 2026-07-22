"use client"

import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** How far (px) the element rises into place. */
  y?: number
  as?: "div" | "section" | "li" | "span"
}

const easing = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const MotionTag = motion[as]
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easing, delay },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  )
}
