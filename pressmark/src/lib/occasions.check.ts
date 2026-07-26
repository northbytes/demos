/* Self-check for the occasion data. The template tiles deep-link into the
 * configurator, so a typo'd position or method is a link that silently does
 * nothing — that's the failure this catches.
 *
 *   node --experimental-strip-types src/lib/occasions.check.ts
 */

import assert from "node:assert/strict";
import { METHODS } from "./catalog.ts";
import {
  OCCASIONS,
  POSITION_IDS,
  occasionBySlug,
  templateById,
  templateHref,
} from "./occasions.ts";

const methodIds = new Set(METHODS.map((m) => m.id));
const positionIds = new Set<string>(POSITION_IDS);

const slugs = OCCASIONS.map((o) => o.slug);
assert.equal(new Set(slugs).size, slugs.length, "occasion slugs must be unique");

const templateIds = OCCASIONS.flatMap((o) => o.templates).map((t) => t.id);
assert.equal(
  new Set(templateIds).size,
  templateIds.length,
  "template ids must be unique across occasions — templateById takes the first",
);

for (const o of OCCASIONS) {
  assert.equal(occasionBySlug(o.slug), o);
  assert.ok(o.facts.length > 0 && o.usual.length > 0 && o.faqs.length > 0);

  for (const t of o.templates) {
    assert.ok(methodIds.has(t.method), `${t.id}: unknown method ${t.method}`);
    assert.ok(t.positions.length > 0, `${t.id}: no print positions`);
    for (const p of t.positions) {
      assert.ok(positionIds.has(p), `${t.id}: unknown position ${p}`);
    }
    assert.equal(templateById(t.id), t);
    assert.ok(templateHref(t.id).includes(`template=${t.id}`));
  }

  // Spans are drawn as percentages of a twelve-month axis; a reversed or
  // out-of-range pair would render a bar hanging off the end of the band.
  for (const s of o.season.spans) {
    assert.ok(s.from >= 0 && s.to <= 11, `${o.slug}: ${s.label} off the axis`);
    assert.ok(s.from <= s.to, `${o.slug}: ${s.label} runs backwards`);
  }
}

console.log(
  `ok — ${OCCASIONS.length} occasion(s), ${templateIds.length} template(s)`,
);
