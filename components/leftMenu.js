import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AnalysisIcon from '@mui/icons-material/BarChart';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import Link from 'next/link';

export default function LeftMenu() {
  return (
    <Drawer
      variant="permanent"
      open
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
  );
}
