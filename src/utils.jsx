//utils.jsx

// **Shared oarlock geometry constants (cm)**
// Used both for the plan-view drawing (SVGCanvas) and the lifted geometry
// calculations in App, so they must agree on a single source of truth.
export const OARLOCK_WIDTH = 5; // Distance from pin to center of oar shaft
export const OARLOCK_DEPTH = 2; // Half of oarlock depth

export const calcOarSpread = (inboard, catchAngle) => {
    // oar spread is the straight line distance from the pin to the handle tip
    // so Oar Spread is inboard * cos(catchAngle)
    return inboard * Math.cos(catchAngle * Math.PI / 180)
}

export const processOarAngle = (pivotXBoat, pivotYBoat, inboard, oarlockWidth, oarlockDepth, angle) => {
    // Overall logic
    // Compute oarlock offset in terms of horizontal and vertical components
    // Note that the oarlock has a width and a depth, so we need to account for both

    const theta = (angle * Math.PI) / 180;
    const oarlockOffsetX = oarlockWidth * Math.cos(theta) + oarlockDepth * Math.sin(theta);
    const oarlockOffsetY = oarlockWidth * Math.sin(theta) + oarlockDepth * Math.cos(theta);

    const offsetPivot = pivotYBoat + oarlockOffsetY

    const handleTipXRotatedBoat = -(Math.sin(theta) * inboard) - oarlockOffsetX
    const handleTipYRotatedBoat = -((Math.cos(theta) * inboard) - offsetPivot)

    const horizontalDistance = handleTipXRotatedBoat

    // Rotate oarlock dimensions to boat coordinate system
    const deltaX = -oarlockWidth * Math.cos(-theta) - -oarlockDepth * Math.sin(-theta);
    const deltaY = -oarlockWidth * Math.sin(-theta) + -oarlockDepth * Math.cos(-theta);


    // Collar point position in boat coordinates
    const collarXBoat = pivotXBoat + deltaX;
    const collarYBoat = pivotYBoat + deltaY;



    return { horizontalDistance, handleTipXRotatedBoat, handleTipYRotatedBoat, collarXBoat, collarYBoat }
}

// **Derive the full set of rigging metrics from the current inputs.**
// Pure function: takes the primary inputs plus the already-computed
// processOarAngle results for catch and finish, and returns the numbers the
// control panel displays. Lengths use Math.abs so callers never have to worry
// about the sign convention of horizontalDistance.
export const computeMetrics = ({
    spread,
    inboard,
    outboard,
    catchAngle,
    finishAngle,
    processedCatch,
    processedFinish,
}) => {
    const totalLength = inboard + outboard;
    const loadRatio = outboard / inboard; // out/in leverage — heavier as it grows
    const overallLeverage = totalLength / inboard; // alternative ratio some coaches use
    const totalArc = catchAngle + Math.abs(finishAngle);
    const oarSpread = calcOarSpread(inboard, catchAngle);

    const catchLengthCm = Math.abs(processedCatch.horizontalDistance);
    const finishLengthCm = Math.abs(processedFinish.horizontalDistance);
    const workDistance = catchLengthCm + finishLengthCm;

    const inboardSpreadDelta = inboard - spread; // the "inboard ≈ spread + 30" rule check

    return {
        totalLength,
        outboard,
        loadRatio,
        overallLeverage,
        totalArc,
        oarSpread,
        catchLengthCm,
        finishLengthCm,
        workDistance,
        inboardSpreadDelta,
    };
};

// **Three-zone, colour-mapped classifier shared by the rig indicators.**
// `band` is the active [min, max] "balanced" window. Below it takes the low
// label, inside it reads "Balanced", above it takes the high label. Returns the
// verdict, colour, and the track geometry the indicator paints — the green zone
// of the track is exactly [min, max].
export const GEARING_COLORS = {
    light: '#1565c0', // low / blue
    balanced: '#2e7d32', // in-band / green
    heavy: '#c62828', // high / red
};

const LEVEL_COLOR = {
    low: GEARING_COLORS.light,
    mid: GEARING_COLORS.balanced,
    high: GEARING_COLORS.heavy,
};

export const classifyBand = (value, band, labels, reference) => {
    const [min, max] = band && band.length === 2 ? band : [0, 1];
    const lab = labels || { low: 'Low', mid: 'Balanced', high: 'High' };

    let level = 'mid';
    let label = lab.mid;
    if (!Number.isFinite(value)) {
        label = '—';
    } else if (value < min) {
        level = 'low';
        label = lab.low;
    } else if (value > max) {
        level = 'high';
        label = lab.high;
    }

    // Pad the band on both sides (proportional, so it scales for any metric) so
    // the green "balanced" zone reads as a band and there is room to show drift.
    const pad = Math.max((max - min) * 2, 1e-6);
    const lo = min - pad;
    const hi = max + pad;
    const clamp01 = (t) => Math.min(1, Math.max(0, t));
    const pct = (v) => clamp01((v - lo) / (hi - lo)) * 100;

    return {
        level,
        label,
        color: LEVEL_COLOR[level],
        value,
        min,
        max,
        // Percentages across the track (0–100) for the gradient + marker.
        markerPct: Number.isFinite(value) ? pct(value) : 50,
        bandStartPct: pct(min),
        bandEndPct: pct(max),
        // Where the reference (preset) value sits, for the ghost tick.
        refPct: Number.isFinite(reference) ? pct(reference) : null,
        reference: Number.isFinite(reference) ? reference : null,
    };
};

// Load ratio (outboard ÷ inboard): under-geared → Light, over-geared → Heavy.
export const classifyGearing = (loadRatio, band, reference) =>
    classifyBand(loadRatio, band, { low: 'Light', mid: 'Balanced', high: 'Heavy' }, reference);

// Total arc (catch + |finish|): compact stroke → Short, swept out → Long.
export const classifyArc = (totalArc, band, reference) =>
    classifyBand(totalArc, band, { low: 'Short', mid: 'Balanced', high: 'Long' }, reference);

// **Compare a set of values against recommended [min, max] ranges.**
// `values` and `ranges` are keyed objects; only fields present in BOTH are
// checked. Returns a per-field status object: { field: { status, message } }
// where status is 'ok' | 'low' | 'high'. Used to drive inline warnings.
export const checkRanges = (values, ranges) => {
    const result = {};
    if (!ranges) return result;

    Object.keys(ranges).forEach((field) => {
        const range = ranges[field];
        const value = values[field];
        if (range == null || value == null || Number.isNaN(value)) return;

        const [min, max] = range;
        if (value < min) {
            result[field] = {
                status: 'low',
                message: `Below the recommended range (${min}–${max}).`,
            };
        } else if (value > max) {
            result[field] = {
                status: 'high',
                message: `Above the recommended range (${min}–${max}).`,
            };
        } else {
            result[field] = { status: 'ok', message: `Within range (${min}–${max}).` };
        }
    });

    return result;
};
