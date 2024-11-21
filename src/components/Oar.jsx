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
  inboard,
}) => {


    // Collar point in image coordinates
    const collarXInImage = oarImageWidth / 2;
    const collarYInImage = oarImageHeight - inboard;

    
  return (
    <g
      transform={`
        translate(${boatToSvgX(oarImageXBoat)}, ${boatToSvgY(oarImageYBoat)})
        rotate(${oarAngle})
      `}
    >
      <image
        href={oarImage}
        x={-collarXInImage}
        y={-collarYInImage}
        width={oarImageWidth}
        height={oarImageHeight}
      />
     </g>
  );
};

export default Oar;
