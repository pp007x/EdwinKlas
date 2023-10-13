import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../../Css/CompanyDashboard.module.css'; 
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import config from '../../config';

function ResetPassword() {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [generatedToken, setGeneratedToken] = useState("");

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

  const handleGenerateResetToken = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await axios.post(`${config.API_BASE_URL}/api/Users/GenerateResetToken/${selectedUser}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setGeneratedToken(response.data.token);
  };
  const Header = ({ title }) => (
    <div className={styles.header}>
      <hr />
      <div className={styles['page-title']}>{title}</div>
    </div>
  );
  
  return (
    <div className={styles.dashboard}>
        <AdminSidebar />
        <div className={styles.main}>
        {/* <Header title="Reset password" /> */}
            <div className={styles.content}>
            <div className={styles.cool}>
            <div className={styles.hm}>
              <h1>Generate Password Reset Token</h1>
              <form onSubmit={handleGenerateResetToken}>
                <div>
                  <label>
                    Select User:
                  </label>
                  <select className={styles.dropdownMenu} name="selectedUser" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit">Generate Token</button>
              </form>
              {generatedToken && <p>The generated token is: {generatedToken}</p>}
            </div>
        </div>
        </div>
        </div>
    </div>
  );
}

export default ResetPassword;
