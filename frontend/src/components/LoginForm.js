import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Modal from 'react-modal';
import styles from '../Css/LoginForm.module.css';
import logo from '../images/HigtechLogo.png';
import config from '../config';

Modal.setAppElement('#root');

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/Authentication/Login`, data);
      // Save the JWT token to local storage
      localStorage.setItem('token', response.data);
      // Decode the token
      const decodedToken = jwtDecode(response.data);
      // Get the role and the user ID from the token
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']; 

      if (userRole === 'Admin' || userRole === 'Mod') {
        navigate('/admin');
        return;
      }

        
      // Fetch the user's company
      const companyResponse = await axios.get(`${config.API_BASE_URL}/api/Companies/current`, {
        headers: {
          'Authorization': `Bearer ${response.data}`
        }
      });
      const companyType = companyResponse.data.companyType;
      // Check user's scores
      
      try {
        const totalScoreResponse = await axios.get(`${config.API_BASE_URL}/api/TotalScores/user/me`, {
          headers: {
            'Authorization': `Bearer ${response.data}`
          }
        });
        
        const totalScore = totalScoreResponse.data;

        // If user's scores are null, navigate to /reactionform or /openreactionform based on CompanyType
        
         if(!totalScore || totalScore === null) {
          navigate(companyType === 1 ? '/Inforeactionform' : '/openreactionform');
        } else {  
          // Navigate to the correct page based on the role and CompanyType
            navigate(companyType === 1 ? '/dashboard' : '/opendashboard');
          
        }
      } catch (error) {
        navigate(companyType === 1 ? '/ReactionForm' : '/reactionformOpen');
      }
    } catch (error) {
      setModalIsOpen(true);
      setLoginError("Ongeldige gebruikersnaam of wachtwoord.");
    }
  }

  return (
    <div className={styles.loginFormWrapper}>
      <div className={styles.inputBox}>
        <img src={logo} alt="Logo" className={styles.logo} /> 
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Gebruikersnaam:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Gebruikersnaam" className={styles.input} />
          <label className={styles.label}>Wachtwoord:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" className={styles.input} />
          <button type="submit" className={styles.loginButton}>Inloggen</button>
        </form>
        <button className={styles.registerButton} onClick={() => navigate('/register')}>Registreren</button>
        <button className={styles.resetPasswordButton} onClick={() => navigate('/resetpassword')}>Wachtwoord vergeten?</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2>Fout wachtwoord</h2>
          <p>{loginError}</p>
          <button onClick={() => setModalIsOpen(false)}>Sluiten</button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginForm;
