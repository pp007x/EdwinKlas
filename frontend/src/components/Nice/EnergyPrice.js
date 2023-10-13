import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Label, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Title(props) {
  return <h1>{props.children}</h1>;
}

export default function Chart() {
  const theme = useTheme();
  const [userData, setUserData] = useState({ sessions: [], hourData: [] });
  const [energyTariffs, setEnergyTariffs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await axios.get('http://localhost:5281/api/ChargingData/get_charging_data', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        handleLaadtijden(result.data, selectedDate);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedDate]);

  const handleLaadtijden = (data, selectedDate) => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const hourData = Array.from({ length: 24 }, (_, i) => ({ time: i, amount: 0, laadTijden: 0 }));

    const filteredSessions = data.filter(session => {
      const sessionDate = new Date(session.startTime);
      const sessionDateString = sessionDate.toISOString().split('T')[0];
      return sessionDateString === selectedDateString;
    });

    filteredSessions.forEach(session => {
      const startDateTime = new Date(session.startTime);
      const startHour = startDateTime.getHours();
      const durationParts = session.duration.split(':');
      const durationInSeconds = (+durationParts[0]) * 3600 + (+durationParts[1]) * 60 + (+durationParts[2]);
      const endDateTime = new Date(startDateTime.getTime() + durationInSeconds * 1000);
      const endHour = endDateTime.getHours();

      for (let hour = startHour; hour <= endHour; hour++) {
        hourData[hour].amount += 1;
        hourData[hour].laadTijden += 1;
      }
    });

    setUserData({ sessions: filteredSessions, hourData });
  };

  useEffect(() => {
    fetchEnergyTariffs(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    handleUserDataLoad(userData.sessions);
  }, [energyTariffs]);

  const fetchEnergyTariffs = async (date) => {
    try {
      const parsedDataList = [];
      for (let offset = -1; offset <= 1; offset++) {
        const targetDate = new Date(date);
        targetDate.setDate(targetDate.getDate() + offset);
        targetDate.setUTCHours(0, 0, 0, 0);
        const startDateString = targetDate.toISOString();
        const endDate = new Date(targetDate);
        endDate.setUTCHours(23, 59, 59, 999);
        const endDateString = endDate.toISOString();
        const url = `https://mijn.easyenergy.com/nl/api/tariff/getapxtariffs?startTimestamp=${startDateString}&endTimestamp=${endDateString}&grouping=`;
        const result = await axios.get(url);
        const parsedData = result.data.map(item => ({
          time: (new Date(item.Timestamp).getUTCHours() + 1) % 24,
          tariff: parseFloat(item.TariffUsage),
        }));
        parsedDataList.push(...parsedData);
      }
      setEnergyTariffs(parsedDataList);
    } catch (error) {
      console.error('Error fetching energy tariffs:', error);
    }
  };

  const handleUserDataLoad = (sessions) => {
    let hourData = [...userData.hourData];

    sessions.forEach(session => {
      const hour = new Date(session.startTime.replace(' ', 'T')).getHours();
      if (hourData[hour]) {
        hourData[hour].amount += session.amount;
      }
    });

    energyTariffs.forEach(tariffData => {
      if (hourData[tariffData.time]) {
        hourData[tariffData.time].tariff = tariffData.tariff;
      }
    });

    setUserData({ ...userData, hourData });
  };

  return (
    <React.Fragment>
      <Title>Energy Costs for Selected Date</Title>
      <DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  yearDropdownItemNumber={3} // Show 3 years in the dropdown
  minDate={new Date(new Date().setDate(new Date().getDate() - 30))}
/>


      <ResponsiveContainer>
        <BarChart
          data={userData.hourData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis yAxisId="left" orientation="left" stroke={theme.palette.text.secondary}>
            <Label angle={270} position="left" style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}>
              Charging Sessions
            </Label>
          </YAxis>
          <YAxis yAxisId="right" orientation="right" stroke={theme.palette.text.secondary}>
            <Label angle={270} position="right" style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}>
              Laad tarief
            </Label>
          </YAxis>
          <Tooltip />
          <Bar yAxisId="right" dataKey="tariff" fill={theme.palette.secondary.main} />
          <Bar yAxisId="left" dataKey="laadTijden" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
