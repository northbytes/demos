/* The clothing catalogue and its filter logic.
 *
 * Filtering lives here rather than in the component so the facet counts, the
 * result list and the empty-state suggestion all come off one `checks()` pass
 * instead of three near-identical predicates drifting apart.
 * Self-check: `node --experimental-strip-types src/lib/catalog.check.ts`. */

/* Garment colours are stock, not brand tokens — they're the product.
 * `ink` is the print colour that survives on that garment.
 * Lives here rather than next to the drawing so this file stays plain data,
 * runnable under `node` on its own. Re-exported from `garment.tsx`. */
export const GARMENTS = [
  { id: "white", name: "White", hex: "#F2F2EF", ink: "#14181B" },
  { id: "natural", name: "Natural", hex: "#E4D9C1", ink: "#14181B" },
  { id: "ash", name: "Heather ash", hex: "#B9BDBA", ink: "#14181B" },
  { id: "press", name: "Emulsion teal", hex: "var(--press)", ink: "#F7F9F7" },
  { id: "black", name: "Black", hex: "#17181A", ink: "#F7F9F7" },
  { id: "navy", name: "Navy", hex: "#1B2A41", ink: "#F7F9F7" },
  { id: "burgundy", name: "Burgundy", hex: "#5B1A28", ink: "#F7F9F7" },
  { id: "forest", name: "Forest green", hex: "#14503C", ink: "#F7F9F7" },
];

export const COLOURS = GARMENTS;
export type ColourId = (typeof GARMENTS)[number]["id"];

export const TYPES = [
  { id: "tee", label: "T-shirts" },
  { id: "long", label: "Long sleeve" },
  { id: "polo", label: "Polo shirts" },
  { id: "hoodie", label: "Hoodies" },
  { id: "sweat", label: "Sweatshirts" },
  { id: "jacket", label: "Jackets & gilets" },
  { id: "workwear", label: "Workwear" },
  { id: "headwear", label: "Headwear" },
  { id: "bag", label: "Bags & aprons" },
] as const;
export type TypeId = (typeof TYPES)[number]["id"];

export const METHODS = [
  { id: "screen", label: "Screen print" },
  { id: "dtg", label: "DTG" },
  { id: "embroidery", label: "Embroidery" },
  { id: "vinyl", label: "Vinyl transfer" },
] as const;
export type MethodId = (typeof METHODS)[number]["id"];

export const SIZE_RANGES = [
  { id: "s-xl", label: "S–XL" },
  { id: "s-3xl", label: "S–3XL" },
  { id: "xs-5xl", label: "XS–5XL" },
  { id: "one", label: "One size" },
] as const;
export type SizeId = (typeof SIZE_RANGES)[number]["id"];

export const MIN_ORDERS = [
  { id: 1, label: "No minimum" },
  { id: 10, label: "10 units" },
  { id: 25, label: "25 units" },
  { id: 50, label: "50 units" },
] as const;

export const SORTS = [
  { id: "popular", label: "Most printed" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name, A–Z" },
] as const;
export type SortId = (typeof SORTS)[number]["id"];

/* ─── Products ───────────────────────────────────────────────────────────── */

export type Product = {
  id: string;
  name: string;
  type: TypeId;
  /** The mono type label on the card — garment class and cloth weight. */
  spec: string;
  /** Unit price at the top quantity band, which is what the card quotes. */
  price: number;
  min: number;
  sizes: SizeId;
  methods: MethodId[];
  colours: ColourId[];
  /** Total colourways stocked — the card shows five chips and counts the rest. */
  variants: number;
  stock: boolean;
};

const ALL = GARMENTS.map((g) => g.id) as ColourId[];
const CORE: ColourId[] = ["white", "black", "navy", "ash", "natural"];
const DARK: ColourId[] = ["black", "navy", "press", "forest", "burgundy"];
const PALE: ColourId[] = ["white", "natural", "ash"];

/* name, type, spec, price, min order, size range, methods, colours, colourways, in stock */
const P = (
  name: string,
  type: TypeId,
  spec: string,
  price: number,
  min: number,
  sizes: SizeId,
  methods: MethodId[],
  colours: ColourId[],
  variants: number,
  stock = true,
): Product => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  type,
  spec,
  price,
  min,
  sizes,
  methods,
  colours,
  variants,
  stock,
});

/* Array order is the "most printed" sort — it's the shop's own ranking. */
export const PRODUCTS: Product[] = [
  // T-shirts
  P("Classic heavy tee", "tee", "HEAVY TEE · 180 GSM", 6.4, 1, "xs-5xl", ["screen", "dtg", "vinyl"], ALL, 24),
  P("Organic cotton tee", "tee", "ORGANIC TEE · 155 GSM", 7.2, 10, "s-3xl", ["screen", "dtg"], CORE, 14),
  P("Premium ringspun tee", "tee", "RINGSPUN TEE · 200 GSM", 8.1, 10, "s-3xl", ["screen", "dtg", "vinyl"], ALL, 18),
  P("Performance tee", "tee", "PERFORMANCE TEE · 140 GSM", 9.6, 25, "s-xl", ["vinyl", "dtg"], ["white", "black", "navy", "press"], 9),
  P("Tri-blend tee", "tee", "TRI-BLEND TEE · 160 GSM", 8.9, 10, "s-3xl", ["dtg", "screen"], ["ash", "natural", "white", "black"], 10),
  P("Oversized boxy tee", "tee", "BOXY TEE · 220 GSM", 11.4, 10, "s-xl", ["screen", "dtg"], ["white", "black", "natural", "forest"], 8),
  P("Ladies fitted tee", "tee", "FITTED TEE · 150 GSM", 6.9, 10, "s-xl", ["screen", "dtg", "vinyl"], CORE, 14),
  P("Cotton vest", "tee", "VEST · 150 GSM", 6.1, 25, "s-xl", ["screen", "vinyl"], ["white", "black", "ash", "navy"], 7),
  P("Pocket tee", "tee", "POCKET TEE · 185 GSM", 9.8, 10, "s-3xl", ["screen", "embroidery"], DARK, 6, false),
  P("Event tee", "tee", "EVENT TEE · 145 GSM", 4.2, 50, "s-3xl", ["screen"], ["white", "black", "navy", "burgundy"], 12),

  // Long sleeve
  P("Long sleeve heavy tee", "long", "LONG SLEEVE · 190 GSM", 9.4, 10, "s-3xl", ["screen", "dtg"], CORE, 11),
  P("Raglan baseball tee", "long", "RAGLAN · 165 GSM", 10.2, 25, "s-xl", ["screen", "vinyl"], ["white", "black", "navy"], 6),
  P("Long sleeve performance top", "long", "LS PERFORMANCE · 145 GSM", 12.6, 25, "s-xl", ["vinyl", "embroidery"], ["black", "navy", "press"], 5, false),

  // Polos
  P("Classic piqué polo", "polo", "PIQUÉ POLO · 220 GSM", 11.2, 10, "xs-5xl", ["embroidery", "vinyl", "screen"], ALL, 22),
  P("Cotton-rich polo", "polo", "COTTON POLO · 200 GSM", 12.4, 10, "s-3xl", ["embroidery", "vinyl"], CORE, 15),
  P("Performance polo", "polo", "PERFORMANCE POLO · 160 GSM", 14.8, 25, "s-3xl", ["embroidery", "vinyl"], DARK, 10),
  P("Ladies stretch polo", "polo", "STRETCH POLO · 200 GSM", 13.6, 10, "s-xl", ["embroidery"], ["white", "black", "navy", "burgundy"], 9),
  P("Heavyweight work polo", "polo", "WORK POLO · 240 GSM", 15.2, 10, "xs-5xl", ["embroidery"], DARK, 8),

  // Hoodies
  P("Classic pullover hoodie", "hoodie", "PULLOVER HOOD · 280 GSM", 17.4, 10, "xs-5xl", ["screen", "dtg", "embroidery"], ALL, 26),
  P("Heavyweight hoodie", "hoodie", "HEAVY HOOD · 350 GSM", 22.8, 10, "s-3xl", ["screen", "embroidery"], DARK, 12),
  P("Zip-through hoodie", "hoodie", "ZIP HOOD · 300 GSM", 19.6, 10, "s-3xl", ["embroidery", "screen"], CORE, 16),
  P("Organic hoodie", "hoodie", "ORGANIC HOOD · 300 GSM", 21.4, 25, "s-3xl", ["screen", "dtg"], ["natural", "ash", "black", "forest"], 9),
  P("Ladies fitted hoodie", "hoodie", "FITTED HOOD · 280 GSM", 18.2, 10, "s-xl", ["screen", "embroidery"], CORE, 13),
  P("Oversized hoodie", "hoodie", "OVERSIZED HOOD · 400 GSM", 26.5, 25, "s-xl", ["screen", "dtg"], ["black", "ash", "natural", "press"], 7),
  P("Cropped hoodie", "hoodie", "CROPPED HOOD · 280 GSM", 19.9, 25, "s-xl", ["screen", "vinyl"], PALE, 5, false),

  // Sweatshirts
  P("Classic crew sweatshirt", "sweat", "CREW SWEAT · 280 GSM", 14.6, 10, "xs-5xl", ["screen", "embroidery", "dtg"], ALL, 20),
  P("Heavyweight crew", "sweat", "HEAVY CREW · 350 GSM", 19.8, 10, "s-3xl", ["screen", "embroidery"], DARK, 11),
  P("Quarter-zip sweat", "sweat", "QUARTER ZIP · 300 GSM", 21.2, 10, "s-3xl", ["embroidery"], ["black", "navy", "ash", "press"], 8),
  P("Varsity crew", "sweat", "VARSITY CREW · 300 GSM", 20.4, 25, "s-xl", ["screen", "vinyl"], ["natural", "navy", "burgundy"], 6),
  P("Organic crew sweat", "sweat", "ORGANIC CREW · 300 GSM", 18.9, 25, "s-3xl", ["screen", "dtg"], ["natural", "ash", "forest", "black"], 9),

  // Jackets & gilets
  P("Softshell jacket", "jacket", "SOFTSHELL · 3-LAYER", 32.0, 10, "xs-5xl", ["embroidery"], DARK, 10),
  P("Padded gilet", "jacket", "GILET · QUILTED", 28.4, 10, "s-3xl", ["embroidery"], ["black", "navy", "forest"], 6),
  P("Waterproof shell", "jacket", "SHELL · 2000MM HH", 24.6, 25, "s-3xl", ["embroidery", "vinyl"], ["black", "navy", "press"], 5),
  P("Fleece jacket", "jacket", "FLEECE · 300 GSM", 22.9, 10, "s-3xl", ["embroidery"], ["black", "navy", "ash", "burgundy"], 8),

  // Workwear
  P("Hi-vis vest", "workwear", "HI-VIS VEST · EN ISO 20471", 8.4, 25, "s-3xl", ["screen", "vinyl"], ["white", "navy"], 3),
  P("Hi-vis bomber", "workwear", "HI-VIS BOMBER · CLASS 3", 46.0, 10, "s-3xl", ["embroidery"], ["navy", "black"], 4),
  P("Work trousers", "workwear", "WORK TROUSER · 260 GSM", 27.5, 10, "s-3xl", ["embroidery"], ["black", "navy", "ash"], 6),
  P("Bib and brace", "workwear", "BIB & BRACE · 245 GSM", 31.0, 10, "s-3xl", ["embroidery"], ["navy", "black"], 4, false),
  P("Oxford work shirt", "workwear", "WORK SHIRT · OXFORD", 19.4, 10, "s-3xl", ["embroidery", "vinyl"], ["white", "navy", "ash"], 7),
  P("Chef jacket", "workwear", "CHEF JACKET · 210 GSM", 21.6, 10, "s-3xl", ["embroidery"], ["white", "black"], 4),

  // Headwear
  P("Five-panel cap", "headwear", "CAP · 5 PANEL", 7.9, 25, "one", ["embroidery", "vinyl"], ALL, 18),
  P("Six-panel structured cap", "headwear", "CAP · 6 PANEL", 8.6, 25, "one", ["embroidery"], CORE, 14),
  P("Cuffed beanie", "headwear", "BEANIE · CUFFED", 6.8, 25, "one", ["embroidery"], DARK, 12),
  P("Bucket hat", "headwear", "BUCKET HAT · TWILL", 11.2, 50, "one", ["embroidery"], ["natural", "black", "forest"], 5),

  // Bags & aprons
  P("Cotton tote", "bag", "TOTE · 140 GSM", 4.6, 50, "one", ["screen", "dtg"], ["natural", "white", "black"], 6),
  P("Heavy canvas tote", "bag", "CANVAS TOTE · 340 GSM", 9.2, 25, "one", ["screen", "embroidery"], ["natural", "black", "navy"], 5),
  P("Bib apron", "bag", "BIB APRON · 240 GSM", 12.4, 10, "one", ["embroidery", "screen"], ["black", "burgundy", "forest", "navy"], 9),
  P("Drawstring gym sac", "bag", "GYM SAC · 210 GSM", 5.4, 50, "one", ["screen", "vinyl"], ["black", "navy", "white"], 6),
];

/* ─── Filters ────────────────────────────────────────────────────────────── */

export const PRICE_BOUNDS: [number, number] = [4, 46];

export type Filters = {
  types: TypeId[];
  methods: MethodId[];
  colours: ColourId[];
  sizes: SizeId[];
  price: [number, number];
  mins: number[];
  stock: boolean;
};

export const EMPTY_FILTERS: Filters = {
  types: [],
  methods: [],
  colours: [],
  sizes: [],
  price: PRICE_BOUNDS,
  mins: [],
  stock: false,
};

export type Group = keyof ReturnType<typeof checks>;

export const GROUP_LABEL: Record<Group, string> = {
  type: "garment type",
  method: "print method",
  colour: "colour",
  size: "size range",
  price: "price",
  min: "minimum order",
  stock: "in stock",
};

/** Clearing one group without touching the others. */
export const clearGroup = (f: Filters, g: Group): Filters =>
  ({
    type: { ...f, types: [] },
    method: { ...f, methods: [] },
    colour: { ...f, colours: [] },
    size: { ...f, sizes: [] },
    price: { ...f, price: PRICE_BOUNDS },
    min: { ...f, mins: [] },
    stock: { ...f, stock: false },
  })[g];

export const isActive = (f: Filters, g: Group): boolean =>
  ({
    type: f.types.length > 0,
    method: f.methods.length > 0,
    colour: f.colours.length > 0,
    size: f.sizes.length > 0,
    price: f.price[0] !== PRICE_BOUNDS[0] || f.price[1] !== PRICE_BOUNDS[1],
    min: f.mins.length > 0,
    stock: f.stock,
  })[g];

/** One pass, one verdict per group — so "all" and "all but one" share a source. */
export function checks(p: Product, f: Filters) {
  return {
    type: !f.types.length || f.types.includes(p.type),
    method: !f.methods.length || p.methods.some((m) => f.methods.includes(m)),
    colour: !f.colours.length || p.colours.some((c) => f.colours.includes(c)),
    size: !f.sizes.length || f.sizes.includes(p.sizes),
    price: p.price >= f.price[0] && p.price <= f.price[1],
    min: !f.mins.length || f.mins.includes(p.min),
    stock: !f.stock || p.stock,
  };
}

const passes = (p: Product, f: Filters, except?: Group) =>
  Object.entries(checks(p, f)).every(([g, ok]) => g === except || ok);

export const filterProducts = (f: Filters) =>
  PRODUCTS.filter((p) => passes(p, f));

/** How many results an option would yield — its own group left out of the count. */
export const facetCount = (
  f: Filters,
  group: Group,
  pred: (p: Product) => boolean,
) => PRODUCTS.filter((p) => passes(p, f, group) && pred(p)).length;

export const sortProducts = (list: Product[], sort: SortId) => {
  if (sort === "popular") return list;
  const by: Record<Exclude<SortId, "popular">, (a: Product, b: Product) => number> = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name, "en-GB"),
  };
  return [...list].sort(by[sort]);
};

/**
 * The single active filter worth dropping when nothing matches: the one whose
 * removal recovers the most products. Undefined when dropping any one group
 * still leaves zero — then only "clear everything" helps.
 */
export function bestRelaxation(f: Filters) {
  const options = (Object.keys(GROUP_LABEL) as Group[])
    .filter((g) => isActive(f, g))
    .map((g) => ({
      group: g,
      count: PRODUCTS.filter((p) => passes(p, f, g)).length,
    }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count);
  return options[0];
}
