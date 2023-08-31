import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import LeftMenu from '../components/leftMenu';
import { useMediaQuery, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [filename, setFilename] = useState();
  const [crop, setCrop] = useState({ aspect: 1/1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [maskArea, setMaskArea] = useState(); // State to hold the mask area
  const imgRef = useRef(null);
  const [deltaEValue, setDeltaEValue] = useState(); // State to hold the Delta E value
  const isMobile = useMediaQuery('(max-width:600px)');

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('https://www.sunsolve.co/uploadfile/', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const data = await response.json();
      setOriginalImageUrl(data.original_image_url);
      setFilename(selectedFile.name);
      setIsUploading(false);
    } else {
      console.error('Upload failed.');
    }
  };

  const segmentHandler = async () => {
    setIsSegmenting(true);
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
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
        crop: JSON.stringify(scaledCrop),
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      const maskBase64 = data.mask_base64;
      setOverlayImageUrl(`data:image/png;base64,${maskBase64}`);
      setMaskArea(data.mask_area_mm2);
      setDeltaEValue(data.delta_e);
      setIsSegmenting(false);
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

  const mobileStyles = {
    button: {
      padding: '15px 30px',
      fontSize: '1.2em',
    },
    input: {
      fontSize: '1.2em',
    },
    container: {
      padding: '20px',
    },
    title: {
      fontSize: '2em',
    },
    guideText: {
      fontSize: '1.2em',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={mobileStyles.container}>
      <LeftMenu />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h4>Treatment #1:</h4>
            {deltaEValue !== undefined && <span>Delta E Value: {deltaEValue.toFixed(2)}</span>}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: '100%' }}>
            <h1 style={mobileStyles.title}>Upload Image</h1>
            {!originalImageUrl &&
              <form onSubmit={submitHandler}>
                <input type="file" onChange={fileChangedHandler} style={mobileStyles.input} />
                <button type="submit" style={mobileStyles.button}>Upload</button>
              </form>
            }
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
                <div style={mobileStyles.guideText}>Drag a segmentation area around the wound</div>
                <button onClick={segmentHandler} style={mobileStyles.button}>
                  {isSegmenting ? <CircularProgress size={24} /> : 'Segment!'}
                </button>
              </div>
            }
            {overlayImageUrl && (
              <div style={{ marginTop: '20px' }}>
                <h2>Segmented Image:</h2>
                <img src={overlayImageUrl} alt="Overlay" style={{ maxWidth: "400px", maxHeight: "400px" }} />
              </div>
            )}
            {maskArea !== undefined && 
              <div className="info-box">
                <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>
                <p>Delta E Value: {deltaEValue.toFixed(2)}</p> 
              </div>
            }
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
