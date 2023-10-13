import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Css/ReactionForm.module.css';
import { useNavigate } from 'react-router-dom';

import config from '../config';



const IntroPage = () => {
  const [onderwerpData, setOnderwerpData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/api/Onderwerp/welkom`, {
      headers: {
      }
    })
    .then(response => {
      setOnderwerpData(response.data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, []);

  const handleIntroRead = () => {
    navigate('/reactionform');
  };

  return (
    <div className={styles["form-control"]}>
        <div>
          <h1>{onderwerpData ? onderwerpData.name : 'Loading...'}</h1>
          <p dangerouslySetInnerHTML={{__html: onderwerpData ? onderwerpData.description : 'Loading...' }}></p>
          <button className={styles["button"]} onClick={handleIntroRead}>Ga door naar de vragen</button>
        </div>
    </div>
  );
};

export default IntroPage;
