import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../../Css/CompanyDashboard.module.css';
import config from '../../config';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Label, Tooltip, ResponsiveContainer } from 'recharts';

export default function Kleurenbox() {
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
    
    
    
      const [userBoxes, setUserBoxes] = useState([]);
      const [userScores, setUserScores] = useState([]);
      const [companyId, setCompanyId] = useState(null);
      const [companyName, setCompanyName] = useState(null);
      const [boxOnePos, setBoxOnePos] = useState({x: 0, y: 0});
      const [boxTwoPos, setBoxTwoPos] = useState({x: 0, y: 0});const [displayCount, setDisplayCount] = useState(20);
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
    
      const Header = ({ title }) => (
        <div className={styles.header}>
          <hr />
          <div className={styles["page-title"]}>{title}</div>
        </div>
      );  
      const handleSeeMore = () => {
        setDisplayCount(prevCount => prevCount + 20);
      };

      return (
        <React.Fragment>
          <table className={styles["participant-table"]}>
            <thead>
              <tr>
                <th>Deelnemer</th>
                <th>D</th>
                <th>I</th>
                <th>S</th>
                <th>C</th>
                <th>Resultaat</th>
              </tr>
            </thead>
            <tbody>
              {userBoxes.map((user, index) => {
                const userScore = userScores.find(score => score.userId === user.id) || {};
                let userProfile = "";
      
                if (user.box && user.box.length === 2) {
                  const descriptionIndex = boxCodeToIndex[user.box[0].toUpperCase()] * 4 + boxCodeToIndex[user.box[1].toLowerCase()];
                  userProfile = descriptions[descriptionIndex];
                } else if (user.box && user.box.length === 1) {
                  const letter = user.box[0].toUpperCase();
                  const value = singleLetter[letter];
                  userProfile = descriptions[value];
                }
      
                return (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{userScore.scoreValueD}</td>
                    <td>{userScore.scoreValueI}</td>
                    <td>{userScore.scoreValueS}</td>
                    <td>{userScore.scoreValueC}</td>
                    <td>{userProfile}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Link color="primary" href="#" onClick={handleSeeMore}>
            Zie meer resultaten
          </Link>
        </React.Fragment>
      );
    }

