// Oarlock.jsx
import React from 'react';

const Oarlock = ({ cx, cy, angle, rectWidth, rectHeight, circleRadius }) => {
  const rectX = cx - rectWidth;
  const rectY = cy - rectHeight / 2;

  return (
    <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
      
      {/* Rectangle representing the oarlock */}
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        fill="grey"
      />
    
      {/* Circle representing the pin */}
      <circle cx={cx} cy={cy} r={circleRadius} fill="black" />

      
    </g>
  );
};

export default Oarlock;
