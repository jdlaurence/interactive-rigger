// src/components/GuideLines.jsx
import React from 'react';

const GuideLines = ({ boatToSvgX, boatToSvgY, pixelsToCm }) => {
  return (
    <>
      {/* Vertical Guide Line (centerline / pin axis) */}
      <line
        x1={boatToSvgX(0)}
        y1={boatToSvgY(200)}
        x2={boatToSvgX(0)}
        y2={boatToSvgY(-20)}
        stroke="#8a97a3"
        strokeOpacity={0.85}
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />
      {/* Horizontal Guide Line (athwartships through the work-through) */}
      <line
        x1={boatToSvgX(-200)}
        y1={boatToSvgY(0)}
        x2={boatToSvgX(200)}
        y2={boatToSvgY(0)}
        stroke="#8a97a3"
        strokeOpacity={0.85}
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />
    </>
  );
};

export default GuideLines;
