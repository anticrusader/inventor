import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload = ({ images, onChange, maxImages = 5 }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const remainingSlots = maxImages - images.length;
    const newImageFiles = [...files]
      .filter(file => file.type.startsWith('image/'))
      .slice(0, remainingSlots);

    const newImages = newImageFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      isExisting: false
    }));
    
    onChange([...images, ...newImages]);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <Box>
      {/* Upload Area */}
      {images.length < maxImages && (
        <Paper
          sx={{
            p: 2,
            bgcolor: dragActive ? 'action.hover' : 'background.paper',
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'grey.500',
            borderRadius: 2,
            cursor: 'pointer',
            textAlign: 'center',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Upload Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop or click to select ({images.length}/{maxImages} images)
          </Typography>
        </Paper>
      )}

      {/* Image Preview */}
      {images.length > 0 && (
        <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <img
                src={image.url}
                alt={`Preview ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <IconButton
                onClick={() => removeImage(index)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'background.paper'
                  }
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
