import React from 'react';
import { Container, Grid, Box, Typography, TextField } from '@mui/material';
import LeftMenu from '../components/leftMenu';

export default function PatientDetails() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <LeftMenu />
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ width: '100%' }}>
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
