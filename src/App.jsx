// src/App.jsx
import React, { useState } from 'react';
import { Box, AppBar, Toolbar } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import SVGCanvas from './components/SVGCanvas';
import { SiteHeader } from './components/SiteHeader';

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
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#eef2f5',
      }}
    >
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <SiteHeader />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {/* Control Panel */}
        <Box
          sx={{
            width: 200,
            maxHeight: '100%',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            boxShadow: 3,
            padding: 2,
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

        {/* SVG Canvas */}
        <Box
          sx={{
            flexGrow: 1,
            width: '700px',
            height: '100%',
            overflowY: 'auto',
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
      </Box>
    </Box>
  );
}

export default App;
