import React from 'react';
import { Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, TextField, Grid, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AnalysisIcon from '@mui/icons-material/BarChart'; // Replace with a suitable icon for Analysis
import DoctorIcon from '@mui/icons-material/LocalHospital'; // Replace with a suitable icon for Doctor Summary
import Link from 'next/link';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  drawer: {
    backgroundColor: '#333333', // Grey background
    color: 'white', // White text
    width: 240, // Set a fixed width for the drawer
  },
});

export default function Home() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Drawer variant="permanent" open classes={{ paper: classes.drawer }}>
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
        <TabPanel value={value} index={0}>
          <Typography variant="h5" gutterBottom>
            Patient Details
          </Typography>
          <form>
            {/* Rest of the Patient Details Form */}
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
      </Box>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  );
}
