import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';
import LeftMenu from '../components/leftMenu';
import { Button, Container, useMediaQuery } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { linearRegression } from 'simple-statistics';

export default function UploadPage() {
  const [imageSegmentors, setImageSegmentors] = useState([0]);
  const [showAddButton, setShowAddButton] = useState(false);
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
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [filename, setFilename] = useState(null);

  const addImageSegmentor = () => {
    setImageSegmentors([...imageSegmentors, imageSegmentors.length]);
    setShowAddButton(false);
  };

  const handleSegmentationComplete = (treatmentNumber, deltaE, filename) => {
    setPlotData(prevData => {
      const newLabels = [...prevData.labels, `Treatment ${treatmentNumber}`];
      const newData = [...prevData.datasets[0].data, deltaE];
      const linearFit = linearRegression(newData.map((y, x) => [x + 1, y]));
      const linearData = newLabels.map((_, x) => linearFit.m * x + linearFit.b);
      const remainingTreatments = (100 - linearFit.b) / linearFit.m;
      setShowAddButton(true);
      setEstimatedRemainingTreatments(remainingTreatments);

      return {
        labels: newLabels,
        datasets: [
          {
            label: 'Delta E Values',
            data: newData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          prevData.datasets[1],
          {
            label: 'Linear Fit',
            data: linearData,
            fill: false,
            borderColor: 'blue',
            tension: 0.1,
          }
        ],
      };
    });
  };

  return (
  <div style={{ display: 'flex' }}>
    <LeftMenu />
    <Container
      style={{
        marginLeft: isMobile ? '0px' : '240px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>Analysis</h1>
      <div style={{ display: 'flex', marginBottom: '16px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        {imageSegmentors.map((_, index) => (
          <div key={index} style={{ marginRight: '16px' }}>
            <ImageSegmentor
              onSegmentationComplete={handleSegmentationComplete}
            />
          </div>
        ))}
        {showAddButton && (
          <Button
            variant="contained"
            color="primary"
            style={{ height: '400px', width: isMobile ? '100%' : '400px' }}
            onClick={addImageSegmentor}
          >
            +
          </Button>
        )}
      </div>
      <div style={{ width: isMobile ? '100%' : '600px', height: '300px' }}>
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

