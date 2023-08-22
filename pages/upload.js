import React, { useState } from 'react';
import ImageSegmentor from '../components/ImageSegmentor.js';
import LeftMenu from '../components/leftMenu';
import { Button } from '@mui/material';
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

  const handleSegmentationComplete = (deltaE, filename) => {
    setPlotData(prevData => {
      const newLabels = [...prevData.labels, `Segment ${filename}`];
      const newData = [...prevData.datasets[0].data, deltaE];
      const linearFit = linearRegression(newData.map((y, x) => [x, y]));
      const linearData = newLabels.map((_, x) => linearFit.m * x + linearFit.b);
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
    setSegmentationComplete(true);
  };

   return (
    <div style={{ display: 'flex' }}>
      <LeftMenu />
      <div style={{ marginLeft: '240px', flex: 1 }}>
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
        <div style={{ width: '600px', height: '300px' }}>
          <Line data={plotData} />
        </div>
      </div>
    </div>
  );
}
