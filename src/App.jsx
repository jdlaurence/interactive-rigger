// src/App.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import SVGCanvas from './components/SVGCanvas';
import './App.css';

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
    <Box
      sx={{
        position: 'relative', // Establishes a positioning context for the ControlPanel
        width: '100vw',
        height: '100vh',
        backgroundColor: '#eef2f5', // Light background color for contrast
        overflow: 'hidden', // Prevents scrollbars from appearing
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
          top: 4, // 16px from the top
          left: 4, // 16px from the right
          width: { xs: '90%', sm: '150px' }, // Responsive width
          maxHeight: '90vh', // Prevents the panel from exceeding viewport height
          overflowY: 'auto', // Adds scrollbar if content overflows
          backgroundColor: '#f9f9f9',
          boxShadow: 3, // Adds a shadow for depth
          borderRadius: 2, // Rounded corners
          padding: 1, // Padding inside the panel
          zIndex: 10, // Ensures the panel is above the SVGCanvas
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
    </Box>
  );
}

export default App;
