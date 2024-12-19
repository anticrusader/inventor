import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import FullScreenImage from './FullScreenImage';

const ZoomableImage = ({ src, alt }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [fullScreen, setFullScreen] = useState(false);
  const imgRef = useRef(null);

  const MAGNIFIER_SIZE = 200;
  const ZOOM_LEVEL = 4;

  const handleMouseMove = (e) => {
    const elem = imgRef.current;
    if (!elem) return;

    const { top, left, width, height } = elem.getBoundingClientRect();
    
    // Get cursor position relative to image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Keep magnifier within image bounds
    const magnifierX = Math.min(Math.max(MAGNIFIER_SIZE/2, x), width - MAGNIFIER_SIZE/2);
    const magnifierY = Math.min(Math.max(MAGNIFIER_SIZE/2, y), height - MAGNIFIER_SIZE/2);

    setMagnifierPosition({
      x: magnifierX,
      y: magnifierY,
      sourceX: x,
      sourceY: y
    });
  };

  const handleClick = () => {
    setFullScreen(true);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          cursor: 'zoom-in',
          '&:hover .magnifier': {
            opacity: 1
          }
        }}
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: 4,
            display: 'block'
          }}
        />
        {showMagnifier && (
          <Box
            className="magnifier"
            sx={{
              position: 'absolute',
              width: MAGNIFIER_SIZE,
              height: MAGNIFIER_SIZE,
              border: '2px solid #fff',
              borderRadius: '50%',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.2s',
              backgroundColor: '#fff',
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${ZOOM_LEVEL * 100}% ${ZOOM_LEVEL * 100}%`,
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              transform: 'translate(-50%, -50%)',
              left: magnifierPosition.x,
              top: magnifierPosition.y,
              backgroundPosition: `${-magnifierPosition.sourceX * ZOOM_LEVEL + MAGNIFIER_SIZE/2}px ${-magnifierPosition.sourceY * ZOOM_LEVEL + MAGNIFIER_SIZE/2}px`
            }}
          />
        )}
      </Box>

      <FullScreenImage
        open={fullScreen}
        onClose={() => setFullScreen(false)}
        src={src}
        alt={alt}
      />
    </>
  );
};

export default ZoomableImage;
