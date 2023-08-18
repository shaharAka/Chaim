import React, { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import { useDropzone } from 'react-dropzone';
import 'react-image-crop/dist/ReactCrop.css';
import { Stack, Button } from '@mui/material';

export default function ImageUploader({ onUpload, setCompletedCrop }) {
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [crop, setCrop] = useState({ aspect: 1 / 1 });

  const onDrop = useCallback((acceptedFiles) => {
  const file = acceptedFiles[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    const result = reader.result;
    setOriginalImageUrl(result);
    if (file) {
      onUpload(file.name, result); // Call onUpload here after reading is complete
    }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        {!originalImageUrl && (
          <div {...getRootProps()} style={{ border: '2px dashed #000', padding: '10px', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <p>Drag and drop an image here, or click to select an image</p>
          </div>
        )}
        {originalImageUrl && (
          <div>
            <ReactCrop
              src={originalImageUrl}
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              style={{ maxWidth: '400px', maxHeight: '400px' }}
            />
          </div>
        )}
      </Stack>
    </div>
  );
}
