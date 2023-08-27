import React, { useState, useRef, useEffect} from 'react';
import { Button, CircularProgress, TextField, useMediaQuery } from '@mui/material';
import ImageUploader from './ImageUploader.js';

export default function ImageSegmentor({ onSegmentationComplete }) {
  const [maskBase64, setMaskBase64] = useState(null);
  const [originalImageWidth, setOriginalImageWidth] = useState(null);
  const [originalImageHeight, setOriginalImageHeight] = useState(null);
  const displayedImageWidth = 400; 
  const displayedImageHeight = 400;
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [filename, setFilename] = useState(null);
  const [treatmentNumber, setTreatmentNumber] = useState('');
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [isBoundingBoxSelected, setIsBoundingBoxSelected] = useState(false);
  const [deltaEValue, setDeltaEValue] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [completedCrop, setCompletedCrop] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (originalImageUrl) {
      const img = new Image();
      img.onload = function () {
        setOriginalImageWidth(this.width);
        setOriginalImageHeight(this.height);
      };
      img.src = originalImageUrl;
    }
  }, [originalImageUrl]);

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

    if (originalImageWidth && originalImageHeight) {
      const xScale = originalImageWidth / displayedImageWidth;
      const yScale = originalImageHeight / displayedImageHeight;

      const scaledCrop = {
        x: completedCrop.x * xScale,
        y: completedCrop.y * yScale,
        width: completedCrop.width * xScale,
        height: completedCrop.height * yScale,
      };

      console.log("Sending scaled crop object: ", JSON.stringify(scaledCrop));


    const response = await fetch('https://www.sunsolve.co/segment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
        image: originalImageUrl,
        crop: JSON.stringify(scaledCrop),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setDeltaEValue(data.delta_e);
      setMaskBase64(data.mask_base64);
      
      if (onSegmentationComplete) {
        onSegmentationComplete(parseInt(treatmentNumber, 10), data.delta_e, filename);
      }
    } else {
      console.error('Segmentation failed.');
    }
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

    {/* This part is to display the mask image */}
    {maskBase64 && (
      <div>
        <img src={`data:image/png;base64,${maskBase64}`} alt="Mask" />
      </div>
    )}
  </div>
);

