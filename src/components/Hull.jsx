// src/components/Hull.jsx
import React from 'react';

const Hull = ({
  hullStartXBoat,
  hullEndXBoat,
  hullWidth,
  gunwaleWidth,
  boatToSvgX,
  boatToSvgY,
  pixelsToCm,
}) => {
  const hullLines = [
    hullWidth / 2 - gunwaleWidth,
    hullWidth / 2,
    -hullWidth / 2,
    -hullWidth / 2 + gunwaleWidth,
  ];

  return (
    <>
      {hullLines.map((yBoat, index) => (
        <line
          key={index}
          x1={boatToSvgX(hullStartXBoat)}
          y1={boatToSvgY(yBoat)}
          x2={boatToSvgX(hullEndXBoat)}
          y2={boatToSvgY(yBoat)}
          stroke="black"
          strokeWidth={pixelsToCm(2)}
        />
      ))}
    </>
  );
};

export default Hull;
