import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "./services/quizService";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ title: "", description: "", category: "", difficulty: "", timeLimit: 60 });

  const handleChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("TOKEN:", localStorage.getItem("token")); 
      await quizService.createQuiz(quiz);
      navigate("/quizzes");
    } catch (err) {
      console.error("Failed to create quiz:", err);
      alert("Failed to create quiz.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={quiz.title} onChange={handleChange} placeholder="Title" required />
        <input name="description" value={quiz.description} onChange={handleChange} placeholder="Description" required />
        <input name="category" value={quiz.category} onChange={handleChange} placeholder="Category" />
        <select name="difficulty" value={quiz.difficulty} onChange={handleChange}>
          <option value="">Select difficulty</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <input name="timeLimit" type="number" value={quiz.timeLimit} onChange={handleChange} placeholder="Time (sec)" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
