/* Self-check for the catalogue filter maths — the facet counts and the
 * empty-state suggestion are the only non-obvious logic on the listing page.
 *
 *   node --experimental-strip-types src/lib/catalog.check.ts
 */

import assert from "node:assert/strict";
import {
  EMPTY_FILTERS,
  PRODUCTS,
  PRICE_BOUNDS,
  bestRelaxation,
  clearGroup,
  facetCount,
  filterProducts,
  isActive,
  sortProducts,
  type Filters,
} from "./catalog.ts";

const f = (patch: Partial<Filters>): Filters => ({ ...EMPTY_FILTERS, ...patch });

// No filters = everything, and every price sits inside the slider bounds.
assert.equal(filterProducts(EMPTY_FILTERS).length, PRODUCTS.length);
assert.ok(
  PRODUCTS.every(
    (p) => p.price >= PRICE_BOUNDS[0] && p.price <= PRICE_BOUNDS[1],
  ),
  "a product is priced outside the slider range",
);

// Groups AND together; options within a group OR.
const tees = filterProducts(f({ types: ["tee"] }));
assert.ok(tees.length > 0 && tees.every((p) => p.type === "tee"));
assert.equal(
  filterProducts(f({ types: ["tee", "polo"] })).length,
  tees.length + filterProducts(f({ types: ["polo"] })).length,
);
assert.ok(
  filterProducts(f({ types: ["tee"], methods: ["embroidery"] })).length <
    tees.length,
);

// A facet count ignores its own group but honours the others — so ticking the
// option it sits next to yields exactly that many results.
const base = f({ types: ["tee"], stock: true });
const embroidered = facetCount(base, "method", (p) =>
  p.methods.includes("embroidery"),
);
assert.equal(
  embroidered,
  filterProducts({ ...base, methods: ["embroidery"] }).length,
);
// Ticking a second type must not change the type facets themselves.
assert.equal(
  facetCount(f({ types: ["tee"] }), "type", (p) => p.type === "polo"),
  facetCount(f({ types: ["tee", "polo"] }), "type", (p) => p.type === "polo"),
);

// The empty state must name a filter that genuinely rescues the page.
const dead = f({ types: ["bag"], colours: ["ash"] });
assert.equal(filterProducts(dead).length, 0);
const relax = bestRelaxation(dead)!;
assert.ok(relax, "no relaxation offered for an empty result set");
assert.equal(filterProducts(clearGroup(dead, relax.group)).length, relax.count);
assert.ok(relax.count > 0);

// Clearing a group turns it off and leaves the rest alone.
const cleared = clearGroup(dead, "colour");
assert.equal(isActive(cleared, "colour"), false);
assert.equal(isActive(cleared, "type"), true);
assert.equal(isActive(f({ price: [6, 46] }), "price"), true);
assert.equal(isActive(EMPTY_FILTERS, "price"), false);

// Sorting reorders without dropping anything.
const asc = sortProducts(PRODUCTS, "price-asc");
assert.equal(asc.length, PRODUCTS.length);
assert.ok(asc.every((p, i) => i === 0 || asc[i - 1].price <= p.price));
assert.deepEqual(sortProducts(PRODUCTS, "popular"), PRODUCTS);

console.log(`ok — ${PRODUCTS.length} products, ${asc.length} sorted`);
