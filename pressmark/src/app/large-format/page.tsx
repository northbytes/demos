import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/system/section";
import { UtilityLabel } from "@/components/system/utility-label";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/site/photo";
import { SiteNav } from "@/components/site/site-nav";
import { SubstrateSwatch } from "@/components/site/substrate-swatch";
import { LF_PRODUCTS, SUBSTRATES } from "@/lib/large-format";

export const metadata: Metadata = {
  title: "Large format — posters, banners, boards and vinyl | PRESSMARK",
  description:
    "Posters, PVC banners, roller banners, site hoarding boards and vinyl stickers, printed up to 1600mm wide on UV-stable inks. Order online, or ask for a quote on the bespoke work.",
};

export default function LargeFormatPage() {
  return (
    <>
      <SiteNav />

      <main id="top">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <Section dark rule={false} className="py-16 md:py-24">
          <UtilityLabel className="block opacity-60">LARGE FORMAT</UtilityLabel>

          <h1 className="t-display mt-6">Print big.</h1>

          <p className="mt-8 max-w-measure text-body opacity-75">
            Off the wide roll and off the flatbed at Bailey Works. Posters for a
            shop window, banners for a scaffold, and hoarding that has to still be
            legible in February.
          </p>

          <div className="mt-16 border-t border-rule-dk pt-6">
            <span className="t-utility opacity-70">
              UP TO 1600MM WIDE · INDOOR AND OUTDOOR · UV STABLE INKS
            </span>
          </div>
        </Section>

        {/* ── The five ──────────────────────────────────────────────────────── */}
        {/* Full-bleed: the plate runs to the edge of the viewport, the copy keeps
            the gutter. `min-h` rather than a hard 420 so a 3-line description at
            768px pushes the block down instead of getting clipped. */}
        <section aria-label="What we print large format">
          {LF_PRODUCTS.map((p, i) => (
            <article
              key={p.id}
              className="grid border-t border-rule first:border-t-0 md:min-h-[420px] md:grid-cols-2"
            >
              <div
                className={`relative h-[260px] md:h-auto ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Photo
                  src={p.img}
                  label={p.photo}
                  i={i + 3}
                  className="absolute inset-0 border-0"
                />
              </div>

              <div className="flex items-center px-[var(--gutter)] py-12 md:px-12 md:py-10 lg:px-16">
                <div className="w-full max-w-[560px]">
                  <span className="t-utility block opacity-55">
                    {p.n} — {p.name.toUpperCase()}
                  </span>
                  <h2 className="t-sub mt-4">{p.name}</h2>
                  <p className="mt-3 max-w-measure text-small opacity-75">
                    {p.copy}
                  </p>

                  <dl className="mt-6 border-t border-rule">
                    {p.spec.map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-6 border-b border-rule py-2"
                      >
                        <dt className="t-utility opacity-60">{k}</dt>
                        <dd className="t-note text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8">
                    {p.cta === "order" ? (
                      <Button asChild size="md">
                        <a href="#">Configure and order</a>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="secondary" size="md">
                          <a href={`/large-format/quote?product=${p.id}`}>
                            Request a quote
                          </a>
                        </Button>
                        <p className="t-note mt-4 max-w-measure opacity-70">
                          Priced on panel count, fixings and where it&apos;s
                          going — so a person does this one, not a basket.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ── Materials ─────────────────────────────────────────────────────── */}
        <Section dark>
          <UtilityLabel className="block opacity-60">MATERIALS</UtilityLabel>
          <h2 className="t-section mt-4 max-w-[16ch]">
            What it gets printed on.
          </h2>
          <p className="mt-8 max-w-measure text-body opacity-70">
            Five substrates cover almost everything that goes out of here. Hover
            one if you want the plain version of what it&apos;s for.
          </p>

          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SUBSTRATES.map((s) => (
              <li
                key={s.id}
                className="group border border-rule-dk bg-press-2 focus-within:border-paper hover:border-paper transition-colors duration-wipe ease-squeegee"
              >
                <div className="relative">
                  <SubstrateSwatch id={s.id} className="aspect-[4/3] w-full" />

                  {/* Desktop: the note wipes over the sample. Below md it just
                      sits under the label — nothing to hover with. */}
                  {/* Opaque, not tinted — a 6% window onto Correx flutes turns
                      mono body copy into noise. */}
                  <div className="pointer-events-none absolute inset-0 hidden items-end bg-press p-4 opacity-0 transition-opacity duration-wipe ease-squeegee group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
                    <p className="t-note leading-[1.7]">{s.note}</p>
                  </div>
                </div>

                <div className="border-t border-rule-dk px-4 py-3">
                  <span className="t-utility block leading-[1.6]">{s.label}</span>
                  <p className="t-note mt-3 opacity-70 md:hidden">{s.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Not sure ──────────────────────────────────────────────────────── */}
        <Section>
          <div className="grid-12 items-end gap-y-8">
            <div className="col-span-12 lg:col-span-7">
              <UtilityLabel className="block opacity-60">
                NOT ON THE LIST
              </UtilityLabel>
              <h2 className="t-section mt-4 max-w-[18ch]">
                Odd sizes, odd surfaces, odd deadlines.
              </h2>
              <p className="mt-6 max-w-measure text-body opacity-75">
                Tell us the finished size, where it&apos;s going and when you need
                it. We&apos;ll come back with a price — and say so if there&apos;s
                a cheaper way to do it.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <Button asChild size="lg">
                <Link href="/large-format/quote">Request a quote</Link>
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
