// Oarlock.jsx
import React from 'react';

const Oarlock = ({ cx, cy, angle, rectWidth, rectHeight, circleRadius }) => {
  const rectX = cx - rectWidth;
  const rectY = cy - rectHeight / 2;

  return (
    <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
      {/* Oarlock gate body (black plastic) */}
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        rx={rectHeight * 0.35}
        fill="#2a2e33"
        stroke="#0e1113"
        strokeWidth={0.8}
      />
      {/* Face highlight on the gate */}
      <rect
        x={rectX + 0.5}
        y={rectY + 0.5}
        width={rectWidth - 1}
        height={rectHeight * 0.4}
        rx={rectHeight * 0.3}
        fill="#4a525a"
        opacity={0.65}
      />
      {/* Metallic pin */}
      <circle cx={cx} cy={cy} r={circleRadius} fill="#d2d8de" stroke="#6b7177" strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={circleRadius * 0.45} fill="#7e868f" />
    </g>
  );
};

export default Oarlock;
