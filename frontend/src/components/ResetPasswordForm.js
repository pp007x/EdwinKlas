import React, { useState } from "react";
import axios from "axios";
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import styles from '../Css/LoginForm.module.css';
import config from '../config';

Modal.setAppElement('#root');

function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [tokenInputFocused, setTokenInputFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setErrorModalIsOpen(true);
      return;
    }

    try {
      await axios.post(`${config.API_BASE_URL}/api/Users/ResetPassword`, {
        resetToken: token,
        newPassword: password
      });

      setSuccessModalIsOpen(true);
    } catch (error) {
      setError("Token incorrect");
      setErrorModalIsOpen(true);
    }
  };

  return (
    <div className={styles.loginFormWrapper}>
      <div className={styles.inputBox}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Token:</label>
          <div // Wrap the input field and tooltip container
            className={styles.inputWithTooltip}
            onMouseEnter={() => setTokenInputFocused(true)}
            onMouseLeave={() => setTokenInputFocused(false)}
          >
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              className={styles.input}
              onFocus={() => setTokenInputFocused(true)}
              onBlur={() => setTokenInputFocused(false)}
            />
            {tokenInputFocused && (
              <div className={styles.tooltip}>
                Geleverd vanuit Parcival
              </div>
            )}
          </div>

          <label className={styles.label}>Nieuw wachtwoord:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
          />

          <label className={styles.label}>Bevestig wachtwoord:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={styles.input}
          />

          <button type="submit" className={styles.loginButton}>Stel wachtwoord opnieuw in</button>
        </form>
        <button className={styles.loginButton} onClick={() => navigate('/login')}>Terug naar login</button>
        
      </div>
      {/* Success Modal */}
      <Modal
        isOpen={successModalIsOpen}
        onRequestClose={() => setSuccessModalIsOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2>Wachtwoord Reset Succesvol</h2>
          <p>Uw wachtwoord is succesvol opnieuw ingesteld.</p>
          <button onClick={() => setSuccessModalIsOpen(false)}>Sluiten</button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={errorModalIsOpen}
        onRequestClose={() => setErrorModalIsOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2>Fout bij Wachtwoord Reset</h2>
          <p>{error}</p>
          <button onClick={() => setErrorModalIsOpen(false)}>Sluiten</button>
        </div>
      </Modal>
    </div>
  );
}

export default ResetPasswordForm;
