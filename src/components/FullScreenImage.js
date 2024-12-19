import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const FullScreenImage = ({ open, onClose, src, alt }) => {
  const [scale, setScale] = React.useState(1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          maxHeight: '95vh',
          maxWidth: '95vw',
          m: 1,
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Control buttons */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          display: 'flex',
          gap: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 1,
          p: 0.5
        }}>
          <IconButton 
            onClick={handleZoomIn}
            sx={{ color: 'white' }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton 
            onClick={handleZoomOut}
            sx={{ color: 'white' }}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton 
            onClick={onClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Image container */}
        <Box
          sx={{
            width: '100%',
            height: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImage;
