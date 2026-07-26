import * as React from "react";
import { cn } from "@/lib/utils";
import { HalftoneField } from "./halftone-field";

/* Registration crosshair — structural, like a press sheet. 12px, hairline. */
export function RegistrationMark({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn("absolute opacity-40", className)}
      style={style}
    >
      <circle
        cx="6"
        cy="6"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M6 0.5v11M0.5 6h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const CORNERS: React.CSSProperties[] = [
  { left: "calc(var(--gutter) - 6px)", top: -6 },
  { right: "calc(var(--gutter) - 6px)", top: -6 },
  { left: "calc(var(--gutter) - 6px)", bottom: -6 },
  { right: "calc(var(--gutter) - 6px)", bottom: -6 },
];

export function Section({
  children,
  dark = false,
  bleed = false,
  crosshairs = true,
  rule = true,
  className,
  innerClassName,
  ...props
}: React.ComponentProps<"section"> & {
  /** Full-bleed dark teal band. Carries the halftone field. */
  dark?: boolean;
  /** Edge to edge — no container padding. Breaks the grid deliberately. */
  bleed?: boolean;
  crosshairs?: boolean;
  /** Hairline divider on the top edge. */
  rule?: boolean;
  innerClassName?: string;
}) {
  return (
    <section
      {...props}
      className={cn(
        "relative py-18 md:py-32",
        rule && "border-t border-solid",
        dark
          ? "on-dark bg-press text-wash border-rule-dk"
          : "bg-wash text-ink border-rule",
        className,
      )}
    >
      {dark && <HalftoneField />}

      {crosshairs && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="shell relative h-full">
            {CORNERS.map((style, i) => (
              <RegistrationMark key={i} style={style} />
            ))}
          </div>
        </div>
      )}

      <div className={cn(bleed ? "relative" : "shell relative", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
