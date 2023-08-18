import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';

export default function UploadPage() {
  const [imageSegmentors, setImageSegmentors] = useState([<ImageSegmentor key={0} />]);

  const addImageSegmentor = () => {
    setImageSegmentors([
      ...imageSegmentors,
      <ImageSegmentor key={imageSegmentors.length} />,
    ]);
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {imageSegmentors}
      </div>
      <button onClick={addImageSegmentor} style={{ marginTop: '20px' }}>+</button>
    </div>
  );
}

