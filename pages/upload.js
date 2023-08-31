import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import LeftMenu from '../components/leftMenu';
import { useMediaQuery, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function TreatmentSection({ treatment, index }) {
  const imgRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  
  const submitHandler = async (event, treatmentIndex) => {
  event.preventDefault();
  setIsUploading(true);

  const formData = new FormData();
  formData.append('file', treatments[treatmentIndex].selectedFile);

  try {
    const response = await fetch('https://www.sunsolve.co/uploadfile/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Server response:', data);

      // Updating only the relevant treatment
      const newTreatments = [...treatments];
      newTreatments[treatmentIndex].originalImageUrl = data.original_image_url;
      newTreatments[treatmentIndex].filename = treatments[treatmentIndex].selectedFile.name;
      setTreatments(newTreatments);

      console.log('Uploaded successfully!');
    } else {
      console.error('Upload failed.');
    }
  } catch (error) {
    console.error('There was a problem with the upload:', error);
  }

  setIsUploading(false);
};


  const segmentHandler = async (treatmentIndex) => {
  setIsSegmenting(true);

  // Getting the scaling factors
  const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
  const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

  // Scaling the coordinates
  const completedCrop = treatments[treatmentIndex].completedCrop;
  const scaledCrop = {
    x: completedCrop.x * scaleX,
    y: completedCrop.y * scaleY,
    width: completedCrop.width * scaleX,
    height: completedCrop.height * scaleY,
    unit: completedCrop.unit,
    aspect: completedCrop.aspect,
  };

  try {
    const response = await fetch('https://www.sunsolve.co/segment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: treatments[treatmentIndex].filename,
        crop: JSON.stringify(scaledCrop), // Sending the scaled coordinates
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const maskBase64 = data.mask_base64;

      // Updating only the relevant treatment
      const newTreatments = [...treatments];
      newTreatments[treatmentIndex].overlayImageUrl = `data:image/png;base64,${maskBase64}`;
      newTreatments[treatmentIndex].maskArea = data.mask_area_mm2;
      newTreatments[treatmentIndex].deltaEValue = data.delta_e;
      setTreatments(newTreatments);

      console.log('Segmented successfully!');
    } else {
      console.error('Segmentation failed.');
    }
  } catch (error) {
    console.error('There was a problem with the segmentation:', error);
  }

  setIsSegmenting(false);
};


  const onLoad = (img) => {
    imgRef.current = img;
  };

  const fileChangedHandler = (event, treatmentIndex) => {
  const selectedFile = event.target.files[0];
  const newTreatments = [...treatments];

  // Update only the relevant treatment
  newTreatments[treatmentIndex].selectedFile = selectedFile;
  setTreatments(newTreatments);
};

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h4>{`Treatment #${index + 1}:`}</h4>
          {treatment.deltaEValue !== null && <span>Delta E Value: {treatment.deltaEValue.toFixed(2)}</span>}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          <h1>Upload Image</h1>
          <form onSubmit={submitHandler}>
            <input type="file" onChange={fileChangedHandler} />
            <button type="submit">
              {isUploading ? <CircularProgress size={24} /> : 'Upload'}
            </button>
          </form>
          {treatment.originalImageUrl && (
            <ReactCrop
              src={treatment.originalImageUrl}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(newCrop) => setCompletedCrop(newCrop)}
            />
          )}
          <button onClick={segmentHandler}>
            {isSegmenting ? <CircularProgress size={24} /> : 'Segment!'}
          </button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default function UploadPage() {
  const [treatments, setTreatments] = useState([
    { id: 1, originalImageUrl: null, deltaEValue: null },
    { id: 2, originalImageUrl: null, deltaEValue: null },
  ]);

  const isMobile = useMediaQuery('(max-width:600px)');

  const mobileStyles = {
  button: {
    padding: '15px 30px',
    fontSize: '1.2em',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  input: {
    fontSize: '1.2em',
    padding: '10px',
    margin: '10px 0',
    display: 'block',
  },
  container: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  guideText: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginTop: '15px',
  },
};


  return (
    <div style={mobileStyles.container}>
      <LeftMenu />
      {treatments.map((treatment, index) => (
        <TreatmentSection key={treatment.id} treatment={treatment} index={index} />
      ))}
    </div>
  );
}
