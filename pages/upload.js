import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [filename, setFilename] = useState();
  const [crop, setCrop] = useState({ aspect: 1/1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [maskArea, setMaskArea] = useState(); // State to hold the mask area
  const [defectColor, setDefectColor] = useState(null); // State to hold the defect color
  const [referenceSkinColor, setReferenceSkinColor] = useState(null); // State to hold the reference skin color
  const imgRef = useRef(null);
  const [deltaEValue, setDeltaEValue] = useState(); // State to hold the Delta E value


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
      console.log('Server response:', data);
      setOriginalImageUrl(data.original_image_url);
      setFilename(selectedFile.name);
      console.log('Uploaded successfully!');
    } else {
      console.error('Upload failed.');
    }
  };

  const segmentHandler = async () => {
    // Getting the scaling factors
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // Scaling the coordinates
    const scaledCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
      unit: completedCrop.unit,
      aspect: completedCrop.aspect,
    };

    const response = await fetch('https://www.sunsolve.co/segment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
        crop: JSON.stringify(scaledCrop), // Sending the scaled coordinates
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const maskBase64 = data.mask_base64;
      setOverlayImageUrl(`data:image/png;base64,${maskBase64}`);
      setMaskArea(data.mask_area_mm2); // Set the mask area
      setDefectColor(data.defect_color); // Set the defect color
      setReferenceSkinColor(data.reference_skin_color); // Set the reference skin color
      setDeltaEValue(data.delta_e);
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
          <ReactCrop
            src={originalImageUrl}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            style={{maxWidth: "400px", maxHeight: "400px"}}
          />
          <button onClick={segmentHandler}>Segment!</button>
        </div>}
      {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{width: "400px", height: "400px"}} />}
      <div>
      {maskArea !== undefined && 
    <div className="info-box">
      <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>
      <p>Defect Color: 
        <span style={{background: `rgb(${defectColor.join(',')})`, padding: '5px'}}>&nbsp;</span> {defectColor.join(', ')}
      </p>
      <p>Reference Skin Color: 
        <span style={{background: `rgb(${referenceSkinColor.join(',')})`, padding: '5px'}}>&nbsp;</span> {referenceSkinColor.join(', ')}
      </p>
      <p>Delta E Value: {deltaEValue.toFixed(2)}</p> {/* Rendering the deltaE value */}
    </div>}
</div>

}
