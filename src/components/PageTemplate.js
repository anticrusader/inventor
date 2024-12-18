import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const PageTemplate = ({ title, children, showFilter = true }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">{title}</Typography>
        {showFilter && (
          <Button
            variant="outlined"
            startIcon={<FilterAltOutlinedIcon />}
            sx={{ borderRadius: '8px' }}
          >
            Filter
          </Button>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default PageTemplate;
