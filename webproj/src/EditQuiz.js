import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizService from "./services/quizService";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(id);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        alert("Failed to load quiz.");
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await quizService.updateQuiz(id, quiz);
      navigate("/quizzes");
    } catch (err) {
      console.error("Failed to update quiz:", err);
      alert("Failed to update quiz.");
    }
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={quiz.title} onChange={handleChange} required />
        <input name="description" value={quiz.description} onChange={handleChange} required />
        <input name="category" value={quiz.category} onChange={handleChange} />
        <select name="difficulty" value={quiz.difficulty} onChange={handleChange}>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <input name="timeLimit" type="number" value={quiz.timeLimit} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditQuiz;
