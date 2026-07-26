/* Large format — the catalogue, the substrates, and the quote-form rules.
 *
 * The two bits of real logic (unit conversion on the size fields, and which
 * step is allowed to advance) live here so the form component stays markup.
 * Self-check: `node --experimental-strip-types src/lib/large-format.check.ts`. */

/* ─── Catalogue ──────────────────────────────────────────────────────────── */

/** `order` checks out through the configurator. `quote` doesn't — site boards
 * are priced off panel counts and a site visit, so a basket would be lying. */
export type Cta = "order" | "quote";

export const LF_PRODUCTS = [
  {
    n: "01",
    id: "posters",
    name: "Posters",
    photo: "OFF THE ROLL · 1189MM",
    img: "/img/lf-posters.jpg",
    copy: "Litho-sharp indoor posters printed off the wide roll and trimmed square. The ones that go in shop windows, foyers and pub corridors.",
    spec: [
      ["SIZES", "A2, A1, A0, or custom to 1600mm wide"],
      ["MATERIAL", "Silk-coated poster paper"],
      ["WEIGHT", "170 gsm"],
      ["USE", "Indoor"],
      ["LEAD TIME", "2 working days"],
    ],
    cta: "order" as Cta,
  },
  {
    n: "02",
    id: "pvc-banners",
    name: "PVC banners",
    photo: "WELDED HEM · 6M RUN",
    img: "/img/lf-banners.jpg",
    copy: "Hemmed, eyeleted and welded on all four edges. Hung across a shopfront or a scaffold, they take a winter without stretching out of shape.",
    spec: [
      ["SIZES", "1000 × 500mm to 6000 × 1500mm"],
      ["MATERIAL", "Matt PVC banner, welded hems"],
      ["WEIGHT", "440 gsm"],
      ["USE", "Outdoor"],
      ["LEAD TIME", "3 working days"],
    ],
    cta: "order" as Cta,
  },
  {
    n: "03",
    id: "roller-banners",
    name: "Roller banners",
    photo: "CASSETTE BASE · 850MM",
    img: "/img/lf-roller.jpg",
    copy: "Print, cassette, pole and bag. Anti-curl film so it still hangs straight on the third exhibition, not just the first.",
    spec: [
      ["SIZES", "850 × 2000mm · 1000 × 2000mm"],
      ["MATERIAL", "Anti-curl polyester film, alloy base"],
      ["WEIGHT", "220 micron"],
      ["USE", "Indoor"],
      ["LEAD TIME", "2 working days"],
    ],
    cta: "order" as Cta,
  },
  {
    n: "04",
    id: "site-boards",
    name: "Site boards",
    photo: "HOARDING RUN · 2440MM",
    img: "/img/lf-boards.jpg",
    copy: "Hoarding panels, site signage and safety boards. Panel counts, fixings and a delivery date to the site gate — so this one goes through a person, not a basket.",
    spec: [
      ["SIZES", "2440 × 1220mm panels, cut to fit"],
      ["MATERIAL", "3mm Foamex or 4mm Correx"],
      ["WEIGHT", "3mm / 4mm board"],
      ["USE", "Outdoor"],
      ["LEAD TIME", "5–7 working days"],
    ],
    cta: "quote" as Cta,
  },
  {
    n: "05",
    id: "stickers",
    name: "Stickers and vinyl",
    photo: "KISS CUT · 100 MICRON",
    img: "/img/lf-stickers.jpg",
    copy: "Kiss-cut on sheets or cut to shape on a roll. Window graphics, van livery, crate labels and the ones that end up on a laptop lid.",
    spec: [
      ["SIZES", "50mm to 1000mm, any shape"],
      ["MATERIAL", "Monomeric self-adhesive vinyl"],
      ["WEIGHT", "100 micron"],
      ["USE", "Indoor and outdoor"],
      ["LEAD TIME", "3 working days"],
    ],
    cta: "order" as Cta,
  },
];

/* ─── Substrates ─────────────────────────────────────────────────────────── */

/** `note` is deliberately plain English — the mono label is the spec, this is
 * what you'd get told across the counter. */
export const SUBSTRATES = [
  {
    id: "pvc",
    label: "440GSM PVC · MATT",
    note: "The workhorse banner material. Matt, so it doesn't flare in photographs, and heavy enough to hang flat across six metres.",
  },
  {
    id: "foamex",
    label: "3MM FOAMEX",
    note: "Rigid PVC sheet, dead flat and light. Screw or stick it to a wall — this is the one for signs people stand close to.",
  },
  {
    id: "correx",
    label: "4MM CORREX",
    note: "Fluted plastic board. Cheap, weatherproof and honest about being temporary — site boards and anything cable-tied to a fence for a season.",
  },
  {
    id: "silk",
    label: "170GSM SILK POSTER",
    note: "Coated paper with a low sheen. Colour sits rich on it and it doesn't glare under shop lighting. Indoor only — rain turns it to pulp.",
  },
  {
    id: "vinyl",
    label: "MONOMERIC VINYL",
    note: "Thin self-adhesive vinyl for flat surfaces. Windows, panels, van sides. Peels off cleanly for a couple of years, then stops wanting to.",
  },
];

/* ─── Units ──────────────────────────────────────────────────────────────── */

export const UNITS = [
  { id: "mm", label: "MM" },
  { id: "in", label: "IN" },
] as const;
export type UnitId = (typeof UNITS)[number]["id"];

/** The widest the roll runs. Anything over this gets panelled and joined. */
export const MAX_WIDTH_MM = 1600;

export const toMm = (value: number, unit: UnitId) =>
  unit === "mm" ? value : value * 25.4;

/** Swap a typed dimension to the other unit: whole mm, inches to two places.
 * Two places rather than one is deliberate — at one decimal, toggling MM→IN→MM
 * turns a 2440mm board into 2441mm, and this is a size someone cuts to. */
export function convert(value: number, from: UnitId, to: UnitId) {
  if (from === to || !Number.isFinite(value) || value <= 0) return value;
  const mm = toMm(value, from);
  return to === "mm" ? Math.round(mm) : Math.round((mm / 25.4) * 100) / 100;
}

/* ─── The quote draft ────────────────────────────────────────────────────── */

export const PLACES = ["Indoor", "Outdoor", "Both"];

export const FIXINGS = [
  "Eyelets every 500mm",
  "Hemmed edges",
  "Pole pockets",
  "D-rings",
  "Rope and ties",
  "None — just the print",
];

export type QuoteDraft = {
  product: string;
  quantity: number;
  width: number;
  height: number;
  unit: UnitId;
  place: string;
  fixings: string[];
  artwork: string | null;
  needsDesign: boolean;
  name: string;
  company: string;
  email: string;
  phone: string;
  needBy: string;
  notes: string;
};

export const EMPTY_DRAFT: QuoteDraft = {
  product: "",
  quantity: 1,
  width: 0,
  height: 0,
  unit: "mm",
  place: "",
  fixings: [],
  artwork: null,
  needsDesign: false,
  name: "",
  company: "",
  email: "",
  phone: "",
  needBy: "",
  notes: "",
};

export const STEPS = [
  { n: 1, label: "WHAT YOU NEED" },
  { n: 2, label: "YOUR ARTWORK" },
  { n: 3, label: "YOUR DETAILS" },
] as const;

/** What's stopping this step going forward. Empty = clear to advance.
 * Blockers only — the over-width note is guidance, not a stop. */
export function stepIssues(step: number, d: QuoteDraft): string[] {
  const out: string[] = [];
  if (step === 1) {
    if (!d.product) out.push("Pick what you need printing.");
    if (!(d.quantity >= 1)) out.push("How many do you need? One is fine.");
    if (!(d.width > 0) || !(d.height > 0))
      out.push("Give us the finished size — width and height.");
    if (!d.place) out.push("Is it going indoors or outdoors?");
  }
  if (step === 2 && !d.artwork && !d.needsDesign)
    out.push(
      "Upload your artwork, or tick that you'd like us to quote for design too.",
    );
  if (step === 3) {
    if (!d.name.trim()) out.push("We need a name to put on the quote.");
    if (!/^\S+@\S+\.\S+$/.test(d.email))
      out.push("We need an email address to send the price to.");
  }
  return out;
}

/** True once the finished size runs past the roll and has to be panelled. */
export const needsPanelling = (d: QuoteDraft) =>
  Math.min(toMm(d.width, d.unit), toMm(d.height, d.unit)) > MAX_WIDTH_MM;

/** Finished size, written the way it goes on the job bag. */
export const fmtSize = (d: QuoteDraft) =>
  d.width > 0 && d.height > 0 ? `${d.width} × ${d.height}${d.unit}` : "—";

/** The date input hands back "2026-08-14". A mono spec line reads it back as a
 * date, not a database value. Parsing a fixed string, so it's SSR-safe. */
export function fmtNeedBy(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .toUpperCase();
}
