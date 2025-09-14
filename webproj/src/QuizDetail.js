import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "./services/quizService";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  const role = localStorage.getItem("userRole"); // "admin" ili "user"

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
      <h2>Quiz details</h2>
      <p><strong>Quiz name:</strong> {quiz.title}</p>
      <p><strong>Description:</strong> {quiz.description}</p>
      <p><strong>Category:</strong> {quiz.category}</p>
      <p><strong>Difficulty:</strong> {quiz.difficulty}</p>
      <p><strong>Number of questions:</strong> {quiz.questions ? quiz.questions.length : "unknown"}</p>
      <p><strong>Time Limit:</strong> {quiz.timeLimit} seconds</p>

      {role === "user" && (
        <button
          style={{ background: "green", color: "white", marginRight: 8 }}
          onClick={() => navigate(`/quizzes/${id}/solve`)}
        >
          Start Quiz
        </button>
      )}

      <br /><br />
      <button
        style={{ background: "#007bff", color: "white" }}
        onClick={() => navigate("/quizzes")}
      >
        Back to list
      </button>
    </div>
  );
};

export default QuizDetail;
