# LocalScreens

Preview your local dev server across real device viewports, stacked vertically.

## Device Pixel Ratio (1x / 2x / 3x)

DPR is how many physical screen pixels are packed into a single CSS pixel.

- 1x: 1 physical pixel per CSS pixel (e.g. Asus TUF A17, 1920x1080, no scaling)
- 2x (Retina): a 2x2 block of physical pixels renders each CSS pixel (MacBook Air, iPhones, iPads)
- 3x: a 3x3 block per CSS pixel (iPhone Pro models, many Android phones)

A MacBook Air's panel is physically 2880x1800 pixels, but the browser reports
a 1440x900 CSS viewport, because the OS divides by the DPR so media queries
and vw/vh units stay in sane numbers. The device list in this app uses the
CSS/layout size since that is what drives responsive breakpoints. The dpr
field is just a label showing which @2x/@3x image assets that device will load.

## Layout

Device previews render in a single vertical column, stacked top to bottom,
scaled to a fixed card width you control with the slider in the toolbar.