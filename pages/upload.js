import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';
import LeftMenu from '../components/leftMenu';
import { Button, Container, useMediaQuery } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { linearRegression } from 'simple-statistics';

export default function UploadPage() {
  const [imageSegmentors, setImageSegmentors] = useState([0]);
  const [segmentationComplete, setSegmentationComplete] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [plotData, setPlotData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Delta E Values',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Constant Line at 100',
        data: new Array(10).fill(100),
        fill: false,
        borderColor: 'red',
        borderDash: [5, 5],
        tension: 0,
      }
    ],
  });
  const [estimatedRemainingTreatments, setEstimatedRemainingTreatments] = useState();

  const addImageSegmentor = () => {
    setImageSegmentors([...imageSegmentors, imageSegmentors.length]);
    setSegmentationComplete(false);
  };

  const handleSegmentationComplete = (treatmentNumber, deltaE, filename) => {
  console.log(`Treatment Number: ${treatmentNumber}, Delta E: ${deltaE}`); // Logging the values
  setPlotData(prevData => {
    const newLabels = [...prevData.labels, `Treatment ${treatmentNumber}`];
    const newData = [...prevData.datasets[0].data, deltaE];
    const linearFit = linearRegression(newData.map((y, x) => [x, y]));
    const linearData = newLabels.map((_, x) => linearFit.m * x + linearFit.b);
    const remainingTreatments = (100 - linearFit.b) / linearFit.m; // Correct calculation

    // Set the remaining treatments
    setEstimatedRemainingTreatments(remainingTreatments);

    return {
      labels: newLabels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: newData,
        },
        prevData.datasets[1],
        {
          label: 'Linear Fit',
          data: linearData,
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
        },
      ],
    };
  });

  setSegmentationComplete(true); // Moved inside the function
};

   return (
    <div style={{ display: 'flex' }}>
      <LeftMenu />
      <Container
        style={{
          marginLeft: isMobile ? '0px' : '240px', // No margin left on mobile
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>Analysis</h1>
        <div style={{ display: 'flex', marginBottom: '16px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          {imageSegmentors.map((segmentor, index) => (
            <div key={index} style={{ marginRight: '16px' }}>
              <ImageSegmentor
                onSegmentationComplete={(treatmentNumber, deltaE, filename) =>
                handleSegmentationComplete(treatmentNumber, deltaE, filename)
                  }
              />
            </div>
          ))}
          {segmentationComplete && (
            <Button
              variant="contained"
              color="primary"
              style={{ height: '400px', width: isMobile ? '100%' : '400px' }} // Full width on mobile
              onClick={addImageSegmentor}
            >
              +
            </Button>
          )}
        </div>
        <div style={{ width: isMobile ? '100%' : '600px', height: '300px' }}> {/* Full width on mobile */}
          <Line data={plotData} />
        </div>
        {estimatedRemainingTreatments && (
          <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '18px', fontWeight: 'bold' }}>
            Estimated remaining treatments: {estimatedRemainingTreatments.toFixed(2)}
          </div>
        )}
      </Container>
    </div>
  );
}
