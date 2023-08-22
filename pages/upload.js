import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';
import LeftMenu from '../components/leftMenu';
import { Button, Container } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { linearRegression } from 'simple-statistics';

export default function UploadPage() {
  const [imageSegmentors, setImageSegmentors] = useState([0]);
  const [segmentationComplete, setSegmentationComplete] = useState(false);
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

  const addImageSegmentor = () => {
    setImageSegmentors([...imageSegmentors, imageSegmentors.length]);
    setSegmentationComplete(false);
  };

  const handleSegmentationComplete = (deltaE, filename, treatmentNumber) => {
    setPlotData(prevData => {
      const newLabels = [...prevData.labels, treatmentNumber]; // Use treatment numbers as labels
      const newData = [...prevData.datasets[0].data, deltaE];
      const linearFit = linearRegression(newData.map((y, x) => [x, y]));
      const linearData = newLabels.map((_, x) => linearFit.m * x + linearFit.b);

      // Calculation for the estimated remaining treatments
      const estimatedRemainingTreatments = (100 - linearFit.b) / linearFit.m;

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
        estimatedRemainingTreatments,
      };
    });
    setSegmentationComplete(true);
  };

  return (
    <div style={{ display: 'flex' }}>
      <LeftMenu />
      <Container
        style={{
          marginLeft: '240px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>Analysis</h1>
        <div style={{ display: 'flex', marginBottom: '16px' }}>
          {imageSegmentors.map((segmentor, index) => (
            <div key={index} style={{ marginRight: '16px' }}>
              <ImageSegmentor
                onSegmentationComplete={(deltaE, filename) =>
                  handleSegmentationComplete(deltaE, filename, segmentor + 1) // Pass the treatment number
                }
              />
            </div>
          ))}
          {segmentationComplete && (
            <Button
              variant="contained"
              color="primary"
              style={{ height: '400px', width: '400px' }}
              onClick={addImageSegmentor}
            >
              +
            </Button>
          )}
        </div>
        <div style={{ width: '600px', height: '300px' }}>
          <Line data={plotData} />
        </div>
        {plotData.estimatedRemainingTreatments && (
          <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '18px', fontWeight: 'bold' }}>
            Estimated remaining treatments: {plotData.estimatedRemainingTreatments.toFixed(2)}
          </div>
        )}
      </Container>
    </div>
  );
}
