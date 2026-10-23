# Star data attribution and license

`web/catalog.js` contains a modified subset of the HYG 4.1 database by Astronexus and catalog contributors. The data is licensed under [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/), including this subset. Application code has the separate MIT license in `LICENSE`.

Source file: [hygdata_v41.csv](https://raw.githubusercontent.com/astronexus/HYG-Database/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/CURRENT/hygdata_v41.csv).

Pinned repository commit: `c7f7f883fe678cc7680169a50ccd7dcc49b060ce` in [Astronexus/HYG-Database](https://github.com/astronexus/HYG-Database/tree/c7f7f883fe678cc7680169a50ccd7dcc49b060ce). [Original license notice](https://github.com/astronexus/HYG-Database/blob/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/LICENSE). The source repository is archived; its current development location is [Codeberg](https://codeberg.org/astronexus/hyg).

Changes made on October 23, 2026: selected stars with a proper name, a HIP identifier and visual magnitude at or below 3; retained HYG/HIP IDs, name, RA, declination, magnitude and constellation abbreviation; rounded RA/declination to six decimals; sorted and reformatted the data as JavaScript. This yields 144 stars across 47 constellation abbreviations. The catalog's RA/declination epoch and equinox are J2000.0; no current-epoch or horizon transformation is applied.

The subset must keep this attribution, source reference, change notice and CC BY-SA 4.0 license when redistributed. No endorsement by the catalog's contributors is implied. UI descriptions of the selected data were written for this app; no constellation-boundary or mythology text was copied.

To reproduce the subset, run `python scripts/derive_catalog.py`. It reads the pinned source over HTTPS and prints the selected JSON; it does not change local files. Wrap that JSON in the `export const stars = ...;` declaration in `web/catalog.js` and preserve its data-license notice.
