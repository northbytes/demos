import * as React from "react";

/* The garment, drawn rather than photographed — so a colour swap is a real
 * re-print rather than a tinted image, and the four views stay in register.
 * Shared by the hero ink desk and the product configurator. */

/* The stock colours live in the catalogue — same list the listing page filters
 * on, so a colour can't exist on one page and not the other. */
import { GARMENTS } from "@/lib/catalog";

export { GARMENTS };
export type Garment = (typeof GARMENTS)[number];

export const TEE_FRONT =
  "M160 44 L120 54 L48 122 L74 184 L116 162 L110 428 Q200 444 290 428 L284 162 L326 184 L352 122 L280 54 L240 44 C224 70 176 70 160 44 Z";

const TEE_BACK =
  "M160 44 L120 54 L48 122 L74 184 L116 162 L110 428 Q200 444 290 428 L284 162 L326 184 L352 122 L280 54 L240 44 C226 60 174 60 160 44 Z";

/* The sleeve view is the front tee cropped to the left shoulder, not a made-up
 * shape — the seams line up with the other views because they are the same
 * seams. Deliberately a loose crop: zoom in far enough to fill the frame with
 * garment and the silhouette disappears, leaving unreadable flat panels. */
const SLEEVE_ZOOM = "translate(-10 -3) scale(1.4)";

export type View = "front" | "back" | "sleeve" | "folded";

export const VIEWS: { id: View; label: string }[] = [
  { id: "front", label: "FRONT" },
  { id: "back", label: "BACK" },
  { id: "sleeve", label: "LEFT SLEEVE" },
  { id: "folded", label: "FOLDED" },
];

/* Boxes are percentages of the plate, so they hold at any size. */
type Box = { left: string; top: string; width: string; height: string };

const box = (l: number, t: number, w: number, h: number): Box => ({
  left: `${l}%`,
  top: `${t}%`,
  width: `${w}%`,
  height: `${h}%`,
});

/** Where a customer's artwork lands on each view. */
export const ART_BOX: Record<View, Box> = {
  front: box(36, 32, 28, 24),
  back: box(31, 30, 38, 30),
  sleeve: box(20, 32, 13, 11),
  folded: box(40, 42, 20, 16),
};

/** The maximum printable rectangle, and what it measures. */
export const PRINT_AREA: Record<View, { box: Box; label: string }> = {
  front: { box: box(33, 30, 34, 41), label: "MAX PRINT AREA — 297 × 420 MM (A3)" },
  back: { box: box(33, 28, 34, 41), label: "MAX PRINT AREA — 297 × 420 MM (A3)" },
  sleeve: { box: box(18, 28, 17, 19), label: "MAX PRINT AREA — 90 × 250 MM" },
  folded: { box: box(36, 36, 28, 34), label: "MAX PRINT AREA — 297 × 420 MM (A3)" },
};

function Shape({ view, hex, ink }: { view: View; hex: string; ink: string }) {
  // The outline has to hold on both grounds — a white tee on --paper and a
  // black one on --press. Deriving it from the print ink does both: it's dark
  // on pale garments and pale on dark ones.
  const shell = {
    fill: hex,
    stroke: `color-mix(in srgb, ${ink} 30%, transparent)`,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
  };

  if (view === "folded") {
    return (
      <>
        <rect x="74" y="132" width="252" height="254" {...shell} />
        <g fill={ink}>
          {/* Sleeves folded behind, and the waist fold. */}
          <path d="M74 132 L128 132 L128 386 L74 386 Z" opacity="0.05" />
          <path d="M272 132 L326 132 L326 386 L272 386 Z" opacity="0.05" />
          <path d="M74 268 L326 268 L326 282 L74 282 Z" opacity="0.06" />
        </g>
        <g fill="none" stroke={ink} opacity="0.16" strokeWidth="1.5">
          <path d="M128 132 V386 M272 132 V386 M74 268 H326" />
        </g>
        {/* Collar sitting proud of the fold. */}
        <path d="M156 108 L244 108 L244 132 L156 132 Z" {...shell} />
        <path
          d="M156 108 L244 108 L244 116 L156 116 Z"
          fill={ink}
          opacity="0.1"
        />
      </>
    );
  }

  return (
    <>
      <g transform={view === "sleeve" ? SLEEVE_ZOOM : undefined}>
        <path d={view === "back" ? TEE_BACK : TEE_FRONT} {...shell} />
        <g fill={ink}>
        <path d="M116 162 L152 172 L146 430 L110 428 Z" opacity="0.05" />
        <path d="M284 162 L248 172 L254 430 L290 428 Z" opacity="0.05" />
        <path d="M48 122 L74 184 L88 178 L64 116 Z" opacity="0.07" />
        <path d="M352 122 L326 184 L312 178 L336 116 Z" opacity="0.07" />
        <path
          d="M110 428 Q200 444 290 428 L289 414 Q200 430 111 414 Z"
          opacity="0.07"
        />
        {view === "back" ? (
          // Back neck tape — how you tell the two views apart at a glance.
          <path
            d="M160 44 C174 60 226 60 240 44 L243 52 C226 70 174 70 157 52 Z"
            opacity="0.14"
          />
        ) : (
          <path
            d="M160 44 C176 70 224 70 240 44 L247 51 C228 82 172 82 153 51 Z"
            opacity="0.12"
          />
        )}
        </g>
      </g>
    </>
  );
}

/** One garment view with the customer's artwork placed on it. */
export function GarmentPlate({
  view,
  hex,
  ink,
  artUrl,
}: {
  view: View;
  hex: string;
  ink: string;
  artUrl?: string | null;
}) {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 400 470" className="block h-full w-full" aria-hidden="true">
        <Shape view={view} hex={hex} ink={ink} />
      </svg>

      {artUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artUrl}
          alt=""
          className="absolute object-contain"
          style={ART_BOX[view]}
        />
      )}
    </div>
  );
}
