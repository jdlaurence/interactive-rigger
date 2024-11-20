// src/components/ControlPanel.jsx
import React from 'react';

const ControlPanel = ({
  oarAngle,
  setOarAngle,
  spread,
  setSpread,
  inboard,
  setInboard,
  outboard,
  setOutboard,
  catchAngle,
  setCatchAngle,
  finishAngle,
  setFinishAngle,
  catchLength,
  setCatchLength,
  finishLength,
  setFinishLength,
}) => {
  return (
    <div className="control-panel" style={{ marginBottom: '20px' }}>
      {/* Catch Angle Slider */}
      <div style={{ marginBottom: '10px' }}>
        <label>Catch Angle: {catchAngle}°</label>
        <input
          type="range"
          min="0"
          max="90"
          value={catchAngle}
          onChange={(e) => setCatchAngle(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '300px' }}
        />
      </div>

      {/* Finish Angle Slider */}
      <div style={{ marginBottom: '10px' }}>
        <label>Finish Angle: {finishAngle}°</label>
        <input
          type="range"
          min="-90"
          max="-0"
          value={finishAngle}
          onChange={(e) => setFinishAngle(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '300px', transform: 'rotate(180deg)' }}
        />
      </div>

      {/* Spread Slider */}
      {/* <div style={{ marginBottom: '10px' }}>
        <label>Spread: {spread} cm</label>
        <input
          type="range"
          min="50"
          max="150"
          value={spread}
          onChange={(e) => setSpread(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '300px' }}
        />
      </div> */}

      {/* Inboard Input */}
      {/* <div style={{ marginBottom: '10px' }}>
        <label>Inboard: {inboard} cm</label>
        <input
          type="number"
          value={inboard}
          onChange={(e) => setInboard(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '100px' }}
        />
      </div> */}

      {/* Outboard Input */}
      {/* <div style={{ marginBottom: '10px' }}>
        <label>Outboard: {outboard} cm</label>
        <input
          type="number"
          value={outboard}
          onChange={(e) => setOutboard(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '100px' }}
        />
      </div> */}

      {/* Catch Angle Slider */}
      {/* <div style={{ marginBottom: '10px' }}>
        <label>Catch Angle: {catchAngle}°</label>
        <input
          type="range"
          min="0"
          max="90"
          value={catchAngle}
          onChange={(e) => setCatchAngle(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '300px' }}
        />
      </div> */}

      {/* Finish Angle Slider */}
      {/* <div style={{ marginBottom: '10px' }}>
        <label>Finish Angle: {finishAngle}°</label>
        <input
          type="range"
          min="0"
          max="90"
          value={finishAngle}
          onChange={(e) => setFinishAngle(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '300px' }}
        />
      </div> */}

      {/* Catch Length Input */}
      {/* <div style={{ marginBottom: '10px' }}>
        <label>Catch Length: {catchLength} cm</label>
        <input
          type="number"
          value={catchLength}
          onChange={(e) => setCatchLength(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '100px' }}
        />
      </div> */}

      {/* Finish Length Input */}
      {/* <div style={{ marginBottom: '10px' }}>
        <label>Finish Length: {finishLength} cm</label>
        <input
          type="number"
          value={finishLength}
          onChange={(e) => setFinishLength(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '100px' }}
        />
      </div> */}
    </div>
  );
};

export default ControlPanel;
