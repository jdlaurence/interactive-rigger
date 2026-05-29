// src/components/AngleLines.jsx
//
// Protractor-style arc annotations centered on the pin. The oar rotates about
// the pin, so the open angular fan between the catch oar and the finish oar is
// empty space — the arcs live there. Angles are measured from the "square"
// reference (the perpendicular pointing straight outboard, +y in boat space).
//
// Oar directions are derived from the actual handle-tip coordinates (pin minus
// handle, pointing toward the blade) so each arc lines up exactly with the
// rendered oar regardless of the small oarlock-offset correction in utils.

import React from 'react';

// Arc radii from the pin, in cm.
const R_ANGLE = 66; // catch / finish arcs
const R_TOTAL = 96; // outer total-sweep arc
const LABEL_GAP = 16; // how far past an arc its label sits

const polar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];

// Sample an arc into a polyline path — avoids SVG arc-flag bookkeeping and
// stays crisp at any sweep.
const arcPath = (cx, cy, r, a0, a1, steps = 72) => {
  let d = '';
  for (let i = 0; i <= steps; i += 1) {
    const a = a0 + (a1 - a0) * (i / steps);
    const [x, y] = polar(cx, cy, r, a);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d.trim();
};

// A small tangential arrowhead whose tip sits exactly on the arc endpoint
// (the base trails back along the sweep), so nothing extends past the shaft.
const arrowHead = (cx, cy, r, a, sweepSign, size) => {
  const [px, py] = polar(cx, cy, r, a);
  const tx = -Math.sin(a) * sweepSign; // unit tangent in the sweep direction
  const ty = Math.cos(a) * sweepSign;
  const nx = Math.cos(a); // unit radial (outward)
  const ny = Math.sin(a);
  const tip = [px, py];
  const b1 = [px - tx * size + nx * size * 0.5, py - ty * size + ny * size * 0.5];
  const b2 = [px - tx * size - nx * size * 0.5, py - ty * size - ny * size * 0.5];
  return [tip, b1, b2].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
};

const AngleLines = ({
  pivotXBoat,
  pivotYBoat,
  collarXBoatCatch,
  collarYBoatCatch,
  collarXBoatFinish,
  collarYBoatFinish,
  catchAngle,
  finishAngle,
  totalArc,
  boatToSvgX,
  boatToSvgY,
  pixelsToCm,
}) => {
  const cx = boatToSvgX(pivotXBoat);
  const cy = boatToSvgY(pivotYBoat);

  const rAngle = pixelsToCm(R_ANGLE);
  const rTotal = pixelsToCm(R_TOTAL);
  const labelGap = pixelsToCm(LABEL_GAP);
  const arrow = pixelsToCm(7);

  // The oar artwork is rotated by exactly `oarAngle` about its collar, which is
  // offset ~one oarlock-width from the pin. So the visible shaft is parallel to
  // the pure-rotation direction but does NOT pass through the pin. A pin-centered
  // arc therefore lands beside the shaft unless we account for that offset.
  //
  // Intersect the shaft line (through the collar, along the oar's screen angle)
  // with the arc's radius and use the angle of that intersection point. This puts
  // every endpoint exactly on the rendered shaft, for any spread / angle / radius.
  const refAng = -Math.PI / 2; // "square": straight outboard (+y boat) is up in SVG
  const pureAng = (deg) => refAng + (deg * Math.PI) / 180;
  const shaftAngle = (collarXBoat, collarYBoat, deg, r) => {
    const ux = Math.cos(pureAng(deg));
    const uy = Math.sin(pureAng(deg));
    const wx = boatToSvgX(collarXBoat) - cx; // collar relative to pin (SVG)
    const wy = boatToSvgY(collarYBoat) - cy;
    const uw = ux * wx + uy * wy;
    const disc = Math.max(0, uw * uw - (wx * wx + wy * wy) + r * r);
    const t = -uw + Math.sqrt(disc); // blade-side intersection of shaft with radius r
    return Math.atan2(wy + t * uy, wx + t * ux);
  };

  const catchAng = shaftAngle(collarXBoatCatch, collarYBoatCatch, catchAngle, rAngle);
  const finishAng = shaftAngle(collarXBoatFinish, collarYBoatFinish, finishAngle, rAngle);
  const catchAngOuter = shaftAngle(collarXBoatCatch, collarYBoatCatch, catchAngle, rTotal);
  const finishAngOuter = shaftAngle(collarXBoatFinish, collarYBoatFinish, finishAngle, rTotal);

  const refEnd = polar(cx, cy, rTotal, refAng);
  const catchMid = (refAng + catchAng) / 2;
  const finishMid = (finishAng + refAng) / 2;
  const totalMid = (finishAngOuter + catchAngOuter) / 2;

  const catchLabel = polar(cx, cy, rAngle + labelGap, catchMid);
  const finishLabel = polar(cx, cy, rAngle + labelGap, finishMid);
  const totalLabel = polar(cx, cy, rTotal + labelGap + pixelsToCm(4), totalMid);

  const textCommon = {
    fontFamily: 'Inter, system-ui, Arial, sans-serif',
    fontSize: pixelsToCm(11),
    fontWeight: 600,
    stroke: '#ffffff',
    strokeWidth: pixelsToCm(2.4),
    paintOrder: 'stroke',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  };

  const COLOR_CATCH = '#1565c0';
  const COLOR_FINISH = '#2e7d32';
  const COLOR_TOTAL = '#37474f';

  return (
    <g>
      {/* Reference "square" line — the perpendicular angles are measured from */}
      <line
        x1={cx}
        y1={cy}
        x2={refEnd[0]}
        y2={refEnd[1]}
        stroke="#8a97a3"
        strokeOpacity={0.9}
        strokeWidth={pixelsToCm(1)}
        strokeDasharray={`${pixelsToCm(4)},${pixelsToCm(4)}`}
      />

      {/* Outer total-arc sweep, finish → catch, with arrowheads at both ends */}
      <path
        d={arcPath(cx, cy, rTotal, finishAngOuter, catchAngOuter)}
        fill="none"
        stroke={COLOR_TOTAL}
        strokeWidth={pixelsToCm(1.6)}
        strokeLinecap="round"
        strokeOpacity={0.85}
      />
      <polygon points={arrowHead(cx, cy, rTotal, catchAngOuter, +1, arrow)} fill={COLOR_TOTAL} />
      <polygon points={arrowHead(cx, cy, rTotal, finishAngOuter, -1, arrow)} fill={COLOR_TOTAL} />

      {/* Catch angle arc (reference → catch oar) */}
      <path
        d={arcPath(cx, cy, rAngle, refAng, catchAng)}
        fill="none"
        stroke={COLOR_CATCH}
        strokeWidth={pixelsToCm(2)}
        strokeLinecap="round"
      />

      {/* Finish angle arc (finish oar → reference) */}
      <path
        d={arcPath(cx, cy, rAngle, finishAng, refAng)}
        fill="none"
        stroke={COLOR_FINISH}
        strokeWidth={pixelsToCm(2)}
        strokeLinecap="round"
      />

      {/* Labels */}
      <text x={catchLabel[0]} y={catchLabel[1]} fill={COLOR_CATCH} {...textCommon}>
        {`Catch ${Math.round(catchAngle)}°`}
      </text>
      <text x={finishLabel[0]} y={finishLabel[1]} fill={COLOR_FINISH} {...textCommon}>
        {`Finish ${Math.round(Math.abs(finishAngle))}°`}
      </text>
      <text x={totalLabel[0]} y={totalLabel[1]} fill={COLOR_TOTAL} {...textCommon}>
        {`Total Arc ${Math.round(totalArc)}°`}
      </text>
    </g>
  );
};

export default AngleLines;
