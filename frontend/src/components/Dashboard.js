import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import DashboardSidebar from './DashboardSidebar';
import styles from '../Css/CompanyDashboard.module.css';
import axios from 'axios';
import config from '../config';
import Draggable from 'react-draggable';
import { AppContext } from '../context';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { renderToString } from "react-dom/server";
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

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const backgroundColor = '#FFEECA';

const Header = ({ title }) => (
  <div className={styles.header}>
    <hr />
    <div className={styles["page-title"]}>{title}</div>
  </div>
);

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [DateData, setDateData] = useState(null);
  const [Username, setUsernameData] = useState(null);
  const [onderwerpData, setOnderwerpData] = useState(null);
  const [tempRadarChart, setTempRadarChart] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const pdfRef = useRef(); 

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
        setCompanyName(data.name);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${config.API_BASE_URL}/api/TotalScores/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      const serverData = response.data;
      setDateData(serverData.date);
      setResultData(serverData);

      const transformedData = [
        {
          subject: 'Dominant', A: serverData.scoreValueD,
        },
        {
          subject: 'Invloedrijk', A: serverData.scoreValueI,
        },
        {
          subject: 'Stabiel', A: serverData.scoreValueS,
        },
        {
          subject: 'Consciëntieus', A: serverData.scoreValueC,
        },
      ];
      setChartData(transformedData);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

    axios.get(`${config.API_BASE_URL}/api/Onderwerp/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setOnderwerpData(response.data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

    axios.get(`${config.API_BASE_URL}/api/Users/Profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setUsernameData(response.data.username);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, []);

  const handleDownload = () => {
    const pdf = new jsPDF();
    const scoreValues = [
      { title: 'Score Value D:', value: resultData.scoreValueD },
      { title: 'Score Value I:', value: resultData.scoreValueI },
      { title: 'Score Value S:', value: resultData.scoreValueS },
      { title: 'Score Value C:', value: resultData.scoreValueC },
    ];
    const onderwerp = onderwerpData ? onderwerpData.name : 'Loading...';
    const onderwerpDescription = onderwerpData 
      ? onderwerpData.description.replace(/<br>/g, '\n')  // replace <br> with new lines
      : 'Loading...';

    let textOffset = 10;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Username: ${Username}`, 10, textOffset);
    textOffset += 10;
    pdf.text(`Datum van afname: ${DateData && new Date(DateData).toLocaleDateString()}`, 10, textOffset);
    textOffset += 10;
    pdf.text(`Onderwerp: ${onderwerp}`, 10, textOffset);
    textOffset += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const splitTitle = pdf.splitTextToSize(`${onderwerpDescription}`, 180);
    pdf.text(splitTitle, 10, textOffset);
    textOffset += 10 * splitTitle.length;  // adjust offset

    pdf.addPage();
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Behaalde scores:`, 10, 20); // Updated textOffset to 20
    textOffset = 30; // Initialize textOffset with 30 or appropriate starting point for scores
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    scoreValues.forEach(scoreValue => {
      pdf.text(`${scoreValue.title} ${scoreValue.value}`, 10, textOffset);
      textOffset += 10;
    });

    const tempRadarChart = (
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'black' }} />
        <PolarRadiusAxis PolarRadiusAxis angle={90} domain={[0, 40]} axisLine={{ stroke: 'black' }}tick={props => { const {x, y, payload} = props;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={0}
                            y={0}
                            dy={16}
                            textAnchor="end"
                            fill="#000"
                            transform="rotate(-45)"
                          >
                            {payload.value}
                          </text>
                        </g>
                      );
                    }}/>
        <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    );
    setTempRadarChart(tempRadarChart);
    const tempChartDiv = document.createElement('div');
    tempChartDiv.style.width = '600px';
    tempChartDiv.style.height = '500px';
    tempChartDiv.style.position = 'absolute';
    tempChartDiv.style.left = '-10000px';
    document.body.appendChild(tempChartDiv);
    ReactDOM.render(tempRadarChart, tempChartDiv);
    setTimeout(() => {
      html2canvas(tempChartDiv)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        const imgWidthMM = canvas.width / 3.78;  // convert width from px to mm
        const imgHeightMM = canvas.height / 3.78;  // convert height from px to mm
    
        const pageWidthMM = 200;  // width of A4 paper in mm
        const pageHeightMM = 297;  // height of A4 paper in mm
    
        const x = (pageWidthMM - imgWidthMM) / 2;
        const y = (pageHeightMM - imgHeightMM) / 2;
    
        pdf.addImage(imgData, 'PNG', x + 10, y + 15, imgWidthMM, imgHeightMM);
        pdf.save("download.pdf");
        setTempRadarChart(null);
      })
      .then(() => {
        ReactDOM.unmountComponentAtNode(tempChartDiv);
        document.body.removeChild(tempChartDiv);
      });
    }, 1000);
  };
  
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

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
            <Grid item xs={12} md={8} lg={7}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 450,
                      width: 600,
                    }}
                  >
                    <Chart />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width: 600 }}>
                    <ChargingData />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  width: 500,
                }}
              >
                <TimeOfDay />
              </Paper>
            </Grid>
          </Grid>
         
        </Container>
      </Box>
    </Box>
    </ThemeProvider>
  );
}
