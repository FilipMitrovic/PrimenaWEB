
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import resultService from "./services/resultService";
import "./QuizResults.css";

const QuizResults = () => {
  const { id: quizId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await resultService.getResultsByQuiz(quizId);
        setResults(res || []);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        alert("Failed to load quiz results.");
      } finally {
        setLoading(false);
      }
    })();
  }, [quizId]);

  if (loading) return <div className="quizresults-container">Loading...</div>;

  return (
    <div className="quizresults-container">
      <h2>
        Results for {results[0]?.quizTitle || `Quiz #${quizId}`}
      </h2>
      {results.length === 0 ? (
        <p className="quizresults-empty">No results found for this quiz.</p>
      ) : (
        <table className="quizresults-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Correct</th>
              <th>Total</th>
              <th>Percent</th>
              <th>Duration (s)</th>
              <th>Taken At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.userName || `User #${r.userId}`}</td>
                <td>{r.correctAnswers}</td>
                <td>{r.totalQuestions}</td>
                <td>{r.scorePercent}%</td>
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

export default QuizResults;
