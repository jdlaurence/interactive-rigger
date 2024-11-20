// src/components/GuideLines.jsx
import React from 'react';

const GuideLines = ({ boatToSvgX, boatToSvgY, pixelsToCm }) => {
  return (
    <>
      {/* Vertical Guide Line */}
      <line
        x1={boatToSvgX(0)}
        y1={boatToSvgY(200)}
        x2={boatToSvgX(0)}
        y2={boatToSvgY(-20)}
        stroke="black"
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />
      {/* Horizontal Guide Line */}
      <line
        x1={boatToSvgX(-200)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(200)}
        y2={boatToSvgY(0)}
        stroke="black"
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />
    </>
  );
};

export default GuideLines;
