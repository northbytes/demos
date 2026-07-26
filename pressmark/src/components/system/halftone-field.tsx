import { useId } from "react";
import { cn } from "@/lib/utils";

/* Halftone dot field — dots vary in radius across a vertical gradient.
 * Dark teal bands only. Never on the light ground. */
export function HalftoneField({
  className,
  opacity = 0.05,
}: {
  className?: string;
  opacity?: number;
}) {
  const id = useId().replace(/:/g, "");
  const radii = [1.8, 1.4, 1.05, 0.72, 0.45];

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-paper",
        className,
      )}
      style={{ opacity }}
    >
      <defs>
        {radii.map((r, i) => (
          <pattern
            key={i}
            id={`${id}-${i}`}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r={r} fill="currentColor" />
          </pattern>
        ))}
      </defs>
      {radii.map((_, i) => (
        <rect
          key={i}
          x="0"
          y={`${(i * 100) / radii.length}%`}
          width="100%"
          height={`${100 / radii.length + 0.5}%`}
          fill={`url(#${id}-${i})`}
        />
      ))}
    </svg>
  );
}
