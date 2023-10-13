import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '../../images/HigtechLogo.png';
import styles from '../../Css/DashboardSidebar.module.css';
import config from '../../config';
import { AppContext } from '../../context';
const DashboardSidebar = () => {
  const location = useLocation();
  const { resetPositions } = useContext(AppContext);
  const [apiLink, setApiLink] = useState('https://www.google.com');

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch the link from the API when the component mounts
    axios.get(`${config.API_BASE_URL}/api/Link`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }) // replace 'https://your-api-url' with your actual API URL
      .then(response => {
        // Set the state variable to the fetched link
        setApiLink(response.data.webadress); 
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className={styles["sidebar-container"]}>
      <div className={styles.sidebar}>
        <div className={styles["logo-container"]}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        <hr />
        <div className={styles.navigation}>
          <Link
            to="/opendashboard"
            className={`${styles["nav-button"]} ${location.pathname === '/dashboard' ? styles.active : ''}`}
          ><b>
            Dashboard</b>
          </Link>
          <Link
            to="/inforeactionformOpen"
            className={`${styles["nav-button"]} ${location.pathname === '/inforeactionformOpen' ? styles.active : ''}`}
          ><b>
            Start een nieuwe ronde</b>
          </Link>
          <a href={apiLink} className={styles["nav-button"]} target="_blank" rel="noopener noreferrer">
            <b>External Link</b>
          </a>
        </div>
        <p></p>
        <button style={{
                  backgroundColor: '#08804a',
                }} onClick={resetPositions}>Reset Positions</button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
