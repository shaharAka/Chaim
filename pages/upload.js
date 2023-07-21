import { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [imageUrl, setImageUrl] = useState();

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
      setImageUrl(data.original_image_url);
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
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
