import React from 'react';
import { Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, TextField, Grid, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AnalysisIcon from '@mui/icons-material/BarChart';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [value, setValue] = React.useState(0);
  const { push } = useRouter();

  const handleChange = (newValue) => {
    if (newValue === 1) {
      push('/upload');
    } else {
      setValue(newValue);
    }
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
                <ListItemIcon><AnalysisIcon /></ListItemIcon>
                <ListItemText primary="Analysis" />
              </ListItem>
              <ListItem button onClick={() => handleChange(2)}>
                <ListItemIcon><DoctorIcon /></ListItemIcon>
                <ListItemText primary="Doctor Summary" />
              </ListItem>
            </List>
          </Drawer>
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ width: '100%' }}>
            {value === 0 && (
              <div>
                <Typography variant="h5" gutterBottom>
                  Patient Details
                </Typography>
                <form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Name" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="ID" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Age" variant="outlined" fullWidth type="number" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Sex"
                        variant="outlined"
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </form>
              </div>
            )}
            {value === 1 && (
              <div>
                <Link href="/upload" passHref>
                  <a>Upload an Image</a>
                </Link>
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
        </Grid>
      </Grid>
    </Container>
  );
}
