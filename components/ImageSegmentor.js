import React, { useState, useRef } from 'react';
import ImageUploader from './ImageUploader.js';

export default function ImageSegmenter({ onSegmentationComplete }) {
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [filename, setFilename] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [maskArea, setMaskArea] = useState(); // State to hold the mask area
  const [deltaEValue, setDeltaEValue] = useState(); // State to hold the Delta E value
  const imgRef = useRef(null);
  
  const onImageLoad = (event) => {
    imgRef.current = event.target; // event.target will contain the img element
  };

  const segmentHandler = async () => {
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
        crop: JSON.stringify(scaledCrop), // Sending the scaled coordinates
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const maskBase64 = data.mask_base64;
      setOverlayImageUrl(`data:image/png;base64,${maskBase64}`);
      setMaskArea(data.mask_area_mm2); // Set the mask area
      setDeltaEValue(data.delta_e);
      console.log('Segmented successfully!');
      if (onSegmentationComplete) {
        onSegmentationComplete(); 
      }
    } else {
      console.error('Segmentation failed.');
    }
  };

  return (
    <div>
      <ImageUploader
        onUpload={(name, url) => {
          setFilename(name);
          setOriginalImageUrl(url);
        }}
        setCompletedCrop={setCompletedCrop}
        onImageLoaded={onImageLoad} // Just pass the reference to the function
      />
      <button onClick={segmentHandler}>Segment!</button>
      {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{ width: "400px", height: "400px" }} />}
      <div>
        {maskArea !== undefined &&
          <div className="info-box">
            <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>
            <p>Delta E Value: {deltaEValue.toFixed(2)}</p>
          </div>
        }
      </div>
        {originalImageUrl && <img ref={imgRef} src={originalImageUrl} alt="Original" style={{ display: 'none' }} onLoad={onImageLoad} />} 
    </div>
  );
}






