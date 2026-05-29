// src/components/ControlPanel.jsx
import React from 'react';
import {
  Box,
  TextField,
  Slider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Alert,
  Divider,
} from '@mui/material';
import { CREW_PRESETS, BOAT_CLASSES, getCrewPreset } from '../rigData';

// Small "i" affordance that reveals an explanation on hover (no icon package).
const Info = ({ text }) => (
  <Tooltip title={text} arrow placement="top">
    <Box
      component="span"
      sx={{
        ml: 0.5,
        width: 15,
        height: 15,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: 'text.disabled',
        color: 'text.secondary',
        fontSize: 10,
        fontStyle: 'italic',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'help',
        verticalAlign: 'middle',
      }}
    >
      i
    </Box>
  </Tooltip>
);

const fmt = (n, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : '—');

// Section heading.
const Section = ({ children }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ display: 'block', mt: 2, mb: 0.75, lineHeight: 1.3 }}
  >
    {children}
  </Typography>
);

// Inline warning shown under a field when its value is out of the recommended
// range for the active crew/boat.
const FieldWarning = ({ status }) => {
  if (!status || status.status === 'ok') return null;
  return (
    <Alert severity="warning" variant="outlined" sx={{ mt: 0.5, py: 0, fontSize: 12 }}>
      {status.message}
    </Alert>
  );
};

// A labeled metric line with an explanatory tooltip and optional warning color.
const MetricRow = ({ label, value, unit, info, status }) => {
  const color = status && status.status !== 'ok' ? 'warning.main' : 'text.primary';
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.25 }}>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
        {label}
        {info && <Info text={info} />}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color }}>
        {value}
        {unit ? ` ${unit}` : ''}
      </Typography>
    </Box>
  );
};

const ControlPanel = ({
  spread,
  setSpread,
  inboard,
  setInboard,
  totalLength,
  setTotalLength,
  outboard,
  catchAngle,
  setCatchAngle,
  finishAngle,
  setFinishAngle,
  crewType,
  onCrewChange,
  boatClass,
  onBoatChange,
  metrics,
  rangeStatus,
}) => {
  const preset = getCrewPreset(crewType);
  const outboardInvalid = outboard <= 0;

  const numberField = (label, value, onChange, { min, max, step = 0.5, unit = 'cm' }) => (
    <TextField
      label={`${label}${unit ? ` (${unit})` : ''}`}
      type="number"
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      inputProps={{ min, max, step }}
    />
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Preset */}
      <Section>Preset</Section>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ flex: 1.5 }}>
          <InputLabel id="crew-label">Crew</InputLabel>
          <Select
            labelId="crew-label"
            label="Crew"
            value={crewType}
            onChange={(e) => onCrewChange(e.target.value)}
          >
            <MenuItem value="custom">Custom</MenuItem>
            {Object.entries(CREW_PRESETS).map(([key, p]) => (
              <MenuItem key={key} value={key}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel id="boat-label">Boat</InputLabel>
          <Select
            labelId="boat-label"
            label="Boat"
            value={boatClass}
            onChange={(e) => onBoatChange(e.target.value)}
          >
            {Object.entries(BOAT_CLASSES).map(([key, b]) => (
              <MenuItem key={key} value={key}>
                {b.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {preset && preset.notes && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
          {preset.notes}
        </Typography>
      )}

      {/* Dimensions */}
      <Section>Dimensions</Section>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        <Box>
          {numberField('Spread', spread, setSpread, { min: 75, max: 92, step: 0.5 })}
          <FieldWarning status={rangeStatus.spread} />
        </Box>
        <Box>
          {numberField('Oar length', totalLength, setTotalLength, { min: 355, max: 390, step: 0.5 })}
          <FieldWarning status={rangeStatus.totalLength} />
        </Box>
        <Box>
          {numberField('Inboard', inboard, setInboard, { min: 105, max: 124, step: 0.5 })}
          <FieldWarning status={rangeStatus.inboard} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: 1.25,
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            Outboard
            <Info text="Outboard = oar length − inboard. The lever from the collar to the blade — longer means a heavier load." />
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: outboardInvalid ? 'error.main' : 'text.primary' }}
          >
            {fmt(outboard, 1)} cm
          </Typography>
        </Box>
      </Box>
      {outboardInvalid && (
        <Alert severity="error" variant="outlined" sx={{ mt: 0.75, py: 0, fontSize: 12 }}>
          Inboard must be less than oar length — increase oar length or reduce inboard.
        </Alert>
      )}

      {/* Stroke arc */}
      <Section>Stroke arc</Section>
      <Box sx={{ px: 0.5 }}>
        <Typography variant="body2">Catch angle: {catchAngle}°</Typography>
        <Slider
          value={catchAngle}
          min={30}
          max={70}
          onChange={(e, v) => setCatchAngle(v)}
          sx={{ color: '#1565c0' }}
        />
        <Typography variant="body2">Finish angle: {finishAngle}°</Typography>
        <Slider
          value={finishAngle}
          min={-60}
          max={-10}
          onChange={(e, v) => setFinishAngle(v)}
          sx={{ color: '#2e7d32' }}
        />
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Metrics */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<Typography>▾</Typography>} sx={{ px: 0, minHeight: 0 }}>
          <Typography variant="subtitle2">Rigging metrics</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <MetricRow
            label="Oar length"
            value={fmt(metrics.totalLength, 1)}
            unit="cm"
            info="Inboard + outboard — the full length of the oar."
            status={rangeStatus.totalLength}
          />
          <MetricRow
            label="Outboard"
            value={fmt(metrics.outboard, 1)}
            unit="cm"
            info="Collar to blade tip. The working lever in the water."
          />
          <MetricRow
            label="Load ratio"
            value={fmt(metrics.loadRatio, 2)}
            info="Outboard ÷ inboard. Higher = heavier gearing. Typically ~2.1–2.35 for sweep."
            status={rangeStatus.loadRatio}
          />
          <MetricRow
            label="Overall leverage"
            value={fmt(metrics.overallLeverage, 2)}
            info="Oar length ÷ inboard — an alternative way some coaches express the gearing."
          />
          <MetricRow
            label="Total arc"
            value={fmt(metrics.totalArc, 0)}
            unit="°"
            info="Catch angle + |finish angle|. ~90° is typical for sweep; a larger arc makes the drive feel heavier."
            status={rangeStatus.totalArc}
          />
          <MetricRow
            label="Oar spread"
            value={fmt(metrics.oarSpread, 1)}
            unit="cm"
            info="Straight-line reach from the pin to the handle tip at the catch (inboard × cos catch angle)."
          />
          <MetricRow
            label="Work distance"
            value={fmt(metrics.workDistance, 1)}
            unit="cm"
            info="Horizontal handle travel from catch to finish — a proxy for stroke length at the handle."
          />
          <MetricRow
            label="Inboard − spread"
            value={fmt(metrics.inboardSpreadDelta, 1)}
            unit="cm"
            info="Rule of thumb: inboard ≈ spread + 30 cm. This is how far you are from that guideline."
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ControlPanel;
