// src/components/SVGCanvas.jsx
import React from 'react';
import Hull from './Hull';
import GuideLines from './GuideLines';
import Oar from './Oar';
import LengthLines from './LengthLines';
import oarImage from '../assets/Oar.svg';
import collarImage from '../assets/Collar.svg';
import { processOarAngle } from '../utils';
import Oarlock from './Oarlock';

const SVGCanvas = ({
  spread,
  inboard,
  outboard,
  catchAngle,
  finishAngle,
  catchLength,
  setCatchLength,
  finishLength,
  setFinishLength,
  pixelsPerCm,
  svgWidthCm,
  svgHeightCm,
}) => {
  // **Helper functions to convert between pixels and centimeters**
  const pixelsToCm = (pixels) => pixels / pixelsPerCm;
  const cmToPixels = (cm) => cm * pixelsPerCm;

  // **SVG origin coordinates (center of the canvas)**
  const originX = svgWidthCm / 2;
  const originY = svgHeightCm / 2;

  // **Conversion functions from boat coordinate space to SVG coordinate space**
  const boatToSvgX = (x) => originX + x; // SVG x-axis increases to the right
  const boatToSvgY = (y) => originY - y; // SVG y-axis increases downward, so subtract y

  // **Hull dimensions in centimeters**
  const hullLength = 325;
  const gunwaleWidth = 5;
  const hullWidth = 40;

  // **Hull positions in boat coordinate space**
  const hullStartXBoat = -hullLength / 2; // Stern position
  const hullEndXBoat = hullLength / 2;    // Bow position

  // **Pin coordinates in boat coordinate space**
  const pivotXBoat = 0;
  const pivotYBoat = spread; // Distance from centerline to oarlock

  // **Oar image dimensions in centimeters**
  const oarImageWidth = 100;
  const oarImageHeight = 370;

  // **Oarlock dimensions in cm**
  const oarlockWidth = 5; // Distance from pin to center of oar shaft
  const oarlockDepth = 2; // Half of oarlock depth

  // **Compute handle positions and horizontal distances at catch and finish angles**
  const processedCatch = processOarAngle(
    pivotXBoat,
    pivotYBoat,
    inboard,
    oarlockWidth,
    oarlockDepth,
    catchAngle
  );
  const processedFinish = processOarAngle(
    pivotXBoat,
    pivotYBoat,
    inboard,
    oarlockWidth,
    oarlockDepth,
    finishAngle
  );

  // **Extract data for catch position**
  const {
    horizontalDistance: horizontalDistanceCatch,
    handleTipXRotatedBoat: handleTipXRotatedBoatCatch,
    handleTipYRotatedBoat: handleTipYRotatedBoatCatch,
    collarXBoat: oarImageXBoatCatch,
    collarYBoat: oarImageYBoatCatch,
  } = processedCatch;
  

  // **Extract data for finish position**
  const {
    horizontalDistance: horizontalDistanceFinish,
    handleTipXRotatedBoat: handleTipXRotatedBoatFinish,
    handleTipYRotatedBoat: handleTipYRotatedBoatFinish,
    collarXBoat: collarXBoatFinish,
    collarYBoat: collarYBoatFinish,
  } = processedFinish;

  // Update catchLength and finishLegth when angles change
  setCatchLength(horizontalDistanceCatch.toFixed(2));
  setFinishLength(horizontalDistanceFinish.toFixed(2));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${svgWidthCm} ${svgHeightCm}`}
    >
      {/* Render the boat hull */}
      <Hull
        hullStartXBoat={hullStartXBoat}
        hullEndXBoat={hullEndXBoat}
        hullWidth={hullWidth}
        gunwaleWidth={gunwaleWidth}
        boatToSvgX={boatToSvgX}
        boatToSvgY={boatToSvgY}
        pixelsToCm={pixelsToCm}
      />

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

      {/* Render oar at catch position */}
      <Oar
        oarImage={oarImage}
        collarImage={collarImage}
        collarXBoat={oarImageXBoatCatch}
        collarYBoat={oarImageYBoatCatch}
        oarImageWidth={oarImageWidth}
        oarImageHeight={oarImageHeight}
        oarAngle={catchAngle}
        boatToSvgX={boatToSvgX}
        boatToSvgY={boatToSvgY}
        inboard={inboard}
      />

      {/* Render oar at finish position */}
      <Oar
        oarImage={oarImage}
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
    </svg>
  );
};

export default SVGCanvas;
