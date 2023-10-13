  import * as React from 'react';
  import Link from '@mui/material/Link';
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell from '@mui/material/TableCell';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import Typography from '@mui/material/Typography';
  import Title from './Title';
  import axios from 'axios';
  import { useEffect, useState, useRef  } from 'react';
  import styles from '../../Css/Dashboard.module.css';
  import { jsPDF } from "jspdf";
  import html2canvas from "html2canvas";
  import config from '../../config';
  import ReactDOM from 'react-dom';
  import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
  } from 'recharts';


  export default function ChargingData() {
    const [chartData, setChartData] = useState([]);
    const [resultData, setResultData] = useState(null);
    const [DateData, setDateData] = useState([]);
    const [Username, setUsernameData] = useState(null);
    const [onderwerpData, setOnderwerpData] = useState(null);
    const [tempRadarChart, setTempRadarChart] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const pdfRef = useRef(); 
    const [selectedDate, setSelectedDate] = useState(null);
    const [id, setId] = useState(null);
    const [datum, setDatum] = useState(null);

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
      axios.get(`${config.API_BASE_URL}/api/TotalScores/user/me/dates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        const data = response.data;
        console.log(data);
        if (Array.isArray(data)) {
          setDateData(data); // data should be an array of { Date, Id }
        } else {
          setDateData([]); // Set it to an empty array if it's not an array
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
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
        
        setResultData(serverData);
        setDatum(serverData.date);
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


    
    useEffect(() => {
      if (id !== null) {
        const token = localStorage.getItem('token');
        axios.get(`${config.API_BASE_URL}/api/TotalScores/user/me/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log("Biem" + response.data);
          setResultData(response.data);  // This should trigger a UI update
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
      }
    }, [id]); // Changed from [selectedDate]
    
    
    
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
      const dateObj = new Date(datum);
const formattedDatum = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
pdf.text(`Datum van afname: ${formattedDatum}`, 10, textOffset);
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
        <RadarChart 
        cx={295} 
        cy={200} 
        outerRadius={120} 
        width={600} 
        height={600} 
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
          fill="#000000"
          fillOpacity={0.6}
          className={styles["radar-polygon"]}
          
        />
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
        });}, 10000);
    };

    return (
      <React.Fragment>
        <Title>{Username}</Title>
        <div>
      
                <h3>Datum van afname:</h3>
                <select onChange={e => {
        const selectedData = DateData[e.target.selectedIndex];
        setSelectedDate(selectedData);
        setId(selectedData.id); // Set the id when a date is selected
      }}>
      {Array.isArray(DateData) && DateData.map((item, index) => (
        <option key={index} value={item.id}>
          {new Date(item.date).toLocaleDateString('en-GB')}
        </option>
      ))}
      </select>




                <h3>Resultaten</h3>
                <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '18px' }}>
                <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '18px' }}>
                  <b>Score Value D:</b> {resultData?.scoreValueD || 'Loading...'}
                </div>
                <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '18px' }}>
                  <b>Score Value I:</b> {resultData?.scoreValueI || 'Loading...'}
                </div>
                </div>
                <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '18px' }}>
                  <b>Score Value S:</b> {resultData?.scoreValueS || 'Loading...'}
                </div>
                <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '18px' }}>
                  <b>Score Value C:</b> {resultData?.scoreValueC|| 'Loading...'}
                </div>
                <button 
                  className={styles.appelsap} 
                  onClick={handleDownload} 
                  style={{ float: 'right' }}
                >
                  Download PDF
                </button>
        </div>
      </React.Fragment>
    );
  }
