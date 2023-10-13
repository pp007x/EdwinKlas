import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import config from '../../config';
import DashboardSidebar from './AdminSidebar';
import styles from '../../Css/CompanyDashboard.module.css'; 
const Header = ({ title }) => (
  <div className={styles.header}>
    <hr />
    <div className={styles["page-title"]}>{title}</div>
  </div>
);

function AdminNewQuestion() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyTypes, setCompanyTypes] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${config.API_BASE_URL}/api/companies` , {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then(response => response.json())
            .then(data => {
                console.log(data);  // log the server response
                setCompanies(data);
                const companyTypes = data.reduce((acc, company) => {
                  acc[company.id] = company.companyType;
                  return acc;
                }, {});
                setCompanyTypes(companyTypes);
              });
              
    }, []);
    

    const handleFileUpload = async (event) => {
        setLoading(true);
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            const yamlText = e.target.result;
            const data = yaml.load(yamlText);
        
            // Assuming for company type 1, the structure is array at the root level
            // and for company type 2, there is a 'questions' key
            let questions;
            if (Array.isArray(data)) {
                questions = data;  // for company type 1
            } else if (data.questions) {
                questions = data.questions;  // for company type 2
            } else {
                console.error('Invalid structure in YAML file. Expected an array or a key "questions".');
                return;
            }
            
            questions.forEach(question => question.CompanyId = selectedCompany);
            setQuestions(questions);
    
            // Depending on the company type, choose the API URL
            console.log(companyTypes)
            const apiUrl = companyTypes[selectedCompany] === 2
            ? `${config.API_BASE_URL}/api/YamlUpload/YamlUploadForType2`
            : `${config.API_BASE_URL}/api/YamlUpload`;
    
            try {
                const token = localStorage.getItem('token');
                console.log(questions)
                console.log(apiUrl)
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
                    body: JSON.stringify(questions)
                    
                });
                if (response.ok) {
                    alert("Data successfully uploaded");
                } else {
                    // Get the error message from the server
                    const errorMessage = await response.text();
                    console.error('Server responded with an error:', errorMessage);
                    alert("Failed to upload data");
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);
    };
    
    

    return (
        <div className={styles.dashboard}>
            <DashboardSidebar />
            <div className={styles.main}>
                {/* <Header title="Upload questions" /> */}
                <div className={styles.content}>
                    <div className={styles.sidebarRight}>
                    <div className={styles.cool}>
                    <div className={styles.hm}>
                        <h1>Add new questions</h1>
                        <label className={styles.label}>Select a company:</label>
                        <div>
                        <select className={styles.dropdownMenu} value={selectedCompany} onChange={event => setSelectedCompany(parseInt(event.target.value, 10))}>

                                <option value="">Select a company...</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <p></p>
                        <input type="file" style={{ width: '500px' }} onChange={handleFileUpload} disabled={loading || !selectedCompany} />
                    </div>
                </div>
                </div>
                </div>
            </div>
        </div>
    );
    
}

export default AdminNewQuestion;
