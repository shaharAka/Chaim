import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';
import { Button } from '@mui/material';
import { Line } from 'react-chartjs-2';

// You can import simple-statistics to perform linear regression
import simpleStats from 'simple-statistics';

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
        data: new Array(10).fill(100), // Assuming you have at most 10 data points
        fill: false,
        borderColor: 'red',
        borderDash: [5, 5], // This creates a dashed line
        tension: 0,
      }
    ],
  });

  // Handler to add a new ImageSegmentor component
  const addImageSegmentor = () => {
    setImageSegmentors([...imageSegmentors, imageSegmentors.length]);
    setSegmentationComplete(false);
  };

  // Callback to mark segmentation as complete and update plot data
  const handleSegmentationComplete = (deltaE, filename) => {
    setPlotData(prevData => {
      const newLabels = [...prevData.labels, `Segment ${filename}`];
      const newData = [...prevData.datasets[0].data, deltaE];

      // Compute linear regression
      const linearFit = simpleStats.linearRegression(newData.map((y, x) => [x, y]));
      const linearData = newLabels.map((_, x) => linearFit.m * x + linearFit.b);

      return {
        labels: newLabels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: newData,
          },
          prevData.datasets[1], // Keep the constant line
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
    setSegmentationComplete(true);
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <div style={{ display: 'flex' }}>
        {imageSegmentors.map((segmentor, index) => (
          <div key={index} style={{ marginRight: '16px' }}>
            <ImageSegmentor onSegmentationComplete={handleSegmentationComplete} />
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
      <div>
        <Line data={plotData} />
      </div>
    </div>
  );
}
