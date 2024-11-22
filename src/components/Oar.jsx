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
  inboard,
}) => {
  // **Determine collar position within the oar image (image coordinate space)**
  const collarXInImage = oarImageWidth / 2; // Horizontal center of the image
  const collarYInImage = oarImageHeight - inboard; // Vertical position based on inboard length

  // **Adjust collar position for changes in inboard length**
  const inboardBaseline = 114; // Baseline inboard length based on original oar image
  const inboardDiff = inboard - inboardBaseline; // Difference from baseline
  const collarYInImageAdjusted = collarYInImage + inboardDiff; // Adjusted vertical position

  return (
    // **Group the oar and collar images together for shared transformation**
    <g
      transform={`
        translate(${boatToSvgX(collarXBoat)}, ${boatToSvgY(collarYBoat)})
        rotate(${oarAngle})
      `}
    >
      {/* Render the oar image */}
      <image
        href={oarImage}
        x={-collarXInImage}
        y={-collarYInImage}
        width={oarImageWidth}
        height={oarImageHeight}
      />

      {/* Render the collar image on top, adjusted for inboard length */}
      <image
        href={collarImage}
        x={-collarXInImage}
        y={-collarYInImageAdjusted}
        width={oarImageWidth}
        height={oarImageHeight}
      />
    </g>
  );
};

export default Oar;
