// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import SVGCanvas from './components/SVGCanvas';
import { SiteHeader } from './components/SiteHeader';

function App() {
  // **State variables for rigging parameters (all measurements are in centimeters unless specified)**
  const [spread, setSpread] = useState(80); // Distance between hull center-line and oarlock pin
  const [inboard, setInboard] = useState(114); // Length from the handle end to the collar (blade side)
  const [outboard, setOutboard] = useState(370 - 114); // Length from collar to blade tip
  const [catchAngle, setCatchAngle] = useState(55); // Oar angle at catch position (degrees)
  const [finishAngle, setFinishAngle] = useState(-35); // Oar angle at finish position (degrees)
  const [catchLength, setCatchLength] = useState(80); // Horizontal distance from pin to handle tip at catch
  const [finishLength, setFinishLength] = useState(80); // Horizontal distance from pin to handle tip at finish

  // **Conversion factor for scaling**
  const pixelsPerCm = 1; // 1 pixel per centimeter

  // **Layout dimensions**
  const controlPanelWidth = 200;
  const headerHeight = 80;

  // **SVG canvas dimensions in centimeters**
  const svgWidthCm = 500;
  const svgHeightCm = 700;

  // **State for window size to handle responsive layout**
  const [windowSize, setWindowSize] = useState({
    height: window.innerHeight,
  });

  // **Effect hook to update window size on resize**
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize); // Add event listener
    return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
  }, []);
  
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
          position: 'relative',
        }}
      >
        {/* Control Panel */}
        <Box
          sx={{
            width: controlPanelWidth,
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            top: 64, 
            left: 0, 
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            boxShadow: 3,
            padding: 2,
            paddingTop: 4,
          }}
        >
          <ControlPanel
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
            marginLeft: `${controlPanelWidth}px`,
            height: `${windowSize.height - headerHeight}px`,
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
            setCatchLength={setCatchLength}
            finishLength={finishLength}
            setFinishLength={setFinishLength}
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
