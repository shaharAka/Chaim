import { useState, useRef } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [coords, setCoords] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageContainerRef = useRef(null);

  const submitHandler = async (event) => {
    event.preventDefault();
    setCoords([]); // reset coords on new upload
    setIsImageLoaded(false); // reset image load status on new upload
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

  const handleImageClick = async (event) => {
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCoords(oldCoords => [...oldCoords, { x, y }]);
    // Send coordinates to the backend
    const response = await fetch('https://www.sunsolve.co/getcoords/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ x, y }),
    });
    if (!response.ok) {
      console.error('Failed to send coordinates to the backend.');
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={submitHandler}>
        <input type="file" onChange={fileChangedHandler} />
        <button type="submit">Upload</button>
      </form>
      <div ref={imageContainerRef} onClick={handleImageClick} style={{ position: 'relative', width: '400px', height: '400px' }}>
        {originalImageUrl && <img src={originalImageUrl} alt="Original" width="400" height="400" onLoad={() => setIsImageLoaded(true)} />}
        {coords.map((coord, index) => (
          <div key={index} style={{ position: 'absolute', top: `${coord.y}px`, left: `${coord.x}px`, width: '10px', height: '10px', background: 'red', borderRadius: '50%' }}></div>
        ))}
      </div>
      {isImageLoaded && <p>Click on the wound</p>}
      {coords.map((coord, index) => <p key={index}>Clicked at: {`X: ${coord.x}, Y: ${coord.y}`}</p>)}
    </div>
  );
}
