import { Section, RegistrationMark } from "@/components/system/section";
import { HalftoneField } from "@/components/system/halftone-field";
import { UtilityLabel } from "@/components/system/utility-label";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/site/photo";
import { SeasonTimeline } from "@/components/site/season-timeline";
import { SiteNav } from "@/components/site/site-nav";
import { BANDS, money } from "@/lib/pricing";
import { templateHref, type Occasion, type Template } from "@/lib/occasions";

/* The occasion landing template. Everything variable lives in the `Occasion`
 * object — nothing below reads a hard-coded occasion, garment or figure, so a
 * new occasion is a data entry and no layout work.
 * See src/lib/occasions.ts. */

/* Flat stand-in for a ready-made design: an optional image block, an optional
 * glyph, then type bars. Enough to tell the eight templates apart at a glance
 * without pretending to be artwork. */
function TemplatePlate({ art }: { art: Template["art"] }) {
  return (
    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 border border-rule bg-paper px-8">
      {art.block && (
        <div className="relative mb-2 aspect-[4/3] w-[64%] overflow-hidden bg-ink/10">
          <HalftoneField className="text-ink" opacity={0.42} />
        </div>
      )}
      {art.big && (
        <span
          className="font-display leading-none"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
          }}
        >
          {art.big}
        </span>
      )}
      {art.lines.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="block h-[7px] bg-ink"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export function OccasionLanding({ occasion: o }: { occasion: Occasion }) {
  return (
    <>
      <SiteNav />

      <main id="top">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="on-dark relative flex min-h-[74vh] items-center overflow-hidden bg-press py-24 text-wash">
          <Photo
            src={o.heroImg}
            label={o.heroPhoto}
            eager
            className="absolute inset-0"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-press/60" />
          <HalftoneField opacity={0.07} />

          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <RegistrationMark style={{ left: 12, top: 12 }} />
            <RegistrationMark style={{ right: 12, top: 12 }} />
            <RegistrationMark style={{ left: 12, bottom: 12 }} />
            <RegistrationMark style={{ right: 12, bottom: 12 }} />
          </div>

          <div className="shell relative">
            <div className="grid-12">
              <div className="col-span-12 lg:col-span-7">
                <UtilityLabel className="block opacity-70">{o.label}</UtilityLabel>

                {/* Display, stepped down: the token's 9vw is cut for a
                    full-shell masthead, not a 7-column well. */}
                <h1 className="t-display mt-8 text-[clamp(2.75rem,6vw,5.5rem)] text-paper">
                  {o.title}
                </h1>

                <p className="mt-8 max-w-[52ch] text-body text-wash/80">
                  {o.intro}
                </p>

                <div className="mt-12 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <a href={o.primary.href}>{o.primary.text}</a>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <a href={o.secondary.href} className="text-paper">
                      {o.secondary.text}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Fact strip ────────────────────────────────────────────────────── */}
        <section className="border-b border-rule bg-wash">
          <div className="shell">
            <ul className="rail flex h-[64px] items-center divide-x divide-rule overflow-x-auto">
              {o.facts.map((f) => (
                <li
                  key={f}
                  className="t-utility flex-1 px-6 whitespace-nowrap opacity-70 first:pl-0 last:pr-0"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Templates ─────────────────────────────────────────────────────── */}
        <Section id="templates" rule={false}>
          <UtilityLabel className="block opacity-60">
            {`${o.templates.length} READY-MADE LAYOUTS`}
          </UtilityLabel>
          <h2 className="t-section mt-4 max-w-[20ch]">
            Pick a template or bring your own.
          </h2>
          <p className="mt-6 max-w-measure text-body opacity-75">
            Each one opens in the design tool with the print method and positions
            already set. Change anything you like from there, or upload your own
            artwork and ignore all of this.
          </p>

          {/* Two up even on a phone — eight full-width tiles is a scroll, not a
              gallery. */}
          <div className="mt-24 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
            {o.templates.map((t) => (
              <a key={t.id} href={templateHref(t.id)} className="group block">
                <div className="cut-marks">
                  <TemplatePlate art={t.art} />
                </div>
                <h3 className="t-utility mt-4 transition-transform duration-squeegee ease-squeegee group-hover:translate-x-1">
                  {t.label}
                </h3>
                <p className="mt-3 text-small opacity-70">{t.note}</p>
              </a>
            ))}
          </div>
        </Section>

        {/* ── Ordering calendar ─────────────────────────────────────────────── */}
        <Section dark>
          <UtilityLabel className="block opacity-60">
            THE ORDERING CALENDAR
          </UtilityLabel>
          <h2 className="t-sub mt-6 max-w-[44ch] font-mono tracking-utility uppercase">
            {o.season.note}
          </h2>

          <div className="mt-24">
            <SeasonTimeline spans={o.season.spans} />
          </div>

          <p className="mt-16 max-w-measure text-body opacity-75">
            {o.season.line}
          </p>
        </Section>

        {/* ── What people usually order ─────────────────────────────────────── */}
        <Section>
          <UtilityLabel className="block opacity-60">
            WHAT PEOPLE USUALLY ORDER
          </UtilityLabel>
          <h2 className="t-section mt-4 max-w-[20ch]">
            The order we take most weeks.
          </h2>

          <div className="mt-24 grid border-t border-rule md:grid-cols-3">
            {o.usual.map((u) => (
              <div
                key={u.field}
                className="border-b border-rule py-12 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
              >
                <span className="t-utility block opacity-60">{u.field}</span>
                <p className="t-section mt-6 text-[clamp(1.75rem,2.6vw,2.5rem)]">
                  {u.value}
                </p>
                <p className="mt-6 text-small opacity-70">{u.note}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <Section>
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-3">
              <UtilityLabel className="block opacity-60">
                WHAT PEOPLE ASK
              </UtilityLabel>
              <h2 className="t-section mt-4">Before you order.</h2>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <div className="border-t border-rule">
                {/* Native disclosure — no JS, no library, correct semantics. */}
                {o.faqs.map((f) => (
                  <details key={f.q} className="group border-b border-rule">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                      <span className="t-sub">{f.q}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                        className="shrink-0"
                      >
                        <path d="M0 7h14" stroke="currentColor" strokeWidth="1.25" />
                        <path
                          d="M7 0v14"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          className="group-open:hidden"
                        />
                      </svg>
                    </summary>
                    <p className="max-w-measure pb-8 text-small opacity-80">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Closing band ──────────────────────────────────────────────────── */}
        <Section dark id="prices">
          <div className="grid-12 gap-y-16">
            <div className="col-span-12 lg:col-span-5">
              <UtilityLabel className="block opacity-60">
                {o.closing.label}
              </UtilityLabel>
              <h2 className="t-section mt-4">{o.closing.heading}</h2>
              <p className="mt-6 max-w-measure text-body opacity-75">
                {o.closing.copy}
              </p>
            </div>

            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <div className="grid grid-cols-2 border-t border-rule-dk md:grid-cols-5">
                {BANDS.map((b) => (
                  <div
                    key={b.label}
                    // Five bands over two columns leaves the last one alone on
                    // its row — its bottom rule would dangle at half width.
                    className="border-b border-rule-dk py-8 last:border-b-0 md:border-b-0 md:border-l md:pl-4 md:first:border-l-0 md:first:pl-0"
                  >
                    <span className="t-utility block opacity-60">{b.label}</span>
                    <p className="t-sub mt-3">{money(b.price)}</p>
                  </div>
                ))}
              </div>

              <p className="t-note mt-8 opacity-60">
                Per shirt, ex VAT, one-colour front print.
              </p>

              <Button asChild size="lg" className="mt-12">
                <a href={o.primary.href}>{o.closing.cta}</a>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <footer className="on-dark border-t border-rule-dk bg-press text-wash">
        <div className="shell flex h-[64px] items-center justify-between gap-6">
          <span className="t-utility opacity-60">© 2026 PRESSMARK</span>
          <span className="t-utility opacity-60">MADE IN KENT</span>
        </div>
      </footer>
    </>
  );
}
