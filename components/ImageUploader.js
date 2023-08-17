import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Stack } from '@mui/material';

export default function ImageUploader({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [crop, setCrop] = useState({ aspect: 1/1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const fileChangedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('https://www.sunsolve.co/uploadfile/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setOriginalImageUrl(data.original_image_url);
      onUpload(selectedFile.name, data.original_image_url);
    } else {
      console.error('Upload failed.');
    }
  };

  const onLoad = (img) => {
    imgRef.current = img;
  };

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        <label htmlFor="contained-button-file">
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="contained-button-file"
            type="file"
            onChange={fileChangedHandler}
          />
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
        <Button variant="contained" onClick={submitHandler}>
          Submit
        </Button>
      </Stack>
      {originalImageUrl && (
        <div>
          <ReactCrop
            src={originalImageUrl}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            style={{ maxWidth: '400px', maxHeight: '400px' }}
          />
        </div>
      )}
    </div>
  );
}
