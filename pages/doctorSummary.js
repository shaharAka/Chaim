import React from 'react';
import { Container, Grid, Box, TextField, Button } from '@mui/material';
import LeftMenu from '../components/LeftMenu';

export default function DoctorSummary() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <LeftMenu />
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ width: '100%' }}>
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

