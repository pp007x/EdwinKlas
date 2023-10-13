import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../../Css/CompanyDashboard.module.css';
import config from '../../config';

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

      const getLetterColor = (letter) => {
        switch (letter) {
          case 'D':
            return '#df1f26';
          case 'C':
            return '#0078c0';
          case 'S':
            return '#00a84b';
          case 'I':
            return '#ffc808';
          default:
            return 'black'; // Default color
        }
      };
    
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

  return (
    <React.Fragment>
    
      <div className={styles["dashboard-content"]} >

              <div className={styles["big-square-wrapper"]}>
                <div className={styles["big-square-container"]}>
                  {['C', 'D', 'S', 'I'].map((letter, bigSquareIndex) => (
                    <div className={`${styles["big-square"]} ${styles["big-square-" + (bigSquareIndex + 1)]}`} key={bigSquareIndex}>
                      <p className={styles["corner-letter"]} style={{color: getLetterColor(letter)}}><b>{letter}</b></p>
                      <div className={styles["small-squares"]} >
                        {[0, 1, 2, 3].map((smallSquareIndex) => {
                          const descriptionIndex = bigSquareIndex * 4 + smallSquareIndex;
                          const colorClass = `small-square-${descriptionIndex + 1}`;
                          return (
                            <div className={`${styles["small-square"]} ${styles[colorClass]}`}  key={smallSquareIndex}>
                              <div className={styles["box-content"]}>
                                <p className={styles["description-name"]} style={{color: 'black'}}><b>{descriptions[descriptionIndex]}</b></p>
                                <p></p>
                                {smallSquareIndex === 3 && bigSquareIndex === 0 && <p className={styles["indirect-label"]}><b>Consciëntieus</b></p>}
                                {smallSquareIndex === 0 && bigSquareIndex === 2 && <p className={styles["mens-label"]}><b>Stabiel</b></p>}
                                {smallSquareIndex === 0 && bigSquareIndex === 1 && <p className={styles["taak-label"]}><b>Dominant</b></p>}
                                {smallSquareIndex === 0 && bigSquareIndex === 3 && <p className={styles["direct-label"]}><b>Invloedrijk</b></p>}
                                <div className={styles["score-container"]} style={{color: 'black'}} >
                                {userBoxes 
                                .filter(user =>
                                  typeof user.box === 'string' &&
                                  (user.box.length === 1 || user.box.length === 2) &&
                                  boxCodeToIndex[user.box[0].toUpperCase()] === bigSquareIndex &&
                                  boxCodeToIndex[user.box.length === 1 ? user.box[0].toUpperCase() : user.box[1].toLowerCase()] === smallSquareIndex)
                                .map((user, index) => (
                                  <p className={styles["score-name"]} key={index}>{user.username}</p>
                                ))
                              }

                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
                </div>
              
    </React.Fragment>
  );
}

