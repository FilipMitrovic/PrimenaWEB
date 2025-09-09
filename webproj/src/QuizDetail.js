
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import quizService from "./services/quizService";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await quizService.getQuizById(id);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz.");
      }
    })();
  }, [id]);

  if (!quiz) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <p>Category: {quiz.category}</p>
      <p>Difficulty: {quiz.difficulty}</p>
      <p>Questions: {quiz.questions ? quiz.questions.length : "unknown"}</p>
      <p>Time limit: {quiz.timeLimit} seconds</p>

      <button onClick={() => navigate(`/quizzes/${id}/solve`)}>Start Quiz</button>
      <br /><br />
      <Link to="/quizzes">Back to list</Link>
    </div>
  );
};

export default QuizDetail;
