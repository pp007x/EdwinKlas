import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function EnginePower() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    axios.get('http://localhost:5281/api/ChargingData/get_charging_data', {
      headers: {
        Authorization: `Bearer ${token}` // Include the bearer token in the header
      }
    })
      .then(response => {
        console.log(response.data.estimatedBatteryCapacity);
        setUserData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching data', error);
      });
  }, []);

  return (
    <React.Fragment>
      <Title>Geschatte grote batterij</Title>
      {userData && userData.estimatedBatteryCapacity !== undefined ? (
        <Typography component="p" variant="h4">
          {userData.estimatedBatteryCapacity}
        </Typography>
      ) : (
        <Typography component="p" variant="h4">
          Loading...
        </Typography>
      )}
      <Title></Title>
    </React.Fragment>
  );
}
