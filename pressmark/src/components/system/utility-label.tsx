"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/* Spec labels — SIZE RUN, 180 GSM, 300 DPI, LEAD TIME.
 * Types in character by character over 300ms on section entry. Once.
 * The text is always in the DOM: the reveal is a stepped clip, so the label
 * stays readable with JS off and never re-flows. */
export function UtilityLabel({
  children,
  className,
  type = true,
}: {
  children: string;
  className?: string;
  type?: boolean;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = React.useState<"idle" | "pending" | "run">("idle");

  // Before paint, so there's no flash of the full label first.
  useIsomorphicLayoutEffect(() => {
    if (type) setPhase("pending");
  }, [type]);

  React.useEffect(() => {
    if (!type) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPhase("run");
        io.disconnect();
      },
      // Threshold 0: a label wider than the viewport would never reach a
      // higher ratio, and would stay clipped out of existence.
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [type]);

  return (
    <span ref={ref} className={cn("t-utility", className)}>
      <span
        className="type-in"
        data-typing={phase === "idle" ? undefined : phase}
        style={{ "--chars": children.length } as React.CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}
