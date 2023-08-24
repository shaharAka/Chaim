import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useMediaQuery } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AnalysisIcon from '@mui/icons-material/BarChart';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

export default function LeftMenu() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      {isMobile && (
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'grey',
            color: 'white',
            width: 240,
          },
        }}
      >
        <List>
          <Link href="/patientDetails" passHref>
            <ListItem button component="a">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Patient Details" />
            </ListItem>
          </Link>
          <Link href="/upload" passHref>
            <ListItem button component="a">
              <ListItemIcon><AnalysisIcon /></ListItemIcon>
              <ListItemText primary="Analysis" />
            </ListItem>
          </Link>
          <Link href="/doctorSummary" passHref>
            <ListItem button component="a">
              <ListItemIcon><DoctorIcon /></ListItemIcon>
              <ListItemText primary="Doctor Summary" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </div>
  );
}
