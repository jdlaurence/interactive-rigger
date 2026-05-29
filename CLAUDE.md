# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Interactive Rigger is a single-page tool for visualizing and measuring the rigging geometry of sweep rowing shells. The user adjusts rigging parameters (spread, inboard, oar angles) in a control panel and sees a live, to-scale SVG diagram of the hull, oarlocks, and oars at the catch and finish positions. It is a pure front-end React app with no backend, no tests, and no persistence.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build (output to `dist/`)
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo

There is no test suite. Vite `base` is set to `/interactive-rigger/` (see `vite.config.js`) for GitHub Pages deployment, so local previews are served under that path.

## Architecture

State and orchestration flow top-down through props; there is no state library or context.

- **`src/App.jsx`** owns all rigging state via `useState` (spread, inboard, outboard, catchAngle, finishAngle, catchLength, finishLength) and the layout constants. It passes state + setters down to both `ControlPanel` and `SVGCanvas`. This is the single source of truth.
- **`src/components/ControlPanel.jsx`** renders the inputs (number fields + MUI sliders) that drive the state setters. Note the mix: plain HTML `<input>` with inline `styles` objects alongside MUI `<Slider>`/`<Typography>`.
- **`src/components/SVGCanvas.jsx`** is the rendering hub. It holds the fixed hull/oar/oarlock dimensions, defines the coordinate transforms, calls `processOarAngle` for both catch and finish, and composes the child SVG primitives (`Hull`, `GuideLines`, `LengthLines`, `Oarlock` ×2, `Oar` ×2).
- **`src/utils.jsx`** contains the geometry math: `processOarAngle` (the core trig that rotates the oar/oarlock about the pin and returns handle-tip and collar positions) and `calcOarSpread`.
- Leaf components (`Hull`, `Oar`, `Oarlock`, `GuideLines`, `LengthLines`) are presentational SVG renderers that receive computed coordinates and transform functions as props. `AngleLines.jsx` is empty.

### Coordinate systems (important)

There are two coordinate spaces, and getting them straight is essential to any geometry change:

1. **Boat space** — origin at the hull center; x increases toward the bow, y increases away from the centerline (toward the rigger). The pin sits at `(0, spread)`. All physical math in `utils.jsx` works here.
2. **SVG space** — origin at top-left; y increases downward. `SVGCanvas` converts via `boatToSvgX = originX + x` and `boatToSvgY = originY - y` (the y-flip), where the origin is the canvas center.

Units are centimeters throughout; `pixelsPerCm` is currently `1`, and the SVG `viewBox` is sized directly in cm (`svgWidthCm` × `svgHeightCm`), so 1 SVG user unit = 1 cm.

### Render-during-render caveat

`SVGCanvas` calls `setCatchLength(...)` and `setFinishLength(...)` directly in its render body to push computed lengths back up to `App` for display in the control panel. This works but is a code smell (state update during render, relying on React bailout). If you touch length computation, be aware these values flow *up* from the canvas, not down — the `catchLength`/`finishLength` state in `App` is derived output, not input.

### Oar rendering

`Oar.jsx` overlays two SVG images (`assets/Oar.svg` + `assets/Collar.svg`) and positions the collar relative to an `inboardBaseline` of 114 cm, which matches the original oar artwork. Changing the oar image or its intrinsic dimensions (`oarImageWidth`/`oarImageHeight` in `SVGCanvas`) requires re-checking this baseline.
