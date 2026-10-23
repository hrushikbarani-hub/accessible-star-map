import test from "node:test";
import assert from "node:assert/strict";
import { stars } from "../web/catalog.js";
import {
  findStars,
  mapPoint,
  describeConstellation,
  validSaved,
  constellationNames,
} from "../web/model.js";
test("pinned bright-star subset has unique IDs, valid coordinates and defined groups", () => {
  assert.equal(stars.length, 144);
  assert.equal(new Set(stars.map((s) => s.id)).size, 144);
  for (const s of stars) {
    assert.ok(s.ra >= 0 && s.ra < 24 && s.dec >= -90 && s.dec <= 90);
    assert.ok(s.mag <= 3);
    assert.ok(constellationNames[s.constellation]);
    const p = mapPoint(s, 23);
    assert.ok(p.x >= 40 && p.x <= 840 && p.y >= 25 && p.y <= 365);
  }
});
test("catalog filters compose and empty saved sets remain empty", () => {
  assert.equal(findStars({ query: "SIRIUS" })[0].name, "Sirius");
  assert.ok(
    findStars({ constellation: "Ori" }).every((s) => s.constellation === "Ori"),
  );
  assert.equal(findStars({ onlySaved: true }).length, 0);
  assert.match(describeConstellation("Ori"), /Orion/);
  assert.equal(validSaved('["missing"]').size, 0);
  assert.ok(findStars({ magnitude: 0.5 }).every((s) => s.mag <= 0.5));
});
