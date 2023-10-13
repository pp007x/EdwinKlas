import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import styles from '../Css/CompanyDashboard.module.css';
import Draggable from 'react-draggable';
import DashboardSidebar from './DashboardSidebar';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import './Nice/Nice.css'
import Kleurenbox from './Nice/Kleurenbox';
import ChartInfo from './Nice/ChartInfo';

const backgroundColor = 'white';
const descriptions = [
  "Analyticus (C)", "Strateeg (Cd)", "Perfectionist (Cs)", "Raadgever (Ci)",
  "Pionier (Dc)", "Beslisser (D)", "Doorzetter (Ds)", "Avonturier (Di)",
  "Specialist (Sc)", "Doener (Sd)", "Dienstverlener (S)", "Helper (Si)",
  "Diplomaat (Ic)", "Inspirator (Id)", "Bemiddelaar (Is)", "Entertainer (I)"
];

const boxCodeToIndex = {
  "C": 0, "D": 1, "S": 2, "I": 3,
  "c": 0, "d": 1, "s": 2, "i": 3,
};




const singleLetter = {
  "C": 0, "D": 5, "S": 10, "I": 15,
}


const CompanyDashboard = () => {
  const [userBoxes, setUserBoxes] = useState([]);
  const [userScores, setUserScores] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [boxOnePos, setBoxOnePos] = useState({x: 0, y: 0});
  const [boxTwoPos, setBoxTwoPos] = useState({x: 0, y: 0});
  const resetPositions = () => {
    setBoxOnePos({x: 0, y: 0});
    setBoxTwoPos({x: 0, y: 0});
    localStorage.removeItem('boxOnePos');
    localStorage.removeItem('boxTwoPos');
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/api/Companies/current`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        setCompanyId(data.id);
        setCompanyName(data.name); // Assuming 'Name' is the correct property for the company's name
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, []);


  useEffect(() => {
    const fetchUserBoxes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/api/Companies/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = response.data;
        setUserBoxes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching user boxes:', error);
      }
    };

    const fetchUserScores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/api/TotalScores/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        setUserScores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching user scores:', error);
      }
    };

    if (companyId) {
      fetchUserBoxes();
      fetchUserScores();
    }
  }, [companyId]);
  const defaultTheme = createTheme();
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
  const Header = ({ title }) => (
    <div className={styles.header}>
      <hr />
      <div className={styles["page-title"]}>{title}</div>
    </div>
  );
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
                <Grid container spacing={3} >
                  <Grid item xs={12} md={8} lg={7}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 1000,
                            width: 1100,
                          }}
                        >
                          <Kleurenbox />
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <ChartInfo />
                        </Paper>
                      </Grid>
                      

                      </Grid>
                      </Grid>
                      </Grid>
     
        </Container>
      </Box>
    </Box>
    </ThemeProvider>
  );
}


export default CompanyDashboard