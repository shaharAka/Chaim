import { useState, useRef } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [coords, setCoords] = useState({x: 0, y: 0});
  const [coordsDisplay, setCoordsDisplay] = useState(false);
  const imageRef = useRef(null);

  const submitHandler = async (event) => {
    event.preventDefault();
    setCoordsDisplay(false); // reset coords display on new upload
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

  const fileChangedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageClick = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCoords({ x, y });
    setCoordsDisplay(true); // display coords after clicking on the image
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={submitHandler}>
        <input type="file" onChange={fileChangedHandler} />
        <button type="submit">Upload</button>
      </form>
      {originalImageUrl && <img ref={imageRef} src={originalImageUrl} alt="Original" width="400" height="400" onClick={handleImageClick} />}
      <button onClick={() => console.log(coords)}>Click on the wound</button>
      {coordsDisplay && <p>Clicked at: {`X: ${coords.x}, Y: ${coords.y}`}</p>}
    </div>
  );
}
