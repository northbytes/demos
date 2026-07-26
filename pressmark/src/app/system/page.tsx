"use client";

import * as React from "react";
import { Section } from "@/components/system/section";
import { UtilityLabel } from "@/components/system/utility-label";
import { HalftoneField } from "@/components/system/halftone-field";
import { SqueegeeReveal } from "@/components/system/squeegee-reveal";
import { Button } from "@/components/ui/button";
import { Input, FieldError, FieldHint } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const PALETTE = [
  { token: "--press", hex: "#0F2E38", name: "Emulsion teal", use: "Dark ground, hero, footer, banded sections" },
  { token: "--press-2", hex: "#16414E", name: "Lifted teal", use: "Cards and inset panels on dark ground" },
  { token: "--wash", hex: "#E4E8E5", name: "Wash", use: "The light ground. Default for most of the site" },
  { token: "--paper", hex: "#F7F9F7", name: "Paper", use: "Cards and input surfaces on the light ground" },
  { token: "--ink", hex: "#14181B", name: "Ink", use: "Body text on light ground" },
  { token: "--magenta", hex: "#E6007E", name: "Process magenta", use: "Rationed. Primary buttons, active ink chip, price figures" },
  { token: "--amber", hex: "#F2A900", name: "Safelight amber", use: "Hover and attention only. Never a fill" },
  { token: "--cyan", hex: "#00A3D9", name: "Process cyan", use: "The hero registration signature. Nowhere else" },
];

const TYPE_SCALE = [
  { role: "Hero display", cls: "t-display", size: "clamp(3.5rem, 9vw, 8.5rem)", weight: "800", lh: "0.88", track: "-0.03em", face: "Bricolage Grotesque", sample: "Press ready" },
  { role: "Section heading", cls: "t-section", size: "clamp(2rem, 4vw, 3.5rem)", weight: "700", lh: "0.95", track: "-0.03em", face: "Bricolage Grotesque", sample: "Screen, DTG or embroidery" },
  { role: "Sub-heading", cls: "t-sub", size: "1.375rem", weight: "600", lh: "1.3", track: "-0.01em", face: "Bricolage Grotesque", sample: "Upload artwork, approve the proof" },
  { role: "Body", cls: "t-body max-w-measure", size: "1rem", weight: "400", lh: "1.6", track: "normal", face: "Inter Tight", sample: "We print in Sheffield. Screen printing from 25 pieces, DTG from one, embroidery from 10. Artwork goes on press once you have signed the proof." },
  { role: "Small", cls: "t-small max-w-measure", size: "0.875rem", weight: "400", lh: "1.5", track: "normal", face: "Inter Tight", sample: "Delivery is next working day on stocked lines ordered before 11am." },
  { role: "Utility label", cls: "t-utility", size: "0.75rem", weight: "500", lh: "1", track: "0.12em", face: "Martian Mono", sample: "SIZE RUN · 180 GSM · 300 DPI" },
];

const GARMENTS = [
  { name: "White", hex: "#F2F2EF", ink: "#14181B" },
  { name: "Heather grey", hex: "#B9BDBA", ink: "#14181B" },
  { name: "Bottle green", hex: "#14503C", ink: "#F7F9F7" },
  { name: "Navy", hex: "#1B2A41", ink: "#F7F9F7" },
  { name: "Burgundy", hex: "#5B1A28", ink: "#F7F9F7" },
  { name: "Black", hex: "#17181A", ink: "#F7F9F7" },
];

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

const MOTION = [
  { name: "Squeegee wipe", spec: "18deg mask, left to right", dur: "420ms", fires: "Garment colour change · full-bleed bands entering view" },
  { name: "Halftone dissolve", spec: "Coarse dot field to full resolution", dur: "600ms", fires: "Images, first paint" },
  { name: "Button wipe", spec: "Fill sweeps in from the left", dur: "180ms", fires: "Button hover. No scale, no lift" },
  { name: "Label type-in", spec: "Character by character", dur: "300ms", fires: "Utility labels, on section entry, once" },
];

/* ─── Small building blocks used only by this spec sheet ─────────────────── */

function Spec({ children }: { children: React.ReactNode }) {
  return (
    <dl className="divide-y divide-rule border-y border-rule [.on-dark_&]:divide-rule-dk [.on-dark_&]:border-rule-dk">
      {children}
    </dl>
  );
}

function SpecRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="t-utility opacity-55">{k}</dt>
      <dd className="text-right text-small">{v}</dd>
    </div>
  );
}

function StateLabel({ children }: { children: string }) {
  return <span className="t-utility block opacity-45">{children}</span>;
}

function Panel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="cut-marks border border-rule bg-paper p-6 [.on-dark_&]:border-rule-dk [.on-dark_&]:bg-press-2">
      <UtilityLabel className="mb-6 block opacity-55">{label}</UtilityLabel>
      {children}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function SystemPage() {
  const [garment, setGarment] = React.useState(GARMENTS[0]);
  const [dissolveKey, setDissolveKey] = React.useState(0);

  return (
    <main id="top">
      {/* ── Masthead ──────────────────────────────────────────────────────── */}
      <Section dark rule={false}>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-7">
            <UtilityLabel className="mb-8 block text-cyan">
              DESIGN SYSTEM · REV 01 · SHEFFIELD
            </UtilityLabel>
            <h1 className="t-display">
              PRESS
              <br />
              MARK
            </h1>
            <p className="mt-8 max-w-measure text-body opacity-80">
              Tokens, type and components for the print shop. Every value here is
              fixed. If a page needs something this sheet does not carry, the sheet
              gets amended first.
            </p>
            <div className="mt-12 flex flex-wrap gap-3">
              <Button>Get a price</Button>
              <Button variant="secondary">See the components</Button>
            </div>
          </div>

          {/* Registration signature — the only place cyan appears. */}
          <div className="col-span-12 mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <RegistrationSignature />
            <Spec>
              <SpecRow k="Ground" v="Wash #E4E8E5" />
              <SpecRow k="Accent" v="Process magenta" />
              <SpecRow k="Radius" v="2px" />
              <SpecRow k="Grid" v="12 col · 1440 max" />
              <SpecRow k="Shadows" v="None" />
            </Spec>
          </div>
        </div>
      </Section>

      {/* ── Type scale ────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <UtilityLabel className="mb-4 block opacity-55">TYPE</UtilityLabel>
              <h2 className="t-section">Three faces, big jumps</h2>
              <p className="mt-6 text-small opacity-70">
                Nothing sits in the middle of the scale. Headlines are set tight and
                left-aligned.
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="divide-y divide-rule border-y border-rule">
              {TYPE_SCALE.map((t) => (
                <div
                  key={t.role}
                  className="grid gap-6 py-8 md:grid-cols-[minmax(0,1fr)_180px]"
                >
                  <div className="min-w-0">
                    <p className={t.cls}>{t.sample}</p>
                  </div>
                  <dl className="t-utility space-y-2 opacity-55">
                    <div>{t.role}</div>
                    <div>{t.face}</div>
                    <div>{t.size}</div>
                    <div>
                      W{t.weight} · LH {t.lh}
                    </div>
                    <div>TR {t.track}</div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Palette ───────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-3">
            <UtilityLabel className="mb-4 block opacity-55">COLOUR</UtilityLabel>
            <h2 className="t-section">Eight values, no others</h2>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-rule">
                    <th className="t-utility w-px py-3 pr-6 font-normal opacity-55">Swatch</th>
                    <th className="t-utility py-3 pr-6 font-normal opacity-55">Token</th>
                    <th className="t-utility py-3 pr-6 font-normal opacity-55">Hex</th>
                    <th className="t-utility py-3 font-normal opacity-55">Where it goes</th>
                  </tr>
                </thead>
                <tbody>
                  {PALETTE.map((c) => (
                    <tr key={c.token} className="border-b border-rule align-top">
                      <td className="py-4 pr-6">
                        <span
                          className="block size-8 border border-rule"
                          style={{ background: c.hex }}
                          aria-hidden="true"
                        />
                      </td>
                      <td className="t-utility py-4 pr-6 whitespace-nowrap">{c.token}</td>
                      <td className="t-utility py-4 pr-6 whitespace-nowrap opacity-55">{c.hex}</td>
                      <td className="py-4 text-small">
                        <span className="block font-medium">{c.name}</span>
                        <span className="opacity-65">{c.use}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-small opacity-65">
              Hairlines: <span className="t-utility">--rule</span> on light,{" "}
              <span className="t-utility">--rule-dk</span> on dark. Depth comes from
              those, not from shadows.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Components, light ground ──────────────────────────────────────── */}
      <Section>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <UtilityLabel className="mb-4 block opacity-55">COMPONENTS</UtilityLabel>
              <h2 className="t-section">Every state, on the wash</h2>
              <p className="mt-6 text-small opacity-70">
                Flat, 2px radius, hairline borders. Hover fills wipe in from the left.
              </p>
            </div>
          </div>

          <div className="col-span-12 space-y-8 lg:col-span-9">
            <ButtonMatrix />
            <FieldMatrix />
            <div className="grid gap-8 md:grid-cols-2">
              <ChoiceMatrix />
              <BadgeMatrix />
            </div>
            <TabsDemo />
          </div>
        </div>
      </Section>

      {/* ── Components, dark band ─────────────────────────────────────────── */}
      <Section dark>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <UtilityLabel className="mb-4 block opacity-60">
                ON THE DARK GROUND
              </UtilityLabel>
              <h2 className="t-section">Same kit, dark ground</h2>
              <p className="mt-6 text-small opacity-75">
                Dark teal bands break the page up. Three or four per page, full-bleed.
              </p>
            </div>
          </div>

          <div className="col-span-12 space-y-8 lg:col-span-9">
            <ButtonMatrix />
            <FieldMatrix />
            <div className="grid gap-8 md:grid-cols-2">
              <ChoiceMatrix />
              <BadgeMatrix />
            </div>
            <TabsDemo />
          </div>
        </div>
      </Section>

      {/* ── Ink chips + squeegee ──────────────────────────────────────────── */}
      <Section>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-3">
            <UtilityLabel className="mb-4 block opacity-55">MOTION</UtilityLabel>
            <h2 className="t-section">The squeegee wipe</h2>
            <p className="mt-6 max-w-measure text-small opacity-70">
              Pick a garment colour. The panel re-prints with an 18deg diagonal wipe
              over 420ms. It is the only reveal on the site.
            </p>

            <div
              className="mt-8 flex flex-wrap gap-3"
              role="group"
              aria-label="Garment colour"
            >
              {GARMENTS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  className="ink-chip"
                  style={{ background: g.hex }}
                  aria-label={g.name}
                  aria-pressed={garment.name === g.name}
                  onClick={() => setGarment(g)}
                />
              ))}
            </div>
            <p className="t-utility mt-4 opacity-55">
              SELECTED · {garment.name.toUpperCase()}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <SqueegeeReveal replayKey={garment.name}>
              <figure
                className="grain flex min-h-[320px] flex-col justify-between border border-rule p-8"
                style={{ background: garment.hex, color: garment.ink }}
              >
                <span className="t-utility">PRESSMARK · HEAVYWEIGHT TEE · 210 GSM</span>
                <figcaption className="mt-16">
                  <span className="t-sub block">{garment.name}</span>
                  <span className="mt-2 block text-small opacity-70">
                    Ringspun cotton. Sizes XS–4XL. Screen printed, up to six colours.
                  </span>
                </figcaption>
              </figure>
            </SqueegeeReveal>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <figure>
                <div
                  key={dissolveKey}
                  className="halftone-dissolve grain h-[180px] border border-rule bg-press-2"
                />
                <figcaption className="mt-3 flex items-center justify-between gap-4">
                  <span className="t-utility opacity-55">HALFTONE DISSOLVE · 600MS</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDissolveKey((k) => k + 1)}
                  >
                    Replay
                  </Button>
                </figcaption>
              </figure>

              <figure>
                <div className="grain h-[180px] border border-rule bg-press-2" />
                <figcaption className="t-utility mt-3 opacity-55">
                  GRAIN OVERLAY · 2.5% · PHOTOGRAPHY ONLY
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Structural devices ────────────────────────────────────────────── */}
      <Section dark>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-3">
            <UtilityLabel className="mb-4 block opacity-60">DEVICES</UtilityLabel>
            <h2 className="t-section">Structure, not decoration</h2>
            <p className="mt-6 text-small opacity-75">
              If you notice them as ornament, they are too strong. The crosshairs at
              the corners of this section are the reference.
            </p>
          </div>

          <div className="col-span-12 grid gap-6 md:grid-cols-3 lg:col-span-8 lg:col-start-5">
            <figure>
              <div className="relative h-[160px] overflow-hidden border border-rule-dk bg-press">
                <HalftoneField opacity={0.14} />
              </div>
              <figcaption className="t-utility mt-3 opacity-60">
                HALFTONE FIELD · SHOWN AT 14% · SHIPS AT 5%
              </figcaption>
            </figure>

            <figure>
              <div className="flex h-[160px] items-center justify-center border border-rule-dk bg-press">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  className="opacity-60"
                >
                  <circle cx="6" cy="6" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M6 0.5v11M0.5 6h11" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
              <figcaption className="t-utility mt-3 opacity-60">
                REGISTRATION MARK · 12PX · HAIRLINE
              </figcaption>
            </figure>

            <figure>
              <div className="cut-marks flex h-[160px] items-center justify-center border border-rule-dk bg-press-2 text-center">
                <span className="t-utility px-4 opacity-60">HOVER FOR CUT MARKS</span>
              </div>
              <figcaption className="t-utility mt-3 opacity-60">
                CUT MARKS · 16PX · ON HOVER
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      {/* ── Spacing + motion reference ────────────────────────────────────── */}
      <Section>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-3">
            <UtilityLabel className="mb-4 block opacity-55">REFERENCE</UtilityLabel>
            <h2 className="t-section">Spacing and motion</h2>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <p className="t-utility mb-4 opacity-55">SPACING SCALE</p>
            <dl className="divide-y divide-rule border-y border-rule">
              {SPACING.map((s) => (
                <div key={s} className="flex items-center gap-6 py-2">
                  <dt className="t-utility w-12 shrink-0 opacity-55">{s}px</dt>
                  <dd className="min-w-0 flex-1">
                    <span
                      className="block h-2 bg-ink/15"
                      style={{ width: s }}
                      aria-hidden="true"
                    />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-small opacity-65">
              Sections run 128px on desktop, 72px on mobile.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <p className="t-utility mb-4 opacity-55">MOTION</p>
            <dl className="divide-y divide-rule border-y border-rule">
              {MOTION.map((m) => (
                <div key={m.name} className="py-4">
                  <dt className="flex items-baseline justify-between gap-4">
                    <span className="text-small font-medium">{m.name}</span>
                    <span className="t-utility opacity-55">{m.dur}</span>
                  </dt>
                  <dd className="mt-1 text-small opacity-65">
                    {m.spec}. {m.fires}.
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-small opacity-65">
              Under <span className="t-utility">prefers-reduced-motion</span> every
              transition becomes a 120ms opacity fade and the type-in is skipped.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <Section dark crosshairs={false} className="py-16 md:py-24">
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-12 md:col-span-6">
            <p className="t-sub">PRESSMARK</p>
            <p className="mt-2 text-small opacity-70">
              Screen printing, DTG and embroidery. Large format on the same site.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 md:text-right">
            <p className="t-utility opacity-60">
              SYSTEM REV 01 ·{" "}
              <a className="link" href="#top">
                TOP OF SHEET
              </a>
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}

/* ─── Hero registration signature — the only cyan on the site ────────────── */

function RegistrationSignature() {
  return (
    <div className="relative mb-8 aspect-[4/3] border border-rule-dk">
      <HalftoneField opacity={0.12} />
      <svg viewBox="0 0 120 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g stroke="var(--cyan)" strokeWidth="0.4" fill="none">
          <circle cx="60" cy="45" r="18" />
          <circle cx="60" cy="45" r="26" />
          <path d="M60 12v66M27 45h66" />
        </g>
        <g stroke="var(--magenta)" strokeWidth="0.4" fill="none">
          <circle cx="64" cy="47" r="18" />
        </g>
      </svg>
      <span className="t-utility absolute bottom-3 left-3 text-cyan">
        REGISTRATION · CMY
      </span>
    </div>
  );
}

/* ─── Component matrices ─────────────────────────────────────────────────── */

const VARIANTS = ["primary", "secondary", "ghost"] as const;

function ButtonMatrix() {
  const states = [
    { label: "DEFAULT", props: {} },
    { label: "HOVER", props: { className: "is-hover" } },
    { label: "DISABLED", props: { disabled: true } },
    { label: "LOADING", props: { loading: true } },
  ];

  return (
    <Panel label="BUTTON">
      <div className="space-y-8">
        {VARIANTS.map((v) => (
          <div key={v} className="space-y-3">
            <StateLabel>{v.toUpperCase()}</StateLabel>
            <div className="flex flex-wrap items-end gap-4">
              {states.map((s) => (
                <div key={s.label} className="space-y-2">
                  <Button variant={v} {...s.props}>
                    {s.label === "LOADING" ? "On press" : "Get a price"}
                  </Button>
                  <StateLabel>{s.label}</StateLabel>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-3">
          <StateLabel>SIZES</StateLabel>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function FieldMatrix() {
  return (
    <Panel label="INPUT · SELECT">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="t-utility block opacity-55" htmlFor="qty">
              QTY
            </label>
            <Input id="qty" placeholder="50" />
            <FieldHint>Screen printing starts at 25 pieces.</FieldHint>
          </div>

          <div className="space-y-2">
            <label className="t-utility block opacity-55" htmlFor="artwork">
              ARTWORK
            </label>
            <Input id="artwork" defaultValue="logo-72dpi.png" aria-invalid />
            <FieldError>
              That file is 72 DPI. Print needs 300 DPI at final size — send a vector
              file or a larger PNG.
            </FieldError>
          </div>

          <div className="space-y-2">
            <label className="t-utility block opacity-55" htmlFor="acct">
              ACCOUNT
            </label>
            <Input id="acct" defaultValue="Trade account pending" disabled />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <span className="t-utility block opacity-55">PRINT METHOD</span>
            <Select defaultValue="screen">
              <SelectTrigger aria-label="Print method">
                <SelectValue placeholder="Choose a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>GARMENTS</SelectLabel>
                  <SelectItem value="screen">Screen print</SelectItem>
                  <SelectItem value="dtg">DTG</SelectItem>
                  <SelectItem value="embroidery">Embroidery</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>LARGE FORMAT</SelectLabel>
                  <SelectItem value="poster">Poster</SelectItem>
                  <SelectItem value="banner">PVC banner</SelectItem>
                  <SelectItem value="hoarding" disabled>
                    Site hoarding — quote only
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="t-utility block opacity-55">DELIVERY</span>
            <Select disabled>
              <SelectTrigger aria-label="Delivery">
                <SelectValue placeholder="Set a quantity first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collect">Collect</SelectItem>
              </SelectContent>
            </Select>
            <FieldHint>Set a quantity and we will price the delivery.</FieldHint>
          </div>

          <div className="border-t border-rule pt-6 [.on-dark_&]:border-rule-dk">
            <p className="t-utility opacity-55">UNIT PRICE · 50 OFF</p>
            <p className="t-section mt-2 text-magenta">£6.40</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ChoiceMatrix() {
  const rows = [
    { id: "c1", label: "Front print", defaultChecked: true, disabled: false },
    { id: "c2", label: "Back print", defaultChecked: false, disabled: false },
    { id: "c3", label: "Sleeve print", defaultChecked: false, disabled: true },
  ];

  return (
    <Panel label="CHECKBOX">
      <div className="space-y-4">
        {rows.map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            <Checkbox
              id={c.id}
              defaultChecked={c.defaultChecked}
              disabled={c.disabled}
            />
            <label htmlFor={c.id} className="text-small">
              {c.label}
            </label>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Checkbox id="c4" aria-invalid />
          <label htmlFor="c4" className="text-small">
            Approve the proof
          </label>
        </div>
        <FieldError>Tick this to send the job to press.</FieldError>
      </div>
    </Panel>
  );
}

function BadgeMatrix() {
  return (
    <Panel label="BADGE">
      <div className="flex flex-wrap gap-3">
        <Badge>180 GSM</Badge>
        <Badge variant="solid">ORDER #4471</Badge>
        <Badge variant="accent">3 COLOUR</Badge>
        <Badge variant="status">IN PRODUCTION</Badge>
      </div>
      <p className="mt-6 text-small opacity-65">
        Badges are set in the utility face. The amber dot is the only status colour.
      </p>
    </Panel>
  );
}

function TabsDemo() {
  return (
    <Panel label="TABS">
      <Tabs defaultValue="screen">
        <TabsList>
          <TabsTrigger value="screen">SCREEN</TabsTrigger>
          <TabsTrigger value="dtg">DTG</TabsTrigger>
          <TabsTrigger value="embroidery">EMBROIDERY</TabsTrigger>
          <TabsTrigger value="format" disabled>
            LARGE FORMAT
          </TabsTrigger>
        </TabsList>
        <TabsContent value="screen">
          <Spec>
            <SpecRow k="Minimum" v="25 pieces" />
            <SpecRow k="Colours" v="Up to 6" />
            <SpecRow k="Lead time" v="5 working days" />
          </Spec>
        </TabsContent>
        <TabsContent value="dtg">
          <Spec>
            <SpecRow k="Minimum" v="1 piece" />
            <SpecRow k="Colours" v="Full colour" />
            <SpecRow k="Lead time" v="3 working days" />
          </Spec>
        </TabsContent>
        <TabsContent value="embroidery">
          <Spec>
            <SpecRow k="Minimum" v="10 pieces" />
            <SpecRow k="Stitch count" v="Up to 15,000" />
            <SpecRow k="Lead time" v="7 working days" />
          </Spec>
        </TabsContent>
      </Tabs>
    </Panel>
  );
}
