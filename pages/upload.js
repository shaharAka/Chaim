import { useState, useRef } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [coords, setCoords] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef(null);

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

  const handleImageClick = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCoords(oldCoords => [...oldCoords, { x, y }]);
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={submitHandler}>
        <input type="file" onChange={fileChangedHandler} />
        <button type="submit">Upload</button>
      </form>
      {originalImageUrl && <img ref={imageRef} src={originalImageUrl} alt="Original" width="400" height="400" onClick={handleImageClick} onLoad={() => setIsImageLoaded(true)} />}
      {isImageLoaded && <button onClick={() => console.log(coords)}>Click on the wound</button>}
      {coords.map((coord, index) => <p key={index}>Clicked at: {`X: ${coord.x}, Y: ${coord.y}`}</p>)}
      <style jsx>{`
        img {
          position: relative;
        }
        img::after {
          content: '';
          position: absolute;
          top: ${coords.length > 0 ? `${coords[coords.length - 1].y}px` : '0'};
          left: ${coords.length > 0 ? `${coords[coords.length - 1].x}px` : '0'};
          width: 10px;
          height: 10px;
          background: red;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
