import { cn } from "@/lib/utils"

/**
 * A fine line-drawn oak leaf used as a recurring brand accent —
 * for section dividers, bullet markers and a small mark near headings.
 */
export function OakLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      {/* central vein */}
      <path d="M12 2.5c0 6 0 12 0 19" />
      {/* lobed oak leaf outline */}
      <path d="M12 3.2c1.4 1.1 2.2 1 3.1.2 .3 1.4-.4 2.2-1.2 2.6 1.7.4 2.7-.1 3.4-1 .1 1.6-.9 2.4-2 2.7 1.7.6 2.8.2 3.6-.6-.1 1.7-1.2 2.5-2.5 2.7 1.6.8 2.8.6 3.7-.1-.4 1.7-1.7 2.4-3 2.4 1.3 1 2.4 1 3.4.6-.9 1.5-2.3 1.8-3.6 1.4" />
      <path d="M12 3.2c-1.4 1.1-2.2 1-3.1.2-.3 1.4.4 2.2 1.2 2.6-1.7.4-2.7-.1-3.4-1-.1 1.6.9 2.4 2 2.7-1.7.6-2.8.2-3.6-.6.1 1.7 1.2 2.5 2.5 2.7-1.6.8-2.8.6-3.7-.1.4 1.7 1.7 2.4 3 2.4-1.3 1-2.4 1-3.4.6.9 1.5 2.3 1.8 3.6 1.4" />
    </svg>
  )
}

/** A slim horizontal divider with a centered oak leaf. */
export function OakDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 text-accent", className)} aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-40 sm:w-24" />
      <OakLeaf className="h-5 w-5 shrink-0" />
      <span className="h-px w-16 bg-current opacity-40 sm:w-24" />
    </div>
  )
}
