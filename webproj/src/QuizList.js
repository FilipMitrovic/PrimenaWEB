import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import quizService from "./services/quizService";
import { logoutUser } from "./services/userService";


const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await quizService.getAllQuizzes();
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      alert("Failed to load quizzes. Check backend/CORS.");
    }
  };

  const handleLogout = () => {
    logoutUser(); // briše token, userName, userRole
    navigate("/login"); // redirektuje na login stranu
  };

  const filtered = quizzes.filter((x) => {
    if (q && !x.title?.toLowerCase().includes(q.toLowerCase())) return false;
    if (category && x.category !== category) return false;
    if (difficulty && x.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Available Quizzes</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search by title"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">All categories</option>
          <option value="Programming">Programming</option>
          <option value="History">History</option>
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">All difficulties</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>

      <ul>
        {filtered.map((quiz) => (
          <li key={quiz.id} style={{ marginBottom: 12 }}>
            <strong>{quiz.title}</strong> — {quiz.description} <br />
            Category: {quiz.category || "—"} • Difficulty: {quiz.difficulty || "—"} • Time: {quiz.timeLimit} sec<br />
            <Link to={`/quizzes/${quiz.id}`} style={{ marginRight: 8 }}>View</Link>
            <Link to={`/quizzes/${quiz.id}/solve`}>Start</Link>
            {/* Ako je admin, ovde možeš dodati Edit/Delete dugmad */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
