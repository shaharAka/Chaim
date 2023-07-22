import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('crop', completedCrop);

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
      {originalImageUrl && (
        <ReactCrop
          src={originalImageUrl}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={(newCrop) => setCompletedCrop(newCrop)}
        />
      )}
    </div>
  );
}
