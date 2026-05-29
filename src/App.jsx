// src/App.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ControlPanel from './components/ControlPanel';
import SVGCanvas from './components/SVGCanvas';
import { SiteHeader } from './components/SiteHeader';
import {
  processOarAngle,
  computeMetrics,
  checkRanges,
  OARLOCK_WIDTH,
  OARLOCK_DEPTH,
} from './utils';
import { applyPreset, getRanges } from './rigData';

const DRAWER_WIDTH = 344;

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // **Primary rigging inputs (all measurements in centimeters unless noted)**
  const [spread, setSpread] = useState(84); // Hull center-line to oarlock pin
  const [inboard, setInboard] = useState(114); // Handle end to collar (blade side)
  const [totalLength, setTotalLength] = useState(370); // Full oar length (club-fixed; editable as a club setting)
  const [catchAngle, setCatchAngle] = useState(60); // Oar angle at the catch (deg)
  const [finishAngle, setFinishAngle] = useState(-35); // Oar angle at the finish (deg)

  // **Coaching context + display options**
  const [crewType, setCrewType] = useState('hwtMen');
  const [boatClass, setBoatClass] = useState('eight');

  // **Outboard is derived — total length minus inboard.**
  const outboard = totalLength - inboard;

  // **Conversion factor for scaling**
  const pixelsPerCm = 1; // 1 pixel per centimeter

  // **Coordinate-origin reference for the plan view (cm).**
  const svgWidthCm = 500;
  const svgHeightCm = 700;

  // **Derived geometry + metrics (single source of truth, flows downward).**
  const { processedCatch, processedFinish, metrics } = useMemo(() => {
    const pivotXBoat = 0;
    const pivotYBoat = spread;
    const pCatch = processOarAngle(
      pivotXBoat,
      pivotYBoat,
      inboard,
      OARLOCK_WIDTH,
      OARLOCK_DEPTH,
      catchAngle
    );
    const pFinish = processOarAngle(
      pivotXBoat,
      pivotYBoat,
      inboard,
      OARLOCK_WIDTH,
      OARLOCK_DEPTH,
      finishAngle
    );
    return {
      processedCatch: pCatch,
      processedFinish: pFinish,
      metrics: computeMetrics({
        spread,
        inboard,
        outboard,
        catchAngle,
        finishAngle,
        processedCatch: pCatch,
        processedFinish: pFinish,
      }),
    };
  }, [spread, inboard, outboard, catchAngle, finishAngle]);

  // **Recommended ranges for the active crew/boat, and per-field status.**
  const ranges = useMemo(() => getRanges(crewType, boatClass), [crewType, boatClass]);
  const rangeStatus = useMemo(
    () =>
      checkRanges(
        {
          spread,
          inboard,
          totalLength: metrics.totalLength,
          loadRatio: metrics.loadRatio,
          totalArc: metrics.totalArc,
        },
        ranges
      ),
    [spread, inboard, metrics, ranges]
  );

  // **Apply a crew/boat preset to all the inputs it controls.**
  const applyRig = (crew, boat) => {
    const rig = applyPreset(crew, boat);
    if (!rig) return;
    setSpread(rig.spread);
    setInboard(rig.inboard);
    setTotalLength(rig.totalLength);
    setCatchAngle(rig.catchAngle);
    setFinishAngle(rig.finishAngle);
  };

  const handleCrewChange = (newCrew) => {
    setCrewType(newCrew);
    if (newCrew !== 'custom') applyRig(newCrew, boatClass);
  };

  const handleBoatChange = (newBoat) => {
    setBoatClass(newBoat);
    if (crewType !== 'custom') applyRig(crewType, newBoat);
  };

  // **Wrapped setters: a manual edit drops the active preset to "custom".**
  const editValue = (setter) => (value) => {
    setter(value);
    setCrewType('custom');
  };

  const controls = (
    <ControlPanel
      spread={spread}
      setSpread={editValue(setSpread)}
      inboard={inboard}
      setInboard={editValue(setInboard)}
      totalLength={totalLength}
      setTotalLength={editValue(setTotalLength)}
      outboard={outboard}
      catchAngle={catchAngle}
      setCatchAngle={editValue(setCatchAngle)}
      finishAngle={finishAngle}
      setFinishAngle={editValue(setFinishAngle)}
      crewType={crewType}
      onCrewChange={handleCrewChange}
      boatClass={boatClass}
      onBoatChange={handleBoatChange}
      metrics={metrics}
      rangeStatus={rangeStatus}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open controls"
              onClick={() => setDrawerOpen(true)}
              sx={{ fontSize: 22, lineHeight: 1 }}
            >
              ☰
            </IconButton>
          )}
          <SiteHeader />
        </Toolbar>
      </AppBar>

      {/* Body: sidebar + main viz */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Desktop: permanent sidebar */}
        {!isMobile && (
          <Box
            component="aside"
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              height: '100%',
              overflowY: 'auto',
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            {controls}
          </Box>
        )}

        {/* Mobile: temporary drawer */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton aria-label="close controls" onClick={() => setDrawerOpen(false)}>
                ✕
              </IconButton>
            </Box>
            {controls}
          </Drawer>
        )}

        {/* Main visualization area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, md: 1.5 },
            p: { xs: 1, md: 2 },
            bgcolor: 'background.default',
            overflow: 'hidden',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              minHeight: 0,
              border: 1,
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <SVGCanvas
              spread={spread}
              inboard={inboard}
              outboard={outboard}
              catchAngle={catchAngle}
              finishAngle={finishAngle}
              processedCatch={processedCatch}
              processedFinish={processedFinish}
              metrics={metrics}
              pixelsPerCm={pixelsPerCm}
              svgWidthCm={svgWidthCm}
              svgHeightCm={svgHeightCm}
            />
          </Paper>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}
          >
            © 2026 J.D. Laurence-Chasen. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
