import React, { useEffect, useState } from 'react';
import DashboardSidebar from './OpenDashboardSidebar';
import styles from '../../Css/Dashboard.module.css';
import axios from 'axios';
import config from '../../config';
import html2pdf from 'html2pdf.js';
import Draggable from 'react-draggable';
import { AppContext } from '../../context';
const backgroundColor = '#087a80';
const Header = ({ title }) => (
  <div className={styles.header}>
    <hr />
    <div className={styles["page-title"]}>{title}</div>
  </div>
);

const OpenDashboard = () => {
  const [openQuestions, setOpenQuestions] = useState([]);
  const [openAnswers, setOpenAnswers] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [username, setUsername] = useState('');
  const [boxOnePos, setBoxOnePos] = useState({x: 0, y: 0});

  const resetPositions = () => {
    setBoxOnePos({x: 0, y: 0});
    localStorage.removeItem('boxOnePos');

  };
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${config.API_BASE_URL}/api/Users/Username`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setUsername(response.data);
    })
    axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/open`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setOpenQuestions(response.data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

    axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/user/me/answers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
        setOpenAnswers(response.data);
        const uniqueSessions = [...new Set(response.data.map(answer => answer.session))];
        setSessions(uniqueSessions);
        setSelectedSession(uniqueSessions[0]);  // This is the update
      })
      
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, []);

  const handleSessionChange = (event) => {
    setSelectedSession(parseInt(event.target.value));
  };

  const downloadPdf = () => {
    axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/updatedWordDocument`, {
      responseType: 'blob', // Important
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      // Create a blob from the Word document stream
      const file = new Blob(
        [response.data], 
        {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
      );
      
      // Create a link, click it, and remove it to download the file
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', 'Questionnaire.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  
  
  const getEarliestDate = (session) => {
    const dates = openAnswers.filter(answer => answer.session === session).map(answer => new Date(answer.date));
    return formatDate(new Date(Math.min(...dates)));
  }
  
  const formatDate = (date) => {
    const d = new Date(date);
    const time = [addLeadingZero(d.getHours()), addLeadingZero(d.getMinutes())].join(':');
    const datePart = [addLeadingZero(d.getDate()), addLeadingZero(d.getMonth() + 1), d.getFullYear()].join('-');
    return datePart + ' om ' + time;
  }

  
  const addLeadingZero = (num) => {
    return num < 10 ? '0' + num : num.toString();
  }
  

  

  return (
    <AppContext.Provider value={{ resetPositions }}>
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.main}>
        <Header title='Open Questions and Answers' />
        <div className={styles.content}>
          <div className={styles["text-content"]}>
          <Draggable
  position={boxOnePos}
  onStop={(e, data) => {
    const newPos = {x: data.x, y: data.y};
    setBoxOnePos(newPos);
    localStorage.setItem('boxOnePos', JSON.stringify(newPos));
  }}
>
          <div 
          
            className={styles["text-content"]} 
            style={{
              backgroundColor: backgroundColor,
              padding: '20px 10px 10px 30px',
              marginLeft: '20px',
              borderRadius: '20px',
              color: 'white',
              maxWidth: '1000px',
              boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.8)',
              display: 'flex',
  flexDirection: 'column',
  height: 'fit-content', 
            }}
            >
            <h2>Open Questions and Answers</h2>
            <select value={selectedSession} onChange={handleSessionChange} style={{width: '150px', height: '30px', fontSize: '18px'}}>
  {sessions.map((session, index) => (
    <option key={index} value={session}>{`Session ${index + 1}`}</option>
  ))}
</select>
            <div id="session-data">
                <h1 style={{fontWeight: 'bold'}}>Vragenlijst</h1>
                
                <h3>U heeft deze vragenlijst op {getEarliestDate(selectedSession)} ingevuld</h3>
                {openQuestions.map((question, questionIndex) => {
                    const correspondingAnswers = openAnswers.filter(answer => answer.questionOpenId === question.id && answer.session === selectedSession);
                    return (
                        <React.Fragment key={questionIndex}>
                        <h2>{question.questionText}</h2>
                        {correspondingAnswers.map((answer, answerIndex) => (
                            <p key={answerIndex} dangerouslySetInnerHTML={{ __html: answer.answerText }}></p>

                        ))}
                        {correspondingAnswers.length === 0 && <p>No answers for this question in this session.</p>}
                        </React.Fragment>
                    );
                })}
            </div>
            <hr style={{ width: '40%', marginLeft: '0', border: 'none', borderBottom: '1px solid white' }} />


            <div>
            <button style={{ backgroundColor: '#083e80', marginBottom: '30px' }} onClick={downloadPdf}>Download PDF</button >
            </div>
            </div>
            </Draggable>
            

          </div>
        </div>
      </div>
    </div>
    </AppContext.Provider>
  );
};

export default OpenDashboard;
