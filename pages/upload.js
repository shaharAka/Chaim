import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useMediaQuery, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TreatmentSection = ({ index, onSegmentDone }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [overlayImageUrl, setOverlayImageUrl] = useState();
  const [filename, setFilename] = useState();
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [maskArea, setMaskArea] = useState();
  const imgRef = useRef(null);
  const [deltaEValue, setDeltaEValue] = useState();

  const isMobile = useMediaQuery('(max-width:600px)');
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
    }
  };

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
      onSegmentDone();  // Notify the parent component that the segmentation is done
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
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div>Treatment #{index + 1}</div>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          <form onSubmit={submitHandler}>
            <input type="file" onChange={fileChangedHandler} style={mobileStyles.input} />
            <button type="submit" style={mobileStyles.button}>Upload</button>
          </form>
          {isUploading && <CircularProgress />}
          {originalImageUrl && (
            <ReactCrop
              src={originalImageUrl}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              style={{maxWidth: "400px", maxHeight: "400px"}}
            />
          )}
          {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{width: "400px", height: "400px"}} />}
          {maskArea !== undefined && <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>}
          {deltaEValue !== undefined && <div>Delta E Value: {deltaEValue.toFixed(2)}</div>}
          <button onClick={segmentHandler} style={mobileStyles.button}>
            {isSegmenting ? <CircularProgress size={24} /> : 'Segment!'}
          </button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default function UploadPage() {
  const [sections, setSections] = useState([{}]);
  const isMobile = useMediaQuery('(max-width:600px)');

  const addSection = () => {
    setSections([...sections, {}]);
  };

  const onSegmentDone = () => {
    addSection();  // Add a new section when segmentation is done
  };

  return (
    <div>
      {sections.map((_, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div>Treatment #{index + 1}</div>
          </AccordionSummary>
          <AccordionDetails>
            <TreatmentSection onSegmentDone={onSegmentDone} />
          </AccordionDetails>
        </Accordion>
      ))}
      <Button variant="contained" color="primary" onClick={addSection}>
        Add Another Treatment
      </Button>
    </div>
  );
}
