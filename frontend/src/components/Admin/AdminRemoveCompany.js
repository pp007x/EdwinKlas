// RemoveCompany.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../../Css/CompanyDashboard.module.css'; 
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader'; // you might want to create separate css module for this component
import config from '../../config';

function RemoveCompany() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isCompanyRemoved, setIsCompanyRemoved] = useState(false);

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

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleRemoveCompany = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    await axios.delete(`${config.API_BASE_URL}/api/Companies/${selectedCompany}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setIsCompanyRemoved(true);
    setSelectedCompany("");
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
        {/* <Header title="Remove company" /> */}

            <div className={styles.content}>
            <div className={styles.cool}>
            <div className={styles.hm}>
          <h1>Remove Company</h1>
          {isCompanyRemoved && <p>Company removed successfully!</p>}
          <form onSubmit={handleRemoveCompany}>
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
            <button type="submit">Remove Company</button>
          </form>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default RemoveCompany;
