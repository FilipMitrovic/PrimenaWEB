
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import quizService from "./services/quizService";

const QuizSolve = () => {
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
      <h2>Solving: {quiz.title}</h2>
      <p>Here we will render questions, timer and submit logic.</p>
      <button onClick={() => navigate(`/quizzes/${id}`)}>Back</button>
    </div>
  );
};

export default QuizSolve;
