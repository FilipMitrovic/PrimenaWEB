// src/ResultDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import resultService from "./services/resultService";

const ResultDetail = () => {
  const { id: resultId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await resultService.getResult(resultId);
        setResult(res.data);
      } catch (err) {
        console.error("Failed to fetch result:", err);
        alert("Failed to load result.");
      }
    })();
  }, [resultId]);

  if (!result) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Result Detail</h2>
      <p><strong>Quiz ID:</strong> {result.quizId}</p>
      <p><strong>User ID:</strong> {result.userId}</p>
      <p><strong>Correct:</strong> {result.correctAnswers}</p>
      <p><strong>Total:</strong> {result.totalQuestions}</p>
      <p><strong>Score:</strong> {result.scorePercent}%</p>
      <p><strong>Duration:</strong> {result.durationSeconds} seconds</p>
      <p><strong>Taken At:</strong> {new Date(result.takenAt).toLocaleString()}</p>
    </div>
  );
};

export default ResultDetail;
