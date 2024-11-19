import { useState } from 'react';
import oar from './assets/Oar.svg';
import './App.css';
import { calcOarSpread } from './utils';

function App() {
  const [spread, setSpread] = useState(80); // in cm
  const [inboard, setInboard] = useState(spread + 30); // in cm
  const [outboard, setOutboard] = useState(370 - inboard); // in cm
  const [catchAngle, setCatchAngle] = useState(45);
  const [finishAngle, setFinishAngle] = useState(45);
  const [catchLength, setCatchLength] = useState(200); // in cm
  const [finishLength, setFinishLength] = useState(200); // in cm
  const [workDistance, setWorkDistance] = useState(catchLength + finishLength);
  const [oarSpread, setOarSpread] = useState(calcOarSpread(inboard, catchAngle));

  const [oarAngle, setOarAngle] = useState(0);

  // Conversion factor
  const pixelsPerCm = 1;

  // SVG dimensions in cm
  const svgWidthCm = 450;
  const svgHeightCm = 450;

  // Hull variables in cm
  const hullLength = 325;
  const gunwaleWidth = 5;
  const hullStartX = (svgWidthCm - hullLength) / 2;
  const hullEndX = hullStartX + hullLength;

  // Hull positions in cm
  const hullYPosition = 86;
  const hullWidth = 30;

  // Hull lines Y positions in cm
  const hullLine1Y = hullYPosition - gunwaleWidth;
  const hullLine2Y = hullYPosition;
  const hullLine3Y = hullYPosition + hullWidth;
  const hullLine4Y = hullLine3Y + gunwaleWidth;

  // Guide lines in cm
  const verticalGuideLineX = svgWidthCm / 2;
  const verticalGuideLineYStart = 20;
  const verticalGuideLineYEnd = hullLine2Y + 10;

  const horizontalGuideLineY = hullLine3Y - 6;
  const horizontalGuideLineXStart = hullStartX + 10;
  const horizontalGuideLineXEnd = hullEndX - 10;

  // Pivot point coordinates in cm
  const pivotX = verticalGuideLineX;
  const pivotY = hullLine1Y - 16;

  // Oar image dimensions and position in cm
  const oarImageWidth = 100;
  const oarImageHeight = 100;
  const oarImageX = pivotX - oarImageWidth / 2;
  const oarImageY = 0;

  // Handle tip calculations in cm
  const handleTipXBefore = oarImageX + oarImageWidth / 2;
  const handleTipYBefore = oarImageY + oarImageHeight;

  const dx = handleTipXBefore - pivotX;
  const dy = handleTipYBefore - pivotY;
  const theta = (oarAngle * Math.PI) / 180;

  console.log('dx * cos(theta):', dx * Math.cos(theta));
  console.log('dy * sin(theta):', dy * Math.sin(theta));
  const dxRotated = dx * Math.cos(theta) - dy * Math.sin(theta);
  const dyRotated = dx * Math.sin(theta) + dy * Math.cos(theta);

  const handleTipXAfter = dxRotated + pivotX;
  const handleTipYAfter = dyRotated + pivotY;

  const horizontalDistance = Math.abs(handleTipXAfter - pivotX).toFixed(2);

  // Helper function to convert pixels to cm
  const pixelsToCm = (pixels) => pixels / pixelsPerCm;

  // Decide whether it's catch length or finish length
  let lengthLine = null;
  let lengthPerpendicularLine = null;
  let lengthText = null;

  if (oarAngle !== 0) {
    lengthLine = (
      <line
        x1={handleTipXAfter}
        y1={horizontalGuideLineY}
        x2={pivotX}
        y2={horizontalGuideLineY}
        stroke={oarAngle > 0 ? 'blue' : 'green'}
        strokeWidth={pixelsToCm(2)}
      />
    );
    lengthPerpendicularLine = (
      <line
        x1={handleTipXAfter}
        y1={horizontalGuideLineY}
        x2={handleTipXAfter}
        y2={handleTipYAfter}
        stroke="black"
        strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
      />
    );
    lengthText = (
      <text
        x={(handleTipXAfter + pivotX) / 2}
        y={horizontalGuideLineY - 1.4}
        fontFamily="Arial"
        fontSize={pixelsToCm(12)}
        fill={oarAngle > 0 ? 'blue' : 'green'}
        textAnchor="middle"
      >
        {oarAngle > 0 ? `Catch Length: ${horizontalDistance}` : `Finish Length: ${horizontalDistance}`}
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
          width={svgWidthCm * pixelsPerCm}
          height={svgHeightCm * pixelsPerCm}
          viewBox={`0 0 ${svgWidthCm} ${svgHeightCm}`}
        >
          {/* Hull */}
          <line
            x1={hullStartX}
            y1={hullLine1Y}
            x2={hullEndX}
            y2={hullLine1Y}
            stroke="black"
            strokeWidth={pixelsToCm(2)}
          />
          <line
            x1={hullStartX}
            y1={hullLine2Y}
            x2={hullEndX}
            y2={hullLine2Y}
            stroke="black"
            strokeWidth={pixelsToCm(2)}
          />
          <line
            x1={hullStartX}
            y1={hullLine3Y}
            x2={hullEndX}
            y2={hullLine3Y}
            stroke="black"
            strokeWidth={pixelsToCm(2)}
          />
          <line
            x1={hullStartX}
            y1={hullLine4Y}
            x2={hullEndX}
            y2={hullLine4Y}
            stroke="black"
            strokeWidth={pixelsToCm(2)}
          />


          {/* Guide Lines */}
          <line
            x1={verticalGuideLineX}
            y1={verticalGuideLineYStart}
            x2={verticalGuideLineX}
            y2={verticalGuideLineYEnd}
            stroke="black"
            strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
          />
          <line
            x1={horizontalGuideLineXStart}
            y1={horizontalGuideLineY}
            x2={horizontalGuideLineXEnd}
            y2={horizontalGuideLineY}
            stroke="black"
            strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
          />

          {/* Dynamic Length Lines and Text */}
          {lengthLine}
          {lengthPerpendicularLine}
          {lengthText}

          {/* Pivot point visualization */}
          <circle cx={pivotX} cy={pivotY} r={pixelsToCm(5)} fill="red" />

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
