import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../Css/ReactionForm.module.css';
import config from '../../config';

const ReactionFormOpen = () => {
  const [questions, setQuestions] = useState([]);
  const [openAnswers, setOpenAnswers] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [hulpVakjes, setHulpVakjes] = useState([]);
  const colorMap = {
    'Blauw': '#1e90ff', // Hex color code for blue
    'Geel': '#ffd700',  // Hex color code for yellow
    'Groen': '#35cc35', // Hex color code for green
    'Rood': '#ff4c4c'   // Hex color code for red
  };
  useEffect(() => {
    const fetchProfileAndQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const localConfig = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        const profileResponse = await axios.get(`${config.API_BASE_URL}/api/Users/Profile`, localConfig);
        const questionsResponse = await axios.get(`${config.API_BASE_URL}/api/OpenReactionForm/open`, localConfig, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const hulpVakjesResponse = await axios.get(`${config.API_BASE_URL}/api/HulpVakjes`, localConfig);
        
        setUserId(profileResponse.data.id);
        setQuestions(questionsResponse.data);
        setHulpVakjes(hulpVakjesResponse.data);
      } catch (error) {
        console.error('Failed to fetch profile or questions:', error);
      }
    };
    fetchProfileAndQuestions();
  }, []);


  const handleOpenAnswerChange = (questionId, answerText) => {
    answerText = answerText.replace(/\n/g, "<br />");
    setOpenAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answerText
    }));
  };
  
  const createMarkup = (html) => {
    return {__html: html.replace(/<br>/g, '\n')};
  }
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      const localConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      const formattedOpenAnswers = Object.entries(openAnswers).map(([questionId, answerText]) => ({
        questionId: parseInt(questionId),
        answerText
      }));
  
      const responseOpenAnswers = await axios.post(
        `${config.API_BASE_URL}/api/OpenReactionForm/openanswers`,
        formattedOpenAnswers,
        localConfig
      );
  
      navigate('/opendashboard');
    } catch (error) {
      console.error("Failed to submit open answers:", error);
    }
  };
  

  return (
    <div className={styles["form-control"]}>
      <div className={styles["form-content"]}>
        {questions.length > 0 ? (
          <form className={styles["reactionform"]} onSubmit={handleSubmit}>
            <h1>Vragenlijst</h1>
            {questions.map((question, index) => (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }} key={question.id}>
                <div className={styles["questionform"]}>
                  <label htmlFor={`question-${question.id}`}>
                    {question.questionText}
                  </label>
                  <div>
                    <textarea
                      id={`question-${question.id}`}
                      style={{ width: "600px", height: "100px", resize: "none" }}
                      onChange={(e) => handleOpenAnswerChange(question.id, e.target.value)}
                    />
                  </div>
                </div>
                <div 
                  style={{ 
                    backgroundColor: colorMap[hulpVakjes[index]?.kleur] || '#ffffff', 
                    borderRadius: '15px', 
                    padding: '20px'
                  }}
                >
                  <h3>{hulpVakjes[index]?.titel}</h3>
                  <p style={{whiteSpace: "pre-line"}} dangerouslySetInnerHTML={createMarkup(hulpVakjes[index]?.tekst || '')}></p>
                </div>
              </div>
            ))}
            <div className={styles["button"]}>
              <button type="submit">Submit</button>
            </div>
          </form>
        ) : (
          <p>There are no questions</p>
        )}
      </div>
    </div>
  );
  

};
export default ReactionFormOpen;
