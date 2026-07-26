"use client";

import * as React from "react";

/* The low-resolution half of a comparison pair.
 *
 * This actually resamples the mark rather than imitating the look of it: the
 * SVG is rasterised at `sample` pixels wide, then blown back up to plate size
 * with smoothing off. What you see is real information loss, the same kind a
 * 72 DPI file suffers on the way to a 300 DPI plate — not a blur filter
 * standing in for it.
 *
 * ponytail: the cheap version was `filter: url(#pixelate)` in pure SVG, but
 * the feTile/feMorphology chain renders empty in Chrome, and a CSS blur is an
 * impression of the problem rather than the problem. 20 lines of canvas is the
 * honest one. */
export function LowRes({
  src,
  sample,
  bg,
  alt,
}: {
  src: string;
  /** Rasterise this many pixels wide before upscaling. Lower = coarser. */
  sample: number;
  /** Painted under the mark first — the marks are transparent. */
  bg: string;
  alt: string;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = React.useState(false);

  React.useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const img = new Image();
    img.onload = () => {
      const ctx = cv.getContext("2d");
      if (!ctx) return;

      // Down: the browser rasterises the SVG at this size, and that's where
      // the detail is actually lost.
      const lo = document.createElement("canvas");
      lo.width = sample;
      lo.height = Math.max(1, Math.round((sample * cv.height) / cv.width));
      const loCtx = lo.getContext("2d");
      if (!loCtx) return;
      loCtx.fillStyle = bg;
      loCtx.fillRect(0, 0, lo.width, lo.height);
      loCtx.drawImage(img, 0, 0, lo.width, lo.height);

      // Up: nearest neighbour, so the surviving pixels stay visible as pixels.
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(lo, 0, 0, cv.width, cv.height);
      setPainted(true);
    };
    img.src = src;
  }, [src, sample, bg]);

  return (
    <>
      <canvas
        ref={ref}
        width={600}
        height={420}
        role="img"
        aria-label={alt}
        className={`block w-full ${painted ? "" : "hidden"}`}
      />
      {/* Until the canvas has painted — and with JS off entirely — the figure
          shows the mark rather than an empty plate. */}
      {!painted && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="block w-full" />
      )}
    </>
  );
}
