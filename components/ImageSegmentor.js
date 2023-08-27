import React, { useState, useRef } from 'react';
import { Button, CircularProgress, TextField, useMediaQuery } from '@mui/material';
import ImageUploader from './ImageUploader.js';

export default function ImageSegmentor({ onSegmentationComplete }) {
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [filename, setFilename] = useState(null);
  const [treatmentNumber, setTreatmentNumber] = useState('');
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [isBoundingBoxSelected, setIsBoundingBoxSelected] = useState(false);
  const [deltaEValue, setDeltaEValue] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [completedCrop, setCompletedCrop] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImageUrl(reader.result);
        setFilename(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const segmentHandler = async () => {
    setIsSegmenting(true);
    console.log("Sending crop object: ", JSON.stringify(completedCrop));

    const response = await fetch('https://www.sunsolve.co/segment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
        image: originalImageUrl,
        crop: JSON.stringify(completedCrop),
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

  const handleBoundingBoxSelection = (completedCrop) => {
    if (completedCrop?.width > 0 && completedCrop?.height > 0) {
      setIsBoundingBoxSelected(true);
      setCompletedCrop(completedCrop);
    } else {
      setIsBoundingBoxSelected(false);
    }
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
          onBoundingBoxSelection={handleBoundingBoxSelection}
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
          <div>Please select a bounding box around the wound.</div>
          <Button
            variant="contained"
            color="primary"
            onClick={segmentHandler}
            disabled={!isBoundingBoxSelected || !treatmentNumber}
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
