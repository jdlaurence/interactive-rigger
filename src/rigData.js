// src/rigData.js
//
// Crew-type presets, boat-class adjustments, recommended ranges and coaching
// tips for sweep rigging.
//
// Numbers are sourced from real equipment data and a standards chart, not
// generic web references:
//   - HS Boys / HS Girls presets are real high-level junior top-boat oars
//     (S2V Skinny): boys 374 cm / 114 inboard / 34.5 mm grip, girls 372 cm /
//     115 inboard / 32 mm grip.
//   - Open and Masters presets come from a Beginner/Intermediate/Elite rigging
//     chart, cross-checked against real competitive women's rigs (which run
//     shorter oars, ~362–371 cm, than the chart's elite 8+ figure of 375).
//   - Inboard = spread + 30 cm (sweep). Holds across every data point.
//   - Oarlock (gate) height by level: 16.5 / 17.5 / 18.5 cm. Pitch: 5 / 4 / 3°.
//   - Sweep stroke angles (chart): women catch 50/54/57, finish 31/34/36;
//     men catch 53/57/61, finish 32/34/36 (beg/int/elite).
//   - Load ratio = outboard / inboard (~2.2–2.3 for sweep); heavier as it grows.
//
// These are starting points, not prescriptions — always test on the water.

// Fours and pairs are commonly rowed on the same oars as the eight, with the
// load lightened by CLAMs (clip-on collars) instead of re-rigging the spread.
// Each CLAM moves the collar ~1 cm toward the blade: inboard goes up, oar length
// is fixed, so outboard (and the load) comes down. 8+ = none, 4+/4- = 1,
// 2-/2+ = 2.
export const BOAT_CLASSES = {
  eight: { label: '8+', clams: 0 },
  fourSweep: { label: '4+ / 4-', clams: 1 },
  pair: { label: '2- / 2+', clams: 2 },
};

// Centimeters of inboard added per CLAM (collar shifted toward the blade).
export const CLAM_CM = 1;

// Half-width of the "Balanced" load-ratio window (so the band is ~0.02 wide).
// The window is centred on each preset's own (boat-adjusted) load ratio, so a
// recommended rig always reads Balanced and a manual change of more than this
// much tips it Light or Heavy. In custom mode the fixed 2.235–2.255 window below
// is used instead.
export const GEARING_HALF_WIDTH = 0.01;

// Each crew preset carries a full starting rig for an *eight*; applyPreset()
// then adds CLAMs for smaller boats.
export const CREW_PRESETS = {
  hsGirls: {
    label: 'HS Girls',
    spread: 85,
    inboard: 115,
    totalLength: 372,
    catchAngle: 55,
    finishAngle: -34,
    oarlockHeight: 17.5,
    oarlockPitch: 4,
    grip: 32,
    arcTarget: [85, 90], // Bechard women int–elite (87–90)
    notes:
      'A neutral-to-light gear on a full, well-covered arc.',
    tips: [
      'Keep the load honest: over-gearing junior crews shortens the stroke and rushes the recovery — length and rhythm first.',
      'Inboard tracks spread + 30 cm; a slimmer grip suits smaller hands and a cleaner outside-hand feather.',
      'Set the gate near 17.5 cm so the handle finishes into the lower ribs, not the lap.',
      'In fours and pairs, add a CLAM to lighten the load rather than re-rigging — pick the boat above and the inboard updates.',
    ],
  },
  hsBoys: {
    label: 'HS Boys',
    spread: 84,
    inboard: 114,
    totalLength: 374,
    catchAngle: 58,
    finishAngle: -34,
    oarlockHeight: 18,
    oarlockPitch: 4,
    grip: 34.5,
    arcTarget: [89, 94], // Bechard men int–elite (91–95)
    notes:
      'A moderate-to-firm gear over a large arc.',
    tips: [
      'Confirm the catch is connected before adding load — the bigger the catch angle, the heavier the effective gearing.',
      'Resist over-gearing across a wide range of sizes: a load the whole crew holds for a full piece beats a heavy gear that collapses the back half.',
      'Gate around 18 cm; adjust so the outside hand draws into the lower ribs at the finish.',
      'Row fours and pairs on the same oars with a CLAM added to lighten the load — select the boat above.',
    ],
  },
  openWomen: {
    label: 'Open / Elite Women',
    spread: 84,
    inboard: 114,
    totalLength: 370,
    catchAngle: 57,
    finishAngle: -35,
    oarlockHeight: 18.5,
    oarlockPitch: 3,
    grip: 34.5,
    arcTarget: [88, 93], // Bechard women elite (~90)
    notes:
      'A relatively short oar on a big, well-covered arc.',
    tips: [
      'A larger catch angle adds effective load — make sure the catch is connected, not just reached.',
      'Standard gate height ~18.5 cm; raise slightly only for the tallest athletes.',
      'Verify pitch (blade ~0°, gate ~3°) before chasing load.',
    ],
  },
  openMen: {
    label: 'Open / Elite Men',
    spread: 84,
    inboard: 114,
    totalLength: 376,
    catchAngle: 60,
    finishAngle: -35,
    oarlockHeight: 19,
    oarlockPitch: 3,
    grip: 37,
    arcTarget: [92, 97], // Bechard men elite (~95)
    notes:
      'Heaviest gear and the largest arc.',
    tips: [
      'Heaviest gearing of the presets — confirm the crew holds the load and rate over a full 2k before going heavier.',
      'Taller athletes often need a higher gate (~19 cm) to clear the knees and finish cleanly.',
      'A total arc near 95° is normal at this level when the catch is genuinely connected.',
    ],
  },
  masters: {
    label: 'Masters',
    spread: 85,
    inboard: 115,
    totalLength: 369,
    catchAngle: 52,
    finishAngle: -33,
    oarlockHeight: 17.5,
    oarlockPitch: 4,
    grip: 37,
    arcTarget: [82, 87], // lighter / shorter arc (Bechard beginner end)
    notes:
      'Lighter gearing keeps the stroke long and prioritizes comfort, joint health and sustainable load.',
    tips: [
      'Gear lighter than you think — a comfortable load protects backs and shoulders and keeps the stroke long.',
      'A slightly higher gate can ease pressure on the lower back at the finish.',
      'Smaller catch angles are fine; don’t force reach the body can’t connect.',
    ],
  },
};

// Generous fallback ranges used in "custom" mode (no preset selected). The
// load-ratio window here is a general sweep guideline since there is no crew to
// centre on.
export const DEFAULT_RANGES = {
  spread: [82, 88],
  inboard: [112, 118],
  totalLength: [360, 380],
  loadRatio: [2.235, 2.255],
  totalArc: [86, 94],
  oarlockHeight: [14, 22],
};

// Build per-field recommended ranges from a (boat-adjusted) preset. The balanced
// load-ratio window is centred on this rig's own outboard/inboard ratio.
const buildRanges = (preset) => {
  const loadCenter = (preset.totalLength - preset.inboard) / preset.inboard;
  return {
    spread: [preset.spread - 2, preset.spread + 3],
    inboard: [preset.inboard - 2, preset.inboard + 3],
    totalLength: [preset.totalLength - 4, preset.totalLength + 4],
    loadRatio: [loadCenter - GEARING_HALF_WIDTH, loadCenter + GEARING_HALF_WIDTH],
    totalArc: preset.arcTarget || DEFAULT_RANGES.totalArc,
    oarlockHeight: [preset.oarlockHeight - 2, preset.oarlockHeight + 3],
  };
};

// Merge a crew preset with a boat class into a concrete starting rig that App
// spreads into its state setters. Smaller boats keep the same oar and spread but
// add CLAMs, which lengthen the inboard (and shorten the effective outboard).
export const applyPreset = (crewType, boatClass) => {
  const crew = CREW_PRESETS[crewType];
  if (!crew) return null;
  const boat = BOAT_CLASSES[boatClass] || BOAT_CLASSES.eight;
  return {
    spread: crew.spread,
    inboard: crew.inboard + boat.clams * CLAM_CM,
    totalLength: crew.totalLength,
    catchAngle: crew.catchAngle,
    finishAngle: crew.finishAngle,
    oarlockHeight: crew.oarlockHeight,
    oarlockPitch: crew.oarlockPitch,
  };
};

// Active recommended ranges for the current crew/boat (or defaults in custom).
export const getRanges = (crewType, boatClass) => {
  const crew = CREW_PRESETS[crewType];
  if (!crew) return DEFAULT_RANGES;
  const boat = BOAT_CLASSES[boatClass] || BOAT_CLASSES.eight;
  return buildRanges({
    ...crew,
    inboard: crew.inboard + boat.clams * CLAM_CM,
  });
};

export const getCrewPreset = (crewType) => CREW_PRESETS[crewType] || null;
