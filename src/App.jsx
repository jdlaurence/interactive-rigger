// src/App.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import SVGCanvas from './components/SVGCanvas';
import './App.css';
import { Copyright } from './components/Copyright';

function App() {
  // State variables
  const [spread, setSpread] = useState(80); // in cm
  const [inboard, setInboard] = useState(114); // in cm; from our actual oars
  const [outboard, setOutboard] = useState(370 - 114); // in cm
  const [catchAngle, setCatchAngle] = useState(55);
  const [finishAngle, setFinishAngle] = useState(-35);
  const [catchLength, setCatchLength] = useState(200); // in cm
  const [finishLength, setFinishLength] = useState(200); // in cm
  const [oarAngle, setOarAngle] = useState(0);

  // Conversion factor
  const pixelsPerCm = 1;

  // SVG dimensions in cm
  const svgWidthCm = 500;
  const svgHeightCm = 700;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#eef2f5',
        overflow: 'hidden',
      }}
    >
      {/* SVG Canvas */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
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
      </Box>

      {/* Control Panel */}
      <Box
        sx={{
          position: 'absolute',
          top: 4,
          left: 4, 
          width: "150px", 
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#f9f9f9',
          boxShadow: 3, 
          borderRadius: 2,
          padding: 1, 
          zIndex: 10, 
        }}
      >
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
      </Box>
      <Box sx={{ position: 'absolute', bottom: 200, left: 0 }}>
      <Copyright />
      </Box>
    </Box>
  );
}

export default App;
