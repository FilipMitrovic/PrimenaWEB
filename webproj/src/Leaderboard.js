
import React, { useEffect, useState } from "react";
import resultService from "./services/resultService";
import quizService from "./services/quizService";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  const currentUser = localStorage.getItem("userName");

  // Učitaj sve kvizove
  useEffect(() => {
    (async () => {
      try {
        const data = await quizService.getAllQuizzes();
        setQuizzes(data || []);
        if (data?.length > 0) {
          setQuizId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    })();
  }, []);

  // Učitaj rezultate
  useEffect(() => {
    if (!quizId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await resultService.getResultsByQuiz(quizId);
        let data = res || [];

        if (period !== "all") {
          const now = new Date();
          let fromDate = null;
          if (period === "week") {
            fromDate = new Date();
            fromDate.setDate(now.getDate() - 7);
          } else if (period === "month") {
            fromDate = new Date();
            fromDate.setMonth(now.getMonth() - 1);
          }
          data = data.filter((r) => new Date(r.takenAt) >= fromDate);
        }

        const sorted = data.sort((a, b) => {
          if (b.scorePercent !== a.scorePercent)
            return b.scorePercent - a.scorePercent;
          return a.durationSeconds - b.durationSeconds;
        });

        setResults(sorted);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        alert("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, [quizId, period]);

  if (loading) return <div className="leaderboard-container">Loading...</div>;

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>

      {/* Filteri */}
      <div className="leaderboard-filters">
        <label>Quiz: </label>
        <select value={quizId} onChange={(e) => setQuizId(e.target.value)}>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>

        <label>Period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">All time</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>

      {results.length === 0 ? (
        <p>No results yet for this filter.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>User</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Total</th>
              <th>Duration (s)</th>
              <th>Taken At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr
                key={r.id}
                className={
                  r.userName === currentUser ? "leaderboard-highlight" : ""
                }
              >
                <td>{idx + 1}</td>
                <td>{r.userName || r.userId}</td>
                <td>{r.quizTitle || r.quizId}</td>
                <td>{r.scorePercent}%</td>
                <td>{r.correctAnswers}</td>
                <td>{r.totalQuestions}</td>
                <td>{r.durationSeconds}</td>
                <td>{new Date(r.takenAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
