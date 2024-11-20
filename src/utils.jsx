//utils.jsx

export const calcOarSpread = (inboard, catchAngle) => {
    // oar spread is the straight line distance from the pin to the handle tip
    // so Oar Spread is inboard * cos(catchAngle)
    return inboard * Math.cos(catchAngle * Math.PI / 180)
}

export const processOarAngle = (inboard, spread, oarlockOffset, oarImageWidth, oarImageHeight, angle) => {

    // Overall logic // 
    // 1. Compute Oarlock offset in terms of X,Y distances, based on theta and tan rules;
    // 2. Add offset Y to spread for ultimate catch/finish length calc
    // 3. Add offset X to resulting length to get full dist from handle tip to pin 
    
    const pivotXBoat = 0; // pivot is the origin
    const pivotYBoat = spread;
    const theta = (angle * Math.PI) / 180;
    console.log("Theta:", theta)
    const oarlockOffsetX = Math.cos(theta) * oarlockOffset
    const oarlockOffsetY = Math.sin(theta) * oarlockOffset
    console.log("Oarlock Offset X:", oarlockOffsetX)
    console.log("Oarlock Offset Y:", oarlockOffsetY)
    const offsetSpread = spread + oarlockOffsetY
    const oarImageXBoat = pivotXBoat - oarImageWidth / 2 - oarlockOffset;
    const oarImageYBoat = pivotYBoat - inboard;
    console.log("Oar Image X Boat:", oarImageXBoat)

    // Handle tip calculations; neutral is 90 deg; 
    // handle tip will be oarlock offset to the left of the pin
    const handleTipXNeutralBoat = oarImageXBoat + oarImageWidth / 2 - pivotXBoat - oarlockOffset;
    const handleTipYNeutralBoat = pivotYBoat - inboard;
    console.log("Handle Tip X Neutral:", handleTipXNeutralBoat)

    const handleTipXRotatedBoat = -(Math.sin(theta) * inboard) - oarlockOffsetX
    const handleTipYRotatedBoat = -((Math.cos(theta) * inboard) - offsetSpread)

    console.log("HandleTip X Rotated:", handleTipXRotatedBoat)
    const horizontalDistance = handleTipXRotatedBoat



    return { horizontalDistance, handleTipXRotatedBoat, handleTipYRotatedBoat, oarImageXBoat, oarImageYBoat }
}