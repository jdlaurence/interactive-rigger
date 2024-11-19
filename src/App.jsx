import { useState } from 'react';
import oar from './assets/Oar.svg';
import './App.css';
import { calcOarSpread } from './utils';

function App() {
  // Existing state variables
  const [spread, setSpread] = useState(80);
  const [inboard, setInboard] = useState(spread + 30); // following Purcer recommendation
  const [outboard, setOutboard] = useState(370 - inboard); // typical C2 length
  const [catchAngle, setCatchAngle] = useState(45);
  const [finishAngle, setFinishAngle] = useState(45);
  const [catchLength, setCatchLength] = useState(200);
  const [finishLength, setFinishLength] = useState(200);
  const [workDistance, setWorkDistance] = useState(catchLength + finishLength);
  const [oarSpread, setOarSpread] = useState(calcOarSpread(inboard, catchAngle)); // straight line distance from Pin to handle tip

  // New state for oar angle
  const [oarAngle, setOarAngle] = useState(0);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 800;

  // Hull variables
  const hullLength = 300;
  const gunwaleWidth = 5;
  const hullStartX = (svgWidth - hullLength) / 2; // Centered horizontally
  const hullEndX = hullStartX + hullLength;

  // Hull positions
  const hullYPosition = 430; // Base Y position for the first hull section
  const hullWidth = 60; // Vertical gap between the two hull sections

  // Hull lines Y positions
  const hullLine1Y = hullYPosition - gunwaleWidth; // Top line of first section
  const hullLine2Y = hullYPosition; // Bottom line of first section
  const hullLine3Y = hullYPosition + hullWidth; // Top line of second section
  const hullLine4Y = hullLine3Y + gunwaleWidth; // Bottom line of second section

  // Guide lines
  const verticalGuideLineX = svgWidth / 2;
  const verticalGuideLineYStart = 100;
  const verticalGuideLineYEnd = hullLine2Y + 50;

  const horizontalGuideLineY = hullLine3Y - 30;
  const horizontalGuideLineXStart = hullStartX + 50;
  const horizontalGuideLineXEnd = hullEndX - 50;

  // Text positions
  const catchTextX = horizontalGuideLineXStart;
  const catchTextY = horizontalGuideLineY - 5;

  const finishTextX = horizontalGuideLineXEnd - 130;
  const finishTextY = catchTextY;

  // Pivot point coordinates
  const pivotX = verticalGuideLineX;
  const pivotY = hullLine1Y - 80;

  // Oar image dimensions and position
  const oarImageWidth = 500;
  const oarImageHeight = 500;
  const oarImageX = pivotX - oarImageWidth / 2;
  const oarImageY = 0;

  // Calculate the handle tip position after rotation
  // Step 1: Coordinates of the handle tip before rotation
  const handleTipXBefore = oarImageX + oarImageWidth / 2;
  const handleTipYBefore = oarImageY + oarImageHeight;

  // Step 2: Translate coordinates relative to the pivot
  const dx = handleTipXBefore - pivotX;
  const dy = handleTipYBefore - pivotY;

  // Step 3: Convert angle to radians
  const theta = (oarAngle * Math.PI) / 180;

  // Step 4: Apply rotation
  const dxRotated = dx * Math.cos(theta) - dy * Math.sin(theta);
  const dyRotated = dx * Math.sin(theta) + dy * Math.cos(theta);

  // Step 5: Translate back to SVG coordinates
  const handleTipXAfter = dxRotated + pivotX;
  const handleTipYAfter = dyRotated + pivotY;

  // Step 6: Compute horizontal distance
  const horizontalDistance = Math.abs(handleTipXAfter - pivotX).toFixed(2);

  // Step 7: Decide whether it's catch length or finish length
  let catchLengthLine = null;
  let catchLengthPerpendicularLine = null;
  let finishLengthLine = null;
  let finishLengthPerpendicularLine = null;
  let catchLengthText = null;
  let finishLengthText = null;

  if (oarAngle > 0) {
    // Positive angle, it's catch length
    catchLengthLine = (
      <line
        x1={handleTipXAfter}
        y1={horizontalGuideLineY}
        x2={pivotX}
        y2={horizontalGuideLineY}
        stroke="blue"
        strokeWidth="2"
      />
    );
    catchLengthPerpendicularLine = (
      <line
        x1={handleTipXAfter}
        y1={horizontalGuideLineY}
        x2={handleTipXAfter}
        y2={handleTipYAfter}
        stroke="black"
        strokeDasharray="5,5"
      />
    );
    catchLengthText = (
      <text
        x={(handleTipXAfter + pivotX) / 2}
        y={horizontalGuideLineY - 7}
        fontFamily="Arial"
        fontSize="12"
        fill="blue"
        textAnchor="middle"
      >
        Catch Length: {horizontalDistance}
      </text>
    );
  } else if (oarAngle < 0) {
    // Negative angle, it's finish length
    finishLengthLine = (
      <line
        x1={handleTipXAfter}
        y1={horizontalGuideLineY}
        x2={pivotX}
        y2={horizontalGuideLineY}
        stroke="green"
        strokeWidth="2"
      />
    );
    finishLengthPerpendicularLine = (
      <line
        x1={handleTipXAfter}
        y1={horizontalGuideLineY}
        x2={handleTipXAfter}
        y2={handleTipYAfter}
        stroke="black"
        strokeDasharray="5,5"
      />
    );

    finishLengthText = (
      <text
        x={(handleTipXAfter + pivotX) / 2}
        y={horizontalGuideLineY - 7}
        fontFamily="Arial"
        fontSize="12"
        fill="green"
        textAnchor="middle"
      >
        Finish Length: {horizontalDistance}
      </text>
    );
  }

  return (
    <>
      <div>
        {/* Slider to adjust the oar angle */}
        <div style={{ marginBottom: '20px' }}>
          <label>Angle: {oarAngle}°</label>
          <input
            type="range"
            min="-90"
            max="90"
            value={oarAngle}
            onChange={(e) => setOarAngle(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Hull */}
          <line
            x1={hullStartX}
            y1={hullLine1Y}
            x2={hullEndX}
            y2={hullLine1Y}
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1={hullStartX}
            y1={hullLine2Y}
            x2={hullEndX}
            y2={hullLine2Y}
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1={hullStartX}
            y1={hullLine3Y}
            x2={hullEndX}
            y2={hullLine3Y}
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1={hullStartX}
            y1={hullLine4Y}
            x2={hullEndX}
            y2={hullLine4Y}
            stroke="black"
            strokeWidth="2"
          />

          {/* Guide Lines */}
          <line
            x1={verticalGuideLineX}
            y1={verticalGuideLineYStart}
            x2={verticalGuideLineX}
            y2={verticalGuideLineYEnd}
            stroke="black"
            strokeDasharray="5,5"
          />
          <line
            x1={horizontalGuideLineXStart}
            y1={horizontalGuideLineY}
            x2={horizontalGuideLineXEnd}
            y2={horizontalGuideLineY}
            stroke="black"
            strokeDasharray="5,5"
          />

          {/* Dynamic Catch/Finish Length Lines and Text */}
          {catchLengthLine}
          {catchLengthPerpendicularLine}
          {catchLengthText}
          {finishLengthLine}
          {finishLengthPerpendicularLine}
          {finishLengthText}

          {/* Pivot point visualization */}
          <circle cx={pivotX} cy={pivotY} r="5" fill="red" />

          {/* Oar SVG with rotation around the pivot point */}
          <g transform={`rotate(${oarAngle}, ${pivotX}, ${pivotY})`}>
            <image
              href={oar}
              x={oarImageX}
              y={oarImageY}
              width={oarImageWidth}
              height={oarImageHeight}
            />
          </g>
        </svg>
      </div>
    </>
  );
}

export default App;
