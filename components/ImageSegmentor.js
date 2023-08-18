import React, { useState, useRef } from 'react';
import ImageUploader from './ImageUploader.js';

export default function ImageSegmenter() {
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [filename, setFilename] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [maskArea, setMaskArea] = useState(); // State to hold the mask area
  const [deltaEValue, setDeltaEValue] = useState(); // State to hold the Delta E value
  const imgRef = useRef(null);

  const segmentHandler = async () => {
    if (!completedCrop) return;

    // Getting the scaling factors
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // Scaling the coordinates
    const scaledCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
      unit: completedCrop.unit,
      aspect: completedCrop.aspect,
    };

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
        {originalImageUrl && <img ref={imgRef} src={originalImageUrl} alt="Original" style={{ display: 'none' }} />}
    </div>
  );
}
