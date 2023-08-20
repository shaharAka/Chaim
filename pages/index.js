import React, { useState } from 'react';
import Link from 'next/link';
import { Tabs, Tab, Box, TextField, Button, TextareaAutosize, Paper } from '@mui/material';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChange = (event, newValue) => setSelectedTab(newValue);

  return (
    <Paper>
      <Tabs value={selectedTab} onChange={handleChange} centered>
        <Tab label="Patient Details" />
        <Tab label="Analysis" />
        <Tab label="Doctor Summary" />
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        <form>
          <TextField label="Name" fullWidth />
          <TextField label="ID" fullWidth />
          <TextField label="Age" fullWidth />
          <TextField label="Sex" fullWidth />
          {/* Add additional fields as needed */}
        </form>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Link href="/upload">
          <a>Upload an Image</a>
        </Link>
        {/* You can include additional uploading functionality here */}
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <TextareaAutosize minRows={6} placeholder="Doctor's notes" style={{ width: '100%' }} />
        <TextField label="Doctor Signature" fullWidth />
        <Button variant="contained" color="primary" disabled>
          Share Report
        </Button>
      </TabPanel>
    </Paper>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}


