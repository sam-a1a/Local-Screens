# LocalScreens

Preview your local dev server across real device viewports, stacked vertically,
with live cross-device tooling for responsive QA.

## Getting started

npm install
npm run dev

Open the printed localhost URL, paste your app's local dev server URL
(e.g. http://localhost:3000) into the URL bar, click Load.

## Device Pixel Ratio (1x / 2x / 3x)

DPR is how many physical screen pixels are packed into a single CSS pixel.

- 1x: 1 physical pixel per CSS pixel (e.g. Asus TUF A17, 1920x1080, no scaling)
- 2x (Retina): a 2x2 block of physical pixels renders each CSS pixel (MacBook Air, iPhones, iPads)
- 3x: a 3x3 block per CSS pixel (iPhone Pro models, many Android phones)

A MacBook Air's panel is physically 2880x1800 pixels, but the browser reports
a 1440x900 CSS viewport, because the OS divides by the DPR so media queries
and vw/vh units stay in sane numbers. The device list uses the CSS/layout
size since that's what drives responsive breakpoints. The dpr field is a
label showing which @2x/@3x image assets that device will load.

## Layout

Device previews render in a single vertical column, stacked top to bottom,
scaled to a fixed card width you control with the slider in the toolbar.

## Categories

Four built-in tabs: Laptops, Desktops, Tablets, Phones — selected via the
buttons under the toolbar. Laptops is selected by default.

## Custom devices

Switch to the Custom tab to:
- Add a device by name, width, height, and DPR
- Remove any custom device with its Remove button
- Export all custom devices to a JSON file (Export JSON button)
- Import a previously exported JSON file to restore or share a device set
  (Import JSON button) — imported devices get fresh IDs so they never
  collide with existing ones

Custom devices persist in your browser's localStorage, so they survive
page reloads but are specific to this browser/machine unless exported.

## Rotate

Tablets and phones show a Rotate button that swaps width and height live,
so you can preview portrait and landscape orientations of the same device.

## Reload All

Forces every visible device preview to refetch the current URL at once,
instead of refreshing each iframe individually.

## Lazy loading

Devices scrolled out of view don't load their iframe until they come
within 200px of the viewport, reducing simultaneous requests to your dev
server when many devices are listed.

## The sync snippet

Several features below require pasting a small script into your own app.
Click "Show sync snippet" under the URL bar, copy it, and add it as an
inline <script> tag near the end of your app's index.html (or any page
you're testing), then refresh. It only communicates back to this tab via
postMessage — nothing is sent anywhere else.

The snippet enables:

### Synchronized scrolling
Toggle "Sync scrolling: On" in the header. Scroll any one device preview
and every other device scrolls to the same relative (ratio-based)
position, so you can see how a sticky header or a breakpoint-triggered
layout change behaves across every screen size simultaneously.

### Automatic breakpoint detection
The snippet scans your app's own stylesheets for @media (min-width /
max-width) rules and reports the pixel values back. A "Detected
breakpoints" bar appears listing every value found. Any device whose
width lands within 24px of one of them gets an inline
"near {value}px breakpoint" badge, so you don't have to guess whether a
given device matches one of your CSS breakpoints.

### Horizontal overflow detection
The snippet continuously checks whether your page's content is wider
than the viewport (the most common responsive bug: a table, image, or
fixed-width element overflowing). Any device where this happens gets a
red border and a badge showing exactly how many pixels it's overflowing
by — live, including overflow introduced dynamically after the initial
load (detected via MutationObserver).

### Synchronized element inspector
Toggle "Inspect: On" in the header, then click any element inside any
one device preview. LocalScreens computes a CSS selector for that
element and