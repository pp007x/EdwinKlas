import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../Css/ReactionForm.module.css';
import config from '../config';
import DragAndDrop from './DragAndDrop';
const ReactionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [userId, setUserId] = useState(null);

  // New State: State for the drag-and-drop question
  // Existing State: State for the first drag-and-drop question
  const [draggedItems, setDraggedItems] = useState(['Optimistisch', 'Zelfverzekerd', 'Nauwkeurig', 'Harmonieus']);

  // New State: State for the second drag-and-drop question
  const [draggedItems2, setDraggedItems2] = useState(['Bedachtzaam', 'Gezellig', 'Luisterend', 'Moedig']);
  const [draggedItems3, setDraggedItems3] = useState(['Vrolijk', 'Onopvallend', 'Onbevreesd', 'Systematisch']);
  const [draggedItems4, setDraggedItems4] = useState(['Positief', 'Risicogebied', 'Terughoudend', 'Ondersteunend']);
  const [draggedItems5, setDraggedItems5] = useState(['Geduldig', 'Spontaan', 'Besluitvaardig', 'Beheerst']);
  const [draggedItems6, setDraggedItems6] = useState(['Vastberaden', 'Voorzichtig', 'Groepsgericht', 'Inspirerend']);
  const [draggedItems7, setDraggedItems7] = useState(['Vasthoudend', 'Planmatig', 'Verzoenend', 'Overtuigend']);
  const [draggedItems8, setDraggedItems8] = useState(['Kritisch', 'Impulsief', 'Betrouwbaar', 'Doelgericht']);
  const [draggedItems9, setDraggedItems9] = useState(['Goedgelovig', 'Analytisch', 'Populair', 'Wilskrachtig']);
  const [draggedItems10, setDraggedItems10] = useState(['Resultaatgericht', 'Kalm', 'Enthousiast', 'Diplomatiek']);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const localConfig = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        const profileResponse = await axios.get(`${config.API_BASE_URL}/api/Users/Profile`, localConfig);
        const questionsResponse = await axios.get(`${config.API_BASE_URL}/api/ReactionForm?companyId=${profileResponse.data.companyId}`, localConfig);
        
        setUserId(profileResponse.data.id);
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.error('Failed to fetch profile or questions:', error);
      }
    };

    fetchProfileAndQuestions();
  }, []);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answerId
    }));
  };

  const calculateTotalScore = () => {
    let totalScoreD = 0;
    let totalScoreI = 0;
    let totalScoreS = 0;
    let totalScoreC = 0;
  
    const wordToLetterMapping = {
      'Optimistisch': 'I',
      'Zelfverzekerd': 'D',
      'Nauwkeurig': 'C',
      'Harmonieus': 'S',
      'Bedachtzaam': 'C',
      'Gezellig': 'S',
      'Luisterend': 'I',
      'Moedig': 'D',
      'Vrolijk': 'D', // Add appropriate mapping
      'Onopvallend': 'I', // Add appropriate mapping
      'Onbevreesd': 'C', // Add appropriate mapping
      'Systematisch': 'S', // Add appropriate mapping
      'Positief': 'C', // Add appropriate mapping
      'Risicogebied': 'D', // Add appropriate mapping
      'Terughoudend': 'I', // Add appropriate mapping
      'Ondersteunend': 'S', // Add appropriate mapping
      'Geduldig': 'S', // Add appropriate mapping
      'Spontaan': 'I', // Add appropriate mapping
      'Besluitvaardig': 'D', // Add appropriate mapping
      'Beheerst': 'C', // Add appropriate mapping
      'Vastberaden': 'C', // Add appropriate mapping
      'Voorzichtig': 'D', // Add appropriate mapping
      'Groepsgericht': 'S', // Add appropriate mapping
      'Inspirerend': 'I', // Add appropriate mapping
      'Vasthoudend': 'D', // Add appropriate mapping
      'Planmatig': 'C', // Add appropriate mapping
      'Verzoenend': 'S', // Add appropriate mapping
      'Overtuigend': 'I', // Add appropriate mapping
      'Kritisch': 'C', // Add appropriate mapping
      'Impulsief': 'I', // Add appropriate mapping
      'Betrouwbaar': 'S', // Add appropriate mapping
      'Doelgericht': 'D', // Add appropriate mapping
      'Goedgelovig': 'S', // Add appropriate mapping
      'Analytisch': 'C', // Add appropriate mapping
      'Populair': 'I', // Add appropriate mapping
      'Wilskrachtig': 'D', // Add appropriate mapping
      'Resultaatgericht': 'D', // Add appropriate mapping
      'Kalm': 'S', // Add appropriate mapping
      'Enthousiast': 'I', // Add appropriate mapping
      'Diplomatiek': 'C' // Add appropriate mapping
    };
    
  
    for (let question of questions) {
      const answerId = answers[question.id];
      if (answerId) {
        const selectedAnswer = question.answers.find(answer => answer.id === answerId);
        if (selectedAnswer) {
          totalScoreD += selectedAnswer.scoreValueD;
          totalScoreI += selectedAnswer.scoreValueI;
          totalScoreS += selectedAnswer.scoreValueS;
          totalScoreC += selectedAnswer.scoreValueC;
        }
      }
    }
  
    // Handle the drag-and-drop questions
    const addDraggedItemsScores = (items) => {
      items.forEach((item, index) => {
        const letter = wordToLetterMapping[item];
        const points = 4 - index; // Most left is 4, second is 3, third is 2, last is 1
        if (letter === 'D') totalScoreD += points;
        if (letter === 'I') totalScoreI += points;
        if (letter === 'S') totalScoreS += points;
        if (letter === 'C') totalScoreC += points;
      });
    };
  
    addDraggedItemsScores(draggedItems);
    addDraggedItemsScores(draggedItems2);
    addDraggedItemsScores(draggedItems3);
    addDraggedItemsScores(draggedItems4);
    addDraggedItemsScores(draggedItems5);
    addDraggedItemsScores(draggedItems6);
    addDraggedItemsScores(draggedItems7);
    addDraggedItemsScores(draggedItems8);
    addDraggedItemsScores(draggedItems9);
    addDraggedItemsScores(draggedItems10);
    
    return {
      scoreValueD: totalScoreD,
      scoreValueI: totalScoreI,
      scoreValueS: totalScoreS,
      scoreValueC: totalScoreC,
      userId: userId
    };
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const totalScore = calculateTotalScore();

    try {
      const token = localStorage.getItem('token');
      const localConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post(`${config.API_BASE_URL}/api/TotalScores`, totalScore, localConfig);

      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to submit total score:", error);
    }
  };

  const onDragStart = (e, index, question) => {
    e.dataTransfer.setData('itemIndex', index);
    e.dataTransfer.setData('question', question);
  };
  
  const onDrop = (e, index, question) => {
    const fromIndex = Number(e.dataTransfer.getData('itemIndex'));
    const questionType = e.dataTransfer.getData('question');
    let newItems;
    
    if (questionType === 'draggedItems') {
      newItems = [...draggedItems];
    } else if (questionType === 'draggedItems2') {
      newItems = [...draggedItems2];
    } else if (questionType === 'draggedItems3') {
      newItems = [...draggedItems3];
    } else if (questionType === 'draggedItems4') {
      newItems = [...draggedItems4];
    } else if (questionType === 'draggedItems5') {
      newItems = [...draggedItems5];
    } else if (questionType === 'draggedItems6') {
      newItems = [...draggedItems6];
    } else if (questionType === 'draggedItems7') {
      newItems = [...draggedItems7];
    } else if (questionType === 'draggedItems8') {
      newItems = [...draggedItems8];
    } else if (questionType === 'draggedItems9') {
      newItems = [...draggedItems9];
    } else if (questionType === 'draggedItems10') {
      newItems = [...draggedItems10];
    } // ... extend this pattern for all question types
    
    [newItems[fromIndex], newItems[index]] = [newItems[index], newItems[fromIndex]];
  
    if (questionType === 'draggedItems') {
      setDraggedItems(newItems);
    } else if (questionType === 'draggedItems2') {
      setDraggedItems2(newItems);
    } else if (questionType === 'draggedItems3') {
      setDraggedItems3(newItems);
    } else if (questionType === 'draggedItems4') {
      setDraggedItems4(newItems);
    } else if (questionType === 'draggedItems5') {
      setDraggedItems5(newItems);
    } else if (questionType === 'draggedItems6') {
      setDraggedItems6(newItems);
    } else if (questionType === 'draggedItems7') {
      setDraggedItems7(newItems);
    } else if (questionType === 'draggedItems8') {
      setDraggedItems8(newItems);
    } else if (questionType === 'draggedItems9') {
      setDraggedItems9(newItems);
    } else if (questionType === 'draggedItems10') {
      setDraggedItems10(newItems);
    }
     // ... extend this pattern for all question types
  };
  

  const onDragOver = (e) => {
    e.preventDefault();
  };
  const chunk = (arr, size) => {
    var results = [];
    while (arr.length) {
      results.push(arr.splice(0, size));
    }
    return results;
  };
  
  const renderDragItems = (items, setItems, questionType) => {
    // Create blocks of 12 items each, then divide them into sub-blocks of 4
    const majorBlocks = chunk([...items], 12);
    
    return (
      <div className={styles["drag-area"]}>
        {majorBlocks.map((blockOfTwelve, majorIdx) => (
          <div key={`major-block-${majorIdx}`} className={styles["major-draggable-block"]}>
            {chunk(blockOfTwelve, 4).map((subBlock, subIdx) => (
              <div key={`sub-block-${subIdx}`} className={styles["draggable-block"]}>
                {subBlock.map((item, index) => (
                  <div
                    key={index}
                    className={styles["draggable-item"]}
                    draggable={true}
                    onDragStart={(e) => onDragStart(e, majorIdx * 12 + subIdx * 4 + index, questionType)}
                    onDrop={(e) => onDrop(e, majorIdx * 12 + subIdx * 4 + index, questionType)}
                    onDragOver={onDragOver}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  
  

  return (
    <div className={styles["form-control"]}>
      {questions.length > 0 ? (
        <form className={styles["reactionform"]} onSubmit={handleSubmit}>
          <h1>Vragenlijst</h1>
          {questions.map((question) => (
            <div className={styles["questionform"]} key={question.id}>
              <label>
                {question.questionText}
                <div className={styles["answer-options"]}>
                  {question.answers.map((answer) => (
                    <label className={styles["answerform"]} htmlFor={answer.id.toString()} key={answer.id}>
                      <input
                        type="radio"
                        id={answer.id.toString()}
                        name={question.id.toString()}
                        value={answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                      />
                      {answer.answerText}
                    </label>
                  ))}
                </div>
              </label>
            </div>
          ))}
          
          {/* Original drag-and-drop question */}
          <div className={styles["questionform"]}>
            <label>
            Rangschik elk blok van vier woorden van boven naar beneden. Bovenaan zet u hetgeen waarmee u zich het meeste associeert en onderaan zet u hetgeen waar u zich het minste mee associeert.
            </label>
          </div>
  
          {renderDragItems(draggedItems, setDraggedItems, 'draggedItems')}
          {renderDragItems(draggedItems2, setDraggedItems2, 'draggedItems2')}
          {renderDragItems(draggedItems3, setDraggedItems3, 'draggedItems3')}
          {renderDragItems(draggedItems4, setDraggedItems4, 'draggedItems4')}
          {renderDragItems(draggedItems5, setDraggedItems5, 'draggedItems5')}
          {renderDragItems(draggedItems6, setDraggedItems6, 'draggedItems6')}
          {renderDragItems(draggedItems7, setDraggedItems7, 'draggedItems7')}
          {renderDragItems(draggedItems8, setDraggedItems8, 'draggedItems8')}
          {renderDragItems(draggedItems9, setDraggedItems9, 'draggedItems9')}
          {renderDragItems(draggedItems10, setDraggedItems10, 'draggedItems10')}

  
          <div className={styles["button"]}>
            
            <button type="submit">Lever in</button>
          </div>
        </form>
      ) : (
        <p>There are no questions</p>
      )}
    </div>
  );
};

export default ReactionForm;
