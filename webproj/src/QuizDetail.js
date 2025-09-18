import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "./services/quizService";
import { getQuestionsByQuiz } from "./services/questionService"; // 👈 dodato
import "./QuizDetail.css";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questionCount, setQuestionCount] = useState(null); // 👈 broj pitanja

  const role = localStorage.getItem("userRole"); // "admin" ili "user"

  useEffect(() => {
    (async () => {
      try {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz.");
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getQuestionsByQuiz(id);
        setQuestionCount(res.data?.length || 0);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    })();
  }, [id]);

  if (!quiz) return <div className="quizdetail-container">Loading...</div>;

  return (
    <div className="quizdetail-container">
      <h2>Quiz details</h2>
      <div className="quizdetail-info">
        <p><strong>Quiz name:</strong> {quiz.title}</p>
        <p><strong>Description:</strong> {quiz.description}</p>
        <p><strong>Category:</strong> {quiz.category}</p>
        <p><strong>Difficulty:</strong> {quiz.difficulty}</p>
        <p><strong>Number of questions:</strong> {questionCount ?? "—"}</p>
        <p><strong>Time Limit:</strong> {quiz.timeLimit} seconds</p>
      </div>

      <div className="quizdetail-buttons">
        {role === "user" && (
          <button
            className="btn btn-start"
            onClick={() => navigate(`/quizzes/${id}/solve`)}
          >
            Start Quiz
          </button>
        )}

        <button
          className="btn btn-back"
          onClick={() => navigate("/quizzes")}
        >
          Back to list
        </button>
      </div>
    </div>
  );
};

export default QuizDetail;
