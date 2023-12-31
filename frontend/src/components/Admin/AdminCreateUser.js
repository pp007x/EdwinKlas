import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../../Css/CompanyDashboard.module.css'; 
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import config from '../../config';
import jwtDecode from "jwt-decode";
import { Link, useLocation } from 'react-router-dom';
function CreateUser() {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    isAdmin: false,
    isMod: false,
    companyId: ""
  });

  const [companies, setCompanies] = useState([]);
  const [isUserAdded, setIsUserAdded] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/api/Companies`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCompanies(response.data);
      } catch (error) {
        console.error("error: " + error);
      }
    };

    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewUser({
      ...newUser,
      [e.target.name]: value
    });
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.API_BASE_URL}/api/Users`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsUserAdded(true);
      setNewUser({
        username: "",
        password: "",
        isAdmin: false,
        isMod: false,
        companyId: ""
      });
    } catch (error) {
      console.error(error);
    }
  };
  const Header = ({ title }) => (
    <div className={styles.header}>
      <hr />
      <div className={styles['page-title']}>{title}</div>
    </div>
  );

  const token = localStorage.getItem('token');
  const location = useLocation();

  let role = "";
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
  }
  return (
    <div className={styles.dashboard}>
        <AdminSidebar />
        <div className={styles.main}>
        {/* <Header title="Add user" /> */}
            <div className={styles.content}>
              <div className={styles.cool}>
              <div className={styles.hm}>
          <h1>Create New User</h1>
          {isUserAdded && <p>User added successfully!</p>}
          <form onSubmit={handleNewUserSubmit}>
            <label>
              Username:
              <input className={styles.inputField} type="text" name="username" value={newUser.username} onChange={handleInputChange} />
            </label>
            <label>
              Password:
              <input className={styles.inputField} type="password" name="password" value={newUser.password} onChange={handleInputChange} />
            </label>

            <label className={`${styles.longLabel}  ${styles.labelWithCheckbox}`}>
            {role === 'Admin' && (
            <>
            <span>Is Admin:</span>
            <input className={`${styles.checkboxSize}`} type="checkbox" name="isAdmin" checked={newUser.isAdmin} onChange={handleInputChange} />
            <span>Is Mod:</span>
            <input className={`${styles.checkboxSize}`} type="checkbox" name="isMod" checked={newUser.isMod} onChange={handleInputChange} />
            </>
            )}
          </label>

          <label>
            Company:
            <select className={styles.dropdownMenu} name="companyId" value={newUser.companyId} onChange={handleInputChange}>
              <option value="">Select company</option>
              {companies && Array.isArray(companies) && companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>

            <button type="submit">Create User</button>
          </form>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
}

export default CreateUser;
