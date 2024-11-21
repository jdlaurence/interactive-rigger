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
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Spread (cm)"
          type="number"
          value={spread}
          onChange={(e) => setSpread(Number(e.target.value))}
          placeholder="Enter spread"
          inputProps={{
            min: 75,
            max: 85,
            step: 0.5,
          }}
          fullWidth
        />
      </Box>

      {/* Inboard Text Input */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Inboard (cm)"
          type="number"
          value={inboard}
          onChange={(e) => setInboard(Number(e.target.value))}
          placeholder="Enter inboard"
          inputProps={{
            min: 113,
            max: 118,
            step: 0.5,
          }}
          fullWidth
        />
      </Box>

      {/* Catch Angle Slider */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1" gutterBottom>
          Catch Angle: {catchAngle}°
        </Typography>
        <Slider
          value={catchAngle}
          min={0}
          max={90}
          onChange={(e, newValue) => setCatchAngle(newValue)}
        />
      </Box>

      {/* Finish Angle Slider */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1" gutterBottom>
          Finish Angle: {finishAngle}°
        </Typography>
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
