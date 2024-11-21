// src/components/SiteHeader.jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Styled AppBar with custom colors and border
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: '#ffffff',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Styled Toolbar to adjust height and center content
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '80px', // Increased height to accommodate additional text
  display: 'flex',
  flexDirection: 'column', // Stack items vertically
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const SiteHeader = () => {
  return (
    <StyledAppBar position="fixed" elevation={0}>
      <StyledToolbar>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
          Interactive Rigger
        </Typography>
        <Typography
          variant="subtitle2"
          component="h2"
          sx={{ fontWeight: 300, color: 'grey.400', mt: 0.5 }}
        >
          Explore rigging adjustments to a sweep rowing shell. Improvements coming soon.
        </Typography>
        <Typography
          variant="caption"
          component="p"
          sx={{ fontWeight: 300, color: 'grey.400', mt: 1 }}
        >
          © 2024 J.D. Laurence-Chasen. All rights reserved.
        </Typography>
      </StyledToolbar>
    </StyledAppBar>
  );
};
