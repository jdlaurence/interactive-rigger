// src/components/Oar.jsx
import React from 'react';

const Oar = ({
  oarImage,
  collarImage,
  collarXBoat,
  collarYBoat,
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
  const inboardBaseline = 114; // based on original oar image
  const inboardDiff = inboard - inboardBaseline;
  const collarYInImageAdjusted = collarYInImage + inboardDiff;

  return (
    <>
      <g
        transform={`
          translate(${boatToSvgX(collarXBoat)}, ${boatToSvgY(collarYBoat)})
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
      <g
        transform={`
          translate(${boatToSvgX(collarXBoat)}, ${boatToSvgY(collarYBoat)})
          rotate(${oarAngle})
        `}
      >
        <image
          href={collarImage}
          x={-collarXInImage}
          y={-collarYInImageAdjusted}
          width={oarImageWidth}
          height={oarImageHeight}
        />
      </g>
    </>
  );
};

export default Oar;
