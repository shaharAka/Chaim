import { useState, useRef, useEffect } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [clicks, setClicks] = useState([]);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.addEventListener('click', (event) => {
        const rect = imageRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        var is_positive = true;
        setClicks((oldClicks) => [...oldClicks, {x, y, is_positive}]);
      });
    }
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener('click');
      }
    };
  }, [imageRef.current]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('clicks', JSON.stringify(clicks));

    const response = await fetch('https://www.sunsolve.co/uploadfile/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setOriginalImageUrl(data.original_image_url);
      setOverlayImageUrl(data.overlay_image_url);
      console.log('Uploaded successfully!');
    } else {
      console.error('Upload failed.');
    }
    setIsLoading(false);
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
      <div style={{ position: 'relative', width: 400, height: 400, border: '1px solid black' }}>
        {isLoading && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>Loading...</div>}
        {originalImageUrl && <img ref={imageRef} src={originalImageUrl} alt="Original" width="400" height="400" />}
      </div>
      <div style={{ position: 'relative', width: 400, height: 400, border: '1px solid black' }}>
        {isLoading && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>Loading...</div>}
        {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" width="400" height="400" />}
      </div>
    </div>
  );
}
