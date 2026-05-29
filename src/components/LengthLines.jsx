// src/components/LengthLines.jsx
import React from 'react';

const LengthLines = ({
  horizontalDistanceCatch,
  horizontalDistanceFinish,
  handleTipXRotatedBoatCatch,
  handleTipYRotatedBoatCatch,
  handleTipXRotatedBoatFinish,
  handleTipYRotatedBoatFinish,
  workDistance,
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

      {/* Horizontal line from handle tip to pivot at catch position (white
          halo underneath so it reads where it crosses the dark hull) */}
      <line
        x1={boatToSvgX(handleTipXRotatedBoatCatch)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(0)}
        y2={boatToSvgY(0)}
        stroke="#ffffff"
        strokeOpacity={0.85}
        strokeWidth={pixelsToCm(4)}
        strokeLinecap="round"
      />
      <line
        x1={boatToSvgX(handleTipXRotatedBoatCatch)}
        y1={boatToSvgY(0)} // Pivot point y-coordinate
        x2={boatToSvgX(0)}
        y2={boatToSvgY(0)}
        stroke="#1565c0"
        strokeWidth={pixelsToCm(2)}
        strokeLinecap="round"
      />

      {/* Vertical dashed line from handle tip to horizontal line at catch position */}
      <line
        x1={boatToSvgX(handleTipXRotatedBoatCatch)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(handleTipXRotatedBoatCatch)}
        y2={boatToSvgY(handleTipYRotatedBoatCatch)}
        stroke="#7a8893"
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />

      {/* Label for catch length */}
      <text
        x={boatToSvgX(handleTipXRotatedBoatCatch / 2)} // Midpoint between handle tip and pivot
        y={catchTextYPosition}
        fontFamily="Inter, system-ui, Arial, sans-serif"
        fontSize={pixelsToCm(12)}
        fontWeight={600}
        fill="#1565c0"
        stroke="#ffffff"
        strokeWidth={pixelsToCm(2.4)}
        paintOrder="stroke"
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
        stroke="#ffffff"
        strokeOpacity={0.85}
        strokeWidth={pixelsToCm(4)}
        strokeLinecap="round"
      />
      <line
        x1={boatToSvgX(handleTipXRotatedBoatFinish)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(0)}
        y2={boatToSvgY(0)}
        stroke="#2e7d32"
        strokeWidth={pixelsToCm(2)}
        strokeLinecap="round"
      />

      {/* Vertical dashed line from handle tip to horizontal line at finish position */}
      <line
        x1={boatToSvgX(handleTipXRotatedBoatFinish)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(handleTipXRotatedBoatFinish)}
        y2={boatToSvgY(handleTipYRotatedBoatFinish)}
        stroke="#7a8893"
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />

      {/* Label for finish length */}
      <text
        x={boatToSvgX(handleTipXRotatedBoatFinish / 2)}
        y={finishTextYPosition}
        fontFamily="Inter, system-ui, Arial, sans-serif"
        fontSize={pixelsToCm(12)}
        fontWeight={600}
        fill="#2e7d32"
        stroke="#ffffff"
        strokeWidth={pixelsToCm(2.4)}
        paintOrder="stroke"
        textAnchor="middle"
      >
        {`Finish Length: ${Math.abs(horizontalDistanceFinish)} cm`}
      </text>

      {/* --- Total Work Distance --- */}
      <text
        x={boatToSvgX(0)}
        y={workTextYPosition}
        fontFamily="Inter, system-ui, Arial, sans-serif"
        fontSize={pixelsToCm(12)}
        fontWeight={600}
        fill="#2b3138"
        stroke="#ffffff"
        strokeWidth={pixelsToCm(2.4)}
        paintOrder="stroke"
        textAnchor="middle"
      >
        {`Work Distance: ${workDistance.toFixed(2)} cm`}
      </text>
    </>
  );
};

export default LengthLines;
