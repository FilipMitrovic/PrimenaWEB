import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "./services/quizService";
import { logoutUser } from "./services/userService";

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // čitamo iz localStorage podatke o korisniku
  const role = localStorage.getItem("userRole"); // "admin" ili "user"
  const username = localStorage.getItem("userName");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await quizService.getAllQuizzes();
      console.log("Fetched quizzes:", res.data);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      alert("Failed to load quizzes. Check backend/CORS.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await quizService.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id)); // update state
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert("Failed to delete quiz.");
    }
  };

  const handleLogout = () => {
    logoutUser(); // briše token, userName, userRole
    navigate("/login");
  };

  const filtered = quizzes.filter((x) => {
    if (q && !x.title?.toLowerCase().includes(q.toLowerCase())) return false;
    if (category && x.category !== category) return false;
    if (difficulty && x.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>
          Available Quizzes {role === "admin" && <span style={{ color: "red" }}>(admin)</span>}
        </h2>
        <div>
          <span style={{ marginRight: 12 }}>Hello, {username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      {/* Ako je admin — prikazujemo Create dugme */}
      {role === "admin" && (
        <div style={{ marginBottom: 16 }}>
          <button
            style={{ background: "green", color: "white", padding: "6px 12px" }}
            onClick={() => navigate("/quizzes/create")}
          >
            + Create Quiz
          </button>
        </div>
      )}

      {/* Filter sekcija */}
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

      {/* Lista kvizova */}
      <ul>
        {filtered.map((quiz) => (
          <li key={quiz.id} style={{ marginBottom: 16, borderBottom: "1px solid #ddd", paddingBottom: 8 }}>
            <strong>{quiz.title}</strong> — {quiz.description} <br />
            Category: {quiz.category || "—"} • Difficulty: {quiz.difficulty || "—"} • Time: {quiz.timeLimit} sec
            <br />

            {/* Dugmad za korisnika */}
            {role === "user" && (
              <div style={{ marginTop: 6 }}>
                <button
                  style={{ marginRight: 8, background: "#007bff", color: "white" }}
                  onClick={() => navigate(`/quizzes/${quiz.id}`)}
                >
                  View
                </button>
                <button
                  style={{ marginRight: 8, background: "green", color: "white" }}
                  onClick={() => navigate(`/quizzes/${quiz.id}/solve`)}
                >
                  Start
                </button>
                <button
                  style={{ background: "#6f42c1", color: "white" }}
                  onClick={() => navigate(`/results/${quiz.id}`)}
                >
                  My Results
                </button>
              </div>
            )}

            {/* Dugmad za admina */}
            {role === "admin" && (
              <div style={{ marginTop: 6 }}>
                <button
                  style={{ marginRight: 8, background: "#007bff", color: "white" }}
                  onClick={() => navigate(`/quizzes/${quiz.id}`)}
                >
                  View
                </button>
                <button
                  style={{ marginRight: 8, background: "#ffc107" }}
                  onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
                >
                  Update
                </button>
                <button
                  style={{ marginRight: 8, background: "red", color: "white" }}
                  onClick={() => handleDelete(quiz.id)}
                >
                  Delete
                </button>
                <button
                  style={{ marginRight: 8, background: "#17a2b8", color: "white" }}
                  onClick={() => navigate(`/quizzes/${quiz.id}/manage`)}
                >
                  Manage Questions
                </button>
                <button
                  style={{ background: "#6f42c1", color: "white" }}
                  onClick={() => navigate(`/results/${quiz.id}`)}
                >
                  View Results
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
