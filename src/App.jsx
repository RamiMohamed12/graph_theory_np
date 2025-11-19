import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Initialize and shuffle questions on load
  useEffect(() => {
    startQuiz();
  }, []);

  const startQuiz = () => {
    // Shuffle questions array
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Shuffle options when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQ = questions[currentQuestionIndex];
      // Create array of objects { text, originalIndex } to track correct answer after shuffle
      const optionsWithIndices = currentQ.options.map((opt, index) => ({
        text: opt,
        originalIndex: index
      }));
      
      // Shuffle options
      const shuffled = optionsWithIndices.sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [questions, currentQuestionIndex]);

  const handleAnswerClick = (originalIndex, selectedIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    const correctIndex = questions[currentQuestionIndex].correctAnswer;
    const correct = originalIndex === correctIndex;

    setSelectedAnswer(selectedIndex); // Track which visual button was clicked
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  if (questions.length === 0) return <div className="loading">Chargement...</div>;

  return (
    <div className="app-container">
      <div className="quiz-card">
        {showScore ? (
          <div className="score-section">
            <h2>Quiz Terminé !</h2>
            <div className="score-display">
              Votre score : {score} / {questions.length}
            </div>
            <p className="score-message">
              {score === questions.length ? "Parfait ! Maître des Graphes 🏆" : 
               score > questions.length / 2 ? "Bien joué ! 👍" : "Encore un peu d'entraînement ! 💪"}
            </p>
            <button className="restart-btn" onClick={startQuiz}>Recommencer</button>
          </div>
        ) : (
          <>
            <div className="question-header">
              <span className="question-count">Question {currentQuestionIndex + 1}/{questions.length}</span>
              <span className="category-tag">{questions[currentQuestionIndex].category}</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="question-section">
              <h2 className="question-text">{questions[currentQuestionIndex].question}</h2>
            </div>

            <div className="answer-section">
              {shuffledOptions.map((option, index) => {
                // Determine class for styling
                let btnClass = "answer-btn";
                if (selectedAnswer !== null) {
                  if (option.originalIndex === questions[currentQuestionIndex].correctAnswer) {
                    btnClass += " correct"; // Always show correct answer in green
                  } else if (index === selectedAnswer) {
                    btnClass += " incorrect"; // Show selected wrong answer in red
                  } else {
                    btnClass += " disabled"; // Dim other options
                  }
                }

                return (
                  <button 
                    key={index} 
                    className={btnClass} 
                    onClick={() => handleAnswerClick(option.originalIndex, index)}
                    disabled={selectedAnswer !== null}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className={`explanation-section ${isCorrect ? 'success' : 'failure'}`}>
                <h3>{isCorrect ? "Correct !" : "Incorrect !"}</h3>
                <p>{questions[currentQuestionIndex].explanation}</p>
                <button className="next-btn" onClick={handleNextQuestion}>
                  {currentQuestionIndex === questions.length - 1 ? "Voir le résultat" : "Question Suivante"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
