import React, { useState, useRef } from 'react';
import { Button, CircularProgress, TextField, useMediaQuery } from '@mui/material';
import ImageUploader from './ImageUploader.js';

export default function ImageSegmentor({ onSegmentationComplete }) {
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [filename, setFilename] = useState(null);
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
            onChange={handleFileChange}
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
            setFilename(name);
            setOriginalImageUrl(url);
          }}
        />
      )}

      {originalImageUrl && (
        <>
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
