import React, { useState, useEffect } from 'react';
import config from '../../config';
import DashboardSidebar from './AdminSidebar';
import styles from '../../Css/CompanyDashboard.module.css';

const Header = ({ title }) => (
  <div className={styles.header}>
    <hr />
    <div className={styles["page-title"]}>{title}</div>
  </div>
);

function AdminEditHulpVakjes() {
  const [hulpVakjes, setHulpVakjes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [newHulpVakje, setNewHulpVakje] = useState({
    Titel: '',
    Tekst: '',
    Kleur: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${config.API_BASE_URL}/api/companies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setCompanies(data));
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetch(`${config.API_BASE_URL}/api/HulpVakjes/${selectedCompany}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const formattedData = data.map(hulpVakje => {
            return { ...hulpVakje, tekst: hulpVakje.tekst.replace(/<br \/>/g, '\n') };
          });
          setHulpVakjes(formattedData);
        })
        .catch(error => console.error(error));
    }
  }, [selectedCompany]);

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleInputChange = (event) => {
    setNewHulpVakje(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };

  const handleHulpVakjeChange = (event, id) => {
    setHulpVakjes(hulpVakjes.map(hulpVakje => hulpVakje.id === id
      ? { ...hulpVakje, [event.target.name]: event.target.value }
      : hulpVakje
    ));
  };

  const handleEdit = (hulpVakje) => {
    const hulpVakjeToSave = { ...hulpVakje, tekst: hulpVakje.tekst.replace(/\n/g, '<br />') };
    fetch(`${config.API_BASE_URL}/api/HulpVakjes/${hulpVakjeToSave.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(hulpVakjeToSave)
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
        } else {
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleSubmit = () => {
    const hulpVakjeToCreate = { ...newHulpVakje, Tekst: newHulpVakje.Tekst.replace(/\n/g, '<br />'), CompanyId: selectedCompany };
    fetch(`${config.API_BASE_URL}/api/HulpVakjes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(hulpVakjeToCreate)
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          fetchHulpVakjes();
          setNewHulpVakje({
            Titel: '',
            Tekst: '',
            Kleur: ''
          });
        } else {
          console.error('Failed to create HulpVakje');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchHulpVakjes = () => {
    if (selectedCompany) {
      fetch(`${config.API_BASE_URL}/api/HulpVakjes/${selectedCompany}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const formattedData = data.map(hulpVakje => {
            return { ...hulpVakje, tekst: hulpVakje.tekst.replace(/<br \/>/g, '\n') };
          });
          setHulpVakjes(formattedData);
        })
        .catch(error => console.error(error));
    }
  };
  
  useEffect(() => {
    fetchHulpVakjes();
  }, [selectedCompany]);

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.main}>
        {/* <Header title="Edit HulpVakjes" /> */}
        <div className={styles.content}>
          <div className={styles.sidebarRight}>
          <div className={styles.cool}>
          <div className={styles.hm}>
            <h1>Edit HulpVakjes</h1>
            <div className={styles.inputFieldWrapper}>
              <label>
                Select a company to edit HulpVakjes for:
                <select className={styles.dropdownMenu} value={selectedCompany} onChange={handleCompanyChange}>
                  <option value="">Select a company...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <h2>Existing HulpVakjes</h2>
            {hulpVakjes.map((hulpVakje, index) => (
              <div key={index}>
                <h3>
                  <input
                    type="text"
                    className={styles.inputField}
                    name="titel"
                    value={hulpVakje.titel}
                    onChange={(e) => handleHulpVakjeChange(e, hulpVakje.id)}
                  />
                </h3>
                <p>
                  <textarea
                    className={styles.inputField}
                    name="tekst"
                    value={hulpVakje.tekst}
                    onChange={(e) => handleHulpVakjeChange(e, hulpVakje.id)}
                  />
                </p>
                <p>
                  <label>
                    Kleur:
                    <select
                      name="kleur"
                      value={hulpVakje.kleur}
                      onChange={(e) => handleHulpVakjeChange(e, hulpVakje.id)}
                    >
                      <option value="">Select a color...</option>
                      <option value="Geel">Geel</option>
                      <option value="Blauw">Blauw</option>
                      <option value="Groen">Groen</option>
                      <option value="Rood">Rood</option>
                    </select>
                  </label>
                </p>
                <button className={styles.primaryButton} onClick={() => handleEdit(hulpVakje)}>Save</button>
              </div>
            ))}
            <h2>New HulpVakje</h2>
            <div>
              <h3>
                <input
                  type="text"
                  className={styles.inputField}
                  name="Titel"
                  value={newHulpVakje.Titel}
                  onChange={handleInputChange}
                  placeholder="Enter title..."
                />
              </h3>
              <p>
                <textarea
                  className={styles.inputField}
                  name="Tekst"
                  value={newHulpVakje.Tekst}
                  onChange={handleInputChange}
                  placeholder="Enter text..."
                />
              </p>
              <p>
                <label>
                  Kleur:
                  <select
                    name="Kleur"
                    value={newHulpVakje.Kleur}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a color...</option>
                    <option value="Geel">Geel</option>
                    <option value="Blauw">Blauw</option>
                    <option value="Groen">Groen</option>
                    <option value="Rood">Rood</option>
                  </select>
                </label>
              </p>
              <button className={styles.primaryButton} onClick={handleSubmit}>Add</button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AdminEditHulpVakjes;
