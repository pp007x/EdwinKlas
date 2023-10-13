import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/HigtechLogo.jpeg';
import styles from '../Css/DashboardSidebar.module.css';
import axios from 'axios';
import config from '../config';
import { AppContext } from '../context';

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/'; // Redirect to the main page. Adjust the URL if your main page is different.
}


const DashboardSidebar = () => {
  const location = useLocation();
  const [companyName, setCompanyName] = useState(null);
  const { resetPositions } = useContext(AppContext);

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

  return (
    <div className={styles["sidebar-container"]}>
      <div className={styles.sidebar}>
        <div>
          <div className={styles["logo-container"]}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>
          <hr />
          <div className={styles.navigation}>
            <Link
              to="/dashboard"
              className={`${styles["nav-button"]} ${location.pathname === '/dashboard' ? styles.active : ''}`}
            >
              Dashboard
            </Link>
            {/* <Link
              to="/companydashboard"
              className={`${styles["nav-button"]} ${location.pathname === '/companydashboard' ? styles.active : ''}`}
            >
              Profielen van {companyName}
            </Link> */}
            <Link
              to="/info"
              className={`${styles["nav-button"]} ${location.pathname === '/info' ? styles.active : ''}`}
            >
              Profielen en communicatiemethodes
            </Link>
            <button style={{background: "#077da1"}} onClick={logout} className={styles["nav-button"]}>Log uit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
