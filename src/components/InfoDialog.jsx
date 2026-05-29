// src/components/InfoDialog.jsx
//
// "About the numbers" reference panel, opened from the gear button in the
// header. It explains where the preset values and recommended ranges come from
// (largely Dan Bechard's rigging chart, cross-checked against real equipment)
// and defines every metric the control panel reports. The preset table is built
// from rigData so the figures here can never drift from the live app.
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Divider,
} from "@mui/material";
import {
  CREW_PRESETS,
  BOAT_CLASSES,
  CLAM_CM,
  GEARING_HALF_WIDTH,
} from "../rigData";

// Section heading, matching the control panel's overline style.
const Heading = ({ children }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ display: "block", mt: 3, mb: 1, lineHeight: 1.3 }}
  >
    {children}
  </Typography>
);

// A defined term: the metric name + its formula, then a plain-language gloss.
const Def = ({ term, formula, children }) => (
  <Box sx={{ mb: 1.25 }}>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {term}
      {formula && (
        <Box
          component="span"
          sx={{
            ml: 1,
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            bgcolor: "action.hover",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            fontWeight: 500,
            color: "text.secondary",
          }}
        >
          {formula}
        </Box>
      )}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
      {children}
    </Typography>
  </Box>
);

const InfoDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pr: 6 }}>
        About the numbers
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Where the presets and recommended ranges come from, and how every
          metric is calculated.
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
          }}
        >
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Sources */}
        <Heading>Sources</Heading>
        <Typography variant="body2" color="text.secondary">
          The recommended arcs, gearing and gate settings are drawn largely from{" "}
          <strong>Dan Bechard&apos;s rigging chart</strong> with adjustments
          based on real equipment data and coaching experience.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          From Bechard&apos;s chart by level (beginner / intermediate / elite):
          gate height runs <strong>16.5 / 17.5 / 18.5 cm</strong> and pitch{" "}
          <strong>5 / 4 / 3°</strong>; women&apos;s catch angles{" "}
          <strong>50 / 54 / 57°</strong> with finishes{" "}
          <strong>31 / 34 / 36°</strong>, men&apos;s catch{" "}
          <strong>53 / 57 / 61°</strong> with finishes{" "}
          <strong>32 / 34 / 36°</strong>.
        </Typography>

        {/* Preset table */}
        <Heading>Crew presets (eight)</Heading>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Each crew loads a complete starting rig for an eight. Smaller boats
          keep the same oars and spread but add CLAMs (see below).
        </Typography>
        <Table size="small" sx={{ "& td, & th": { px: 1, py: 0.5 } }}>
          <TableHead>
            <TableRow>
              <TableCell>Crew</TableCell>
              <TableCell align="right">Spread</TableCell>
              <TableCell align="right">Inboard</TableCell>
              <TableCell align="right">Oar</TableCell>
              <TableCell align="right">Catch</TableCell>
              <TableCell align="right">Finish</TableCell>
              <TableCell align="right">Gate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(CREW_PRESETS).map(([key, p]) => (
              <TableRow key={key}>
                <TableCell>{p.label}</TableCell>
                <TableCell align="right">{p.spread}</TableCell>
                <TableCell align="right">{p.inboard}</TableCell>
                <TableCell align="right">{p.totalLength}</TableCell>
                <TableCell align="right">{p.catchAngle}°</TableCell>
                <TableCell align="right">{p.finishAngle}°</TableCell>
                <TableCell align="right">{p.oarlockHeight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.75 }}
        >
          Spread, inboard and oar length in cm; angles in degrees; gate height
          in cm.
        </Typography>

        {/* Boat classes / CLAMs */}
        <Heading>Boat classes &amp; CLAMs</Heading>
        <Typography variant="body2" color="text.secondary">
          Fours and pairs are usually rowed on the same oars as the eight, with
          the load lightened by CLAMs (clip-on collars) rather than by
          re-rigging the spread. Each CLAM shifts the collar about {CLAM_CM} cm
          toward the blade — inboard goes up, oar length is fixed, so outboard
          and the load come down.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
          {Object.entries(BOAT_CLASSES).map(([key, b]) => (
            <Typography key={key} variant="body2" color="text.secondary">
              <strong>{b.label}</strong>: {b.clams} CLAM
              {b.clams === 1 ? "" : "s"}
            </Typography>
          ))}
        </Box>

        {/* The math */}
        <Heading>The math</Heading>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Everything in the metrics panel is derived from the five inputs
          (spread, inboard, oar length, catch and finish angles). All distances
          are in centimeters. The plan-view diagram rotates the oar about the
          pin at the true catch and finish angles, so the on-screen geometry is
          to scale.
        </Typography>
        <Def term="Outboard" formula="oar length − inboard">
          The lever from the collar to the blade tip — the working length in the
          water. Longer outboard means a heavier load.
        </Def>
        <Def term="Load ratio" formula="outboard ÷ inboard">
          The headline gearing number. Higher is heavier; sweep rigs typically
          sit around 2.2–2.3.
        </Def>
        <Def term="Overall leverage" formula="oar length ÷ inboard">
          An alternative way some coaches express the same gearing.
        </Def>
        <Def term="Total arc" formula="catch + |finish|">
          How far the oar sweeps through the water. Around 90° is typical for
          sweep; a larger arc makes the drive feel heavier.
        </Def>
        <Def term="Oar spread" formula="inboard × cos(catch angle)">
          The straight-line reach from the pin to the handle tip at the catch.
        </Def>
        <Def term="Work distance">
          The horizontal travel of the handle from catch to finish — a proxy for
          stroke length at the handle.
        </Def>
        <Def term="Inboard − spread" formula="≈ 30 cm">
          A standard sweep rule of thumb: inboard ≈ spread + 30 cm. This metric
          is how far the current rig sits from that guideline.
        </Def>

        {/* Ranges & bands */}
        <Heading>How the ranges &amp; bands work</Heading>
        <Typography variant="body2" color="text.secondary">
          The green &ldquo;Balanced&rdquo; zone on each indicator is the
          recommended window for the selected crew, not a universal rule:
        </Typography>
        <Box
          component="ul"
          sx={{ pl: 2.5, mt: 1, mb: 0, "& li": { mb: 0.75 } }}
        >
          <Typography component="li" variant="body2" color="text.secondary">
            <strong>Gearing</strong> is centred on the selected rig&apos;s own
            load ratio, ±{GEARING_HALF_WIDTH} — so a preset always reads
            Balanced, and editing the oar or inboard by more than that tips it
            Light or Heavy.
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            <strong>Total arc</strong> uses the crew&apos;s target window from
            Bechard&apos;s chart (see the preset table).
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            <strong>Spread, inboard and oar length</strong> ranges sit a few
            centimeters either side of the preset value.
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          The grey tick on each band marks the reference preset; the coloured
          marker is your current rig. When you edit away from the preset, an
          &ldquo;Edited&rdquo; chip appears and the diagram ghosts the original
          rig for comparison.
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block" }}
        >
          These figures are starting points, not prescriptions — always test on
          the water and adjust to the crew.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
