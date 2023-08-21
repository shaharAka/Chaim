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
  };

  return (
    <Container>
      <Drawer variant="permanent" open>
        <List>
          <ListItem button onClick={() => handleChange(0)}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Patient Details" />
          </ListItem>
          <Link href="/upload" passHref>
            <ListItem button component="a">
              <ListItemIcon><AnalysisIcon /></ListItemIcon>
              <ListItemText primary="Analysis" />
            </ListItem>
          </Link>
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
            <form>
              {/* Rest of the Patient Details Form */}
            </form>
          </div>
        )}
        {value === 2 && (
          <div>
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
