import type { Metadata } from "next";
import { Section, RegistrationMark } from "@/components/system/section";
import { UtilityLabel } from "@/components/system/utility-label";
import { Configurator } from "@/components/site/configurator";
import { Photo } from "@/components/site/photo";
import { SiteNav, SiteFooter } from "@/components/site/site-nav";

export const metadata: Metadata = {
  title: "Classic heavy tee — 180 GSM ringspun cotton | PRESSMARK",
  description:
    "Configure a printed run of the PRESSMARK classic heavy tee. Pick your colour, print method and positions, upload your artwork and see the price before you commit.",
};

/* ─── Copy ───────────────────────────────────────────────────────────────── */

const STEPS = [
  { n: "01", title: "UPLOAD YOUR ARTWORK", copy: "We check it while you wait." },
  { n: "02", title: "APPROVE THE PROOF", copy: "Back the same working day." },
  { n: "03", title: "WE PRINT IT", copy: "Screen, DTG or embroidery." },
  { n: "04", title: "COLLECT OR DELIVERED", copy: "Medway, or tracked to you." },
];

const MEASUREMENTS = [
  ["S", "34–36", "46", "69"],
  ["M", "38–40", "51", "71"],
  ["L", "42–44", "56", "74"],
  ["XL", "46–48", "61", "76"],
  ["2XL", "50–52", "66", "79"],
  ["3XL", "54–56", "71", "81"],
  ["4XL", "58–60", "76", "84"],
  ["5XL", "62–64", "81", "86"],
];

const FAQS = [
  {
    q: "Artwork guidelines",
    body: (
      <div className="max-w-measure space-y-4 text-small opacity-80">
        <p>
          Send vector where you can — AI, SVG or a PDF with the fonts outlined.
          Vector prints at any size without going soft, which matters most on
          back prints.
        </p>
        <p>
          If it has to be a raster file, 300 DPI at the size it&apos;ll actually
          print. A logo pulled off a website is usually 72 DPI and will look
          rough at 280mm wide — we&apos;ll tell you before we take your money.
        </p>
        <p>
          Screen printing works in flat spot colours, so gradients and drop
          shadows either get simplified or moved to DTG. Send it over and
          we&apos;ll say which way round is better for your job.
        </p>
      </div>
    ),
  },
  {
    q: "Sizing and fit",
    body: (
      <div>
        <p className="mb-6 max-w-measure text-small opacity-80">
          Regular unisex fit. Measured flat, in centimetres, with a 2cm
          tolerance. Chest to fit is in inches, the way most people buy.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule">
                <th className="t-utility py-3 pr-6 font-normal opacity-60">Size</th>
                <th className="t-utility py-3 pr-6 font-normal opacity-60">
                  Chest to fit (in)
                </th>
                <th className="t-utility py-3 pr-6 font-normal opacity-60">
                  Chest flat (cm)
                </th>
                <th className="t-utility py-3 font-normal opacity-60">
                  Body length (cm)
                </th>
              </tr>
            </thead>
            <tbody>
              {MEASUREMENTS.map(([size, fit, chest, length]) => (
                <tr key={size} className="border-b border-rule">
                  <td className="t-utility py-3 pr-6">{size}</td>
                  <td className="t-utility py-3 pr-6 opacity-75">{fit}</td>
                  <td className="t-utility py-3 pr-6 opacity-75">{chest}</td>
                  <td className="t-utility py-3 opacity-75">{length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    q: "Washing and care",
    body: (
      <div className="max-w-measure space-y-4 text-small opacity-80">
        <p>
          Wash at 30°, inside out, with like colours. Tumble dry low if you have
          to. Don&apos;t iron directly on the print — turn it inside out or put a
          cloth over it.
        </p>
        <p>
          Screen and DTG prints are cured at 160°, so they hold through a
          commercial wash cycle. Embroidery is the one to pick if the garment is
          going through an industrial laundry every week.
        </p>
      </div>
    ),
  },
  {
    q: "Delivery and collection",
    body: (
      <div className="max-w-measure space-y-4 text-small opacity-80">
        <p>
          Free UK delivery over £75, otherwise £6.50 tracked with a next-day
          service once the run is off the press. You get the tracking number the
          moment it&apos;s scanned.
        </p>
        <p>
          Collection is from Unit 7, Bailey Works in Medway, Monday to Friday
          8am–5pm. If your job is a same-day, it&apos;ll be boxed and on the desk
          from 4pm.
        </p>
      </div>
    ),
  },
  {
    q: "Returns on custom items",
    body: (
      <div className="max-w-measure space-y-4 text-small opacity-80">
        <p>
          Personalised garments aren&apos;t covered by distance-selling returns,
          which is why nothing goes on press until you&apos;ve signed off the
          proof. That proof is the agreement.
        </p>
        <p>
          If we print it wrong — wrong colour, wrong position, wrong size against
          what you approved — we reprint the whole run at our cost and collect the
          wrong one. If a garment turns up faulty from the mill, same thing. Tell
          us within 14 days.
        </p>
      </div>
    ),
  },
];

const ALSO = [
  { title: "Heavyweight hoodie", spec: "350 GSM · S–3XL", price: "£21.40", img: "/img/garment-hoodie-1.jpg" },
  { title: "Piqué polo", spec: "220 GSM · S–4XL", price: "£14.80", img: "/img/garment-polo-1.jpg" },
  { title: "Organic tote", spec: "280 GSM · ONE SIZE", price: "£4.90", img: "/img/garment-bag-1.jpg" },
  { title: "Hi-vis work vest", spec: "EN ISO 20471 · S–4XL", price: "£8.60", img: "/img/garment-workwear-1.jpg" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProductPage() {
  return (
    <>
      <SiteNav />

      <main>
        {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="border-b border-rule bg-wash">
          <ol className="shell flex h-[48px] items-center gap-3">
            {["Clothing", "T-shirts"].map((crumb) => (
              <li key={crumb} className="flex items-center gap-3">
                <a href="#" className="t-utility opacity-60 hover:opacity-100">
                  {crumb}
                </a>
                <span aria-hidden="true" className="t-utility opacity-30">
                  /
                </span>
              </li>
            ))}
            <li className="t-utility" aria-current="page">
              CLASSIC HEAVY TEE
            </li>
          </ol>
        </nav>

        {/* ── The configurator ──────────────────────────────────────────────── */}
        <div className="shell py-12 md:py-18">
          <Configurator />
        </div>

        {/* ── How a job runs ────────────────────────────────────────────────── */}
        <Section>
          <UtilityLabel className="block opacity-60">
            FOUR STEPS, IN ORDER
          </UtilityLabel>

          <ol className="mt-16 grid gap-8 md:grid-cols-4 md:gap-0">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className="relative pl-8 md:border-l md:border-rule md:pt-12 md:pr-6 md:pl-6 md:first:border-l-0"
              >
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-6 -bottom-8 left-[6px] w-px bg-rule md:hidden"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-[6px] hidden h-px bg-rule md:block"
                />
                <RegistrationMark className="top-0 left-0 opacity-60" />

                <span className="t-utility block opacity-60">{s.n}</span>
                <h3 className="t-utility mt-3">{s.title}</h3>
                <p className="mt-2 text-small opacity-70">{s.copy}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── The detail ────────────────────────────────────────────────────── */}
        <Section>
          <div className="grid-12">
            <div className="col-span-12 lg:col-span-3">
              <UtilityLabel className="block opacity-60">THE DETAIL</UtilityLabel>
              <h2 className="t-section mt-4">Before you order.</h2>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <div className="border-t border-rule">
                {/* Native disclosure — no JS, no library, correct semantics. */}
                {FAQS.map((f) => (
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
                    <div className="pb-8">{f.body}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Others also printed ───────────────────────────────────────────── */}
        <Section>
          <UtilityLabel className="block opacity-60">
            OTHERS ALSO PRINTED
          </UtilityLabel>
          <h2 className="t-section mt-4 mb-16 max-w-[20ch]">
            What goes out alongside these.
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ALSO.map((p, i) => (
              <a key={p.title} href="#" className="group block">
                <div className="cut-marks">
                  <Photo src={p.img} label={p.spec} i={i + 5} className="aspect-[4/5] w-full" />
                </div>
                <h3 className="t-sub mt-4 transition-transform duration-squeegee ease-squeegee group-hover:translate-x-1">
                  {p.title}
                </h3>
                <p className="t-utility mt-3 opacity-60">{p.spec}</p>
                <p className="mt-3 text-small">
                  from <span className="text-magenta">{p.price}</span> each
                </p>
              </a>
            ))}
          </div>
        </Section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      {/* Padded clear of the summary bar, which stays pinned to the bottom of a
          phone viewport all the way down the page. */}
      <SiteFooter className="pb-[176px] lg:pb-0" />
    </>
  );
}
