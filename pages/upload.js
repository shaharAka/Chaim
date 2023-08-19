import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';
import { Button } from '@mui/material';
import { Line } from 'react-chartjs-2';

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
        borderColor: 'rgb(75, 192, 192),
        tension: 0.1,
      },
    ],
  });

  const addImageSegmentor = () => {
    setImageSegmentors([...imageSegmentors, imageSegmentors.length]);
    setSegmentationComplete(false);
  };

  const handleSegmentationComplete = (deltaE, filename) => {
    setPlotData(prevData => ({
      labels: [...prevData.labels, `Segment ${filename}`],
      datasets: [
        {
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data, deltaE],
        },
      ],
    }));
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
