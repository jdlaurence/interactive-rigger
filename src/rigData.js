// src/rigData.js
//
// Crew-type presets, boat-class adjustments, recommended ranges and coaching
// tips for sweep rigging. Numbers are "zero-number" starting points drawn from
// standard rigging references (Concept2, World Rowing/FISA, Rowing News):
//   - Total oar length = inboard + outboard (sweep totals ~362–378 cm).
//   - Inboard ≈ spread + 30 cm (±1).
//   - Load ratio = outboard / inboard (~2.1–2.35 typical); heavier as it grows.
//   - Total arc = catch + |finish|, ~90° for sweep.
//   - Oarlock (gate) height ~17 cm above the seat's lowest point (16 lighter,
//     19 heavyweight men). Blade pitch target 0°, oarlock pitch ~1–7°.
//
// These are starting points, not prescriptions — always test on the water.

// Boat class shifts the spread/inboard slightly: smaller boats run a touch
// wider (and therefore a touch longer inboard to keep the ~+30 relationship).
export const BOAT_CLASSES = {
  eight: { label: 'Eight (8+)', spreadDelta: 0 },
  fourSweep: { label: 'Four (4+ / 4-)', spreadDelta: 1 },
  pair: { label: 'Pair (2- / 2+)', spreadDelta: 2 },
};

// Each crew preset carries a full starting rig for an *eight*; applyPreset()
// then nudges spread/inboard by the boat-class delta.
export const CREW_PRESETS = {
  hsWomen: {
    label: 'High School (Girls)',
    spread: 86,
    inboard: 116,
    totalLength: 370,
    catchAngle: 52,
    finishAngle: -32,
    oarlockHeight: 16,
    oarlockPitch: 4,
    loadTarget: [2.05, 2.25],
    notes:
      'Lighter, developing athletes. Favor a lighter gear: wider spread, longer inboard, shorter oar, and a slightly lower gate. Prioritize clean technique over heavy load.',
    tips: [
      'Keep the load light enough to maintain length and rhythm — over-gearing junior crews shortens the stroke and rushes the recovery.',
      'A wider spread + longer inboard lightens the load without shortening the oar.',
      'Lower the gate height (~16 cm) for shorter athletes so the handle finishes at the bottom of the ribs, not the lap.',
      'Match all riggers in the boat before chasing per-seat tweaks.',
    ],
  },
  hsMen: {
    label: 'High School (Boys)',
    spread: 85,
    inboard: 115,
    totalLength: 370,
    catchAngle: 54,
    finishAngle: -32,
    oarlockHeight: 16,
    oarlockPitch: 4,
    loadTarget: [2.1, 2.3],
    notes:
      'Developing athletes with a wide range of sizes. Start light-to-moderate and add load only once length and bladework hold up at race rate.',
    tips: [
      'Resist over-gearing — a load the crew can carry for a full piece beats a heavy gear that collapses the back half.',
      'Confirm reach at the catch: the bigger the catch angle, the heavier the effective gearing.',
      'Set gate height around 16 cm and adjust so the outside hand draws into the lower ribs at the finish.',
    ],
  },
  hwtWomen: {
    label: 'Heavyweight / International (Women)',
    spread: 84,
    inboard: 114,
    totalLength: 370,
    catchAngle: 58,
    finishAngle: -35,
    oarlockHeight: 17,
    oarlockPitch: 4,
    loadTarget: [2.2, 2.35],
    notes:
      'Elite, full-size athletes. Carry a heavier gear and a large, well-covered arc.',
    tips: [
      'A larger catch angle adds effective load — make sure the catch is connected, not just reached.',
      'Standard gate height ~17 cm; raise slightly only for the tallest athletes.',
      'Verify pitch (blade ~0°, gate ~4°) before adding load.',
    ],
  },
  hwtMen: {
    label: 'Heavyweight / International (Men)',
    spread: 84,
    inboard: 114,
    totalLength: 370,
    catchAngle: 60,
    finishAngle: -35,
    oarlockHeight: 19,
    oarlockPitch: 4,
    loadTarget: [2.25, 2.4],
    notes:
      'Elite, full-size athletes who can carry the heaviest gear and the largest arc.',
    tips: [
      'Heaviest gearing of the presets — confirm the crew holds the load and rate over a full 2k before going heavier.',
      'Taller heavyweight men often need a higher gate (~19 cm) to clear the knees and finish cleanly.',
      'Total arc near 90–95° is normal at this level when the catch is genuinely connected.',
    ],
  },
  masters: {
    label: 'Masters',
    spread: 85,
    inboard: 115,
    totalLength: 370,
    catchAngle: 52,
    finishAngle: -33,
    oarlockHeight: 17,
    oarlockPitch: 4,
    loadTarget: [2.05, 2.25],
    notes:
      'Prioritize comfort, joint health and sustainable load. Lighter gearing keeps the stroke long and the catch unhurried.',
    tips: [
      'Gear lighter than you think — a comfortable load protects backs and shoulders and keeps the stroke long.',
      'A slightly higher gate can ease pressure on the lower back at the finish.',
      'Smaller catch angles are fine; don’t force reach that the body can’t connect.',
    ],
  },
};

// Generous fallback ranges used in "custom" mode (no preset selected).
export const DEFAULT_RANGES = {
  spread: [80, 90],
  inboard: [108, 122],
  totalLength: [360, 382],
  loadRatio: [2.0, 2.5],
  totalArc: [80, 105],
  oarlockHeight: [14, 22],
};

// Build per-field recommended ranges from a (boat-adjusted) preset.
const buildRanges = (preset) => ({
  spread: [preset.spread - 2, preset.spread + 3],
  inboard: [preset.inboard - 2, preset.inboard + 3],
  totalLength: [preset.totalLength - 4, preset.totalLength + 4],
  loadRatio: preset.loadTarget,
  totalArc: [82, 100],
  oarlockHeight: [preset.oarlockHeight - 2, preset.oarlockHeight + 3],
});

// Merge a crew preset with a boat class into a concrete starting rig that App
// spreads into its state setters.
export const applyPreset = (crewType, boatClass) => {
  const crew = CREW_PRESETS[crewType];
  if (!crew) return null;
  const boat = BOAT_CLASSES[boatClass] || BOAT_CLASSES.eight;
  return {
    spread: crew.spread + boat.spreadDelta,
    inboard: crew.inboard + boat.spreadDelta,
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
    spread: crew.spread + boat.spreadDelta,
    inboard: crew.inboard + boat.spreadDelta,
  });
};

export const getCrewPreset = (crewType) => CREW_PRESETS[crewType] || null;
