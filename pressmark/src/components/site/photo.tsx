import * as React from "react";
import { HalftoneField } from "@/components/system/halftone-field";
import { asset, cn } from "@/lib/utils";

/* A placed photograph. `src` is optional so a slot with no shot yet still
 * renders as a press-toned plate rather than a hole — the halftone and grain
 * read as an image that hasn't been dropped in, not a broken one. */
export function Photo({
  src,
  label,
  i = 0,
  /** Above the fold — skip lazy loading, this one is the LCP. */
  eager,
  className,
  style,
}: {
  src?: string;
  label: string;
  i?: number;
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // The hairline is what separates a plate from the band behind it when
        // both are press-toned.
        "grain relative overflow-hidden border border-rule bg-press-2 [.on-dark_&]:border-rule-dk",
        className,
      )}
      style={{
        // Wash at low alpha lifts the plate off a --press band without adding a
        // colour to the system. Under a photo it's the colour of the gap while
        // the file loads.
        backgroundImage: `linear-gradient(${120 + ((i * 47) % 140)}deg, color-mix(in srgb, var(--wash) 15%, transparent) 0%, color-mix(in srgb, var(--wash) 2%, transparent) 78%)`,
        ...style,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset(src)}
          alt=""
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <HalftoneField opacity={0.16} />
          <span className="t-utility absolute top-4 left-4 text-paper opacity-30">
            {label}
          </span>
        </>
      )}
    </div>
  );
}
