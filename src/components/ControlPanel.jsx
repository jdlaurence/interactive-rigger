// src/components/ControlPanel.jsx
import React from 'react';

const ControlPanel = ({
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
    <div className="control-panel" style={styles.controlPanel}>

      {/* Spread Text Input */}
      <div style={styles.controlGroup}>
        <label style={styles.label}>Spread:</label>
        <input
          type="number"
          value={spread}
          onChange={(e) => setSpread(Number(e.target.value))}
          style={styles.textInput}
          placeholder="Enter spread"
          min="0"
        />
      </div>

      {/* Inboard Text Input */}
      <div style={styles.controlGroup}>
        <label style={styles.label}>Inboard:</label>
        <input
          type="number"
          value={inboard}
          onChange={(e) => setInboard(Number(e.target.value))}
          style={styles.textInput}
          placeholder="Enter inboard"
          min="0"
        />
      </div>

      {/* Catch Angle Slider */}
      <div style={styles.controlGroup}>
        <label style={styles.label}>Catch Angle: {catchAngle}°</label>
        <input
          type="range"
          min="0"
          max="90"
          value={catchAngle}
          onChange={(e) => setCatchAngle(Number(e.target.value))}
          style={styles.slider}
        />
      </div>

      {/* Finish Angle Slider */}
      <div style={styles.controlGroup}>
        <label style={styles.label}>Finish Angle: {finishAngle}°</label>
        <input
          type="range"
          min="-90"
          max="0"
          value={finishAngle}
          onChange={(e) => setFinishAngle(Number(e.target.value))}
          style={{ ...styles.slider, transform: 'rotate(180deg)' }}
        />
      </div>

      {/* Optional: Additional Controls */}
      {/* 
      <div style={styles.controlGroup}>
        <label style={styles.label}>Outboard:</label>
        <input
          type="number"
          value={outboard}
          onChange={(e) => setOutboard(Number(e.target.value))}
          style={styles.textInput}
          placeholder="Enter outboard"
          min="0"
        />
      </div>

      <div style={styles.controlGroup}>
        <label style={styles.label}>Catch Length:</label>
        <input
          type="number"
          value={catchLength}
          onChange={(e) => setCatchLength(Number(e.target.value))}
          style={styles.textInput}
          placeholder="Enter catch length"
          min="0"
        />
      </div>

      <div style={styles.controlGroup}>
        <label style={styles.label}>Finish Length:</label>
        <input
          type="number"
          value={finishLength}
          onChange={(e) => setFinishLength(Number(e.target.value))}
          style={styles.textInput}
          placeholder="Enter finish length"
          min="0"
        />
      </div>
      */}
    </div>
  );
};

// Inline styles for simplicity; consider using CSS or styled-components for larger projects
const styles = {
  controlPanel: {
    marginBottom: '5px',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '200px',
    backgroundColor: '#f9f9f9',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  slider: {
    width: '100%',
  },
  textInput: {
    padding: '8px',
    fontSize: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
};

export default ControlPanel;