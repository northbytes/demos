import { svg } from "./sample-art";

/* The demonstration figures for the artwork help page. Deliberately the same
 * Bailey FC crest the configurator loads as its sample file, so anyone who has
 * already been through the basket recognises what they're looking at.
 *
 * Every pair on that page changes exactly one variable. That's the whole point
 * of the band — two plates that differ in one respect can be read without a
 * caption, and a caption is what we're trying not to need. */

/* The box is inset to the artwork's bounding box rather than filling the
 * artboard — that's what an exported file actually carries, and a plate flooded
 * edge to edge in white just reads as a white plate instead of as a rectangle
 * sitting on a garment. */
const crest = (ink: string, box = false) =>
  svg(
    `${box ? '<rect x="138" y="66" width="324" height="294" fill="#FFFFFF"/>' : ""}
     <circle cx="300" cy="170" r="86" fill="none" stroke="${ink}" stroke-width="9"/>
     <circle cx="300" cy="170" r="66" fill="none" stroke="${ink}" stroke-width="2"/>
     <rect x="152" y="150" width="296" height="40" fill="#E6007E"/>
     <text x="300" y="179" text-anchor="middle" font-family="monospace" font-size="27" letter-spacing="5" fill="#FFFFFF">BAILEY FC</text>
     <text x="300" y="330" text-anchor="middle" font-family="monospace" font-size="21" letter-spacing="9" fill="${ink}">EST. 1974</text>`,
  );

/* Resolution pair — one variable: how many pixels the file has.
 * Transparent ground, so the plate colour shows through. */
export const CREST = crest("#14181B");

/* Background pair — one variable: whether the file carries a white rectangle.
 * Both plates sit on Heather ash (#B9BDBA from the garment list), because it's
 * the one value where a dark crest still reads AND a white box is obvious.
 * On white the box is invisible; on teal the crest is. */
export const CREST_BOXED = crest("#14181B", true);

/* Colour pair — one variable: whether the values are reachable in ink.
 * Same three hues, screen-bright then mixed. */
const gamut = (blue: string, magenta: string, green: string) =>
  svg(
    `<circle cx="300" cy="132" r="74" fill="none" stroke="${blue}" stroke-width="17"/>
     <text x="300" y="145" text-anchor="middle" font-family="monospace" font-size="36" font-weight="bold" letter-spacing="1" fill="${blue}">10K</text>
     <rect x="150" y="252" width="300" height="40" fill="${magenta}"/>
     <rect x="150" y="308" width="300" height="40" fill="${green}"/>`,
  );

export const GAMUT_RGB = gamut("#1E5BFF", "#FF1FA0", "#00E87A");
export const GAMUT_CMYK = gamut("#2B4FA8", "#E6007E", "#1E8F5A");

/* Edge pair — one variable: geometry or a grid of pixels.
 * A hard arc and a disc: nothing shows stair-stepping like a curve does. */
export const EDGE = svg(
  `<path d="M60 366 Q300 18 540 366" fill="none" stroke="#14181B" stroke-width="28"/>
   <circle cx="300" cy="252" r="56" fill="#E6007E"/>`,
);
