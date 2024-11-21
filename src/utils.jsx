//utils.jsx

export const calcOarSpread = (inboard, catchAngle) => {
    // oar spread is the straight line distance from the pin to the handle tip
    // so Oar Spread is inboard * cos(catchAngle)
    return inboard * Math.cos(catchAngle * Math.PI / 180)
}

export const processOarAngle = (pivotXBoat, pivotYBoat, inboard, oarlockWidth, oarlockDepth, oarImageWidth, oarImageHeight, angle) => {
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