# Open Sky: Accessible Star Map

A bright-star catalog explorer with a map and an equivalent text workflow. [Open the app](https://hrushikbarani-hub.github.io/accessible-star-map/).

Search 144 named stars, filter 47 constellations and adjust the magnitude limit. Select a star to read its J2000 RA/declination, visual magnitude and an original description of the selected constellation's catalog subset. Save favorite star IDs locally or export the filtered data as an attributed CSV.

## Accessibility

- Native, labeled search, filter and preference controls.
- A text-only view that keeps every catalog record accessible through the list and inspector.
- Visible focus, meaningful button labels and selected-state announcements.
- No automatic animation, flashing, audio or location permission.
- A higher-contrast option, responsive layout and support for browser text zoom.
- Keyboard arrows rotate the focused chart; selecting stars works through ordinary list buttons.

This is an all-sky catalog chart, not a prediction of what is above your horizon tonight. Coordinates remain J2000.0. No weather, daylight, epoch transformation, proper motion, constellation boundary or moving-body calculation is included. The data is a limited selection, not a complete atlas. Lower visual magnitude means brighter.

## Run and check

```powershell
npm ci
npm run check
python -m http.server 8146 --bind 127.0.0.1 --directory web
```

Open `http://127.0.0.1:8146`. Node.js 22+ is needed only for checks; the static app has no runtime dependency or external data request. GitHub Actions checks the source and publishes `web` to free GitHub Pages.

Checks cover catalog integrity, search/filter composition, coordinate bounds, saved IDs, text-only controls, selection focus and the real DOM workflow. Visual browser and screen-reader QA were unavailable during this release; the accessibility features need feedback from real users and do not imply certification.

## Data and code licenses

The HYG 4.1 named-star subset is CC BY-SA 4.0, attributed to Astronexus and catalog contributors. It was selected, rounded and reformatted from a pinned source commit. See [the data attribution and change notice](DATA-LICENSE.md). The app's own code is MIT; that license does not replace the catalog's data license.

`scripts/derive_catalog.py` reproduces the selected JSON from the pinned upstream CSV without writing a file. `web/model.js` handles search, catalog projection and descriptions; `web/app.js` handles the interface. Only saved star IDs are stored in the browser. Clear site data to remove them.

Built by [hirsu](https://hrushikbarani-hub.github.io/), connected to the Robo Telescope and astronomy projects. Next useful work: user-led screen-reader review, a real horizon view through a validated astronomy library, and a wider catalog with an equally usable text interface.
