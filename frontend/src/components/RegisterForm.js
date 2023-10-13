import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Modal from 'react-modal';
import styles from '../Css/LoginForm.module.css';
import config from '../config';

Modal.setAppElement('#root');

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registrationFailureModalIsOpen, setRegistrationFailureModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))) {
      setRegisterError("Uw wachtwoord voldoet niet aan de vereiste criteria. Zorg ervoor dat het minstens 8 tekens bevat, met ten minste één hoofdletter, één kleine letter, één cijfer en één speciaal teken (@, $, !, %, *, ?, of &).");
      setRegistrationFailureModalIsOpen(true);
      return;
    }
    

    try {
      const companyResponse = await axios.get(`${config.API_BASE_URL}/api/Companies/code/${companyCode}`);
      const companyId = companyResponse.data.id;
      const registrationResponse = await axios.post(`${config.API_BASE_URL}/api/Authentication/Register`, {
        username,
        password,
        companyId: parseInt(companyId)
      });

      localStorage.setItem('token', registrationResponse.data);
      await handleLogin();
    } catch (error) {
      setRegisterError("Er is een fout opgetreden tijdens het registreren. Probeer het opnieuw.");
      setRegistrationFailureModalIsOpen(true);
    }
  };
  
  const handleLogin = async () => {
    const data = {
      username: username,
      password: password
    };
  
    try {
      const loginResponse = await axios.post(`${config.API_BASE_URL}/api/Authentication/Login`, data);
  
      localStorage.setItem('token', loginResponse.data);
  
      const decodedToken = jwtDecode(loginResponse.data);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  
      // Fetch the user's company
      const companyResponse = await axios.get(`${config.API_BASE_URL}/api/Companies/current`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data}`
        }
      });
      const companyType = companyResponse.data.companyType;
      if (userRole === 'Admin') {
        navigate('/admin');
      } else {
        navigate(companyType === 1 ? '/InfoReactionForm' : '/reactionformOpen');
      }
  
    } catch (error) {
      setRegisterError("Automatische login gefaald.");
    }
  };
  

  const handleReturnClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.loginFormWrapper}>
      <div className={styles.inputBox}>
        <button className={styles.returnButton} onClick={handleReturnClick}>Terug</button>
        <form onSubmit={handleRegisterSubmit} className={styles.form}>
          <label className={styles.label}>Gebruikersnaam:</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Gebruikersnaam" 
            className={styles.input} 
          />
          <label className={styles.label}>Wachtwoord:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Wachtwoord" 
            className={styles.input} 
          />
          <label className={styles.label}>Bedrijfs Code:</label>
          <input 
            type="text" 
            value={companyCode} 
            onChange={e => setCompanyCode(e.target.value)} 
            placeholder="Bedrijfscode" 
            className={styles.input} 
          />
          <button type="submit" className={styles.loginButton}>Registreren</button>
        </form>
      </div>
      {/* Registration Failure Modal */}
      <Modal
        isOpen={registrationFailureModalIsOpen}
        onRequestClose={() => setRegistrationFailureModalIsOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2>Registratie Mislukt</h2>
          <p>{registerError || "Er is een fout opgetreden tijdens het registreren. Probeer het opnieuw."}</p>
          <button onClick={() => setRegistrationFailureModalIsOpen(false)}>Sluiten</button>
        </div>
      </Modal>
    </div>
  );
  
}

export default RegisterForm;
