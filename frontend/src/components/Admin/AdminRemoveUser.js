// RemoveUser.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../../Css/CompanyDashboard.module.css'; 
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader'; // you might want to create separate css module for this component
import config from '../../config';

function RemoveUser() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isUserRemoved, setIsUserRemoved] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${config.API_BASE_URL}/api/Companies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setCompanies(response.data);
  };

  const fetchUsers = async (companyId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${config.API_BASE_URL}/api/Companies/${companyId}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(response.data);
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    fetchUsers(e.target.value);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleRemoveUser = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    await axios.delete(`${config.API_BASE_URL}/api/Users/${selectedUser}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setIsUserRemoved(true);
    setSelectedUser("");
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
        {/* <Header title="Remove user" /> */}

            <div className={styles.content}>
            <div className={styles.cool}>
            <div className={styles.hm}>
          <h1>Remove User</h1>
          {isUserRemoved && <p>User removed successfully!</p>}
          <form onSubmit={handleRemoveUser}>
            <label>
              Company:
              <select className={styles.dropdownMenu} name="companyId" value={selectedCompany} onChange={handleCompanyChange}>
                <option value="">Select company</option>
                {companies && companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              User:
              <select name="userId" className={styles.dropdownMenu} value={selectedUser} onChange={handleUserChange}>
                <option value="">Select user</option>
                {users && users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Remove User</button>
          </form>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default RemoveUser;
