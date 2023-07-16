import { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('http://34.127.124.108:8000/uploadfile/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setImageUrl(data.original_image_url); // Assuming you want to display the original image
      // or setImageUrl(data.overlay_image_url); to display the overlay
      setDimensions({ width: data.image_width, height: data.image_height });
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
      {imageUrl && <img src={imageUrl} width={dimensions.width} height={dimensions.height} />}
    </div>
  );
}
