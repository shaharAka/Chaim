import React from 'react';
import ImageSegmentor from '../components/ImageSegmentor'; 

export default function UploadPage() {
  return (
    <div>
      <h1>Upload Image</h1>
      <ImageSegmenter /> {/* Call the ImageSegmenter component three times */}
      <ImageSegmenter />
      <ImageSegmenter />
    </div>
  );
}
