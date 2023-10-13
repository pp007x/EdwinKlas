
import { useTheme } from '@mui/material/styles';
import Title from './Title';
import styles from '../../Css/Dashboard.module.css';
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import config from '../../config';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


export default function Chart() {
  const theme = useTheme();
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




  return (
    <React.Fragment>
      <Title></Title>
        <ResponsiveContainer>
           <RadarChart 
                  cx={295} 
                  cy={200} 
                  outerRadius={180} 
                  width={600} 
                  height={300} 
                  data={chartData}
                >
                  <PolarGrid />
                  <PolarAngleAxis
              dataKey="subject"
              tick={props => {
                const { x, y, payload } = props;

                let xOffset = 0;
                let yOffset = 0;

                if (payload.value === 'Consciëntieus') {
                  xOffset = 0; // You can adjust the values
                  yOffset = -15;
                } else if (payload.value === 'Invloedrijk') {
                  xOffset = 70; // You can adjust the values
                  yOffset = -10;
                } else if (payload.value === 'Dominant') {
                  xOffset = 33; // You can adjust the values
                  yOffset = -15;
                } else if (payload.value === 'Stabiel') {
                  xOffset = 25; // You can adjust the values
                  yOffset = -5;
                }

  

                  return (
                    <g transform={`translate(${x + xOffset},${y + yOffset})`}>
                      <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="end"
                        fill="#000"
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
              />

                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 40]}
                    axisLine={{ stroke: 'black' }}
                    tick={props => {
                      const {x, y, payload} = props;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={0}
                            y={10}
                            dy={22}
                            textAnchor="end"
                            fill="#000"
                            transform="rotate(-45)"
                          >
                            {payload.value}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <Radar
                    name="Mike"
                    dataKey="A"
                    stroke="#000000"
                    fill="#d534eb"
                    fillOpacity={0.6}
                    className={styles["radar-polygon"]}
                    
                  />
                </RadarChart>
        </ResponsiveContainer>

    </React.Fragment>
  );
}
