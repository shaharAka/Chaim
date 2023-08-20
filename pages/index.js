import React from 'react';
import { Container, AppBar, Tabs, Tab, Box, Typography, TextField, Grid, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(`Value changed: ${newValue}`);
    console.log(`Current value: ${value}`);
    switch (newValue) {
      case 0:
        console.log('Rendering Patient Details');
        break;
      case 1:
        console.log('Rendering Analysis');
        break;
      case 2:
        console.log('Rendering Doctor Summary');
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Patient Details" />
          <Tab label="Analysis" />
          <Tab label="Doctor Summary" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Link href="/upload">
          <a>Upload an Image</a>
        </Link>
      </TabPanel>
      <TabPanel value={value} index={2}>
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
      </TabPanel>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
