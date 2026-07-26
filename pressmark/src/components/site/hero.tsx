"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { HalftoneField } from "@/components/system/halftone-field";
import { RegistrationMark } from "@/components/system/section";
import { SqueegeeReveal } from "@/components/system/squeegee-reveal";
import { UtilityLabel } from "@/components/system/utility-label";
import { GARMENTS, TEE_FRONT } from "@/components/site/garment";

/* One tee, straight on, with the house mark already on the chest — the hero
 * plate. The product page draws the same body from the same path. */
function Tee({ hex, ink }: { hex: string; ink: string }) {
  return (
    <svg
      viewBox="0 0 400 470"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <path
        d={TEE_FRONT}
        fill={hex}
        stroke="var(--rule-dk)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      {/* Folds and seams — the ink colour at low opacity works on any garment. */}
      <g fill={ink}>
        <path d="M116 162 L152 172 L146 430 L110 428 Z" opacity="0.05" />
        <path d="M284 162 L248 172 L254 430 L290 428 Z" opacity="0.05" />
        <path d="M48 122 L74 184 L88 178 L64 116 Z" opacity="0.07" />
        <path d="M352 122 L326 184 L312 178 L336 116 Z" opacity="0.07" />
        <path d="M110 428 Q200 444 290 428 L289 414 Q200 430 111 414 Z" opacity="0.07" />
        <path
          d="M160 44 C176 70 224 70 240 44 L247 51 C228 82 172 82 153 51 Z"
          opacity="0.12"
        />
      </g>

      {/* Chest artwork — printed, so it takes the ink colour. */}
      <g fill="none" stroke={ink} strokeWidth="2.5">
        <circle cx="200" cy="205" r="48" />
      </g>
      <g fill="none" stroke={ink} strokeWidth="1">
        <circle cx="200" cy="205" r="36" />
        <path d="M200 147v9M200 254v9M147 205h9M244 205h9" />
      </g>
      <rect x="152" y="196" width="96" height="18" fill={ink} />
      <text
        x="200"
        y="209.5"
        textAnchor="middle"
        fill={hex}
        fontFamily="var(--font-utility), monospace"
        fontSize="9"
        letterSpacing="1.4"
      >
        PRESSMARK
      </text>
      <text
        x="200"
        y="284"
        textAnchor="middle"
        fill={ink}
        opacity="0.75"
        fontFamily="var(--font-utility), monospace"
        fontSize="8"
        letterSpacing="1.6"
      >
        EST. MEDWAY · KENT
      </text>
    </svg>
  );
}

/* Three process plates, a hair out of register. The only cyan on the site. */
function OutOfRegister() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
      <g fill="none" strokeWidth="1">
        <g stroke="var(--cyan)">
          <circle cx="20" cy="21" r="8" />
          <path d="M20 10v22M9 21h22" />
        </g>
        <g stroke="var(--magenta)">
          <circle cx="24" cy="24" r="8" />
          <path d="M24 13v22M13 24h22" />
        </g>
        <g stroke="var(--amber)">
          <circle cx="22" cy="26" r="8" />
        </g>
      </g>
    </svg>
  );
}

export function Hero() {
  // Both colours move together: the outgoing one has to be on the base layer in
  // the same render that starts the sweep, or the wipe reveals nothing.
  const [{ previous, active }, setPair] = React.useState({
    previous: GARMENTS[0],
    active: GARMENTS[0],
  });

  function select(g: (typeof GARMENTS)[number]) {
    setPair((p) =>
      p.active.id === g.id ? p : { previous: p.active, active: g },
    );
  }

  return (
    <section
      id="top"
      className="on-dark relative flex min-h-[88vh] items-center overflow-hidden bg-press py-18 text-wash"
    >
      {/* Halftone across the lower third only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
      >
        <HalftoneField opacity={0.05} />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <RegistrationMark style={{ left: 12, top: 12 }} />
        <RegistrationMark style={{ right: 12, top: 12 }} />
        <RegistrationMark style={{ left: 12, bottom: 12 }} />
        <RegistrationMark style={{ right: 12, bottom: 12 }} />
      </div>

      <div className="shell relative">
        <div className="grid-12 items-center gap-y-16">
          {/* ── Left: the pitch ────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5">
            <UtilityLabel className="mb-8 block opacity-70">
              EST. MEDWAY, KENT · SCREEN · DTG · EMBROIDERY
            </UtilityLabel>

            {/* Display role, but the token's 9vw is cut for the masthead at full
                shell width — in a 5-column well it has to come down a step. */}
            <h1 className="t-display text-[clamp(3rem,5.6vw,5rem)] text-paper">
              Your artwork. Our press. Friday.
            </h1>

            <p className="mt-8 max-w-[44ch] text-body text-wash/80">
              Custom printed clothing and large-format print, made in Kent.
              Upload your design, choose your garment, and see the price before
              you commit to anything.
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              <Button size="lg">Get a price</Button>
              <Button variant="secondary" size="lg" className="text-paper">
                Order a sample pack
              </Button>
            </div>
          </div>

          {/* ── Right: the ink desk ────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="relative mx-auto max-w-[400px]">
              <span className="absolute top-0 right-0 z-10">
                <OutOfRegister />
              </span>

              <div className="relative aspect-[400/470]">
                {/* Outgoing colour sits underneath; the new one wipes over it. */}
                <div className="absolute inset-0">
                  <Tee hex={previous.hex} ink={previous.ink} />
                </div>
                <SqueegeeReveal
                  replayKey={active.id}
                  threshold={0}
                  className="absolute inset-0"
                >
                  <Tee hex={active.hex} ink={active.ink} />
                </SqueegeeReveal>
              </div>

              {/* Ink chips — 44px, 52px when selected. */}
              <div
                role="group"
                aria-label="Garment colour"
                className="rail mt-8 flex h-[56px] items-center gap-1 overflow-x-auto"
              >
                {GARMENTS.map((g) => {
                  const on = g.id === active.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      className="ink-chip shrink-0"
                      style={{
                        width: on ? 52 : 44,
                        height: on ? 52 : 44,
                        background: g.hex,
                      }}
                      aria-label={g.name}
                      aria-pressed={on}
                      onClick={() => select(g)}
                    />
                  );
                })}
              </div>

              <p className="t-utility mt-6 opacity-70" aria-live="polite">
                {active.name.toUpperCase()} · 100% RINGSPUN COTTON · 180 GSM ·
                S–5XL
              </p>
            </div>
          </div>
        </div>

        <p className="t-utility mt-16 text-right opacity-55 lg:absolute lg:right-0 lg:-bottom-8 lg:mt-0">
          COLOURWAYS IN STOCK — 31
        </p>
      </div>
    </section>
  );
}
