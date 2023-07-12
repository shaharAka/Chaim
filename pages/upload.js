import { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
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
    </div>
  );
}
