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

function AdminEditQuestions() {
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [editedQuestions, setEditedQuestions] = useState([]);

  const getCompanyName = () => {
    const company = companies.find(c => c.id === parseInt(selectedCompany,10));
    return company ? company.name : '';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${config.API_BASE_URL}/api/companies`
    , {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
      .then(response => response.json())
      .then(data => setCompanies(data));
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      console.log(selectedCompany);
      fetch(`${config.API_BASE_URL}/api/${selectedCompanyType === 2 ? 'OpenReactionForm/companyOpen' : 'Questions'}/${selectedCompany}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setQuestions(data);
          setEditedQuestions(data);
        })
        .catch(error => console.error(error));
    }
  }, [selectedCompany, selectedCompanyType]);


  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    const company = companies.find(c => c.id === parseInt(companyId, 10));
    
    setSelectedCompany(companyId);
    setSelectedCompanyType(company ? company.companyType : null);
  
  };

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    setEditedQuestions(prevState => {
      const updatedQuestions = [...prevState];
      updatedQuestions[index][name] = value;
      return updatedQuestions;
    });
  };

  const handleDeleteQuestion = (questionId) => {
    fetch(`${config.API_BASE_URL}/api/${selectedCompanyType === 2 ? 'OpenReactionForm' : 'Questions'}/${questionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          setEditedQuestions(prevState => prevState.filter(question => question.id !== questionId));
        } else {
          console.error('Failed to delete question');
        }
      })
      .catch(error => console.error('Error:', error));
  };
  


  const handleAnswerChange = (questionIndex, answerIndex, event) => {
    const { name, value } = event.target;
    setEditedQuestions(prevState => {
      const updatedQuestions = [...prevState];
      updatedQuestions[questionIndex].answers[answerIndex][name] = value;
      return updatedQuestions;
    });
  };

  const handleSubmit = () => {
    fetch(`${config.API_BASE_URL}/api/${selectedCompanyType === 2 ? 'OpenReactionForm' : 'Questions'}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(editedQuestions)
    })
      .then(response => {
        if (response.ok) {
          console.log('Questions updated successfully');
        } else {
          console.error('Failed to update questions');
        }
      })
      .catch(error => console.error('Error:', error));
  };
  
  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.main}>
        {/* <Header title="Edit questions" />
         */}
        <div className={styles.content}>
          <div className={styles.sidebarRight}>
          <div className={styles.cool}>
          <div className={styles.hmm}>
            <h1>Edit Questions</h1>
            <div className={styles.inputFieldWrapper}>
              <label>
                Select a company to edit questions for:
                <select className={styles.dropdownMenu} value={selectedCompany} onChange={handleCompanyChange}>
                  <option value="">Select a company...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </label>
            </div>
            {selectedCompanyType !== 2 && questions.length > 0 && (
              <div>
            {questions.length > 0 ? (
              <div>
                  <h2>Existing Questions for Company: {getCompanyName()}</h2>

                <ul>
                  {editedQuestions.map((question, questionIndex) => (
                    <li key={question.id}>
                      <div className={styles.inputFieldWrapper}>
                        <label>
                          Question Text:
                          <input
                            type="text"
                            className={styles.inputEditQuestion}
                            name="questionText"
                            value={question.questionText}
                            onChange={event => handleQuestionChange(questionIndex, event)}
                          />
                        </label>
                      </div>
                      <ul>
                        {question.answers.map((answer, answerIndex) => (
                          <li key={answer.id}>
                            <div className={styles.inputFieldWrapper}>
                              <label>
                                Answer Text:
                                <input
                                  className={styles.inputEditQuestion}
                                  type="text"
                                  name="answerText"
                                  value={answer.answerText}
                                  onChange={event => handleAnswerChange(questionIndex, answerIndex, event)}
                                />
                              </label>
                            </div>
                            <div className={styles.inputFieldWrapper}>
                              <label>
                                Score Value D:
                                <input
                                  className={styles.inputFieldNumber}
                                  type="number"
                                  name="scoreValueD"
                                  value={answer.scoreValueD}
                                  onChange={event => handleAnswerChange(questionIndex, answerIndex, event)}
                                />
                              </label>
                            </div>
                            <div className={styles.inputFieldWrapper}>
                              <label>
                                Score Value I:
                                <input
                                  type="number"
                                  className={styles.inputFieldNumber}
                                  name="scoreValueI"
                                  value={answer.scoreValueI}
                                  onChange={event => handleAnswerChange(questionIndex, answerIndex, event)}
                                />
                              </label>
                            </div>
                            <div className={styles.inputFieldWrapper}>
                              <label>
                                Score Value S:
                                <input
                                  type="number"
                                  className={styles.inputFieldNumber}
                                  name="scoreValueS"
                                  value={answer.scoreValueS}
                                  onChange={event => handleAnswerChange(questionIndex, answerIndex, event)}
                                />
                              </label>
                            </div>
                            <div className={styles.inputFieldWrapper}>
                              <label>
                                Score Value C:
                                <input
                                  type="number"
                                  className={styles.inputFieldNumber}
                                  name="scoreValueC"
                                  value={answer.scoreValueC}
                                  onChange={event => handleAnswerChange(questionIndex, answerIndex, event)}
                                />
                              </label>
                            </div>
                            <button style={{ width: '150px', fontSize: 'smaller', backgroundColor: 'red', color: 'white' }} onClick={() => handleDeleteQuestion(question.id)}>Delete Question</button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>

                <button onClick={handleSubmit}>Submit All Changes</button>
              </div>
            ) : (
              <p></p>
            
            )}
                          </div>
            )}

{selectedCompanyType === 2 && questions.length > 0 ? (
    <div>
      <h2>Open Questions for Company: {getCompanyName()}</h2>

      <ul>
        {editedQuestions.map((question, questionIndex) => (
          <li key={question.id}>
            <div className={styles.inputFieldWrapper}>
              <label>
                Question Text:
                <input
                  type="text"
                  className={styles.inputEditQuestion}
                  name="questionText"
                  value={question.questionText}
                  onChange={event => handleQuestionChange(questionIndex, event)}
                />
              </label>
            </div>
            <button style={{ width: '150px', fontSize: 'smaller', backgroundColor: 'red', color: 'white' }} onClick={() => handleDeleteQuestion(question.id)}>Delete Question</button>
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit}>Submit All Changes</button>
    </div>
  ) : ( 
    <p></p>
  )}

          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  
  
}

export default AdminEditQuestions;
