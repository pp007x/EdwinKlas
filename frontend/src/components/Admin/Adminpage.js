import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminSidebar from './AdminSidebar';
import styles from '../../Css/CompanyDashboard.module.css'; 
import config from '../../config';

function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    isAdmin: false
  });
  const Header = ({ title }) => (
    <div className={styles.header}>
      <hr />
      <div className={styles['page-title']}>{title}</div>
    </div>
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/api/Users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    await axios.post(`${config.API_BASE_URL}/api/Users`, newUser, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const response = await axios.get(`${config.API_BASE_URL}/api/Users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(response.data);
  };

  return (
    <div className={styles.dashboard} >
        <AdminSidebar />
        <div className={styles.main}>
            {/* <Header /> */}
            <div className={styles.content}>
          <h1 className={styles.cool}>Admin Portal</h1>
        </div>
    </div>
    </div>
  );
}

export default AdminPortal;
