import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';
import Button from '@material-ui/core/Button';

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
      <div style={{ display: 'flex' }}>
        {imageSegmentors.map((segmentor, index) => (
          <div key={index} style={{ marginRight: '16px' }}>
            <ImageSegmentor onSegmentationComplete={handleSegmentationComplete} />
          </div>
        ))}
        {segmentationComplete && (
          <Button
            variant="contained"
            color="primary"
            style={{ height: '400px', width: '400px' }} // Match the height and width of the image
            onClick={addImageSegmentor}
          >
            +
          </Button>
        )}
      </div> {/* This closing div tag was missing */}
    </div>
  );
}
