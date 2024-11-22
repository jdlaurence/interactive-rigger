// src/components/LengthLines.jsx
import React from 'react';

const LengthLines = ({
    horizontalDistanceCatch,
    horizontalDistanceFinish,
    handleTipXRotatedBoatCatch,
    handleTipYRotatedBoatCatch,
    handleTipXRotatedBoatFinish,
    handleTipYRotatedBoatFinish,
    pixelsToCm,
    boatToSvgX,
    boatToSvgY,
}) => {


    return (
        <>
            {/* --- Catch Length Lines and Text --- */}

            {/* Length Line Catch */}
            <line
                x1={boatToSvgX(handleTipXRotatedBoatCatch)}
                y1={boatToSvgY(0)}
                x2={boatToSvgX(0)}
                y2={boatToSvgY(0)}
                stroke="blue"
                strokeWidth={pixelsToCm(2)}
            />

            {/* Perpendicular Length Line Catch */}
            <line
                x1={boatToSvgX(handleTipXRotatedBoatCatch)}
                y1={boatToSvgY(0)}
                x2={boatToSvgX(handleTipXRotatedBoatCatch)}
                y2={boatToSvgY(handleTipYRotatedBoatCatch)}
                stroke="black"
                strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
            />

            {/* Length Text Catch */}
            <text
                x={boatToSvgX(handleTipXRotatedBoatCatch / 2)}
                y={boatToSvgY(-35)} // Adjust Y position as needed
                fontFamily="Arial"
                fontSize={pixelsToCm(12)}
                fill="blue"
                textAnchor="middle"
            >
                {`Catch Length: ${Math.abs(horizontalDistanceCatch)} cm`}
            </text>

            {/* --- Finish Length Lines and Text --- */}

            {/* Length Line Finish */}
            <line
                x1={boatToSvgX(handleTipXRotatedBoatFinish)}
                y1={boatToSvgY(0)}
                x2={boatToSvgX(0)}
                y2={boatToSvgY(0)}
                stroke="green"
                strokeWidth={pixelsToCm(2)}
            />

            {/* Perpendicular Length Line Finish */}
            <line
                x1={boatToSvgX(handleTipXRotatedBoatFinish)}
                y1={boatToSvgY(0)}
                x2={boatToSvgX(handleTipXRotatedBoatFinish)}
                y2={boatToSvgY(handleTipYRotatedBoatFinish)}
                stroke="black"
                strokeDasharray={`${pixelsToCm(5)},${pixelsToCm(5)}`}
            />

            {/* Length Text Finish */}
            <text
                x={boatToSvgX(handleTipXRotatedBoatFinish / 2)}
                y={boatToSvgY(-50)} 
                fontFamily="Arial"
                fontSize={pixelsToCm(12)}
                fill="green"
                textAnchor="middle"
            >
                {`Finish Length: ${horizontalDistanceFinish} cm`}
            </text>
            { /* --- Total Work Distance --- */}
            <text
                x={boatToSvgX(0)}
                y={boatToSvgY(-65)}
                fontFamily="Arial"
                fontSize={pixelsToCm(12)}
                fill="black"
                textAnchor="middle"
            >
                {`Work Distance: ${(Math.abs(horizontalDistanceCatch) + Math.abs(horizontalDistanceFinish)).toFixed(2)} cm`}
            </text>
        </>
    );
};

export default LengthLines;
