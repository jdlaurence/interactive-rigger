//utils.jsx

export const calcOarSpread = (inboard, catchAngle) => {
    // oar spread is the straight line distance from the pin to the handle tip
    // so Oar Spread is inboard * cos(catchAngle)
    return inboard * Math.cos(catchAngle * Math.PI / 180)
}