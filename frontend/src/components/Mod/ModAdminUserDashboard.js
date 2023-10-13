import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import DashboardSidebar from './AdminSidebar';
import styles from '../../Css/CompanyDashboard.module.css'; 
import axios from 'axios';
import config from '../../config';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [onderwerpData, setOnderwerpData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [openQuestions, setOpenQuestions] = useState([]);
  const [openAnswers, setOpenAnswers] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);

  const Header = ({ title }) => (
    <div className={styles.header}>
      <hr />
      <div className={styles['page-title']}>{title}</div>
    </div>
  );

  const handleSessionChange = (event) => {
    setSelectedSession(parseInt(event.target.value));
  };

  useEffect(() => {
    fetchOpenReactions();
  }, [selectedCompany, selectedUser]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [selectedCompany]);

  useEffect(() => {
    fetchScoresAndData();
  }, [selectedUser, selectedCompany, companies]);

  const fetchOpenReactions = async () => {
    const token = localStorage.getItem('token');

    if (selectedCompany) {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/company/${selectedCompany}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setOpenQuestions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }

    if (selectedUser) {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/user/${selectedUser}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setOpenAnswers(response.data);
        const uniqueSessions = [...new Set(response.data.map(answer => answer.session))];
        setSessions(uniqueSessions);
        setSelectedSession(uniqueSessions[0]);
        console.log(response.data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/api/Companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchUsers = async () => {
    if (selectedCompany) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/api/Companies/${selectedCompany}/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const users = Array.isArray(response.data) ? response.data : [];
        setUsers(users);
        if (users.length > 0) {
          setSelectedUser(users[0].id);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  const fetchScoresAndData = async () => {
    if (selectedCompany && selectedUser) {
      const companyType = companies.find(c => c.id === Number(selectedCompany)).companyType;
      if (companyType !== 2) {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`${config.API_BASE_URL}/api/TotalScores/user/${selectedUser}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if(response.ok) {
            const serverData = await response.json();
            setResultData(serverData);
            const transformedData = [
              {
                subject: 'Dominant', A: serverData.scoreValueD,
              },
              {
                subject: 'Invloedrijk', A: serverData.scoreValueI,
              },
              {
                subject: 'Stabiel', A: serverData.scoreValueS,
              },
              {
                subject: 'Consciëntieus', A: serverData.scoreValueC,
              },
            ];
            setChartData(transformedData);
            try {
              const onderwerpResponse = await axios.get(`${config.API_BASE_URL}/api/Onderwerp/user/${selectedUser}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              setOnderwerpData(onderwerpResponse.data);
            } catch (error) {
              console.error('There has been a problem with your fetch operation:', error);
            }
          }
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
        }
      }
    }
  };

  const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
      </g>
    );
  };
  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.main}>
        <Header title="Info per user" />
        <div className={styles.content}>
          <div className={styles.sidebarRight}>
            <h1>See user info</h1>
            <label>Select a Company:</label>
            <div>
              <select className={styles.dropdownMenu} onChange={(e) => setSelectedCompany(e.target.value)} disabled={companies.length === 0}>
                <option value="">Select a company</option>
                {companies.map((company, index) => <option key={index} value={company.id}>{company.name}</option>)}
              </select>
            </div>
            <div>
              <label>Select a User:</label>
              <div>
                <select className={styles.dropdownMenu} onChange={(e) => setSelectedUser(e.target.value)} disabled={users.length === 0}>
                  <option value="">Select a user</option>
                  {users.map((user, index) => <option key={index} value={user.id}>{user.username}</option>)}
                </select>
              </div>
            </div>
            
            {resultData && selectedCompany &&
              companies.find(c => c.id === Number(selectedCompany)).companyType !== 2 && (
                <div>
                  <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 40]} tick={<CustomizedAxisTick />} />
                    <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                  <div>
                    <label><b>Score Value:</b></label>
                    <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '14px' }}>
                      <b>Score Value D:</b> {resultData.scoreValueD}
                    </div>
                    <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '14px' }}>
                      <b>Score Value I:</b> {resultData.scoreValueI}
                    </div>
                    <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '14px' }}>
                      <b>Score Value S:</b> {resultData.scoreValueS}
                    </div>
                    <div style={{ fontFamily: 'monospace', marginBottom: '5px', fontSize: '14px' }}>
                      <b>Score Value C:</b> {resultData.scoreValueC}
                    </div>
                  </div>
                </div>
              )}
            
            {selectedCompany &&
            companies.find(c => c.id === Number(selectedCompany)).companyType == 2 && (
              <div>
                <h2>Open Questions and Answers</h2>
                <select value={selectedSession} onChange={handleSessionChange} style={{width: '150px', height: '30px', fontSize: '18px'}}>
                  {sessions.map((session, index) => <option key={index} value={session}>{`Session ${index + 1}`}</option>)}
                </select>
                <div id="session-data">
                  <h1 style={{fontWeight: 'bold'}}>Vragenlijst</h1>
                  {openQuestions.map((question, questionIndex) => {
                    const correspondingAnswers = openAnswers.filter(answer => answer.questionOpenId === question.id && answer.session === selectedSession);
                    if (correspondingAnswers.length > 0) {
                      return (
                        <React.Fragment key={questionIndex}>
                          <h2>{question.questionText}</h2>
                          {correspondingAnswers.map((answer, answerIndex) => <p key={answerIndex}>{answer.answerText}</p>)}
                        </React.Fragment>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );

  
};

export default Dashboard;
