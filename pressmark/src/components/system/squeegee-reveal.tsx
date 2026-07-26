"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/* The squeegee wipe — an 18deg diagonal mask sweeping left to right over 420ms.
 * The site's only reveal. Fires on scroll into view, and again whenever
 * `replayKey` changes (garment colour swaps).
 *
 * The mask is armed client-side: without JS the children just render, rather
 * than sitting masked out of existence. */
export function SqueegeeReveal({
  children,
  className,
  replayKey,
  threshold = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  replayKey?: string | number;
  threshold?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [armed, setArmed] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  const firstRun = React.useRef(true);

  // Before paint, so the mask is in place ahead of the first frame.
  useIsomorphicLayoutEffect(() => setArmed(true), []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const el = ref.current;
    if (!el) return;
    // Snap back to the masked-out state with no transition, flush it, then let
    // the wipe run. Done synchronously — a two-frame dance drops the restart
    // whenever frames are throttled.
    el.style.transitionDuration = "0ms";
    el.removeAttribute("data-in");
    void el.offsetWidth;
    el.style.transitionDuration = "";
    el.setAttribute("data-in", "true");
    setShown(true);
  }, [replayKey]);

  return (
    <div
      ref={ref}
      data-armed={armed || undefined}
      data-in={shown || undefined}
      className={cn("squeegee", className)}
    >
      {children}
    </div>
  );
}
