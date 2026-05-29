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
  Button,
  Chip,
} from '@mui/material';
import { CREW_PRESETS, BOAT_CLASSES, getCrewPreset } from '../rigData';
import { GEARING_COLORS } from '../utils';

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

// Signed delta of a live value from the reference rig, shown to the right of the
// value. Renders nothing when the value matches the reference.
const Delta = ({ current, reference, digits = 1, sx }) => {
  if (!Number.isFinite(current) || !Number.isFinite(reference)) return null;
  const d = current - reference;
  if (Math.abs(d) < (digits >= 2 ? 0.005 : 0.05)) return null;
  return (
    <Typography
      component="span"
      variant="caption"
      sx={{ color: 'primary.main', fontWeight: 700, whiteSpace: 'nowrap', ...sx }}
    >
      {d > 0 ? '+' : '−'}
      {fmt(Math.abs(d), digits)}
    </Typography>
  );
};

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

// A labeled metric line with an explanatory tooltip and a signed delta from the
// reference rig on the right.
const MetricRow = ({ label, value, unit, info, current, reference, digits = 1 }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.25 }}>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
        {label}
        {info && <Info text={info} />}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {value}
          {unit ? ` ${unit}` : ''}
        </Typography>
        <Delta current={current} reference={reference} digits={digits} sx={{ minWidth: 36, textAlign: 'right' }} />
      </Box>
    </Box>
  );
};

// Colour-mapped verdict: a labelled chip over a blue→green→red track whose green
// zone is the recommended window and whose marker sits at the current value.
// Shared by the gearing and total-arc indicators (`data` is a classifyBand result).
const BandIndicator = ({ title, info, data, format }) => {
  if (!data) return null;
  const { label, color, value, markerPct, bandStartPct, bandEndPct, refPct } = data;
  const ghost = refPct != null;
  const track = `linear-gradient(90deg,
    ${GEARING_COLORS.light} 0%,
    ${GEARING_COLORS.light} ${Math.max(0, bandStartPct - 4)}%,
    ${GEARING_COLORS.balanced} ${bandStartPct}%,
    ${GEARING_COLORS.balanced} ${bandEndPct}%,
    ${GEARING_COLORS.heavy} ${Math.min(100, bandEndPct + 4)}%,
    ${GEARING_COLORS.heavy} 100%)`;
  return (
    <Box sx={{ mt: 1.25 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          {title}
          {info && <Info text={info} />}
        </Typography>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 999,
            bgcolor: color,
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.5,
            display: 'flex',
            gap: 0.75,
            alignItems: 'baseline',
          }}
        >
          <span>{label}</span>
          <span style={{ opacity: 0.85, fontWeight: 600 }}>{format(value)}</span>
        </Box>
      </Box>
      <Box sx={{ position: 'relative', height: 8, borderRadius: 999, background: track }}>
        {/* Reference (preset) tick — ghosted, behind the live marker. */}
        {ghost && (
          <Tooltip title={`Reference: ${format(data.reference)}`} arrow placement="top">
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: `${refPct}%`,
                transform: 'translate(-50%, -50%)',
                width: 3,
                height: 16,
                borderRadius: 1,
                bgcolor: '#6b7480',
                opacity: 0.85,
              }}
            />
          </Tooltip>
        )}
        {/* Live marker. */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: `${markerPct}%`,
            transform: 'translate(-50%, -50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            bgcolor: '#fff',
            border: '2px solid',
            borderColor: color,
            boxShadow: 1,
          }}
        />
      </Box>
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
  gearing,
  arc,
  reference,
  isEdited,
  onReset,
}) => {
  const preset = getCrewPreset(crewType);
  const outboardInvalid = outboard <= 0;
  const refMetrics = reference ? reference.metrics : null;

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
      {/* Reference rig */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 0.75 }}>
        <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.3 }}>
          Reference Rig
        </Typography>
        {isEdited && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label="Edited"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 18, '& .MuiChip-label': { px: 0.75, fontSize: 10 } }}
            />
            <Button size="small" onClick={onReset} sx={{ minWidth: 0, px: 0.5, py: 0, fontSize: 11 }}>
              Reset
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ flex: 1.5 }}>
          <InputLabel id="crew-label">Crew</InputLabel>
          <Select
            labelId="crew-label"
            label="Crew"
            value={crewType}
            onChange={(e) => onCrewChange(e.target.value)}
          >
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
      {preset && preset.grip && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
          Handle Ø {preset.grip} mm · gate {preset.oarlockHeight} cm · pitch {preset.oarlockPitch}°
        </Typography>
      )}

      {/* Dimensions */}
      <Section>Dimensions</Section>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        <Box>
          {numberField('Spread', spread, setSpread, { min: 75, max: 92, step: 0.5 })}
        </Box>
        <Box>
          {numberField('Oar length', totalLength, setTotalLength, { min: 355, max: 390, step: 0.5 })}
        </Box>
        <Box>
          {numberField('Inboard', inboard, setInboard, { min: 105, max: 124, step: 0.5 })}
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

      {/* Gearing + arc verdicts (grey tick = reference value) */}
      <BandIndicator
        title="Gearing"
        info="A one-glance read on load, from the load ratio (outboard ÷ inboard). Light = under-geared, Heavy = over-geared; the green zone is the recommended window for the current crew. The grey tick is the reference value."
        data={gearing}
        format={(v) => fmt(v, 2)}
      />
      <BandIndicator
        title="Total arc"
        info="A one-glance read on stroke arc (catch + |finish|). Short = compact, Long = swept out; the green zone is the recommended arc for the current crew (Bechard reference). The grey tick is the reference value."
        data={arc}
        format={(v) => `${fmt(v, 0)}°`}
      />

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
            current={metrics.totalLength}
            reference={refMetrics?.totalLength}
          />
          <MetricRow
            label="Outboard"
            value={fmt(metrics.outboard, 1)}
            unit="cm"
            info="Collar to blade tip. The working lever in the water."
            current={metrics.outboard}
            reference={refMetrics?.outboard}
          />
          <MetricRow
            label="Load ratio"
            value={fmt(metrics.loadRatio, 2)}
            info="Outboard ÷ inboard. Higher = heavier gearing. Typically ~2.1–2.35 for sweep."
            current={metrics.loadRatio}
            reference={refMetrics?.loadRatio}
            digits={2}
          />
          <MetricRow
            label="Overall leverage"
            value={fmt(metrics.overallLeverage, 2)}
            info="Oar length ÷ inboard — an alternative way some coaches express the gearing."
            current={metrics.overallLeverage}
            reference={refMetrics?.overallLeverage}
            digits={2}
          />
          <MetricRow
            label="Total arc"
            value={fmt(metrics.totalArc, 0)}
            unit="°"
            info="Catch angle + |finish angle|. ~90° is typical for sweep; a larger arc makes the drive feel heavier."
            current={metrics.totalArc}
            reference={refMetrics?.totalArc}
            digits={0}
          />
          <MetricRow
            label="Oar spread"
            value={fmt(metrics.oarSpread, 1)}
            unit="cm"
            info="Straight-line reach from the pin to the handle tip at the catch (inboard × cos catch angle)."
            current={metrics.oarSpread}
            reference={refMetrics?.oarSpread}
          />
          <MetricRow
            label="Work distance"
            value={fmt(metrics.workDistance, 1)}
            unit="cm"
            info="Horizontal handle travel from catch to finish — a proxy for stroke length at the handle."
            current={metrics.workDistance}
            reference={refMetrics?.workDistance}
          />
          <MetricRow
            label="Inboard − spread"
            value={fmt(metrics.inboardSpreadDelta, 1)}
            unit="cm"
            info="Rule of thumb: inboard ≈ spread + 30 cm. This is how far you are from that guideline."
            current={metrics.inboardSpreadDelta}
            reference={refMetrics?.inboardSpreadDelta}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ControlPanel;
