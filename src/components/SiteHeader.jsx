// src/components/SiteHeader.jsx
import { Box, Typography } from '@mui/material';

// Brand block rendered inside the App's toolbar (the AppBar itself lives in App
// so it can also host the responsive menu button).
export const SiteHeader = () => {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="h6" component="h1" noWrap sx={{ lineHeight: 1.1 }}>
        Interactive Rigger
      </Typography>
      <Typography
        variant="caption"
        component="p"
        sx={{
          display: { xs: 'none', sm: 'block' },
          color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.2,
        }}
      >
        Visualize &amp; explore sweep rigging — load, length, and angles
      </Typography>
    </Box>
  );
};
