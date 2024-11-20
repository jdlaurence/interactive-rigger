//utils.jsx

export const calcOarSpread = (inboard, catchAngle) => {
    // oar spread is the straight line distance from the pin to the handle tip
    // so Oar Spread is inboard * cos(catchAngle)
    return inboard * Math.cos(catchAngle * Math.PI / 180)
}

export const processOarAngle = (inboard, spread, oarlockWidth, oarlockDepth, oarImageWidth, oarImageHeight, angle) => {

    // Overall logic // 
    // 1. Compute Oarlock offset in terms of X,Y distances, based geo rules
    // 2. Add offset Y to spread for ultimate catch/finish length calc
    // 3. Add offset X to resulting length to get full dist from handle tip to pin 
    
    const pivotXBoat = 0; // pivot is the origin
    const pivotYBoat = spread;
    const theta = (angle * Math.PI) / 180;
    const oarlockOffsetX = oarlockWidth * Math.cos(theta) - oarlockDepth * Math.sin(theta);
    const oarlockOffsetY = oarlockWidth * Math.sin(theta) + oarlockDepth * Math.cos(theta);
    
    const offsetSpread = spread + oarlockOffsetY
    console.log("Oarlock offset X: ", oarlockOffsetX)
    console.log("Oarlock offset Y: ", oarlockOffsetY)
    const oarImageXBoat = pivotXBoat - oarImageWidth / 2 - oarlockOffsetX;
    const oarImageYBoat = pivotYBoat - inboard;

    // Handle tip calculations; neutral is 90 deg; 
    // handle tip will be oarlock offset to the left of the pin
    const handleTipXNeutralBoat = oarImageXBoat + oarImageWidth / 2 - pivotXBoat - oarlockWidth;
    const handleTipYNeutralBoat = pivotYBoat - inboard;

    const handleTipXRotatedBoat = -(Math.sin(theta) * inboard) - oarlockOffsetX
    const handleTipYRotatedBoat = -((Math.cos(theta) * inboard) - offsetSpread)

    const horizontalDistance = handleTipXRotatedBoat



    return { horizontalDistance, handleTipXRotatedBoat, handleTipYRotatedBoat, oarImageXBoat, oarImageYBoat }
}