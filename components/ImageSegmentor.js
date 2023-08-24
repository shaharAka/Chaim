import ImageUploader from './ImageUploader.js';
import { Button, CircularProgress, TextField, useMediaQuery } from '@mui/material';
import React, { useState, useRef, useCallback } from 'react';

export default function ImageSegmenter({ onSegmentationComplete, linearModel }) {
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [filename, setFilename] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [maskArea, setMaskArea] = useState();
  const [deltaEValue, setDeltaEValue] = useState();
  const [segmentationComplete, setSegmentationComplete] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [treatmentNumber, setTreatmentNumber] = useState('');
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
    const isMobile = useMediaQuery('(max-width:600px)');


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the file and pass it to ImageUploader
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilename(file.name);
        setOriginalImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
    console.log('Image loaded:', imgRef.current);
  }, []);

  const segmentHandler = async () => {
    setIsSegmenting(true);
    console.log('Segment handler called');
    console.log('completedCrop:', completedCrop);
    console.log('imgRef.current:', imgRef.current);

    if (!completedCrop || !imgRef.current) return;

    console.log('Natural Width:', imgRef.current.naturalWidth);
    console.log('Display Width:', imgRef.current.width);
    console.log('Natural Height:', imgRef.current.naturalHeight);
    console.log('Display Height:', imgRef.current.height);

    const originalAspectRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
    const displayedWidth = 400;
    const displayedHeight = 400 / originalAspectRatio;
    const scaleX = imgRef.current.naturalWidth / displayedWidth;
    const scaleY = imgRef.current.naturalHeight / displayedHeight;

    console.log('ScaleX:', scaleX);
    console.log('ScaleY:', scaleY);

    const scaledCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
      unit: completedCrop.unit,
      aspect: completedCrop.aspect,
    };

    console.log('Scaled Crop:', scaledCrop);

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
      const maskBase64 = data.mask_base64;
      setOverlayImageUrl(`data:image/png;base64,${maskBase64}`);
      setMaskArea(data.mask_area_mm2);
      setDeltaEValue(data.delta_e);
      console.log(data.delta_e);

      console.log('Segmented successfully!');
      if (onSegmentationComplete) {
        onSegmentationComplete(parseInt(treatmentNumber, 10), data.delta_e, filename);
      }
      setSegmentationComplete(true);
    } else {
      console.error('Segmentation failed.');
    }

    setIsSegmenting(false);
  };

  const estimateRemainingTreatments = () => {
    if (linearModel && linearModel.slope) {
      return Math.ceil((100 - linearModel.intercept) / linearModel.slope);
    }
    return null;
  };

  const estimatedRemainingTreatments = estimateRemainingTreatments();

  return (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div>
      {isMobile ? (
        <input
          type="file"
          accept="image/*"
          capture="camera"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      ) : (
        <ImageUploader
          onUpload={(name, url) => {
            setFilename(name);
            setOriginalImageUrl(url);
          }}
          setCompletedCrop={setCompletedCrop}
          onImageLoaded={onImageLoad}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        style={{ width: '400px', display: 'block', margin: '10px 0' }}
        onClick={() => fileInputRef.current.click()}
      >
        {isMobile ? 'Capture or Select Image' : 'Upload Image'}
      </Button>
    </div>
    {originalImageUrl && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={originalImageUrl} alt="Original" style={{ width: '400px', height: '400px' }} />
        <TextField
          variant="outlined"
          label="Treatment Number"
          type="number"
          value={treatmentNumber}
          onChange={e => setTreatmentNumber(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ margin: '10px 0' }}
          onClick={handleSegmentation}
        >
          Segment Image
        </Button>
        {segmenting && <CircularProgress />}
        {deltaE !== undefined && <div>Delta E: {deltaE}</div>}
      </div>
    )}
  </div>
);

