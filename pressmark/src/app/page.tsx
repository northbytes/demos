import { Section, RegistrationMark } from "@/components/system/section";
import { SqueegeeReveal } from "@/components/system/squeegee-reveal";
import { UtilityLabel } from "@/components/system/utility-label";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/site/hero";
import { Photo } from "@/components/site/photo";
import { PriceLadder } from "@/components/site/price-ladder";
import { RecentWork } from "@/components/site/recent-work";
import { SiteNav } from "@/components/site/site-nav";

/* ─── Copy ───────────────────────────────────────────────────────────────── */

const TRUST = [
  "5–7 DAY STANDARD",
  "48HR EXPRESS",
  "PROOF BEFORE WE PRINT",
  "NO MINIMUM ORDER",
  "4.9 ★ FROM 380 REVIEWS",
];

const SPLIT = [
  {
    label: "01 — CLOTHING",
    heading: "Tees, hoodies, polos, workwear, teamwear.",
    link: "See all clothing",
    photo: "FOLDED RUN · 240 UNITS",
    img: "/img/split-clothing.jpg",
  },
  {
    label: "02 — LARGE FORMAT",
    heading: "Posters, banners, site boards, stickers.",
    link: "See all print",
    photo: "OFF THE ROLL · 1200MM",
    img: "/img/split-large-format.jpg",
  },
];

const OCCASIONS = [
  {
    label: "STAG & HEN",
    copy: "Matching tees that survive the night and the photographs.",
    price: "£7.90",
    at: "each at 25+",
    img: "/img/occasion-stag-hen.jpg",
  },
  {
    label: "FESTIVALS & EVENTS",
    copy: "Crew shirts printed in a week, in the colours you signed off.",
    price: "£6.40",
    at: "each at 100+",
    img: "/img/occasion-festivals.jpg",
  },
  {
    label: "CHARITY RUNS",
    copy: "Vests and tees with the sponsor logos in the right places.",
    price: "£6.40",
    at: "each at 100+",
    img: "/img/occasion-charity.jpg",
  },
  {
    label: "SCHOOL LEAVERS",
    copy: "Names and the year on the back, hoodies in school colours.",
    price: "£9.40",
    at: "each at 25+",
    img: "/img/occasion-leavers.jpg",
  },
  {
    label: "CLUB & TEAM KIT",
    copy: "Numbers, initials and sponsor blocks, season after season.",
    price: "£11.20",
    at: "each at 10+",
    img: "/img/occasion-team.jpg",
  },
  {
    label: "WORKWEAR & UNIFORM",
    copy: "Polos, softshells and hi-vis with the logo stitched on.",
    price: "£9.00",
    at: "each at 10+",
    img: "/img/occasion-workwear.jpg",
  },
  {
    label: "HOSPITALITY",
    copy: "Aprons, tees and caps that hold up to a commercial wash.",
    price: "£9.40",
    at: "each at 25+",
    img: "/img/occasion-hospitality.jpg",
  },
];

const STEPS = [
  {
    n: "01",
    title: "UPLOAD YOUR ARTWORK",
    copy: "PNG, PDF, AI or SVG. We'll tell you straight away if it'll print well.",
  },
  {
    n: "02",
    title: "APPROVE THE PROOF",
    copy: "A digital mockup back the same working day. Nothing goes on press until you say so.",
  },
  {
    n: "03",
    title: "WE PRINT IT",
    copy: "Screen, DTG or embroidery, whichever suits the job and the run size.",
  },
  {
    n: "04",
    title: "COLLECT OR DELIVERED",
    copy: "Pick it up in Medway or have it tracked to your door.",
  },
];

const METHODS = [
  {
    method: "Screen print",
    best: "Bulk runs",
    min: "25+",
    colours: "Up to 6 spot colours",
    feel: "Sits on the fabric",
    from: "£6.40",
  },
  {
    method: "DTG",
    best: "Photographic and small runs",
    min: "1+",
    colours: "Unlimited",
    feel: "Soft in the fabric",
    from: "£14.50",
  },
  {
    method: "Vinyl transfer",
    best: "Names and numbers",
    min: "1+",
    colours: "1–2",
    feel: "Slight sheen",
    from: "£4.00 add-on",
  },
  {
    method: "Embroidery",
    best: "Polos, caps and workwear",
    min: "10+",
    colours: "Up to 12 threads",
    feel: "Stitched",
    from: "£9.00",
  },
];

const REVIEWS = [
  {
    quote:
      "Sent the artwork over at four, had the proof back before I'd finished work. A hundred and twenty hoodies on the shelf a week later, all the same shade of green.",
    who: "MARCUS T · 120 HOODIES · CLUB KIT",
  },
  {
    quote:
      "They spotted our logo was too low-res before we'd paid a penny, then redrew it as a vector and sent that back to us to keep. No fuss about it either.",
    who: "PRIYA R · 60 POLOS · DENTAL PRACTICE",
  },
  {
    quote:
      "Third year running for the festival. Same colours every time, which matters a lot more than people outside of this think it does.",
    who: "DAN W · 240 TEES · FESTIVAL CREW",
  },
];

const FOOTER_LINKS = [
  {
    head: "CLOTHING",
    items: ["T-shirts", "Hoodies & sweats", "Polos", "Workwear", "Teamwear"],
  },
  {
    head: "LARGE FORMAT",
    items: ["Posters", "PVC banners", "Site boards", "Stickers", "Roller banners"],
  },
  {
    head: "HELP",
    items: [
      "Artwork guide",
      "Size guides",
      "Delivery",
      "Returns",
      "Track your order",
    ],
  },
  {
    head: "COMPANY",
    items: ["About PRESSMARK", "The press room", "Trade accounts", "Contact"],
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <main>
        <Hero />

        {/* ── Trust strip ───────────────────────────────────────────────────── */}
        <section className="border-y border-rule bg-wash">
          <div className="shell">
            <ul className="rail flex h-[64px] items-center divide-x divide-rule overflow-x-auto">
              {TRUST.map((t) => (
                <li
                  key={t}
                  className="t-utility flex-1 px-6 whitespace-nowrap opacity-70 first:pl-0 last:pr-0"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What we print ─────────────────────────────────────────────────── */}
        <section className="on-dark grid grid-cols-1 md:grid-cols-2">
          {SPLIT.map((s, i) => (
            <SqueegeeReveal
              key={s.label}
              threshold={0.15}
              className={i === 1 ? "[transition-delay:80ms]" : undefined}
            >
              <a
                href="#"
                className="group relative block h-[420px] overflow-hidden md:h-[560px]"
              >
                <Photo src={s.img} label={s.photo} i={i} className="absolute inset-0" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-press/55 transition-colors duration-squeegee ease-squeegee group-hover:bg-press/35"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                  <span className="t-utility block text-wash opacity-70">
                    {s.label}
                  </span>
                  <h2 className="t-section mt-4 max-w-[16ch] text-paper transition-transform duration-squeegee ease-squeegee group-hover:translate-x-2">
                    {s.heading}
                  </h2>
                  <span className="mt-8 inline-block border-b-2 border-transparent pb-px text-small text-wash transition-colors duration-wipe ease-squeegee group-hover:border-amber">
                    {s.link} →
                  </span>
                </div>
              </a>
            </SqueegeeReveal>
          ))}
        </section>

        {/* ── Shop by occasion ──────────────────────────────────────────────── */}
        <Section>
          <UtilityLabel className="block opacity-60">BY OCCASION</UtilityLabel>
          <h2 className="t-section mt-4 max-w-[18ch]">
            People usually come to us for one of these.
          </h2>

          <div className="rail mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6">
            {OCCASIONS.map((o, i) => (
              <article
                key={o.label}
                className="w-[320px] shrink-0 snap-start"
              >
                <div className="cut-marks">
                  <Photo
                    src={o.img}
                    label={o.label}
                    i={i + 2}
                    className="aspect-[4/5] w-full"
                  />
                </div>
                <h3 className="t-utility mt-4">{o.label}</h3>
                <p className="mt-3 text-small opacity-70">{o.copy}</p>
                <p className="mt-4 text-small">
                  from <span className="text-magenta">{o.price}</span> {o.at}
                </p>
              </article>
            ))}
          </div>
        </Section>

        {/* ── The price ladder ──────────────────────────────────────────────── */}
        <Section dark>
          <PriceLadder />
        </Section>

        {/* ── How it works ──────────────────────────────────────────────────── */}
        <Section>
          <UtilityLabel className="block opacity-60">
            FOUR STEPS, IN ORDER
          </UtilityLabel>
          <h2 className="t-section mt-4 max-w-[20ch]">
            How a job runs through the shop.
          </h2>

          <ol className="mt-24 grid gap-12 md:grid-cols-4 md:gap-0">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className="relative pl-8 md:border-l md:border-rule md:pt-12 md:pr-6 md:pl-6 md:first:border-l-0"
              >
                {/* Mobile: the line runs down. Desktop: it runs across. */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-6 -bottom-12 left-[6px] w-px bg-rule md:hidden"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-[6px] hidden h-px bg-rule md:block"
                />
                <RegistrationMark className="top-0 left-0 opacity-60" />

                <span className="t-utility block opacity-60">{s.n}</span>
                <h3 className="t-sub mt-3">{s.title}</h3>
                <p className="mt-3 max-w-measure text-small opacity-70">
                  {s.copy}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── Choosing a print method ───────────────────────────────────────── */}
        <Section>
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-3">
              <UtilityLabel className="block opacity-60">
                SPEC SHEET
              </UtilityLabel>
              <h2 className="t-section mt-4">Choosing a print method.</h2>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-rule">
                      <th className="t-utility py-3 pr-6 font-normal opacity-60">
                        Method
                      </th>
                      <th className="t-utility py-3 pr-6 font-normal opacity-60">
                        Best for
                      </th>
                      <th className="t-utility py-3 pr-6 font-normal opacity-60">
                        Min qty
                      </th>
                      <th className="t-utility py-3 pr-6 font-normal opacity-60">
                        Colours
                      </th>
                      <th className="t-utility py-3 pr-6 font-normal opacity-60">
                        Feel
                      </th>
                      <th className="t-utility py-3 font-normal opacity-60">
                        From
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {METHODS.map((m) => (
                      <tr key={m.method} className="border-b border-rule">
                        <td className="t-sub py-6 pr-6 whitespace-nowrap">
                          {m.method}
                        </td>
                        <td className="py-6 pr-6 text-small opacity-75">
                          {m.best}
                        </td>
                        <td className="t-utility py-6 pr-6 whitespace-nowrap">
                          {m.min}
                        </td>
                        <td className="py-6 pr-6 text-small opacity-75">
                          {m.colours}
                        </td>
                        <td className="py-6 pr-6 text-small opacity-75">
                          {m.feel}
                        </td>
                        <td className="t-utility py-6 whitespace-nowrap">
                          {m.from}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <a href="#" className="link mt-8 inline-block text-small">
                Not sure? Send us the artwork and we&apos;ll tell you →
              </a>
            </div>
          </div>
        </Section>

        {/* ── Recent work ───────────────────────────────────────────────────── */}
        <Section dark id="work">
          <UtilityLabel className="block opacity-60">OFF THE PRESS</UtilityLabel>
          <h2 className="t-section mt-4 mb-16 max-w-[20ch]">
            Jobs that went out last month.
          </h2>
          <RecentWork />
        </Section>

        {/* ── Reviews ───────────────────────────────────────────────────────── */}
        <Section>
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-3">
              <UtilityLabel className="block opacity-60">
                4.9 ★ · 380 REVIEWS
              </UtilityLabel>
              <h2 className="t-section mt-4">What people say after.</h2>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <div className="divide-y divide-rule border-y border-rule">
                {REVIEWS.map((r) => (
                  <figure key={r.who} className="py-12 first:pt-0">
                    <div
                      className="flex gap-1 text-amber"
                      aria-label="Five out of five"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 0.5 8.9 5h4.6l-3.7 3 1.4 4.6L7 9.9 2.8 12.6 4.2 8 0.5 5h4.6Z"
                            fill="currentColor"
                          />
                        </svg>
                      ))}
                    </div>
                    <blockquote
                      className="mt-6 max-w-measure text-sub"
                      style={{ fontWeight: 400 }}
                    >
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <figcaption className="t-utility mt-6 opacity-60">
                      {r.who}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Trade and bulk ────────────────────────────────────────────────── */}
        <Section dark>
          <div className="grid-12 gap-y-16">
            <div className="col-span-12 lg:col-span-5">
              <UtilityLabel className="block opacity-60">
                TRADE & BULK
              </UtilityLabel>
              <h2 className="t-section mt-4">
                Ordering 100 or more? Talk to a person.
              </h2>
              <p className="mt-6 max-w-measure text-body opacity-75">
                Accounts get banded pricing held for twelve months, stock put
                aside in your sizes, and scheduled reorders so the kit turns up
                before you notice you&apos;re short. One person handles your
                jobs, and you get their direct number.
              </p>
            </div>

            <form className="col-span-12 lg:col-span-6 lg:col-start-7">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="t-utility block opacity-60" htmlFor="t-name">
                    NAME
                  </label>
                  <input
                    id="t-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="field-line font-sans outline-none"
                  />
                </div>

                <div>
                  <label
                    className="t-utility block opacity-60"
                    htmlFor="t-email"
                  >
                    EMAIL
                  </label>
                  <input
                    id="t-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.co.uk"
                    className="field-line font-sans outline-none"
                  />
                </div>

                <div className="relative">
                  <label className="t-utility block opacity-60" htmlFor="t-need">
                    WHAT YOU NEED
                  </label>
                  <select
                    id="t-need"
                    name="need"
                    defaultValue=""
                    required
                    className="field-line pr-6 font-sans outline-none"
                  >
                    <option value="" disabled>
                      Choose one
                    </option>
                    <option value="tees">Printed t-shirts</option>
                    <option value="hoodies">Hoodies & sweats</option>
                    <option value="workwear">Workwear & uniform</option>
                    <option value="embroidery">Embroidery</option>
                    <option value="large-format">Large format</option>
                  </select>
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 bottom-6"
                  >
                    <path
                      d="M1 1.5 6 6.5 11 1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    />
                  </svg>
                </div>

                <div>
                  <label className="t-utility block opacity-60" htmlFor="t-qty">
                    QUANTITY
                  </label>
                  <input
                    id="t-qty"
                    name="qty"
                    type="number"
                    min={1}
                    placeholder="250"
                    className="field-line font-sans outline-none"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="mt-8">
                Ask for a quote
              </Button>
            </form>
          </div>
        </Section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="on-dark relative overflow-hidden bg-press text-wash">
        <div className="shell relative pt-24 pb-16">
          <div className="grid gap-12 md:grid-cols-4">
            {FOOTER_LINKS.map((col) => (
              <div key={col.head}>
                <h2 className="t-utility opacity-60">{col.head}</h2>
                <ul className="mt-6 space-y-3">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="link text-small">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <address className="mt-24 grid gap-6 not-italic md:grid-cols-4">
            <div className="text-small opacity-70">
              PRESSMARK
              <br />
              Unit 7, Bailey Works
              <br />
              Medway, Kent ME4 4TZ
            </div>
            <div className="text-small opacity-70">
              <a href="tel:+441634000000" className="link">
                01634 000 000
              </a>
              <br />
              <a href="mailto:press@pressmark.co.uk" className="link">
                press@pressmark.co.uk
              </a>
              <br />
              Mon–Fri, 8am–5pm
            </div>
          </address>
        </div>

        {/* The wordmark set enormous and cut by the bottom edge. Tonal, not loud. */}
        <div
          aria-hidden="true"
          className="relative h-[9.4vw] overflow-hidden select-none"
        >
          <span
            className="absolute inset-x-0 block text-center font-display whitespace-nowrap text-press-2"
            style={{
              fontSize: "18vw",
              lineHeight: 0.75,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              top: "-2.6vw",
            }}
          >
            PRESSMARK
          </span>
        </div>

        <div className="border-t border-rule-dk">
          <div className="shell flex h-[64px] items-center justify-between gap-6">
            <span className="t-utility opacity-60">© 2026 PRESSMARK</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden="true"
              className="shrink-0 opacity-40"
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
            <span className="t-utility opacity-60">MADE IN KENT</span>
          </div>
        </div>
      </footer>
    </>
  );
}
