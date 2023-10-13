import * as React from 'react';
import Title from './Title';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts';
import config from '../../config';
import styles from '../../Css/Dashboard.module.css';

export default function TimeOfDay() {
  
  const [onderwerpData, setOnderwerpData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
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
  }, []);  // Empty dependency array means this useEffect runs once when the component mounts

  return (
    <React.Fragment>
      <Title>{onderwerpData ? "Profiel-" + onderwerpData.name : 'Loading...'}</Title>
      <div>
        <hr></hr>
        <p dangerouslySetInnerHTML={{ __html: onderwerpData ? onderwerpData.description : 'Loading...' }}></p>
      </div>
    </React.Fragment>
  );
}
