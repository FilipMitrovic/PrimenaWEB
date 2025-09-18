import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "./services/quizService";
import { logoutUser } from "./services/userService";
import "./QuizList.css";  

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const role = localStorage.getItem("userRole");
  const username = localStorage.getItem("userName");
  const userImage = localStorage.getItem("userImage");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      alert("Failed to load quizzes. Check backend/CORS.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await quizService.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert("Failed to delete quiz.");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const filtered = quizzes.filter((x) => {
    const search = q.toLowerCase();
    if (
      search &&
      !x.title?.toLowerCase().includes(search) &&
      !x.description?.toLowerCase().includes(search)
    )
      return false;
    if (category && x.category !== category) return false;
    if (difficulty && x.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div className="quizlist-container">
      {/* Header */}
      <div className="quizlist-header">
        <h2>
          Available Quizzes{" "}
          {role === "admin" && <span style={{ color: "#ffc107" }}>(admin)</span>}
        </h2>
        <div>
          {userImage && <img src={userImage} alt="profile" />}
          <span style={{ marginRight: 12, fontWeight: "bold" }}>
            Hello, {username}
          </span>
          {role === "user" && (
            <>
              <button className="btn btn-purple" onClick={() => navigate("/my-results")}>My Results</button>
              <button className="btn btn-teal" onClick={() => navigate("/live/join")}>Join Live</button>
              <button className="btn btn-info" onClick={() => navigate("/leaderboard")}>Leaderboard</button>
            </>
          )}
          {role === "admin" && (
            <>
              <button className="btn btn-teal" onClick={() => navigate("/live/create")}>Live Arena</button>
              <button className="btn btn-info" onClick={() => navigate("/leaderboard")}>Leaderboard</button>
            </>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Ako je admin — Create dugme */}
      {role === "admin" && (
        <div style={{ marginBottom: 16 }}>
          <button className="btn btn-success" onClick={() => navigate("/quizzes/create")}>
            + Create Quiz
          </button>
        </div>
      )}

      {/* Filter sekcija */}
      <div className="quizlist-filters">
        <input
          placeholder="Search by title or description"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Programming">Programming</option>
          <option value="History">History</option>
          <option value="Science">Science</option>
          <option value="Math">Math</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All difficulties</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>

      {/* Lista kvizova */}
      <div className="quizlist-grid">
        {filtered.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <small>
              Category: <b>{quiz.category || "—"}</b> • Difficulty:{" "}
              <b>{quiz.difficulty || "—"}</b> • Time: {quiz.timeLimit} sec
            </small>
            <div style={{ marginTop: 10 }}>
              {role === "user" && (
                <>
                  <button className="btn btn-primary" onClick={() => navigate(`/quizzes/${quiz.id}`)}>View</button>
                  <button className="btn btn-success" onClick={() => navigate(`/quizzes/${quiz.id}/solve`)}>Start</button>
                </>
              )}
              {role === "admin" && (
                <>
                  <button className="btn btn-primary" onClick={() => navigate(`/quizzes/${quiz.id}`)}>View</button>
                  <button className="btn btn-warning" onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}>Update</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(quiz.id)}>Delete</button>
                  <button className="btn btn-info" onClick={() => navigate(`/quizzes/${quiz.id}/manage`)}>Manage Questions</button>
                  <button className="btn btn-purple" onClick={() => navigate(`/results/${quiz.id}`)}>View Results</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
