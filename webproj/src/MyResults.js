// src/MyResults.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import resultService from "./services/resultService";

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // povuci moje rezultate
        const res = await resultService.getMyResults();
        setResults(res || []);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        alert("Failed to load results.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Results</h2>
      {results.length === 0 ? (
        <p>You have no results yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="6"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Correct</th>
              <th>Total</th>
              <th>Percent</th>
              <th>Duration (s)</th>
              <th>Taken At</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.quizTitle || `Quiz #${r.quizId}`}</td>
                <td>{r.correctAnswers}</td>
                <td>{r.totalQuestions}</td>
                <td>{r.scorePercent}%</td>
                <td>{r.durationSeconds}</td>
                <td>{new Date(r.takenAt).toLocaleString()}</td>
                <td>
                  <button
                    style={{ background: "#007bff", color: "white" }}
                    onClick={() => navigate(`/results/${r.id}/detail`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyResults;
