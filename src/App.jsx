// src/App.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ControlPanel from './components/ControlPanel';
import SVGCanvas from './components/SVGCanvas';
import { SiteHeader } from './components/SiteHeader';
import InfoDialog from './components/InfoDialog';
import {
  processOarAngle,
  computeMetrics,
  classifyGearing,
  classifyArc,
  OARLOCK_WIDTH,
  OARLOCK_DEPTH,
} from './utils';
import { applyPreset, getRanges } from './rigData';

const DRAWER_WIDTH = 344;

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [infoOpen, setInfoOpen] = useState(false);

  // **Primary rigging inputs (all measurements in centimeters unless noted)**
  // Defaults match the High School Boys preset (the club's headline rig).
  const [spread, setSpread] = useState(84); // Hull center-line to oarlock pin
  const [inboard, setInboard] = useState(114); // Handle end to collar (blade side)
  const [totalLength, setTotalLength] = useState(374); // Full oar length (club-fixed; editable as a club setting)
  const [catchAngle, setCatchAngle] = useState(58); // Oar angle at the catch (deg)
  const [finishAngle, setFinishAngle] = useState(-34); // Oar angle at the finish (deg)

  // **Coaching context + display options**
  const [crewType, setCrewType] = useState('hsBoys');
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

  // **Recommended ranges for the active crew/boat (drive the indicator bands).**
  const ranges = useMemo(() => getRanges(crewType, boatClass), [crewType, boatClass]);

  // **Reference rig: the preset for the selected crew/boat. This stays fixed as
  // the user edits, so the live rig can always be compared against it. The
  // geometry (catch/finish oar center-lines + pin) is pre-computed here so the
  // canvas can ghost it, and the metrics drive the reference text + indicators.**
  const referenceRig = useMemo(() => applyPreset(crewType, boatClass), [crewType, boatClass]);
  const reference = useMemo(() => {
    if (!referenceRig) return null;
    const { spread: rS, inboard: rIn, totalLength: rLen, catchAngle: rC, finishAngle: rF } = referenceRig;
    const rOut = rLen - rIn;
    const pc = processOarAngle(0, rS, rIn, OARLOCK_WIDTH, OARLOCK_DEPTH, rC);
    const pf = processOarAngle(0, rS, rIn, OARLOCK_WIDTH, OARLOCK_DEPTH, rF);
    // Blade tip in boat space: pin is at (0, spread); blade is `outboard` beyond.
    const blade = (hx, hy) => {
      const dx = 0 - hx;
      const dy = rS - hy;
      const L = Math.hypot(dx, dy) || 1;
      return { x: (dx / L) * rOut, y: rS + (dy / L) * rOut };
    };
    return {
      rig: referenceRig,
      metrics: computeMetrics({
        spread: rS,
        inboard: rIn,
        outboard: rOut,
        catchAngle: rC,
        finishAngle: rF,
        processedCatch: pc,
        processedFinish: pf,
      }),
      // Enough to re-draw the reference oar artwork as a ghost: collar anchor +
      // angle for each oar, plus the inboard the artwork is positioned against.
      inboard: rIn,
      pin: { x: 0, y: rS },
      catch: {
        angle: rC,
        collar: { x: pc.collarXBoat, y: pc.collarYBoat },
        handle: { x: pc.handleTipXRotatedBoat, y: pc.handleTipYRotatedBoat },
        blade: blade(pc.handleTipXRotatedBoat, pc.handleTipYRotatedBoat),
      },
      finish: {
        angle: rF,
        collar: { x: pf.collarXBoat, y: pf.collarYBoat },
        handle: { x: pf.handleTipXRotatedBoat, y: pf.handleTipYRotatedBoat },
        blade: blade(pf.handleTipXRotatedBoat, pf.handleTipYRotatedBoat),
      },
    };
  }, [referenceRig]);

  // **Has the live rig been edited away from the reference preset?**
  const isEdited = useMemo(() => {
    if (!referenceRig) return false;
    const eq = (a, b) => Math.abs(a - b) < 1e-3;
    return !(
      eq(spread, referenceRig.spread) &&
      eq(inboard, referenceRig.inboard) &&
      eq(totalLength, referenceRig.totalLength) &&
      eq(catchAngle, referenceRig.catchAngle) &&
      eq(finishAngle, referenceRig.finishAngle)
    );
  }, [spread, inboard, totalLength, catchAngle, finishAngle, referenceRig]);

  // **Colour-mapped verdicts: gearing (Light/Balanced/Heavy) + arc (Short/Balanced/Long).
  // The band is the reference window; the marker is the live rig; the ghost tick
  // is the reference value.**
  const gearing = useMemo(
    () => classifyGearing(metrics.loadRatio, ranges.loadRatio, reference?.metrics.loadRatio),
    [metrics.loadRatio, ranges.loadRatio, reference]
  );
  const arc = useMemo(
    () => classifyArc(metrics.totalArc, ranges.totalArc, reference?.metrics.totalArc),
    [metrics.totalArc, ranges.totalArc, reference]
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

  // Selecting a crew or boat loads its preset; editing afterwards keeps the crew
  // selected (it stays the reference) — the live rig simply diverges from it.
  const handleCrewChange = (newCrew) => {
    setCrewType(newCrew);
    applyRig(newCrew, boatClass);
  };
  const handleBoatChange = (newBoat) => {
    setBoatClass(newBoat);
    applyRig(crewType, newBoat);
  };
  const handleReset = () => applyRig(crewType, boatClass);

  const controls = (
    <ControlPanel
      spread={spread}
      setSpread={setSpread}
      inboard={inboard}
      setInboard={setInboard}
      totalLength={totalLength}
      setTotalLength={setTotalLength}
      outboard={outboard}
      catchAngle={catchAngle}
      setCatchAngle={setCatchAngle}
      finishAngle={finishAngle}
      setFinishAngle={setFinishAngle}
      crewType={crewType}
      onCrewChange={handleCrewChange}
      boatClass={boatClass}
      onBoatChange={handleBoatChange}
      metrics={metrics}
      gearing={gearing}
      arc={arc}
      reference={reference}
      isEdited={isEdited}
      onReset={handleReset}
    />
  );

  const canvas = (
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
      showGhost={isEdited}
      reference={reference}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <SiteHeader />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="about the numbers"
            onClick={() => setInfoOpen(true)}
            sx={{ fontSize: 22, lineHeight: 1 }}
          >
            ⚙
          </IconButton>
        </Toolbar>
      </AppBar>

      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />

      {/* Body. Desktop: controls in a fixed sidebar beside the viz. Mobile:
          the viz is pinned to the top of the page and the controls scroll
          underneath it. */}
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* Viz pinned at the top — fixed height, never scrolls away */}
          <Box
            sx={{
              flexShrink: 0,
              height: '42vh',
              p: 1,
              bgcolor: 'background.default',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                height: '100%',
                border: 1,
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              {canvas}
            </Paper>
          </Box>

          {/* Controls below — the scrollable region */}
          <Box
            component="aside"
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            {controls}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Desktop: permanent sidebar */}
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

          {/* Main visualization area */}
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              p: 2,
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
              {canvas}
            </Paper>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'center' }}
            >
              © 2026 J.D. Laurence-Chasen. All rights reserved.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;
