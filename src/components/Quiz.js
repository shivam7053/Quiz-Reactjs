import React, { useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { questionsData } from "./question";
import './styles.css'; // Ensure custom styles are correctly applied

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [category, setCategory] = useState("Random");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // Get random questions from all categories combined
  const getCombinedQuestions = () => {
    const allCategories = Object.keys(questionsData);
    let combinedQuestions = [];

    allCategories.forEach(cat => {
      combinedQuestions = combinedQuestions.concat(questionsData[cat]);
    });

    // Shuffle and pick the first 10 questions
    const shuffledQuestions = combinedQuestions.sort(() => 0.5 - Math.random());
    return shuffledQuestions.slice(0, 10);
  };

  // Get questions based on the selected category
  const getQuestionsByCategory = (category) => {
    if (category === "Random") {
      return getCombinedQuestions();
    } else {
      return questionsData[category].sort(() => 0.5 - Math.random()).slice(0, 10);
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    const questions = getQuestionsByCategory(selectedCategory);
    setQuestions(questions);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
  };

  const handleAnswerOptionClick = (answerKey) => {
    if (selectedAnswer === null) {
      const current = questions[currentQuestion];
      const isCorrect = answerKey === current.correct_answer;

      setSelectedAnswer(answerKey);
      setCorrectAnswer(current.correct_answer);

      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setTimeout(() => {
          setCurrentQuestion(nextQuestion);
          setSelectedAnswer(null);
          setCorrectAnswer(null);
        }, 1000);
      } else {
        setShowScore(true);
      }
    }
  };

  // Determine button class based on the current state
  const buttonClass = (answerKey) => {
    let className = "m-2 btn btn-lg ";

    if (showScore || selectedAnswer !== null) {
      if (answerKey === selectedAnswer) {
        className += answerKey === correctAnswer ? "btn-success" : "btn-danger";
      } else if (answerKey === correctAnswer) {
        className += "btn-success";
      } else {
        className += "btn-secondary";
      }
    } else {
      className += "btn-secondary";
    }

    return className;
  };

  return (
    <div className="quiz">
      <div className="container mt-5">
        <DropdownButton id="dropdown-basic-button" title={category} className="mb-3">
          <Dropdown.Item onClick={() => handleCategoryChange("Random")}>Random</Dropdown.Item>
          <Dropdown.Item onClick={() => handleCategoryChange("programming")}>Programming</Dropdown.Item>
          <Dropdown.Item onClick={() => handleCategoryChange("maths")}>Maths</Dropdown.Item>
          <Dropdown.Item onClick={() => handleCategoryChange("space_science")}>Space Science</Dropdown.Item>
          <Dropdown.Item onClick={() => handleCategoryChange("sports")}>Sports</Dropdown.Item>
          <Dropdown.Item onClick={() => handleCategoryChange("entertainment")}>Entertainment</Dropdown.Item>
        </DropdownButton>
      </div>
      
      {questions.length === 0 && category !== "Random" ? (
        <div className="text-center mt-5">
          <p>Select a category to start the quiz.</p>
        </div>
      ) : (
        <>
          {showScore ? (
            <div className="alert alert-success">
              You scored {score} out of {questions.length}
            </div>
          ) : (
            <>
              {questions.length > 0 && (
                <>
                  <div className="question-section mb-4">
                    <div className="question-count mb-2">
                      <span className="badge bg-primary">
                        Question {currentQuestion + 1}
                      </span>{" "}
                      / {questions.length}
                    </div>
                    <div className="question-text h5">{questions[currentQuestion].question}</div>
                  </div>
                  <div className="answer-section">
                    {Object.entries(questions[currentQuestion].answers)
                      .filter(([key, value]) => value !== null)
                      .map(([key, answer]) => (
                        <Button
                          key={key}
                          className={buttonClass(key)}
                          onClick={() => handleAnswerOptionClick(key)}
                          disabled={selectedAnswer !== null}
                        >
                          {answer}
                        </Button>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
