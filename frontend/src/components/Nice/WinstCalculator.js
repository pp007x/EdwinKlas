import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function WinstCalculator() {
  const [sessions, setSessions] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [energyTariffs, setEnergyTariffs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5281/api/ChargingData/get_charging_data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      filterSessions(response.data);
      fetchEnergyTariffs(selectedDate);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const filterSessions = (allSessions) => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const filteredSessions = allSessions.filter(session => {
      if (!session.startTime) return false;
      const sessionDate = new Date(session.startTime.replace('T', ' '));
      return sessionDate.toISOString().split('T')[0] === selectedDateString;
    });
    setSessions(filteredSessions);
  };

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

    const formatTime = (isoString) => {
        const date = new Date(isoString.replace(' ', 'T'));
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };

    const calculateOptimalStart = (session, energyTariffs) => {
        if (!session || !energyTariffs) {
            console.error("Session or energyTariffs is null or undefined");
            return null;
        }

        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();

        let optimalStart = null;
        let lowestCost = Infinity;

        for (let i = startHour; i <= endHour; i++) {
            const relevantTariffs = energyTariffs.filter(
                (tariff) => parseInt(tariff.time.match(/\d+/)[0]) === i
            );

            if (relevantTariffs.length === 0) continue;

            const totalCost = relevantTariffs.reduce(
                (acc, tariff) => acc + parseFloat(tariff.value),
                0
            );

            if (totalCost < lowestCost) {
                lowestCost = totalCost;
                optimalStart = i;
            }
        }

        return optimalStart;
    };

    
    const calculateCost = (session, energyTariffs) => {
        if (!energyTariffs) return 0;
    
        const startTime = new Date(session.startTime.replace(' ', 'T'));
        const endTime = new Date(session.endTime.replace(' ', 'T'));
        let totalCost = 0;
    
        const powerNumber = parseFloat(session.power.match(/\d+(\.\d+)?/)[0]);
        const durationMillis = endTime - startTime;
        const durationInHours = durationMillis / (1000 * 60 * 60);
        const powerPerHour = powerNumber / durationInHours;
    
        let currentTime = new Date(startTime);
        
        while (currentTime < endTime) {
        let nextHour = new Date(currentTime);
        nextHour.setMinutes(0);
        nextHour.setSeconds(0);
        nextHour.setMilliseconds(0);
        nextHour.setHours(nextHour.getHours() + 1);
        
        // The period to consider in the current iteration, in hours
        let currentPeriod = Math.min(nextHour - currentTime, endTime - currentTime) / (1000 * 60 * 60);
        
        // The hour of the day for which the tariff applies
        const currentHour = currentTime.getUTCHours();
        
        const tariff = energyTariffs.find(t => t.time === currentHour)?.tariff || 0;
        totalCost += powerPerHour * currentPeriod * tariff;
        
        // Move to the next hour
        currentTime = nextHour;
        }
    
        return totalCost;
    };
    

    const handleSeeMore = () => {
        setDisplayCount(prevCount => prevCount + 20);
    };

    return (
        <React.Fragment>
        <Title>Oplaad sessies</Title>
        <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            maxDate={new Date()}
            minDate={new Date(new Date().setDate(new Date().getDate() - 30))}
        />
        <Table size="small">
            <TableHead>
            <TableRow>
                <TableCell>Starttijd</TableCell>
                <TableCell>Eindtijd</TableCell>
                <TableCell>Optimale starttijd</TableCell>
                <TableCell>Duur</TableCell>
                <TableCell>Actuele kosten</TableCell>
                <TableCell>Optimale kosten</TableCell>
                <TableCell>Verlies</TableCell>
                <TableCell align="right">Opgeladen vermogen</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {sessions.slice(0, displayCount).map((session, index) => {
                const optimal = calculateOptimalStart(session, energyTariffs);
                if (optimal.bestCost === null) {
                return <TableRow key={index}><TableCell colSpan={8}>Loading...</TableCell></TableRow>;
                }
                const actualCost = calculateCost(session, energyTariffs);
                const optimalCost = optimal.bestCost;
                const gainOrLoss = actualCost - optimalCost;
                return (
                    <TableRow key={index}>
                    <TableCell>{formatTime(session.startTime)}</TableCell>
                    <TableCell>{formatTime(session.endTime)}</TableCell>
                    <TableCell>{optimal.bestStart !== null ? optimal.bestStart : 'N/A'}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>€{actualCost.toFixed(2)}</TableCell>
                    <TableCell>€{optimalCost !== null ? optimalCost.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell>€{gainOrLoss !== null ? gainOrLoss.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell align="right">{session.power}</TableCell>
                    </TableRow>

                );
            })}
            </TableBody>
        </Table>
        <Link color="primary" href="#" onClick={handleSeeMore}>
            See more charging sessions
        </Link>
        </React.Fragment>
    );
    }
