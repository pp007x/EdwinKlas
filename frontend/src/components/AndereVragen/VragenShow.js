import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Title from '../Nice/Title';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import config from '../../config';

const VragenShow = () => {
  const theme = useTheme();
  const [openQuestions, setOpenQuestions] = useState([]);
  const [openAnswers, setOpenAnswers] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Fetch username
    axios.get(`${config.API_BASE_URL}/api/Users/Username`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setUsername(response.data);
    });

    // Fetch open questions
    axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/open`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setOpenQuestions(response.data);
    });

    // Fetch user answers
    axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/user/me/answers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setOpenAnswers(response.data);
      const uniqueSessions = [...new Set(response.data.map(answer => answer.session))];
      setSessions(uniqueSessions);
      setSelectedSession(uniqueSessions[0]);
    });

  }, []);

  const handleSessionChange = (event) => {
    setSelectedSession(parseInt(event.target.value));
  };

  const downloadPdf = () => {
    axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/updatedWordDocument`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      const file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
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

  const addLeadingZero = (num) => num < 10 ? '0' + num : num.toString();

  return (
    <React.Fragment>
      <Title>Hoi</Title>
      <ResponsiveContainer>
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
          <button style={{ backgroundColor: '#083e80', marginBottom: '30px' }} onClick={downloadPdf}>Download PDF</button>
        </div>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

export default VragenShow;