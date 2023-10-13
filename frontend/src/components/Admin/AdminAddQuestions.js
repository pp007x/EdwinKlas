import React, { useState, useEffect } from 'react';
import config from '../../config';
import DashboardSidebar from './AdminSidebar';
import styles from '../../Css/CompanyDashboard.module.css';

const Header = ({ title }) => (
  <div className={styles.header}>
    <hr />
    <div className={styles['page-title']}>{title}</div>
  </div>
);

function AdminAddQuestions() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ questionText: '', companyId: '', answers: [] });
  const [newAnswer, setNewAnswer] = useState({ answerText: '', scoreValueD: 0, scoreValueI: 0, scoreValueS: 0, scoreValueC: 0 });
  const [statusMessage, setStatusMessage] = useState('');

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
      const company = companies.find(company => company.id === Number(selectedCompany));
      if (company) {
        setSelectedCompanyType(company.companyType);
      } else {
        console.error(`Company with id ${selectedCompany} not found.`);
      }
    } else {
      setSelectedCompanyType(null);
    }
  }, [selectedCompany, companies]);
  

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    setSelectedCompany(companyId);
  };

  const handleNewQuestionChange = (event) => {
    const { name, value } = event.target;
    setNewQuestion(prevState => ({ ...prevState, [name]: value }));
  };

  const handleNewAnswerChange = (event) => {
    const { name, value } = event.target;
    setNewAnswer(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddNewAnswer = () => {
    if (selectedCompanyType !== 2) {
      setNewQuestion(prevState => ({
        ...prevState,
        answers: [...prevState.answers, { ...newAnswer }]
      }));
    }
    setNewAnswer({ answerText: '', scoreValueD: 0, scoreValueI: 0, scoreValueS: 0, scoreValueC: 0 });
  };

  const handleAddNewQuestion = () => {
    const questionWithCompany = { ...newQuestion, companyId: selectedCompany };
    let endpoint = selectedCompanyType === 2 ? '/api/AddQuestion/AddOpenQuestion' : '/api/AddQuestion';
    
    fetch(`${config.API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(questionWithCompany)
    })
      .then(response => {
        if (response.ok) {
          setStatusMessage('Question added successfully');
          setNewQuestion({ questionText: '', companyId: '', answers: [] });
        } else {
          setStatusMessage('Failed to add question');
        }
      })
      .catch(error => {
        setStatusMessage('Error: ' + error);
        console.error('Error:', error);
      });
  };

return (
  <div className={styles.dashboard}>
    <DashboardSidebar />
    <div className={styles.main}>
      {/* <Header title="Add question" /> */}
      <div className={styles.content}>
      <div className={styles.sidebarRight}>
        <div className={styles.cool}>
        <div className={styles.hmm}>
        <h1>Voeg vragen toe</h1>
        <label> Select a company to add questions to: </label>
        <div>
          <select className={styles.dropdownMenu} value={selectedCompany} onChange={handleCompanyChange}>
            <option value="">Select a company...</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>
        <div>
          <h2>Add a new question:</h2>
          <div className={styles.inputFieldWrapper}>
            <label>
              Question Text:
              <input
                type="text"
                className={styles.inputField}
                name="questionText"
                value={newQuestion.questionText}
                onChange={handleNewQuestionChange}
              />
            </label>
          </div>
        </div>
        {selectedCompanyType !== 2 && (
          <>
            <div>
              <h2>Add answers to the new question:</h2>
              <div className={styles.inputFieldWrapper}>
                <label>
                  Answer Text:
                  <input
                    type="text"
                    name="answerText"
                    className={styles.inputField}
                    value={newAnswer.answerText}
                    onChange={handleNewAnswerChange}
                  />
                </label>
              </div>
              <div className={styles.inputFieldWrapper}>
                <label>
                  Score Value D:
                  <input
                    type="number"
                    name="scoreValueD"
                    className={styles.inputFieldNumber}
                    value={newAnswer.scoreValueD}
                    onChange={handleNewAnswerChange}
                  />
                </label>
              </div>
              <div className={styles.inputFieldWrapper}>
                <label>
                  Score Value I:  
                  <input
                    type="number"
                    name="scoreValueI"
                    className={styles.inputFieldNumber}
                    value={newAnswer.scoreValueI}
                    onChange={handleNewAnswerChange}
                  />
                </label>
              </div>
              <div className={styles.inputFieldWrapper}>
                <label>
                  Score Value S:
                  <input
                    type="number"
                    name="scoreValueS"
                    className={styles.inputFieldNumber}
                    value={newAnswer.scoreValueS}
                    onChange={handleNewAnswerChange}
                  />
                </label>
              </div>
              <div className={styles.inputFieldWrapper}>
                <label>
                  Score Value C:
                  <input
                    type="number"
                    name="scoreValueC"
                    className={styles.inputFieldNumber}
                    value={newAnswer.scoreValueC}
                    onChange={handleNewAnswerChange}
                  />
                </label>
              </div>
              <button onClick={handleAddNewAnswer}>Add Answer</button>
            </div>
            <h3>Answers:</h3>
            {newQuestion.answers.map((answer, index) => (
              <div key={index}>
                <p>Answer Text: {answer.answerText}</p>
                <p>Score Value D: {answer.scoreValueD}</p>
                <p>Score Value I: {answer.scoreValueI}</p>
                <p>Score Value S: {answer.scoreValueS}</p>
                <p>Score Value C: {answer.scoreValueC}</p>
                <hr />
              </div>
            ))}
          </>
        )}
        <button onClick={handleAddNewQuestion}>Add Question</button>
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </div>
    </div>
    </div>
    </div>
  </div>
);
};

export default AdminAddQuestions;
