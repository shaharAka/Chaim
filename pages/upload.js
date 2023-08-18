import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';

export default function UploadPage() {
  const [imageSegmentors, setImageSegmentors] = useState([0]); // State to hold the count of ImageSegmentor components
  const [segmentationComplete, setSegmentationComplete] = useState(false); // Flag to check if segmentation is complete

  // Handler to add a new ImageSegmentor component
  const addImageSegmentor = () => {
    setImageSegmentors([...imageSegmentors, imageSegmentors.length]);
    setSegmentationComplete(false); // Reset the segmentation complete flag
  };

  // Callback to mark segmentation as complete
  const handleSegmentationComplete = () => {
    setSegmentationComplete(true);
  };

  return (
    <div>
      <h1>Upload Image</h1>
      {imageSegmentors.map((segmentor, index) => (
        <ImageSegmentor key={index} onSegmentationComplete={handleSegmentationComplete} />
      ))}
      {segmentationComplete && (
        <button onClick={addImageSegmentor}>+</button>
      )}
    </div>
  );
}
