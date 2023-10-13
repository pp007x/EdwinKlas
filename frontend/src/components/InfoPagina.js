import React from 'react';
import styles from '../Css/CompanyDashboard.module.css';
import DashboardSidebar from './DashboardSidebar';
import infopaginaImage from '../images/foto1.PNG'; // Import the image
import infopaginaImage2 from '../images/foto2.PNG'; // Import the image
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Chart from './Nice/Chart';
import ChargingData from './Nice/ChargingData';
import TimeOfDay from './Nice/TimeOfDay';
import './Nice/Nice.css'
import Title from './Nice/Title';
const Header = ({ title }) => (
  <div className={styles.header}>
    <hr />
    <div className={styles["page-title"]}>{title}</div>
  </div>
);

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const defaultTheme = createTheme();
function InfoPagina() {
   return (
    <ThemeProvider theme={defaultTheme}>
      {/* <Header title={companyName ? companyName : 'Loading...'} /> */}
        <DashboardSidebar />
    <Box className="custom-background" sx={{ display: 'flex' }} background-color=" #005270">
      
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3} sx={{ paddingLeft: '40px' }}>
            <Grid item xs={12} md={8} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={12}>
                  <Paper
                    sx={{
                      
                      display: 'flex',
                      flexDirection: 'column',
                      
     
                    }}
                  >
                  <img src={infopaginaImage} alt="Image" className={styles.image} />
                  </Paper>
                </Grid>

              </Grid>
            </Grid>
            <Grid item xs={12} md={8} lg={12}>
              <Paper
                sx={{
                  
                  display: 'flex',
                  flexDirection: 'column',
                  
                  
                }}
              >
            <img src={infopaginaImage2} alt="Image" className={styles.image} /> 
              </Paper>
            </Grid>
          </Grid>
          
        </Container>
      </Box>
    </Box>
    </ThemeProvider>
  );
}


export default InfoPagina;
