import { stars } from "./catalog.js";
export const constellationNames = {
  And: "Andromeda",
  Aql: "Aquila",
  Aqr: "Aquarius",
  Ari: "Aries",
  Aur: "Auriga",
  Boo: "Boötes",
  CMa: "Canis Major",
  CMi: "Canis Minor",
  CVn: "Canes Venatici",
  Cap: "Capricornus",
  Car: "Carina",
  Cas: "Cassiopeia",
  Cen: "Centaurus",
  Cep: "Cepheus",
  Cet: "Cetus",
  Col: "Columba",
  CrB: "Corona Borealis",
  Cru: "Crux",
  Crv: "Corvus",
  Cyg: "Cygnus",
  Dra: "Draco",
  Eri: "Eridanus",
  Gem: "Gemini",
  Gru: "Grus",
  Her: "Hercules",
  Hya: "Hydra",
  Leo: "Leo",
  Lep: "Lepus",
  Lib: "Libra",
  Lyr: "Lyra",
  Oph: "Ophiuchus",
  Ori: "Orion",
  Pav: "Pavo",
  Peg: "Pegasus",
  Per: "Perseus",
  Phe: "Phoenix",
  PsA: "Piscis Austrinus",
  Pup: "Puppis",
  Sco: "Scorpius",
  Ser: "Serpens",
  Sgr: "Sagittarius",
  Tau: "Taurus",
  TrA: "Triangulum Australe",
  UMa: "Ursa Major",
  UMi: "Ursa Minor",
  Vel: "Vela",
  Vir: "Virgo",
};
export function findStars({
  query = "",
  constellation = "all",
  magnitude = 3,
  onlySaved = false,
  saved = new Set(),
  sort = "brightness",
} = {}) {
  const clean = (v) => v.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  const terms = clean(query).trim().split(/\s+/).filter(Boolean);
  return stars
    .filter(
      (s) =>
        (constellation === "all" || s.constellation === constellation) &&
        s.mag <= magnitude &&
        (!onlySaved || saved.has(s.id)) &&
        terms.every((t) =>
          clean(
            `${s.name} ${constellationNames[s.constellation]} ${s.constellation} HIP ${s.hip}`,
          ).includes(t),
        ),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : a.mag - b.mag || a.name.localeCompare(b.name),
    );
}
export function mapPoint(star, rotation = 0) {
  const ra = (((star.ra - rotation) % 24) + 24) % 24;
  return {
    x: 40 + (((24 - ra) % 24) / 24) * 800,
    y: 25 + ((90 - star.dec) / 180) * 340,
  };
}
export function describeConstellation(code) {
  const group = stars
      .filter((s) => s.constellation === code)
      .sort((a, b) => a.mag - b.mag),
    bright = group[0];
  if (!bright) return "No catalog stars in this selection.";
  return `${constellationNames[code]} (${code}) has ${group.length} named stars in this bright-star subset. The brightest listed is ${bright.name}, at visual magnitude ${bright.mag}. Their declinations range from ${Math.min(...group.map((s) => s.dec)).toFixed(1)} to ${Math.max(...group.map((s) => s.dec)).toFixed(1)} degrees. This describes a subset, not the complete constellation or its boundary.`;
}
export function validSaved(raw) {
  try {
    const values = JSON.parse(raw);
    return new Set(
      Array.isArray(values)
        ? values.filter((id) => stars.some((s) => s.id === id))
        : [],
    );
  } catch {
    return new Set();
  }
}
