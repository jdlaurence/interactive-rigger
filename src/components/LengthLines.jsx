// src/components/LengthLines.jsx
import React from 'react';

const LengthLines = ({
  horizontalDistanceCatch,
  horizontalDistanceFinish,
  handleTipXRotatedBoatCatch,
  handleTipYRotatedBoatCatch,
  handleTipXRotatedBoatFinish,
  handleTipYRotatedBoatFinish,
  pixelsToCm,
  boatToSvgX,
  boatToSvgY,
}) => {

    const catchTextYPosition = boatToSvgY(-35);
    const finishTextYPosition = boatToSvgY(-50);
    const workTextYPosition = boatToSvgY(-65);
    
  return (
    <>
      {/* --- Catch Length Lines and Text --- */}

      {/* Horizontal line from handle tip to pivot at catch position */}
      <line
        x1={boatToSvgX(handleTipXRotatedBoatCatch)}
        y1={boatToSvgY(0)} // Pivot point y-coordinate
        x2={boatToSvgX(0)}
        y2={boatToSvgY(0)}
        stroke="blue"
        strokeWidth={pixelsToCm(2)}
      />

      {/* Vertical dashed line from handle tip to horizontal line at catch position */}
      <line
        x1={boatToSvgX(handleTipXRotatedBoatCatch)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(handleTipXRotatedBoatCatch)}
        y2={boatToSvgY(handleTipYRotatedBoatCatch)}
        stroke="black"
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />

      {/* Label for catch length */}
      <text
        x={boatToSvgX(handleTipXRotatedBoatCatch / 2)} // Midpoint between handle tip and pivot
        y={catchTextYPosition}
        fontFamily="Arial"
        fontSize={pixelsToCm(12)}
        fill="blue"
        textAnchor="middle"
      >
        {`Catch Length: ${Math.abs(horizontalDistanceCatch)} cm`}
      </text>

      {/* --- Finish Length Lines and Text --- */}

      {/* Horizontal line from handle tip to pivot at finish position */}
      <line
        x1={boatToSvgX(handleTipXRotatedBoatFinish)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(0)}
        y2={boatToSvgY(0)}
        stroke="green"
        strokeWidth={pixelsToCm(2)}
      />

      {/* Vertical dashed line from handle tip to horizontal line at finish position */}
      <line
        x1={boatToSvgX(handleTipXRotatedBoatFinish)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(handleTipXRotatedBoatFinish)}
        y2={boatToSvgY(handleTipYRotatedBoatFinish)}
        stroke="black"
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />

      {/* Label for finish length */}
      <text
        x={boatToSvgX(handleTipXRotatedBoatFinish / 2)}
        y={finishTextYPosition} 
        fontFamily="Arial"
        fontSize={pixelsToCm(12)}
        fill="green"
        textAnchor="middle"
      >
        {`Finish Length: ${Math.abs(horizontalDistanceFinish)} cm`}
      </text>

      {/* --- Total Work Distance --- */}
      <text
        x={boatToSvgX(0)}
        y={workTextYPosition}
        fontFamily="Arial"
        fontSize={pixelsToCm(12)}
        fill="black"
        textAnchor="middle"
      >
        {`Work Distance: ${(
          Math.abs(horizontalDistanceCatch) + Math.abs(horizontalDistanceFinish)
        ).toFixed(2)} cm`}
      </text>
    </>
  );
};

export default LengthLines;
