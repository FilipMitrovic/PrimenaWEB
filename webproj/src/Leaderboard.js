// src/Leaderboard.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import resultService from "./services/resultService";

const Leaderboard = () => {
  const { id: quizId } = useParams(); // /leaderboard/:id
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = localStorage.getItem("userName");

  useEffect(() => {
    (async () => {
      try {
        const res = await resultService.getResultsByQuiz(quizId);
        // sortiramo: prvo po procentu, zatim po vremenu
        const sorted = (res.data || []).sort((a, b) => {
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
  }, [quizId]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Leaderboard (Quiz #{quizId})</h2>
      {results.length === 0 ? (
        <p>No results yet.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Position</th>
              <th>User</th>
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
                    r.user?.name === currentUser ? "lightyellow" : "white",
                }}
              >
                <td>{idx + 1}</td>
                <td>{r.user?.name || r.userId}</td>
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
