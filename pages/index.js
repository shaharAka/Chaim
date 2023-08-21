import React from 'react';
import { Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, TextField, Grid, Button } from '@mui/material';
import LeftMenu from '../components/LeftMenu'; // Path to your LeftMenu component

export default function Home() {
  const [value, setValue] = React.useState(0);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <LeftMenu value={value} onChange={setValue} />
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
