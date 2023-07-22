import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [crop, setCrop] = useState({ aspect: 1/1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('https://www.sunsolve.co/uploadfile/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setOriginalImageUrl(data.original_image_url);
      console.log('Uploaded successfully!');
    } else {
      console.error('Upload failed.');
    }
  };

  const segmentHandler = async () => {
    const formData = new FormData();
    formData.append('crop', completedCrop);

    const response = await fetch('https://www.sunsolve.co/segment/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setOriginalImageUrl(data.segmented_image_url);
      console.log('Segmented successfully!');
    } else {
      console.error('Segmentation failed.');
    }
  };

  const onLoad = (img) => {
    imgRef.current = img;
  };

  const fileChangedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={submitHandler}>
        <input type="file" onChange={fileChangedHandler} />
        <button type="submit">Upload</button>
      </form>
      {originalImageUrl && 
      <div>
        <div>
          <ReactImageCrop
            src={originalImageUrl}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
          />
        </div>
        <button onClick={segmentHandler}>Segment!</button>
      </div>}
      {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{width: "400px", height: "400px"}} />}
    </div>
  );
}
