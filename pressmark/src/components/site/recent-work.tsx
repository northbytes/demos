"use client";

import * as React from "react";
import { Photo } from "./photo";

const WORK = [
  { h: 300, img: "/img/work-01.jpg", caption: "SCREEN · 2 COLOUR · 240 UNITS · FESTIVAL CREW" },
  { h: 210, img: "/img/work-02.jpg", caption: "EMBROIDERY · LEFT CHEST · 40 POLOS · SCAFFOLDING FIRM" },
  { h: 340, img: "/img/work-03.jpg", caption: "DTG · FULL COLOUR · 12 UNITS · HEN PARTY" },
  { h: 240, img: "/img/work-04.jpg", caption: "SCREEN · 1 COLOUR · 500 UNITS · CHARITY 10K" },
  { h: 280, img: "/img/work-05.jpg", caption: "VINYL · NAMES + NUMBERS · 22 SHIRTS · SUNDAY LEAGUE" },
  { h: 190, img: "/img/work-06.jpg", caption: "LARGE FORMAT · 3M BANNER · 4 OFF · SITE HOARDING" },
  { h: 320, img: "/img/work-07.jpg", caption: "SCREEN · 4 COLOUR · 150 HOODIES · SCHOOL LEAVERS" },
  { h: 250, img: "/img/work-08.jpg", caption: "EMBROIDERY · CAP FRONT · 60 CAPS · GROUNDWORKS" },
];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function RecentWork() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [armed, setArmed] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  // Armed client-side only, so with JS off the plates just render.
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
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="columns-2 gap-2 md:columns-4">
      {WORK.map((w, i) => (
        <figure key={w.caption} className="mb-2 break-inside-avoid">
          <div
            className={
              armed && !shown
                ? "opacity-0"
                : shown
                  ? "halftone-dissolve"
                  : undefined
            }
            style={shown ? { animationDelay: `${i * 60}ms` } : undefined}
          >
            <Photo
              src={w.img}
              label={`PLATE ${String(i + 1).padStart(2, "0")}`}
              i={i}
              className="w-full"
              // Varying heights are the whole point of the masonry.
              style={{ height: w.h }}
            />
          </div>
          <figcaption className="t-utility mt-2 text-wash opacity-60">
            {w.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
