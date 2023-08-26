import React, { useState, useRef } from 'react';
import { Button, CircularProgress, TextField, useMediaQuery } from '@mui/material';
import ImageUploader from './ImageUploader.js';

export default function ImageSegmentor({ onSegmentationComplete, originalImageUrl, filename }) {
  const [treatmentNumber, setTreatmentNumber] = useState('');
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [deltaEValue, setDeltaEValue] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const fileInputRef = useRef(null);

  const segmentHandler = async () => {
    setIsSegmenting(true);

    // Your existing segmentation logic here
    const response = await fetch('https://www.sunsolve.co/segment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
        image: originalImageUrl,
        // Replace scaledCrop with your actual variable
        crop: JSON.stringify({}),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setDeltaEValue(data.delta_e);
      if (onSegmentationComplete) {
        onSegmentationComplete(parseInt(treatmentNumber, 10), data.delta_e, filename);
      }
    } else {
      console.error('Segmentation failed.');
    }

    setIsSegmenting(false);
  };

  return (
    <div>
      {isMobile ? (
        <>
          <input
            type="file"
            accept="image/*"
            capture="camera"
            ref={fileInputRef}
            style={{ display: 'none' }}
            // Remove this function since you're not using this code path in this component anymore
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fileInputRef.current.click()}
          >
            Capture or Select Image
          </Button>
        </>
      ) : (
        <ImageUploader
          onUpload={(name, url) => {
            // Comment these lines out, this part will be done in UploadPage.js
            // setFilename(name);
            // setOriginalImageUrl(url);
          }}
        />
      )}

      {originalImageUrl && (
        <>
          <img src={originalImageUrl} alt="Uploaded" style={{ width: '400px', height: '400px' }} />
          <TextField
            variant="outlined"
            label="Treatment Number"
            type="number"
            value={treatmentNumber}
            onChange={(e) => setTreatmentNumber(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={segmentHandler}
          >
            Segment!
          </Button>
        </>
      )}

      {isSegmenting && <CircularProgress />}
      {deltaEValue !== undefined && <div>Delta E: {deltaEValue}</div>}
    </div>
  );
}
