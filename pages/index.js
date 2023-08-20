import React from 'react';
import { Container, Drawer, List, ListItem, ListItemText, Box, Typography, TextField, Grid, Button } from '@mui/material';

export default function Home() {
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleChange(0)}>
            <ListItemText primary="Patient Details" />
          </ListItem>
          <ListItem button onClick={() => handleChange(1)}>
            <ListItemText primary="Analysis" />
          </ListItem>
          <ListItem button onClick={() => handleChange(2)}>
            <ListItemText primary="Doctor Summary" />
          </ListItem>
        </List>
      </Drawer>
      <Container sx={{ ml: 240 }}>
        <TabPanel value={value} index={0}>
          {/* Patient Details content here */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* Analysis content here */}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* Doctor Summary content here */}
        </TabPanel>
      </Container>
    </Box>
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
