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
