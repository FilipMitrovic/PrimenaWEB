// src/Leaderboard.js
import React, { useEffect, useState } from "react";
import resultService from "./services/resultService";
import quizService from "./services/quizService";

const Leaderboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizId, setQuizId] = useState(""); // izabrani kviz
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all"); // all | week | month

  const currentUser = localStorage.getItem("userName");

  // Učitaj sve kvizove da korisnik može da bira
  useEffect(() => {
    (async () => {
      try {
        const res = await quizService.getAllQuizzes();
        setQuizzes(res.data || []);
        if (res.data?.length > 0) {
          setQuizId(res.data[0].id); // default prvi kviz
        }
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
    })();
  }, []);

  // Učitaj rezultate kad se promeni kviz ili period
  useEffect(() => {
    if (!quizId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await resultService.getResultsByQuiz(quizId);
        let data = res.data || [];

        // filtriraj po periodu
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

        // sortiranje: po procentu pa po vremenu
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

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Leaderboard</h2>

      {/* Filteri */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Quiz: </label>
        <select value={quizId} onChange={(e) => setQuizId(e.target.value)}>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: 16, marginRight: 8 }}>Period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">All time</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>

      {results.length === 0 ? (
        <p>No results yet for this filter.</p>
      ) : (
        <table
          border="1"
          cellPadding="6"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
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
                style={{
                  background:
                    r.userName === currentUser ? "lightblue" : "white",
                }}
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
