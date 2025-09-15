import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import resultService from "./services/resultService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const STORAGE_KEY = "kvizhub_attempts_v1";

const ResultDetail = () => {
  const { id: resultId } = useParams();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [localAttempt, setLocalAttempt] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await resultService.getResult(resultId);
        setResult(res);
  
        if (res?.userId && res?.quizId) {
          const all = await resultService.getMyResults();
          const sameQuiz = (all || []).filter(
            (r) => r.quizId === res.quizId
          );
          setHistory(sameQuiz);
          }
        // sada direktno tražimo u localStorage-u po resultId
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const found = (stored || []).find(
          (a) => String(a.resultId) === String(resultId)
        );
        if (found) {
          setLocalAttempt(found);
        }
      } catch (err) {
        console.error("Failed to fetch result detail:", err);
        alert("Failed to load result detail.");
      }
    })();
  }, [resultId]);

  if (!result) return <div style={{ padding: 20 }}>Loading...</div>;

  const renderLocalQuestions = () => {
    if (!localAttempt) return null;
    const { questions = [], answers = {} } = localAttempt;

    return questions.map((q, idx) => {
      const type = (q.type || "").toLowerCase();
      const userAnswer = answers[q.id];

      let isCorrect = false;
      if (type === "single") {
        const correctOpt = (q.options || []).find((o) => o.isCorrect);
        isCorrect = userAnswer === correctOpt?.id;
      } else if (type === "multiple") {
        const chosen = new Set(Array.isArray(userAnswer) ? userAnswer : []);
        const allCorrect = (q.options || [])
          .filter((o) => o.isCorrect)
          .map((o) => o.id);
        isCorrect =
          allCorrect.length > 0 &&
          allCorrect.every((id) => chosen.has(id)) &&
          [...chosen].every((id) => allCorrect.includes(id));
      } else if (type === "truefalse" || type === "fill") {
        const ans = String(q.answer ?? "").toLowerCase().trim();
        const chosen = String(userAnswer ?? "").toLowerCase().trim();
        isCorrect = ans && chosen === ans;
      }

      const renderUserAnswerText = () => {
        if (type === "single") {
          const chosenOpt = (q.options || []).find((o) => o.id === userAnswer);
          return chosenOpt ? chosenOpt.text : "—";
        } else if (type === "multiple") {
          const chosen = Array.isArray(userAnswer) ? userAnswer : [];
          return (q.options || [])
            .filter((o) => chosen.includes(o.id))
            .map((o) => o.text)
            .join(", ") || "—";
        } else {
          return String(userAnswer || "—");
        }
      };

      const renderCorrectAnswerText = () => {
        if (type === "single" || type === "multiple") {
          return (q.options || [])
            .filter((o) => o.isCorrect)
            .map((o) => o.text)
            .join(", ");
        }
        return q.answer;
      };

      return (
        <div
          key={q.id}
          style={{
            border: "1px solid #ddd",
            marginBottom: 10,
            padding: 10,
            background: isCorrect ? "#d4edda" : "#f8d7da",
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {idx + 1}. {q.text}
          </div>
          <div>
            <strong>Your answer:</strong> {renderUserAnswerText()}
          </div>
          <div>
            <strong>Correct answer:</strong> {renderCorrectAnswerText()}
          </div>
        </div>
      );
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Result Detail</h2>
      <p>
        <strong>Quiz:</strong> {result.quizTitle || `Quiz #${result.quizId}`}
      </p>
      <p>
        <strong>User:</strong> {result.userName || `User #${result.userId}`}
      </p>
      <p>
        <strong>Correct:</strong> {result.correctAnswers}
      </p>
      <p>
        <strong>Total:</strong> {result.totalQuestions}
      </p>
      <p>
        <strong>Score:</strong> {result.scorePercent}%
      </p>
      <p>
        <strong>Duration:</strong> {result.durationSeconds} seconds
      </p>
      <p>
        <strong>Taken At:</strong>{" "}
        {new Date(result.takenAt).toLocaleString()}
      </p>

      <h3>Questions Review</h3>
      {result.answers ? (
        Object.entries(result.answers).map(([qId, answer]) => (
          <div
            key={qId}
            style={{ border: "1px solid #ddd", marginBottom: 10, padding: 10 }}
          >
            <div>
              <strong>Question ID {qId}:</strong> Your answer: {String(answer)}
            </div>
          </div>
        ))
      ) : localAttempt ? (
        renderLocalQuestions()
      ) : (
        <p style={{ color: "gray" }}>
          OVDE STOJE LISTE PITANJA I ODGOVORA KORISNIKA
        </p>
      )}

      {history.length > 1 && (
        <div style={{ marginTop: 30 }}>
          <h3>Progress Over Attempts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={history.map((h, i) => ({
                attempt: i + 1,
                percent: h.scorePercent,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="attempt"
                label={{
                  value: "Attempt",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                domain={[0, 100]}
                label={{
                  value: "Score %",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="percent" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ResultDetail;
