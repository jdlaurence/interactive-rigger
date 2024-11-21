// src/components/SVGCanvas.jsx
import React from 'react';
import Hull from './Hull';
import GuideLines from './GuideLines';
import Oar from './Oar';
import LengthLines from './LengthLines';
import oarImage from '../assets/Oar.svg';
import collarImage from '../assets/Collar.svg';
import { processOarAngle } from '../utils';

const SVGCanvas = ({
  spread,
  inboard,
  outboard,
  catchAngle,
  finishAngle,
  catchLength,
  finishLength,
  pixelsPerCm,
  svgWidthCm,
  svgHeightCm,
}) => {
  // Helper functions
  const pixelsToCm = (pixels) => pixels / pixelsPerCm;
  const cmToPixels = (cm) => cm * pixelsPerCm;

  // SVG dimensions
  const originX = svgWidthCm / 2;
  const originY = svgHeightCm / 2;

  // Conversion functions from boat space to SVG space
  const boatToSvgX = (x) => originX + x;
  const boatToSvgY = (y) => originY - y;

  // Hull variables in cm
  const hullLength = 325;
  const gunwaleWidth = 5;
  const hullWidth = 40;

  // Hull positions in boat space
  const hullStartXBoat = -hullLength / 2;
  const hullEndXBoat = hullLength / 2;

  // Pivot point (pin) coordinates in boat space
  const pivotXBoat = 0;
  const pivotYBoat = spread; // Spread cm above the seat

  // Oar image dimensions in cm
  const oarImageWidth = 100;
  const oarImageHeight = 370; // real value
  const oarlockWidth = 5; // distance from center of edge of oarlock
  const oarlockDepth = 2; // 1/2 of oarlock depth 

  // Compute handle positions and catch/finish lengths
  const processedCatch = processOarAngle(pivotXBoat, pivotYBoat, inboard, oarlockWidth, oarlockDepth, catchAngle);
  const processedFinish = processOarAngle(pivotXBoat, pivotYBoat, inboard, oarlockWidth, oarlockDepth, finishAngle);

  const horizontalDistanceCatch = processedCatch.horizontalDistance
  const handleTipXRotatedBoatCatch = processedCatch.handleTipXRotatedBoat
  const handleTipYRotatedBoatCatch = processedCatch.handleTipYRotatedBoat
  const oarImageXBoatCatch = processedCatch.collarXBoat
  const oarImageYBoatCatch = processedCatch.collarYBoat

  const horizontalDistanceFinish = processedFinish.horizontalDistance
  const handleTipXRotatedBoatFinish = processedFinish.handleTipXRotatedBoat
  const handleTipYRotatedBoatFinish = processedFinish.handleTipYRotatedBoat
  const collarXBoatFinish = processedFinish.collarXBoat
  const collarYBoatFinish = processedFinish.collarYBoat

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${svgWidthCm} ${svgHeightCm}`}
    >
      {/* Hull */}
      <Hull
        hullStartXBoat={hullStartXBoat}
        hullEndXBoat={hullEndXBoat}
        hullWidth={hullWidth}
        gunwaleWidth={gunwaleWidth}
        boatToSvgX={boatToSvgX}
        boatToSvgY={boatToSvgY}
        pixelsToCm={pixelsToCm}
      />

      {/* Guide Lines */}
      <GuideLines
        boatToSvgX={boatToSvgX}
        boatToSvgY={boatToSvgY}
        pixelsToCm={pixelsToCm}
      />

      {/* Dynamic Length Lines and Text */}
        <LengthLines
          horizontalDistanceCatch={horizontalDistanceCatch.toFixed(2)}
          horizontalDistanceFinish={horizontalDistanceFinish.toFixed(2)}
          handleTipXRotatedBoatCatch={handleTipXRotatedBoatCatch}
          handleTipYRotatedBoatCatch={handleTipYRotatedBoatCatch}
          handleTipXRotatedBoatFinish={handleTipXRotatedBoatFinish}
          handleTipYRotatedBoatFinish={handleTipYRotatedBoatFinish}
          pixelsToCm={pixelsToCm}
          boatToSvgX={boatToSvgX}
          boatToSvgY={boatToSvgY}
        />
      {/* Dynamic Angle Lines */}
        {/* <AngleLines
            boatToSvgX={boatToSvgX}
            boatToSvgY={boatToSvgY}
            pixelsToCm={pixelsToCm}
            pivotXBoat={pivotXBoat}
            pivotYBoat={pivotYBoat}
            catchAngle={catchAngle}
            finishAngle={finishAngle}
            handleTipXRotatedBoat={handleTipXRotatedBoat}
            handleTipYRotatedBoat={handleTipYRotatedBoat}
            catchLength={catchLength}
            finishLength={finishLength}
        /> */}

      {/* Pivot point (Pin) visualization */}
      <circle
        cx={boatToSvgX(pivotXBoat)}
        cy={boatToSvgY(pivotYBoat)}
        r={pixelsToCm(3.5)}
        fill="red"
      />

      {/* Catch Oar */}
      <Oar
        oarImage={oarImage}
        collarImage={collarImage}
        collarXBoat={oarImageXBoatCatch}
        collarYBoat={oarImageYBoatCatch} // Adjusted for SVG y-axis
        oarImageWidth={oarImageWidth}
        oarImageHeight={oarImageHeight}
        oarAngle={catchAngle}
        boatToSvgX={boatToSvgX}
        boatToSvgY={boatToSvgY}
        pivotXBoat={pivotXBoat}
        pivotYBoat={pivotYBoat}
        inboard={inboard}
      />

      {/* Finish Oar */}
      <Oar
        oarImage={oarImage}
        collarImage={collarImage}
        collarXBoat={collarXBoatFinish}
        collarYBoat={collarYBoatFinish} // Adjusted for SVG y-axis
        oarImageWidth={oarImageWidth}
        oarImageHeight={oarImageHeight}
        oarAngle={finishAngle}
        boatToSvgX={boatToSvgX}
        boatToSvgY={boatToSvgY}
        pivotXBoat={pivotXBoat}
        pivotYBoat={pivotYBoat}
        inboard={inboard}
      />
    </svg>
  );
};

export default SVGCanvas;
