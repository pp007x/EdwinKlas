import React, { useState } from "react";
import axios from "axios";
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import styles from '../../Css/CompanyDashboard.module.css'; 
import config from '../../config';

function AddCompany() {
  const [company, setCompany] = useState({
    name: "",
    description: "",
    code: Math.random().toString(36).substr(2, 10)
  });

  const [isCompanyAdded, setIsCompanyAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value
    });
  };

  const handleNewCompanySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', company.name);
    formData.append('description', company.description);
    formData.append('code', company.code);
    formData.append('companyType', company.companyType);  // Add this line
  

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.API_BASE_URL}/api/Companies`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsCompanyAdded(true);
      setErrorMessage("");  // Clear any previous error messages
      setCompany({
        name: "",
        description: "",
        code: Math.random().toString(36).substr(2, 10)
      });
    } catch (error) {
      setIsCompanyAdded(false);
      if (error.response && error.response.status === 409) {
        setErrorMessage("A company with this name already exists.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    }
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
            {/* <Header title="Add company" /> */}
            <div className={styles.content}>
              <div className={styles.cool}>
              <div className={styles.hm}>
                <h1>Add New Company</h1>
                {isCompanyAdded && <p>Company added successfully!</p>}
                {errorMessage && <p>{errorMessage}</p>} {/* Display the error message if it's set */}
                <form onSubmit={handleNewCompanySubmit}>
                  <label>
                    Name:
                    <input type="text" name="name" value={company.name} className={styles.inputField} onChange={handleInputChange} required />
                  </label>
                  <label>
                    Description:
                    <input type="text" name="description" className={styles.inputField} value={company.description} onChange={handleInputChange} />
                  </label>
                  <label>
                    Type:
                    <select name="companyType" value={company.companyType} className={styles.inputField} onChange={handleInputChange} required>
                      <option value="">Select a type</option>
                      <option value="1">Meerkeuze</option>
                      {/* <option value="2">Open vragen</option> */}
                    </select>
                  </label>
                  <button type="submit">Add Company</button>
                </form>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default AddCompany;
