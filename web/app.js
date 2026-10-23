import { stars } from "./catalog.js";
import {
  findStars,
  mapPoint,
  describeConstellation,
  constellationNames,
  validSaved,
} from "./model.js";
const $ = (s) => document.querySelector(s),
  esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
let saved = new Set(),
  rows = [],
  selected = stars[0].id,
  page = 0,
  rotation = 0;
try {
  saved = validSaved(localStorage.getItem("open-sky-saved"));
} catch {
  $("#message").textContent =
    "Saved stars will last only for this page session.";
}
$("#constellation").innerHTML += [...new Set(stars.map((s) => s.constellation))]
  .sort((a, b) => constellationNames[a].localeCompare(constellationNames[b]))
  .map(
    (c) => `<option value="${c}">${esc(constellationNames[c])} (${c})</option>`,
  )
  .join("");
function map() {
  const chosen = stars.find((s) => s.id === selected),
    p = chosen ? mapPoint(chosen, rotation) : null;
  $("#map").innerHTML =
    `<svg viewBox="0 0 880 400" aria-hidden="true">${Array.from({ length: 7 }, (_, i) => `<line x1="40" y1="${25 + (i * 340) / 6}" x2="840" y2="${25 + (i * 340) / 6}"/><text x="3" y="${29 + (i * 340) / 6}">${90 - i * 30}°</text>`).join("")}${Array.from({ length: 5 }, (_, i) => `<line x1="${40 + i * 200}" y1="25" x2="${40 + i * 200}" y2="365"/><text x="${40 + i * 200}" y="388">${(((rotation - i * 6) % 24) + 24) % 24}h</text>`).join("")}${rows
      .map((s) => {
        const p = mapPoint(s, rotation);
        return `<circle data-star="${s.id}" cx="${p.x}" cy="${p.y}" r="${Math.max(1.8, 4.4 - s.mag * 0.65)}" class="${s.id === selected ? "selected" : ""}"><title>${esc(s.name)} / ${esc(constellationNames[s.constellation])}</title></circle>`;
      })
      .join(
        "",
      )}${p && rows.some((s) => s.id === selected) ? `<text class="star-label" x="${Math.min(p.x + 10, 730)}" y="${Math.max(p.y - 10, 18)}">${esc(chosen.name)}</text>` : ""}</svg>`;
}
function inspect() {
  const s = stars.find((s) => s.id === selected);
  if (!s || !rows.length) {
    $("#inspector").innerHTML =
      '<div class="empty"><h2>No stars match.</h2><p>Try a wider magnitude limit, another constellation or turn off Saved stars only.</p></div>';
    return;
  }
  $("#inspector").innerHTML =
    `<p class="eyebrow">HYG ${s.id} / HIP ${s.hip}</p><h2>${esc(s.name)}</h2><p>${esc(constellationNames[s.constellation])} / ${s.constellation}</p><div class="coordinates"><div><strong>${s.ra.toFixed(4)} h</strong><small>RIGHT ASCENSION / J2000</small></div><div><strong>${s.dec.toFixed(4)}°</strong><small>DECLINATION / J2000</small></div><div><strong>${s.mag}</strong><small>VISUAL MAGNITUDE</small></div><div><strong>${s.dec >= 0 ? "North" : "South"}</strong><small>OF THE CELESTIAL EQUATOR</small></div></div><p>Right ascension gives a position around the celestial equator. Declination gives the angle north or south of it. These are catalog coordinates, not a claim that the star is above your horizon now.</p><button id="save-star" aria-pressed="${saved.has(s.id)}">${saved.has(s.id) ? "Remove from saved stars" : "Save this star"}</button><h3>${esc(constellationNames[s.constellation])}</h3><p>${esc(describeConstellation(s.constellation))}</p><p class="help">Source: HYG 4.1, selected named-star data. Magnitudes and positions are catalog values; stars can vary and the epoch is not advanced to today.</p>`;
  document
    .querySelectorAll("[data-select]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.select === selected)),
    );
}
function list() {
  const maxPage = Math.max(0, Math.ceil(rows.length / 20) - 1);
  page = Math.min(page, maxPage);
  $("#star-list").innerHTML =
    rows
      .slice(page * 20, page * 20 + 20)
      .map(
        (s) =>
          `<div class="star-row"><button data-select="${s.id}" aria-pressed="${s.id === selected}" aria-controls="inspector"><span>${esc(s.name)}<small>${esc(constellationNames[s.constellation])} / HIP ${s.hip}</small></span></button><span class="star-mag">MAG ${s.mag}</span></div>`,
      )
      .join("") || '<p class="empty">No matching stars.</p>';
  $("#count").textContent = `${rows.length} of ${stars.length} stars`;
  $("#page").textContent = `${page + 1} / ${maxPage + 1}`;
  $("#previous").disabled = page === 0;
  $("#next").disabled = page >= maxPage;
}
function render() {
  rows = findStars({
    query: $("#query").value,
    constellation: $("#constellation").value,
    magnitude: Number($("#magnitude").value),
    sort: $("#sort").value,
    onlySaved: $("#saved-only").checked,
    saved,
  });
  if (!rows.some((s) => s.id === selected)) selected = rows[0]?.id || null;
  $("#mag-label").textContent = $("#magnitude").value;
  list();
  map();
  inspect();
}
$("#filters").addEventListener("submit", (e) => e.preventDefault());
$("#filters").addEventListener("input", () => {
  page = 0;
  render();
});
$("#filters").addEventListener("reset", (e) => {
  e.preventDefault();
  $("#query").value = "";
  $("#constellation").value = "all";
  $("#magnitude").value = "3";
  $("#sort").value = "brightness";
  $("#saved-only").checked = false;
  page = 0;
  render();
});
$("#star-list").addEventListener("click", (e) => {
  const b = e.target.closest("[data-select]");
  if (b) {
    selected = b.dataset.select;
    map();
    inspect();
  }
});
$("#map").addEventListener("click", (e) => {
  const s = e.target.closest("[data-star]");
  if (s) {
    selected = s.dataset.star;
    inspect();
    map();
  }
});
$("#inspector").addEventListener("click", (e) => {
  if (e.target.id !== "save-star") return;
  const id = selected;
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  try {
    localStorage.setItem("open-sky-saved", JSON.stringify([...saved]));
    $("#message").textContent = "Saved star IDs updated in this browser.";
  } catch {
    $("#message").textContent =
      "Storage is blocked. Saved stars last for this page session only.";
  }
  if ($("#saved-only").checked) {
    render();
    $("#saved-only").focus();
  } else {
    e.target.textContent = saved.has(id)
      ? "Remove from saved stars"
      : "Save this star";
    e.target.setAttribute("aria-pressed", String(saved.has(id)));
  }
});
$("#previous").addEventListener("click", () => {
  page = Math.max(0, page - 1);
  list();
});
$("#next").addEventListener("click", () => {
  page++;
  list();
});
$("#saved-only").addEventListener("change", () => {
  page = 0;
  render();
});
$("#text-only").addEventListener(
  "change",
  () => ($("#visual").hidden = $("#text-only").checked),
);
$("#contrast").addEventListener("change", () =>
  document.body.classList.toggle("contrast", $("#contrast").checked),
);
$("#rotation").addEventListener("input", () => {
  rotation = Number($("#rotation").value);
  map();
});
$("#map").addEventListener("keydown", (e) => {
  if (!["ArrowLeft", "ArrowRight", "Home"].includes(e.key)) return;
  e.preventDefault();
  rotation =
    e.key === "Home" ? 0 : (rotation + (e.key === "ArrowLeft" ? 1 : 23)) % 24;
  $("#rotation").value = rotation;
  map();
});
$("#export").addEventListener("click", () => {
  const cell = (v) => '"' + String(v).replace(/"/g, '""') + '"',
    records = [
      [
        "name",
        "ra_hours_j2000",
        "dec_degrees_j2000",
        "visual_magnitude",
        "constellation",
        "source",
        "license",
      ],
      ...rows.map((s) => [
        s.name,
        s.ra,
        s.dec,
        s.mag,
        constellationNames[s.constellation],
        "HYG 4.1 / Astronexus and contributors; modified named-star subset; https://github.com/astronexus/HYG-Database/tree/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/CURRENT",
        "https://creativecommons.org/licenses/by-sa/4.0/",
      ]),
    ];
  const url = URL.createObjectURL(
      new Blob([records.map((r) => r.map(cell).join(",")).join("\r\n")], {
        type: "text/csv",
      }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = "hyg-bright-star-selection.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
