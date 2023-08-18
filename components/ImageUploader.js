import React, { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import { useDropzone } from 'react-dropzone';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Stack } from '@mui/material';

export default function ImageUploader({ onUpload, setCompletedCrop, onImageLoaded }) {
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setOriginalImageUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      onUpload(file.name, reader.result);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        {originalImageUrl && (
          <div>
            <ReactCrop
              src={originalImageUrl}
              onImageLoaded={onImageLoaded} // Added this line
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)} // Modified this line
              style={{ maxWidth: '400px', maxHeight: '400px' }}
            />
          </div>
        )}
      </Stack>
    </div>
  );
}
