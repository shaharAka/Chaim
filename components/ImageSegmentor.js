import ImageUploader from './ImageUploader.js';
import { Stack, Button, CircularProgress } from '@mui/material'; // Import CircularProgress for the spinner
import { Line } from 'react-chartjs-2';
import { TextField } from '@mui/material';
import React, { useState, useRef, useCallback } from 'react';

export default function ImageSegmenter({ onSegmentationComplete }) {
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [filename, setFilename] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [maskArea, setMaskArea] = useState();
  const [deltaEValue, setDeltaEValue] = useState();
  const [segmentationComplete, setSegmentationComplete] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false); // New state for managing when segmentation is happening

  const imgRef = useRef(null);

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
    console.log('Image loaded:', imgRef.current);
  }, []);

  const segmentHandler = async () => {
    setIsSegmenting(true); // Set isSegmenting to true when segmentation starts
    console.log('Segment handler called');
    console.log('completedCrop:', completedCrop);
    console.log('imgRef.current:', imgRef.current);

    if (!completedCrop || !imgRef.current) return;

      // Log the natural and display sizes
    console.log('Natural Width:', imgRef.current.naturalWidth);
    console.log('Display Width:', imgRef.current.width);
    console.log('Natural Height:', imgRef.current.naturalHeight);
    console.log('Display Height:', imgRef.current.height);

     // Get the original image aspect ratio
    const originalAspectRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;

    // Get the displayed width and height
    const displayedWidth = 400;
    const displayedHeight = 400 / originalAspectRatio;

    // Getting the scaling factors
    const scaleX = imgRef.current.naturalWidth / displayedWidth;
    const scaleY = imgRef.current.naturalHeight / displayedHeight;

    // Log the scaling factors
    console.log('ScaleX:', scaleX);
    console.log('ScaleY:', scaleY);

    // Scaling the coordinates
    const scaledCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
      unit: completedCrop.unit,
      aspect: completedCrop.aspect,
    };

    // Log the scaled crop
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
        onSegmentationComplete(data.delta_e, filename);
      }
      setSegmentationComplete(true);
      setIsSegmenting(false); // Set isSegmenting to false when segmentation completes successfully
    } else {
      console.error('Segmentation failed.');
      setIsSegmenting(false); // Set isSegmenting to false if segmentation fails
    }
  };

  return (
    <div>
      <ImageUploader
        onUpload={(name, url) => {
          console.log('Image uploaded:', name, url);
          setFilename(name);
          setOriginalImageUrl(url);
        }}
        setCompletedCrop={setCompletedCrop}
        onImageLoaded={onImageLoad}
      />
      {originalImageUrl && (
        <div>
          {/* Input for Treatment Number */}
          <TextField
            label="Treatment Number"
            variant="outlined"
            value={treatmentNumber}
            onChange={(e) => setTreatmentNumber(e.target.value)}
            style={{ width: '400px', margin: '10px 0' }}
          />

          {!segmentationComplete && (
            isSegmenting ? (
              <CircularProgress /> // Show spinner when segmenting
            ) : (
              <Button
                variant="contained"
                color="primary"
                style={{ width: '400px' }}
                onClick={segmentHandler}
              >
                Segment!
              </Button>
            )
          )}
          {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{ width: "400px", height: "400px" }} />}
          {maskArea !== undefined &&
            <div className="info-box">
              <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>
              <p>Delta E Value: {deltaEValue.toFixed(2)}</p>
            </div>
          }
        </div>
      )}
    </div>
  );
}









