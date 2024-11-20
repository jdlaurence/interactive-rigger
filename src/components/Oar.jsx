// src/components/Oar.jsx
import React from 'react';

const Oar = ({
  oarImage,
  oarImageXBoat,
  oarImageYBoat,
  oarImageWidth,
  oarImageHeight,
  oarAngle,
  boatToSvgX,
  boatToSvgY,
  pivotXBoat,
  pivotYBoat,
}) => {
  return (
    <g transform={`rotate(${oarAngle}, ${boatToSvgX(pivotXBoat)}, ${boatToSvgY(pivotYBoat)})`}>
      <image
        href={oarImage}
        x={boatToSvgX(oarImageXBoat)}
        y={boatToSvgY(oarImageYBoat)}
        width={oarImageWidth}
        height={oarImageHeight}
      />
    </g>
  );
};

export default Oar;
