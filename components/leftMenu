import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AnalysisIcon from '@mui/icons-material/BarChart';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import Link from 'next/link';

export default function LeftMenu({ onChange, value }) {
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
        <ListItem button onClick={() => onChange(0)}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Patient Details" />
        </ListItem>
        <Link href="/upload" passHref>
          <ListItem button component="a">
            <ListItemIcon><AnalysisIcon /></ListItemIcon>
            <ListItemText primary="Analysis" />
          </ListItem>
        </Link>
        <ListItem button onClick={() => onChange(2)}>
          <ListItemIcon><DoctorIcon /></ListItemIcon>
          <ListItemText primary="Doctor Summary" />
        </ListItem>
      </List>
    </Drawer>
  );
}
