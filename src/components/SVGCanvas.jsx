// src/components/SVGCanvas.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import GuideLines from './GuideLines';
import Oar from './Oar';
import LengthLines from './LengthLines';
import AngleLines from './AngleLines';
import oarImage from '../assets/Oar.svg';
import oarFeatheredImage from '../assets/Oar_feathered.svg';
import collarImage from '../assets/Collar.svg';
import boatImage from '../assets/Boat_New.svg';
import { OARLOCK_WIDTH, OARLOCK_DEPTH, processOarAngle } from '../utils';
import Oarlock from './Oarlock';

const LegendSwatch = ({ color, label, swatch }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
    {swatch || <Box sx={{ width: 16, height: 3, bgcolor: color, borderRadius: 1 }} />}
    <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
      {label}
    </Typography>
  </Box>
);

const SVGCanvas = ({
  spread,
  inboard,
  outboard,
  catchAngle,
  finishAngle,
  processedCatch,
  processedFinish,
  metrics,
  pixelsPerCm,
  svgWidthCm,
  svgHeightCm,
}) => {
  // **Helper functions to convert between pixels and centimeters**
  const pixelsToCm = (pixels) => pixels / pixelsPerCm;
  const cmToPixels = (cm) => cm * pixelsPerCm;

  // **SVG origin coordinates (the boat-space origin in user units)**
  const originX = svgWidthCm / 2;
  const originY = svgHeightCm / 2;

  // **Conversion functions from boat coordinate space to SVG coordinate space**
  const boatToSvgX = (x) => originX + x; // SVG x-axis increases to the right
  const boatToSvgY = (y) => originY - y; // SVG y-axis increases downward, so subtract y

  // **Hull dimensions in centimeters (used only to frame the viewBox now that
  // the hull itself is drawn by the imported Boat_New.svg artwork).**
  const hullLength = 325;
  const hullWidth = 40;

  // **Hull positions in boat coordinate space**
  const hullStartXBoat = -hullLength / 2; // Stern position
  const hullEndXBoat = hullLength / 2;    // Bow position

  // **Pin coordinates in boat coordinate space**
  const pivotXBoat = 0;
  const pivotYBoat = spread; // Distance from centerline to oarlock

  // **Oar image dimensions in centimeters (the hand-drawn artwork)**
  const oarImageWidth = 100;
  const oarImageHeight = 370;

  // **Oarlock dimensions in cm (shared with the geometry math)**
  const oarlockWidth = OARLOCK_WIDTH; // Distance from pin to center of oar shaft
  const oarlockDepth = OARLOCK_DEPTH; // Half of oarlock depth

  // **Boat artwork (Boat_New.svg) — replaces the hand-drawn hull, seat, rigger,
  // and shoes. The image is anchored at its rigger pin so it lines up with the
  // app's pin at (0, spread). FINE-TUNE these four constants:**
  const boatImgVBWidth = 123.41502; // Boat_New.svg intrinsic box (Inkscape units)
  const boatImgVBHeight = 96.578728;
  const boatImgScale = 1.48; // cm per image unit (controls overall boat size)
  const boatPinFracX = 0.41; // where the pin sits across the image (0=left, 1=right)
  const boatPinFracY = 0.006; // where the pin sits down the image (0=top, 1=bottom)
  const boatFlipX = false; // set true if bow/stern end up mirrored

  const boatImgW = boatImgVBWidth * boatImgScale;
  const boatImgH = boatImgVBHeight * boatImgScale;
  const pinSvgX = boatToSvgX(0);
  const pinSvgY = boatToSvgY(spread);
  const boatImgX = pinSvgX - boatPinFracX * boatImgW;
  const boatImgY = pinSvgY - boatPinFracY * boatImgH;

  // **Extract pre-computed catch geometry**
  const {
    horizontalDistance: horizontalDistanceCatch,
    handleTipXRotatedBoat: handleTipXRotatedBoatCatch,
    handleTipYRotatedBoat: handleTipYRotatedBoatCatch,
    collarXBoat: collarXBoatCatch,
    collarYBoat: collarYBoatCatch,
  } = processedCatch;

  // **Extract pre-computed finish geometry**
  const {
    horizontalDistance: horizontalDistanceFinish,
    handleTipXRotatedBoat: handleTipXRotatedBoatFinish,
    handleTipYRotatedBoat: handleTipYRotatedBoatFinish,
    collarXBoat: collarXBoatFinish,
    collarYBoat: collarYBoatFinish,
  } = processedFinish;

  // **Blade tip (boat space): the oar line runs through the handle tip and the
  // pin; the blade is `outboard` beyond the pin on the opposite side.**
  const bladeTip = (handleX, handleY) => {
    const dx = pivotXBoat - handleX;
    const dy = pivotYBoat - handleY;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: pivotXBoat + (dx / len) * outboard,
      y: pivotYBoat + (dy / len) * outboard,
    };
  };
  // **Stable viewBox: frame the boat plus the *plausible* oar arc rather than
  // the live angles, so dragging the catch/finish sliders rotates the oars
  // without rescaling or shifting the whole diagram. The reference angles
  // bracket the realistic sweep range; the frame only changes with spread /
  // length / inboard (typed inputs), not while sliding.**
  const FRAME_ANGLES = [40, 78, -10, -48];
  const framePts = [
    { x: hullStartXBoat, y: hullWidth / 2 },
    { x: hullEndXBoat, y: -hullWidth / 2 },
    { x: pivotXBoat, y: pivotYBoat },
    { x: 0, y: -85 }, // room for the length labels below the hull
  ];
  FRAME_ANGLES.forEach((a) => {
    const p = processOarAngle(pivotXBoat, pivotYBoat, inboard, oarlockWidth, oarlockDepth, a);
    const h = { x: p.handleTipXRotatedBoat, y: p.handleTipYRotatedBoat };
    framePts.push(h, bladeTip(h.x, h.y));
  });
  const pad = 28;
  const bxMin = Math.min(...framePts.map((p) => p.x));
  const bxMax = Math.max(...framePts.map((p) => p.x));
  const byMin = Math.min(...framePts.map((p) => p.y));
  const byMax = Math.max(...framePts.map((p) => p.y));
  const vbX = boatToSvgX(bxMin) - pad;
  const vbY = boatToSvgY(byMax) - pad;
  const vbW = bxMax - bxMin + pad * 2;
  const vbH = byMax - byMin + pad * 2;
  const viewBox = `${vbX.toFixed(1)} ${vbY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Legend overlay (decoupled from the dynamic viewBox) */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.4,
          bgcolor: 'rgba(255,255,255,0.8)',
          borderRadius: 1,
          px: 1,
          py: 0.5,
          pointerEvents: 'none',
        }}
      >
        <LegendSwatch color="#1565c0" label="Catch — squared" />
        <LegendSwatch color="#2e7d32" label="Finish — feathered" />
      </Box>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Soft studio backdrop */}
          <radialGradient id="rg-bg" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#f7f9fb" />
            <stop offset="60%" stopColor="#eaeef2" />
            <stop offset="100%" stopColor="#d8dfe6" />
          </radialGradient>
          {/* Carbon hull body — crown sheen runs across the beam */}
          <linearGradient id="rg-hull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d2125" />
            <stop offset="42%" stopColor="#40474e" />
            <stop offset="50%" stopColor="#4c545b" />
            <stop offset="58%" stopColor="#40474e" />
            <stop offset="100%" stopColor="#15181b" />
          </linearGradient>
          {/* Dark molded carbon seat */}
          <linearGradient id="rg-seat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d333a" />
            <stop offset="50%" stopColor="#3d454d" />
            <stop offset="100%" stopColor="#191c20" />
          </linearGradient>
          {/* Red saxboard fitting */}
          <linearGradient id="rg-fitting" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2433b" />
            <stop offset="50%" stopColor="#cd2a25" />
            <stop offset="100%" stopColor="#9b1714" />
          </linearGradient>
          {/* White shoe body */}
          <linearGradient id="rg-shoe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d4dae1" />
          </linearGradient>
          {/* Carbon twill weave overlay */}
          <pattern id="rg-weave" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 H9 M0 4.5 H9" stroke="#000000" strokeOpacity="0.11" strokeWidth="1.3" />
            <path d="M0 2.25 H9 M0 6.75 H9" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1.3" />
          </pattern>
          {/* Depth shadows */}
          <filter id="rg-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#0b1622" floodOpacity="0.32" />
          </filter>
          <filter id="rg-tube-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.7" floodColor="#0b1622" floodOpacity="0.42" />
          </filter>
        </defs>

        {/* Studio backdrop sized to the live viewBox */}
        <rect x={vbX} y={vbY} width={vbW} height={vbH} fill="url(#rg-bg)" />

        {/* Boat artwork (hull + seat + rigger + shoes), anchored at the pin.
            Flip horizontally about the pin if bow/stern come out mirrored. */}
        <g
          transform={
            boatFlipX ? `translate(${(2 * pinSvgX).toFixed(2)} 0) scale(-1 1)` : undefined
          }
        >
          <image
            href={boatImage}
            x={boatImgX}
            y={boatImgY}
            width={boatImgW}
            height={boatImgH}
            preserveAspectRatio="none"
          />
        </g>

        {/* Render guide lines for reference */}
        <GuideLines
          boatToSvgX={boatToSvgX}
          boatToSvgY={boatToSvgY}
          pixelsToCm={pixelsToCm}
        />

        {/* Render dynamic length lines and labels */}
        <LengthLines
          horizontalDistanceCatch={horizontalDistanceCatch.toFixed(2)}
          horizontalDistanceFinish={horizontalDistanceFinish.toFixed(2)}
          handleTipXRotatedBoatCatch={handleTipXRotatedBoatCatch}
          handleTipYRotatedBoatCatch={handleTipYRotatedBoatCatch}
          handleTipXRotatedBoatFinish={handleTipXRotatedBoatFinish}
          handleTipYRotatedBoatFinish={handleTipYRotatedBoatFinish}
          workDistance={metrics.workDistance}
          pixelsToCm={pixelsToCm}
          boatToSvgX={boatToSvgX}
          boatToSvgY={boatToSvgY}
        />

        {/* Render oarlock at catch position */}
        <Oarlock
          cx={boatToSvgX(pivotXBoat)}
          cy={boatToSvgY(pivotYBoat)}
          angle={catchAngle}
          rectWidth={cmToPixels(oarlockWidth * 2)}
          rectHeight={cmToPixels(oarlockDepth * 2)}
          circleRadius={cmToPixels(oarlockDepth * 1.2)}
        />

        {/* Render oarlock at finish position */}
        <Oarlock
          cx={boatToSvgX(pivotXBoat)}
          cy={boatToSvgY(pivotYBoat)}
          angle={finishAngle}
          rectWidth={cmToPixels(oarlockWidth * 2)}
          rectHeight={cmToPixels(oarlockDepth * 2)}
          circleRadius={cmToPixels(oarlockDepth * 1.2)}
        />

        {/* Finish oar: same loom/handle/collar, with the blade feathered (the
            dedicated feathered artwork). Drawn first so the catch sits on top. */}
        <Oar
          oarImage={oarFeatheredImage}
          collarImage={collarImage}
          collarXBoat={collarXBoatFinish}
          collarYBoat={collarYBoatFinish}
          oarImageWidth={oarImageWidth}
          oarImageHeight={oarImageHeight}
          oarAngle={finishAngle}
          boatToSvgX={boatToSvgX}
          boatToSvgY={boatToSvgY}
          inboard={inboard}
        />

        {/* Catch oar: the original artwork, squared (identical to the source SVG) */}
        <Oar
          oarImage={oarImage}
          collarImage={collarImage}
          collarXBoat={collarXBoatCatch}
          collarYBoat={collarYBoatCatch}
          oarImageWidth={oarImageWidth}
          oarImageHeight={oarImageHeight}
          oarAngle={catchAngle}
          boatToSvgX={boatToSvgX}
          boatToSvgY={boatToSvgY}
          inboard={inboard}
        />

        {/* Angle arcs (catch / finish / total) — annotation layer on top */}
        <AngleLines
          pivotXBoat={pivotXBoat}
          pivotYBoat={pivotYBoat}
          collarXBoatCatch={collarXBoatCatch}
          collarYBoatCatch={collarYBoatCatch}
          collarXBoatFinish={collarXBoatFinish}
          collarYBoatFinish={collarYBoatFinish}
          catchAngle={catchAngle}
          finishAngle={finishAngle}
          totalArc={metrics.totalArc}
          boatToSvgX={boatToSvgX}
          boatToSvgY={boatToSvgY}
          pixelsToCm={pixelsToCm}
        />
      </svg>
    </Box>
  );
};

export default SVGCanvas;
