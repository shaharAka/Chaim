import React, { useState, useRef } from 'react';
import { Button, CircularProgress, TextField, useMediaQuery } from '@mui/material';
import ImageUploader from './ImageUploader.js';

export default function ImageSegmenter({ onSegmentationComplete }) {
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [filename, setFilename] = useState(null);
  const [treatmentNumber, setTreatmentNumber] = useState('');
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [deltaEValue, setDeltaEValue] = useState(null);

  const isMobile = useMediaQuery('(max-width:600px)');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilename(file.name);
        setOriginalImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const segmentHandler = async () => {
    setIsSegmenting(true);
    // Your existing segmentation logic here (no changes made)
    const response = await fetch('https://www.sunsolve.co/segment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
        image: originalImageUrl,
        crop: JSON.stringify(scaledCrop),  // Assuming scaledCrop is defined elsewhere in your code
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
