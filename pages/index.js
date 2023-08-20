import React from 'react';
import { Container, List, ListItem, ListItemIcon, ListItemText, Box, Typography, TextField, Grid, Button, Drawer } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AnalysisIcon from '@mui/icons-material/BarChart';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import Link from 'next/link';
import { styled } from '@mui/system';

const DrawerStyled = styled(Drawer)`
  & .MuiDrawer-paper {
    background-color: #333333; // Grey background
    color: white; // White text
    width: 240px; // Set a fixed width for the drawer
  }
`;

export default function Home() {
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Container disableGutters>
      <DrawerStyled variant="permanent" open>
        <List>
          {/* Menu Items */}
        </List>
      </DrawerStyled>
      <Box component="main" sx={{ marginLeft: 240, flexGrow: 1, p: 3 }}>
        <TabPanel value={value} index={0}>
          {/* Patient Details */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* Analysis */}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* Doctor Summary */}
        </TabPanel>
      </Box>
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
