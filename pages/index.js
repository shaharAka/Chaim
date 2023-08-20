import React from 'react';
import { Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, TextField, Grid, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AnalysisIcon from '@mui/icons-material/BarChart';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import Link from 'next/link';

export default function Home() {
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
    console.log("Value changed:", newValue); // Debug log for value change
  };

  console.log("Current value:", value); // Debug log for current value

  return (
    <Container>
      <Drawer
        variant="permanent"
        open
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'grey',
            color: 'white',
            width: 240
          }
        }}
      >
        <List>
          <ListItem button onClick={() => handleChange(0)}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Patient Details" />
          </ListItem>
          <ListItem button onClick={() => handleChange(1)}>
            <ListItemIcon><AnalysisIcon /></ListItemIcon>
            <ListItemText primary="Analysis" />
          </ListItem>
          <ListItem button onClick={() => handleChange(2)}>
            <ListItemIcon><DoctorIcon /></ListItemIcon>
            <ListItemText primary="Doctor Summary" />
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ marginLeft: 240 }}>
        {value === 0 && (
          <div>
            <Typography variant="h5" gutterBottom>
              Patient Details
            </Typography>
            {/* Patient Details Form */}
            { /* Additional log to confirm rendering */ }
            { console.log("Rendering Patient Details") }
            <form>
              {/* Form content here */}
            </form>
          </div>
        )}
        {value === 1 && (
          <div>
            { /* Additional log to confirm rendering */ }
            { console.log("Rendering Analysis") }
            <Link href="/upload">
              <a>Upload an Image</a>
            </Link>
          </div>
        )}
        {value === 2 && (
          <div>
            { /* Additional log to confirm rendering */ }
            { console.log("Rendering Doctor Summary") }
            <TextField
              label="Doctor's Summary"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" color="primary" disabled>
              Share Report
            </Button>
          </div>
        )}
      </Box>
    </Container>
  );
}
