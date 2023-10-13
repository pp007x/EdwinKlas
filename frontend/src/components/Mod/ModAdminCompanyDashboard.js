import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import styles from '../../Css/CompanyDashboard.module.css';
import AdminSidebar from './ModAdminSidebar';
import AdminHeader from './ModAdminHeader';

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

const AdminCompanyDashboard = () => {
  const [userBoxes, setUserBoxes] = useState([]);
  const [userScores, setUserScores] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [companyType, setCompanyType] = useState(null);
  const [linkInput, setLinkInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiLink, setApiLink] = useState('https://www.google.com');
  const [linkName, setLinkName] = useState('');
  const [linkId, setLinkId] = useState('');
  const [companyId, setcompanyId] = useState('');
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/api/Companies`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const company = companies.find((company) => company.id === Number(selectedCompany));
      if (company) {
        setCompanyType(company.companyType);
      }
    }
  }, [selectedCompany, companies]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (companyId) {
        axios.get(`${config.API_BASE_URL}/api/Link/${companyId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        })
        .then(response => {
            setApiLink(response.data.webadress); 
            setLinkInput(response.data.webadress);
            setLinkName(response.data.name);
            setLinkId(response.data.id);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }
}, [companyId]);

  
  const handleInputChange = (e) => {
    setLinkInput(e.target.value);
  }

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    // Include the linkName in the data sent to the API
    axios.post(`${config.API_BASE_URL}/api/Link`, { Id: linkId, Webadress: linkInput, Name: linkName, CompanyId: companyId },  {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        setLoading(false);
        setApiLink(response.data.webadress); 
        alert('Link updated successfully');
      })
      .catch(error => {
        setLoading(false);
        console.error('There was an error!', error);
        alert('There was an error updating the link');
      });
  }
  const handleNameChange = (e) => {
    setLinkName(e.target.value);
  }
  useEffect(() => {
    const fetchUserBoxes = async () => {
      if (companyType !== 2) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${config.API_BASE_URL}/api/Companies/${selectedCompany}/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = response.data;
          setUserBoxes(Array.isArray(data) ? data : []);
          const selectedCompanyData = await axios.get(`${config.API_BASE_URL}/api/Companies/${selectedCompany}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (selectedCompanyData) {
            setCompanyCode(selectedCompanyData.data.code);
            setcompanyId(selectedCompanyData.data.id)
          } else {
            setCompanyCode('');
          }
        } catch (error) {
          console.error('Error fetching user boxes:', error);
        }
      }
    };

    const fetchUserScores = async () => {
      if (companyType !== 2) {
        try {
          const response = await axios.get(`${config.API_BASE_URL}/api/TotalScores/all`);
          const data = response.data;
          setUserScores(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching user scores:', error);
        }
      }
    };

    if (selectedCompany) {
      fetchUserBoxes();
      fetchUserScores();
    }
  }, [selectedCompany, companies, companyType]);

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
        <Header title="Info per company" />
        <div className={styles.content}>
          <div className={styles.sidebarRight}>
            <div className={styles["dashboard-title"]}>
              <h1>Company Dashboard</h1>
              <p>Welcome to the Company Dashboard page!</p>
              <p>Company Code: {companyCode}</p>
            </div>
  
            <div className={styles["company-selection-container"]}>
              <div>
                <label>Select a Company:</label>
              </div>
              <div>
                <select className={styles.dropdownMenu} onChange={(e) => setSelectedCompany(e.target.value)}>
                  <option value="">Select a company</option>
                  {companies.map((company, index) =>
                    <option key={index} value={company.id}>{company.name}</option>
                  )}
                </select>
              </div>
            </div>
            {companyType === 2 && (
      <div style={{marginTop: '30px'}}>
        <label>Dit bedrijf maakt gebruik van de omgevingsanalyse tool.</label>
        <p></p>
        <form onSubmit={handleLinkSubmit}>
          <label>Link Name</label>  {/* New label for link name */}
          <input className={styles.inputField} type="text" value={linkName} onChange={handleNameChange} /> {/* New input field for link name */}
          <label>Link URL</label>  {/* Existing label for link URL */}
          <input className={styles.inputField} type="text" value={linkInput} onChange={handleInputChange} />
          <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Link'}</button>
        </form>
      </div>
    )}

            {companyType !== 2 && (
              <div className={styles["dashboard-content"]}>
                <div className={styles["big-square-wrapper"]}>
                  <div className={styles["big-square-container"]}>
                    {['C', 'D', 'S', 'I'].map((letter, bigSquareIndex) => (
                      <div className={`${styles["big-square"]} ${styles["big-square-" + (bigSquareIndex + 1)]}`} key={bigSquareIndex}>
                        <p className={styles["corner-letter"]}>{letter}</p>
                        <div className={styles["small-squares"]}>
                          {[0, 1, 2, 3].map((smallSquareIndex) => {
                            const descriptionIndex = bigSquareIndex * 4 + smallSquareIndex;
                            const colorClass = `small-square-${descriptionIndex + 1}`;
                            return (
                              <div className={`${styles["small-square"]} ${styles[colorClass]}`} key={smallSquareIndex}>
                                <div className={styles["box-content"]}>
                                  <p className={styles["description-name"]}>{descriptions[descriptionIndex]}</p>
                                  {smallSquareIndex === 2 && bigSquareIndex === 0 && <p className={styles["indirect-label"]}>Indirect</p>}
                                  {smallSquareIndex === 1 && bigSquareIndex === 2 && <p className={styles["mens-label"]}>Mens</p>}
                                  {smallSquareIndex === 0 && bigSquareIndex === 1 && <p className={styles["taak-label"]}>Taak</p>}
                                  {smallSquareIndex === 0 && bigSquareIndex === 3 && <p className={styles["direct-label"]}>Direct</p>}
                                  <div className={styles["score-container"]}>
                                    {userBoxes
                                      .filter(user =>
                                        typeof user.box === 'string' &&
                                        user.box.length === 2 &&
                                        boxCodeToIndex[user.box[0].toUpperCase()] === bigSquareIndex &&
                                        boxCodeToIndex[user.box[1].toLowerCase()] === smallSquareIndex)
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
  
                <div className={styles["participant-table-container"]}>
                  <table className={styles["participant-table"]}>
                    <thead>
                      <tr>
                        <th>Deelnemer</th>
                        <th>D</th>
                        <th>I</th>
                        <th>S</th>
                        <th>C</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBoxes.map((user, index) => {
                        const userScore = userScores.find(score => score.userId === user.id) || {};
                        return (
                          <tr key={index}>
                            <td>{user.username}</td>
                            <td>{userScore.scoreValueD}</td>
                            <td>{userScore.scoreValueI}</td>
                            <td>{userScore.scoreValueS}</td>
                            <td>{userScore.scoreValueC}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
                    }

export default AdminCompanyDashboard;
