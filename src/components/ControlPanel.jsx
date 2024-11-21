// src/components/ControlPanel.jsx
import React from 'react';
import { Box, TextField, Slider, Typography } from '@mui/material';

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
    <Box sx={{ padding: 2 }}>
      
      {/* Spread Text Input */}
      <div style={styles.controlGroup}>
        <label style={styles.label}>Spread (cm):</label>
        <input
          type="number"
          value={spread}
          onChange={(e) => setSpread(Number(e.target.value))}
          style={styles.textInput}
          placeholder="Enter spread"
          min={75}
          max={85}
          step={.5}
        />
      </div>

      {/* Inboard Text Input */}
      <div style={styles.controlGroup}>
        <label style={styles.label}>Inboard (cm):</label>
        <input
          type="number"
          value={inboard}
          onChange={(e) => setInboard(Number(e.target.value))}
          style={styles.textInput}
          placeholder="Enter inboard"
          min={113}
          max={118}
          step={.5}
        />
      </div>

      {/* Catch Angle Slider */}
      <Box sx={{ marginBottom: 2 }}>
      <label style={styles.label}>Catch Angle: {catchAngle}°</label>
        <Slider
          value={catchAngle}
          min={0}
          max={90}
          onChange={(e, newValue) => setCatchAngle(newValue)}
        />
      </Box>

      {/* Finish Angle Slider */}
      <Box sx={{ marginBottom: 2 }}>
      <label style={styles.label}>Finish Angle: {finishAngle}°</label>
        <Slider
          value={finishAngle}
          min={-90}
          max={0}
          onChange={(e, newValue) => setFinishAngle(newValue)}
        />
      </Box>

      {/* Optional Additional Controls */}
      {/* Uncomment if needed
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Outboard (cm)"
          type="number"
          value={outboard}
          onChange={(e) => setOutboard(Number(e.target.value))}
          fullWidth
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Catch Length (cm)"
          type="number"
          value={catchLength}
          onChange={(e) => setCatchLength(Number(e.target.value))}
          fullWidth
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Finish Length (cm)"
          type="number"
          value={finishLength}
          onChange={(e) => setFinishLength(Number(e.target.value))}
          fullWidth
        />
      </Box>
      */}
    </Box>
  );
};

export default ControlPanel;

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
    fontSize: '14px',
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