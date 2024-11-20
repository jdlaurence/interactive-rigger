// src/App.js
import { useState, useEffect } from 'react';
import './App.css';
import { calcOarSpread } from './utils';
import ControlPanel from './components/ControlPanel';
import SVGCanvas from './components/SVGCanvas';

function App() {
  // State variables
  const [spread, setSpread] = useState(80); // in cm
  const [inboard, setInboard] = useState(114); // in cm; from our actual oars
  const [outboard, setOutboard] = useState(370 - 114); // in cm
  const [catchAngle, setCatchAngle] = useState(45);
  const [finishAngle, setFinishAngle] = useState(-45);
  const [catchLength, setCatchLength] = useState(200); // in cm
  const [finishLength, setFinishLength] = useState(200); // in cm
  const [oarAngle, setOarAngle] = useState(0);

  // Conversion factor
  const pixelsPerCm = 1;

  // SVG dimensions in cm
  const svgWidthCm = 500;
  const svgHeightCm = 700;

  return (
    <div className="App">
      <ControlPanel
        oarAngle={oarAngle}
        setOarAngle={setOarAngle}
        spread={spread}
        setSpread={setSpread}
        inboard={inboard}
        setInboard={setInboard}
        outboard={outboard}
        setOutboard={setOutboard}
        catchAngle={catchAngle}
        setCatchAngle={setCatchAngle}
        finishAngle={finishAngle}
        setFinishAngle={setFinishAngle}
        catchLength={catchLength}
        setCatchLength={setCatchLength}
        finishLength={finishLength}
        setFinishLength={setFinishLength}
      />
      <SVGCanvas
        spread={spread}
        inboard={inboard}
        outboard={outboard}
        catchAngle={catchAngle}
        finishAngle={finishAngle}
        catchLength={catchLength}
        finishLength={finishLength}
        pixelsPerCm={pixelsPerCm}
        svgWidthCm={svgWidthCm}
        svgHeightCm={svgHeightCm}
      />
    </div>
  );
}

export default App;
