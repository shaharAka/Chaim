import ImageUploader from './ImageUploader.js';
import { Button, CircularProgress, TextField } from '@mui/material';
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

      console.log('Segmented successfully!');
      if (onSegmentationComplete) {
        onSegmentationComplete(treatmentNumber, data.delta_e, filename); // Fix the order of parameters
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
        <ImageUploader
          onUpload={(name, url) => {
            setFilename(name);
            setOriginalImageUrl(url);
          }}
          setCompletedCrop={setCompletedCrop}
          onImageLoaded={onImageLoad}
        />
        {originalImageUrl && (
          <div>
            <TextField
              label="Treatment Number"
              variant="outlined"
              value={treatmentNumber}
              onChange={(e) => setTreatmentNumber(e.target.value)}
              style={{ width: '400px', margin: '10px 0' }}
            />
            <div style={{ textAlign: 'center' }}>
              {!segmentationComplete && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '400px', display: 'block', margin: '10px 0' }}
                  onClick={segmentHandler}
                  disabled={!treatmentNumber || isSegmenting}
                >
                  {isSegmenting ? <CircularProgress size={24} /> : 'Segment!'}
                </Button>
              )}
              {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{ width: "400px", height: "400px" }} />}
              {maskArea !== undefined &&
                <div className="info-box">
                  <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>
                  <p>Delta E Value: {deltaEValue.toFixed(2)}</p>
                </div>
              }
            </div>
            {estimatedRemainingTreatments !== null && (
              <div style={{ marginLeft: '20px', padding: '10px', border: '2px solid #000', borderRadius: '8px' }}>
                <h3>Estimated remaining treatments:</h3>
                <p style={{ fontSize: '18px' }}>{estimatedRemainingTreatments}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
