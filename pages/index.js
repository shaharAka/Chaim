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
      <Grid container>
        <Grid item xs={3}>
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
                <Link href="/upload">
                  <a style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                    <ListItemIcon><AnalysisIcon /></ListItemIcon>
                    <ListItemText primary="Analysis" />
                  </a>
                </Link>
              </ListItem>
              <ListItem button onClick={() => handleChange(2)}>
                <ListItemIcon><DoctorIcon /></ListItemIcon>
                <ListItemText primary="Doctor Summary" />
              </ListItem>
            </List>
          </Drawer>
        </Grid>
        {/* Rest of the code */}
      </Grid>
    </Container>
  );
}
