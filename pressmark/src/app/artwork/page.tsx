import type { Metadata } from "next";
import { Section } from "@/components/system/section";
import { UtilityLabel } from "@/components/system/utility-label";
import { Button } from "@/components/ui/button";
import { SiteNav, SiteFooter } from "@/components/site/site-nav";
import { ArtworkCheck } from "@/components/site/artwork-check";
import { LowRes } from "@/components/site/artwork-lowres";
import {
  CREST,
  CREST_BOXED,
  EDGE,
  GAMUT_CMYK,
  GAMUT_RGB,
} from "@/lib/artwork-marks";

export const metadata: Metadata = {
  title: "Artwork help — how to send us a file that prints properly | PRESSMARK",
  description:
    "What 300 DPI, CMYK, vector and transparency actually mean for a print, shown side by side. Which file formats we take, and a check you can run on your own file before you order.",
};

/* Plate grounds. ASH is a real garment value from the catalogue — the one
 * value where a dark crest still reads and a white box is still obvious. */
const PAPER = "#F7F9F7";
const ASH = "#B9BDBA";

/* ─── Comparison band ─────────────────────────────────────────────────────── */

function Plate({
  tone,
  label,
  note,
  bg,
  children,
}: {
  tone: "good" | "warn";
  label: string;
  note?: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="m-0">
      <div className="border border-rule" style={{ background: bg }}>
        {children}
      </div>
      <figcaption className="mt-3 flex items-start gap-3 border-t border-rule pt-3">
        {/* Same status marker as the preflight panel — amber is attention. */}
        <span
          aria-hidden="true"
          className="mt-[5px] block size-2 shrink-0 rounded-full"
          style={{ background: tone === "good" ? "var(--press)" : "var(--amber)" }}
        />
        <span className="min-w-0 flex-1">
          <span
            className={`t-utility block leading-[1.6] ${tone === "warn" ? "text-amber" : ""}`}
          >
            {label}
          </span>
          {note && <span className="t-note mt-2 block opacity-65">{note}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

function Pair({
  n,
  label,
  spec,
  note,
  children,
}: {
  n: string;
  label: string;
  /** The right-hand mono note on the hairline — what the press needs. */
  spec: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-rule pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="t-utility opacity-55">
          {n} — {label}
        </span>
        <span className="t-utility opacity-55">{spec}</span>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-4">{children}</div>

      <p className="t-note mt-6 max-w-measure leading-[1.8] opacity-70">{note}</p>
    </div>
  );
}

/* ─── File formats ────────────────────────────────────────────────────────── */

/* `accept` splits deliberately: the drop widget below takes four formats, and
 * saying "yes" to all seven here would contradict the thing on the same page
 * that rejects them. */
const FORMATS: [string, string, string, string][] = [
  ["AI", "Vector logos, and anything with type in it", "Yes", "Yes — upload"],
  ["EPS", "Older vector logos, usually from a designer", "Yes", "Yes — by email"],
  [
    "PDF",
    "Almost anything, as long as it wasn't flattened on the way out",
    "Usually",
    "Yes — upload",
  ],
  ["SVG", "Flat vector marks, normally the web version of a logo", "Yes", "Yes — upload"],
  ["PNG", "Raster art that needs a transparent background", "No", "Yes — upload"],
  ["JPG", "Photographs. Genuinely nothing else", "No", "Yes — by email"],
  ["PSD", "Layered photo work and textures", "No", "Yes — by email"],
];

/* ─── Ink ─────────────────────────────────────────────────────────────────── */

/* Screen value, then what comes back off the press. Violet is in here because
 * it's the worst offender — orange barely moves, and a pair that looks
 * identical reads as a mistake rather than as a fact about orange. */
const INKS: [string, string, string][] = [
  ["Process magenta", "#FF1FA0", "#E6007E"],
  ["Electric blue", "#1E5BFF", "#2B4FA8"],
  ["Vivid green", "#00E87A", "#1E8F5A"],
  ["Electric violet", "#7B2BFF", "#52357F"],
];

const WHAT_WE_DO: [string, string][] = [
  [
    "WE MIX TO A REFERENCE",
    "You give us a Pantone number and we mix to it, rather than matching a screenshot by eye.",
  ],
  [
    "WE PROOF ON THE GARMENT",
    "The proof is printed on the same cotton in the same colour as your order, not on paper.",
  ],
  [
    "WE TELL YOU FIRST",
    "If a colour can't be reached in ink, you hear it before we print, with the nearest thing we can hit.",
  ],
];

export default function ArtworkPage() {
  return (
    <>
      <SiteNav />

      <main id="top">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <Section dark rule={false} className="py-16 md:py-24">
          <UtilityLabel className="block opacity-60">ARTWORK</UtilityLabel>

          {/* Longer than the hero line, so it steps down a size — same
              treatment the occasion pages use. */}
          <h1 className="t-display mt-6 max-w-[22ch] text-[clamp(2.5rem,5vw,4.5rem)]">
            How to send us a file that prints properly.
          </h1>

          <p className="t-sub mt-8 max-w-measure text-wash/80">
            Two minutes here saves a day at proof stage.
          </p>

          <div className="mt-16 border-t border-rule-dk pt-6">
            <span className="t-utility opacity-70">
              300 DPI AT PRINT SIZE · CMYK OR PANTONE · VECTOR WHERE YOU HAVE IT ·
              NO BACKGROUND
            </span>
          </div>
        </Section>

        {/* ── The four things ───────────────────────────────────────────────── */}
        <Section>
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <UtilityLabel className="block opacity-55">
                  SIDE BY SIDE
                </UtilityLabel>
                <h2 className="t-section mt-4">The four that come up.</h2>
                <p className="mt-6 text-small opacity-70">
                  Every pair below changes one thing and one thing only. The
                  left-hand plate is the file we usually get sent; the right-hand
                  one is the same artwork, fixed.
                </p>
                <p className="t-note mt-6 opacity-60">
                  BOTH PLATES ARE SHOWN AT THE SAME SIZE
                </p>
              </div>
            </div>

            <div className="col-span-12 space-y-16 lg:col-span-8 lg:col-start-5">
              {/* 01 — resolution */}
              <Pair
                n="01"
                label="RESOLUTION"
                spec="300 DPI AT FINAL SIZE"
                note="Resolution is only meaningful at the size it prints. A 300 DPI file scaled up to a back print is a 100 DPI file by the time it reaches the screen — so tell us how big it goes, not just what the file says."
              >
                <Plate
                  tone="warn"
                  bg={PAPER}
                  label="72 DPI — A SCREENSHOT, OR A LOGO PULLED OFF A WEBSITE"
                  note="Edges break up and the small line under the crest stops being readable."
                >
                  <LowRes
                    src={CREST}
                    sample={96}
                    bg={PAPER}
                    alt="The Bailey FC crest at 72 DPI: stepped edges and illegible small text."
                  />
                </Plate>
                <Plate
                  tone="good"
                  bg={PAPER}
                  label="300 DPI — THE SAME CREST, ENOUGH PIXELS TO PRINT"
                  note="Every stroke holds, including the 2px inner ring."
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CREST}
                    alt="The same crest at 300 DPI: clean edges and readable text."
                    className="block w-full"
                  />
                </Plate>
              </Pair>

              {/* 02 — colour mode */}
              <Pair
                n="02"
                label="COLOUR MODE"
                spec="CMYK, OR A PANTONE NUMBER"
                note="RGB describes light, CMYK describes ink, and the conversion has to happen somewhere. If you leave it to us we'll get as close as ink goes and show you on the proof — but you'll have more say if you do it before you send."
              >
                <Plate
                  tone="warn"
                  bg={PAPER}
                  label="RGB — SCREEN VALUES"
                  note="#1E5BFF and #00E87A have no ink equivalent. Something has to give."
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={GAMUT_RGB}
                    alt="A mark in bright RGB blue, magenta and green."
                    className="block w-full"
                  />
                </Plate>
                <Plate
                  tone="good"
                  bg={PAPER}
                  label="CMYK — WHERE THOSE VALUES LAND"
                  note="Duller on screen. This is the one that matches what arrives."
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={GAMUT_CMYK}
                    alt="The same mark in the printable CMYK equivalents of those colours."
                    className="block w-full"
                  />
                </Plate>
              </Pair>

              {/* 03 — edges */}
              <Pair
                n="03"
                label="EDGES"
                spec="VECTOR IF YOU HAVE IT"
                note="Vector is geometry, so it redraws itself at any size — a 40mm pocket print and a 2m banner come off the same file. Raster is a fixed grid, and enlarging it just makes the grid bigger."
              >
                <Plate
                  tone="warn"
                  bg={PAPER}
                  label="RASTER — SHOWN AT 8×"
                  note="Those steps are in the file. The screen reproduces them faithfully."
                >
                  <LowRes
                    src={EDGE}
                    sample={40}
                    bg={PAPER}
                    alt="A curve and a disc as raster pixels, showing hard stair-steps along every edge."
                  />
                </Plate>
                <Plate
                  tone="good"
                  bg={PAPER}
                  label="VECTOR — SHOWN AT 8×"
                  note="Still a curve at any magnification, because it's stored as one."
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={EDGE}
                    alt="The same curve and disc as vector geometry, with smooth edges."
                    className="block w-full"
                  />
                </Plate>
              </Pair>

              {/* 04 — background */}
              <Pair
                n="04"
                label="BACKGROUND"
                spec="TRANSPARENT — PNG, SVG, AI OR PDF"
                note="The press prints what's in the file, and a white background is white ink. On a white garment you'd never know; on anything else it's a rectangle. We can cut one off for you, but it costs a proof round — so it's worth checking before you send."
              >
                <Plate
                  tone="warn"
                  bg={ASH}
                  label="WHITE BOX — PRINTS AS A WHITE BOX"
                  note="Nothing wrong with the crest. The problem is the white rectangle sitting behind it."
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CREST_BOXED}
                    alt="The crest on a grey garment with a visible white rectangle printed behind it."
                    className="block w-full"
                  />
                </Plate>
                <Plate
                  tone="good"
                  bg={ASH}
                  label="TRANSPARENT — INK ONLY WHERE THE ARTWORK IS"
                  note="Same file, background deleted. The garment shows through."
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CREST}
                    alt="The same crest on the same garment with a transparent background."
                    className="block w-full"
                  />
                </Plate>
              </Pair>

              <p className="t-utility border-t border-rule pt-6 opacity-55">
                PAIR 04 IS SHOWN ON HEATHER ASH · PAIRS 01—03 ON WHITE
              </p>
            </div>
          </div>
        </Section>

        {/* ── Formats ───────────────────────────────────────────────────────── */}
        <Section dark>
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-3">
              <UtilityLabel className="block opacity-55">FILE FORMATS</UtilityLabel>
              <h2 className="t-section mt-4">What to save it as.</h2>
              <p className="mt-6 text-small opacity-70">
                If you have a choice, send the one furthest up this list. If you
                only have one file, send that — we&apos;ll tell you if it
                won&apos;t hold.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-rule-dk">
                      <th className="t-utility py-3 pr-6 font-normal opacity-55">
                        Format
                      </th>
                      <th className="t-utility py-3 pr-6 font-normal opacity-55">
                        Best for
                      </th>
                      <th className="t-utility py-3 pr-6 font-normal opacity-55">
                        Scalable
                      </th>
                      <th className="t-utility py-3 font-normal opacity-55">
                        We accept
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMATS.map(([format, best, scalable, accept]) => (
                      <tr
                        key={format}
                        className="border-b border-rule-dk align-top"
                      >
                        <td className="t-utility py-4 pr-6 whitespace-nowrap">
                          {format}
                        </td>
                        <td className="py-4 pr-6 text-small opacity-75">{best}</td>
                        <td className="t-utility py-4 pr-6 whitespace-nowrap opacity-55">
                          {scalable.toUpperCase()}
                        </td>
                        <td className="t-utility py-4 whitespace-nowrap">
                          {accept.toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 max-w-measure text-small opacity-70">
                The check below takes AI, PDF, SVG and PNG, up to 20MB. EPS, JPG
                and PSD we handle by hand — send those to{" "}
                <a href="mailto:press@pressmark.co.uk" className="link">
                  press@pressmark.co.uk
                </a>{" "}
                and we&apos;ll convert them and come back to you.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Check your own file ───────────────────────────────────────────── */}
        <Section>
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-4">
              <UtilityLabel className="block opacity-55">
                CHECK YOUR OWN FILE
              </UtilityLabel>
              <h2 className="t-section mt-4 max-w-[18ch]">
                Run it through now, not at proof stage.
              </h2>
              <p className="mt-6 max-w-measure text-body opacity-75">
                This is the same check that runs when you upload artwork to an
                order — resolution, colour mode, background. You get the results
                in plain English, and a fix for anything it flags.
              </p>
              <p className="t-note mt-6 max-w-measure leading-[1.8] opacity-65">
                Nothing is uploaded and nothing is saved. The file is read in your
                browser and forgotten when you leave the page.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <ArtworkCheck />
            </div>
          </div>
        </Section>

        {/* ── Colour ────────────────────────────────────────────────────────── */}
        <Section dark>
          <div className="grid-12 gap-y-16">
            <div className="col-span-12 lg:col-span-5">
              <UtilityLabel className="block opacity-55">COLOUR</UtilityLabel>
              <h2 className="t-section mt-4 max-w-[18ch]">
                Why the magenta on your screen isn&apos;t the magenta on cotton.
              </h2>
              <div className="mt-8 max-w-measure space-y-4 text-body opacity-75">
                <p>
                  Your screen makes magenta by emitting light. We make it by
                  putting a pigment on a surface and letting it absorb light
                  instead. Those are opposite processes, and the backlit one can
                  reach values that no mixed ink can — the very bright blues,
                  greens and violets especially.
                </p>
                <p>
                  Then the surface argues too. Cotton is dyed, absorbent and
                  woven, so ink sinks in and the weave breaks the colour up
                  slightly. The same ink reads warmer on natural than it does on
                  white, and a light ink on a dark garment sits on an underbase
                  that lifts it a shade.
                </p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
                {INKS.map(([name, screen, cotton]) => (
                  <li key={name}>
                    <span className="t-utility block leading-[1.6] opacity-70">
                      {name.toUpperCase()}
                    </span>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          // pointer-events-none: .ink-chip carries an amber
                          // hover ring for the colour picker. These are
                          // swatches, and shouldn't offer to be clicked.
                          className="ink-chip pointer-events-none shrink-0"
                          style={{ background: screen }}
                        />
                        <span className="t-note opacity-60">{screen}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          // pointer-events-none: .ink-chip carries an amber
                          // hover ring for the colour picker. These are
                          // swatches, and shouldn't offer to be clicked.
                          className="ink-chip pointer-events-none shrink-0"
                          style={{ background: cotton }}
                        />
                        <span className="t-note opacity-60">{cotton}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="t-utility mt-8 border-t border-rule-dk pt-6 opacity-55">
                TOP ROW — ON SCREEN · BOTTOM ROW — MIXED AND PRINTED
              </p>

              <dl className="mt-16 border-t border-rule-dk">
                {WHAT_WE_DO.map(([k, v]) => (
                  <div key={k} className="border-b border-rule-dk py-4">
                    <dt className="t-utility opacity-70">{k}</dt>
                    <dd className="mt-3 max-w-measure text-small opacity-75">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>

        {/* ── The human route ───────────────────────────────────────────────── */}
        <Section>
          <div className="grid-12 items-end gap-y-8">
            <div className="col-span-12 lg:col-span-7">
              <UtilityLabel className="block opacity-55">
                THE OTHER OPTION
              </UtilityLabel>
              <h2 className="t-section mt-4 max-w-[20ch]">
                Still not sure? Send it over and we&apos;ll look at it before you
                order.
              </h2>
              <p className="mt-6 max-w-measure text-body opacity-75">
                No obligation and no charge. Email the file with a note about how
                big it needs to print and what garment it&apos;s going on, and
                someone here will tell you straight whether it&apos;ll hold —
                and what to change if it won&apos;t.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <Button asChild size="lg">
                <a href="mailto:press@pressmark.co.uk?subject=Artwork%20check">
                  Email us your file
                </a>
              </Button>
              <p className="t-note mt-6 opacity-70">
                PRESS@PRESSMARK.CO.UK · 01634 000 000 · WEEKDAYS 8—5
              </p>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
