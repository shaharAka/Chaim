import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useMediaQuery, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Typography  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LeftMenu from '../components/leftMenu';


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
  useEffect(() => {
    if (deltaEValue !== undefined) {
      handleSegmentDone();
    }
  }, [deltaEValue]);
  const handleSegmentDone = () => {
    console.log('deltaEValue before calling onSegmentDone:', deltaEValue);
    onSegmentDone(deltaEValue);  
    console.log('handleSegmentDone executed, deltaE:', deltaEValue);
  };
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
      console.log("deltaEvalue 2", deltaEValue)
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
  return (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <div>Treatment #{index + 1}</div>
      {deltaEValue !== undefined && <span>Delta E Value: {deltaEValue.toFixed(2)}</span>}
    </AccordionSummary>
    <AccordionDetails>
      <div style={{ width: '100%' }}>
        {!originalImageUrl ? (
          <>
            <form onSubmit={submitHandler}>
              <input type="file" onChange={fileChangedHandler} style={mobileStyles.input} />
              <button type="submit" style={mobileStyles.button}>Upload</button>
            </form>
            {isUploading && <CircularProgress />}
          </>
        ) : (
          <>
            <Typography variant="h6" style={{ color: 'black' }}>
              {index === 0 && 'Drag a box around the wound and click Segment!'}
            </Typography>
            <ReactCrop
              src={originalImageUrl}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              style={{maxWidth: "400px", maxHeight: "400px"}}
            />
            <button onClick={segmentHandler} style={mobileStyles.button}>
              {isSegmenting ? <CircularProgress size={24} /> : 'Segment!'}
            </button>
          </>
        )}
        {overlayImageUrl && <img src={overlayImageUrl} alt="Overlay" style={{width: "400px", height: "400px"}} />}
        {maskArea !== undefined && <div>Mask Area: {maskArea.toFixed(2)} mm<sup>2</sup></div>}
      </div>
    </AccordionDetails>
  </Accordion>
);
};
export default function UploadPage() {
  const [sections, setSections] = useState([{}]);
  const [deltaEHistory, setDeltaEHistory] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
  console.log('deltaEHistory changed:', deltaEHistory);
}, [deltaEHistory]);
  
  const calculateLinearPrediction = () => {
  if (deltaEHistory.length < 2) {
    console.log('DeltaE history is too short', deltaEHistory);
    return null;
  }

  const deltaEDiff = deltaEHistory[1] - deltaEHistory[0];
  let treatmentsNeeded;

  if (deltaEDiff < 0 && deltaEHistory[1] > 100) {
    treatmentsNeeded = Math.ceil((deltaEHistory[1] - 100) / Math.abs(deltaEDiff));
  } else if (deltaEDiff > 0 && deltaEHistory[1] > 100) {
    treatmentsNeeded = "Increasing, re-evaluate treatment";
  } else if (deltaEHistory[1] <= 100) {
    treatmentsNeeded = "Target reached or surpassed";
  } else {
    treatmentsNeeded = "Undefined scenario";
  }

  console.log('Previous deltaE:', deltaEHistory[0]);
  console.log('Current deltaE:', deltaEHistory[1]);  
  console.log('Delta Difference:', deltaEDiff);  
  console.log('Treatments Needed:', treatmentsNeeded);

  return treatmentsNeeded;
};

  
  const onSegmentDone = (newDeltaE) => {
  console.log('Received newDeltaE:', newDeltaE);
  console.log('Current deltaEHistory before setting:', deltaEHistory);
  
  setSections([...sections, {}]);
  setDeltaEHistory(prevHistory => {
    const updatedHistory = [...prevHistory, newDeltaE];
    console.log('Updated History:', updatedHistory);
    return updatedHistory;
  });
};

  const treatmentsNeeded = calculateLinearPrediction();

  return (
    <div>
      <LeftMenu />
      {sections.map((_, index) => (
        <TreatmentSection index={index} onSegmentDone={onSegmentDone} key={index} />
      ))}
      {treatmentsNeeded !== null && (
        <div style={{ backgroundColor: 'blue', color: 'white', padding: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5em' }}>
          Based on a simple linear prediction, it will take <u>approximately {treatmentsNeeded} more treatments</u> to reach healthy skin levels.
        </div>
      )}
    </div>
  );
}
