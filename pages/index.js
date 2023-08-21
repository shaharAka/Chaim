import React from 'react';
import { Container, Grid, Box } from '@mui/material';
import LeftMenu from './LeftMenu'; // Path to your LeftMenu component

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
              // Patient Details Code
            )}
            {value === 2 && (
              // Doctor Summary Code
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
