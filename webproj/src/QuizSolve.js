import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "./services/quizService";
import { getQuestionsByQuiz } from "./services/questionService";
import resultService from "./services/resultService";

const STORAGE_KEY = "kvizhub_attempts_v1";

const QuizSolve = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(null);

  const startedAtRef = useRef(null);

  // učitaj kviz (meta)
  useEffect(() => {
    (async () => {
      try {
        const data = await quizService.getQuizById(quizId);
        setQuiz(data);
        setRemaining(Number(data?.timeLimit || 60));
        startedAtRef.current = new Date();
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz.");
      }
    })();
  }, [quizId]);

  // učitaj pitanja
  useEffect(() => {
    (async () => {
      try {
        const res = await getQuestionsByQuiz(quizId);
        setQuestions(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load questions.");
      }
    })();
  }, [quizId]);

  // tajmer
  useEffect(() => {
    if (!quiz || finished) return;
    if (remaining <= 0) {
      handleSubmit();
      return;
    }
    const t = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [quiz, finished, remaining]);

  const total = questions.length;

  // handleri
  const setSingle = (qid, optId) =>
    setAnswers((prev) => ({ ...prev, [qid]: optId }));

  const toggleMulti = (qid, optId) =>
    setAnswers((prev) => {
      const old = Array.isArray(prev[qid]) ? prev[qid] : [];
      const exists = old.includes(optId);
      const next = exists ? old.filter((x) => x !== optId) : [...old, optId];
      return { ...prev, [qid]: next };
    });

  const setTf = (qid, val) =>
    setAnswers((prev) => ({ ...prev, [qid]: val }));

  const setFill = (qid, txt) =>
    setAnswers((prev) => ({ ...prev, [qid]: txt }));

  // lokalno bodovanje
  const computeScore = () => {
    let correct = 0;
    for (const q of questions) {
      const type = (q.type || "").toLowerCase();

      if (type === "single") {
        const chosenOptId = answers[q.id];
        const okOpt = (q.options || []).find((o) => o.isCorrect);
        if (okOpt && chosenOptId === okOpt.id) correct++;
      } else if (type === "multiple") {
        const chosen = new Set(Array.isArray(answers[q.id]) ? answers[q.id] : []);
        const allCorrect = (q.options || [])
          .filter((o) => o.isCorrect)
          .map((o) => o.id);
        const chosenOnlyCorrect =
          allCorrect.length > 0 &&
          allCorrect.every((id) => chosen.has(id)) &&
          [...chosen].every((id) => allCorrect.includes(id));
        if (chosenOnlyCorrect) correct++;
      } else if (type === "truefalse") {
        const chosen = String(answers[q.id] ?? "").toLowerCase().trim();
        const ans = String(q.answer ?? "").toLowerCase().trim();
        if (chosen && chosen === ans) correct++;
      } else if (type === "fill") {
        const chosen = String(answers[q.id] ?? "").trim().toLowerCase();
        const ans = String(q.answer ?? "").trim().toLowerCase();
        if (chosen && ans && chosen === ans) correct++;
      }
    }
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
  };

  // čuvanje pokušaja u localStorage
  const saveAttemptToLocalStorage = (sc, endedAtIso, resultId) => {
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      const questionsSnapshot = (questions || []).map((q) => ({
        id: q.id,
        text: q.text,
        type: (q.type || "").toLowerCase(),
        options: (q.options || []).map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: !!o.isCorrect,
        })),
        answer: q.answer ?? null,
      }));

      let durationSeconds = quiz?.timeLimit ? quiz.timeLimit - remaining : 0;
      if (startedAtRef.current && endedAtIso) {
        const d =
          (new Date(endedAtIso).getTime() - startedAtRef.current.getTime()) / 1000;
        if (isFinite(d) && d >= 0) durationSeconds = Math.round(d);
      }

      const attempt = {
        resultId, // direktna veza sa backend rezultatom
        quizId: Number(quizId),
        quizTitle: quiz?.title || `Quiz #${quizId}`,
        takenAt: endedAtIso,
        durationSeconds,
        correctAnswers: sc.correct,
        totalQuestions: sc.total,
        scorePercent: sc.percent,
        answers: { ...answers },
        questions: questionsSnapshot,
      };

      const next = [...prev, attempt];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to write attempt to localStorage:", e);
    }
  };

  const handleSubmit = async () => {
    const sc = computeScore();
    setScore(sc);
    setFinished(true);

    const endedAtIso = new Date().toISOString();

    try {
      const res = await resultService.createResult({
        quizId: Number(quizId),
        correctAnswers: sc.correct,
        totalQuestions: sc.total,
        scorePercent: sc.percent,
        durationSeconds: quiz?.timeLimit ? quiz.timeLimit - remaining : 0,
      });
      saveAttemptToLocalStorage(sc, endedAtIso, res?.id || null);
    } catch (err) {
      console.error("Failed to save result:", err);
      saveAttemptToLocalStorage(sc, endedAtIso, null);
    }
  };

  if (!quiz) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Solving: {quiz.title}</h2>
      <p>
        Time left: <strong>{remaining}s</strong>
      </p>

      {!finished ? (
        <>
          {(questions || []).map((q, idx) => {
            const type = (q.type || "").toLowerCase();
            return (
              <div
                key={q.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {idx + 1}. {q.text}
                </div>

                {type === "single" &&
                  (q.options || []).map((opt) => (
                    <label
                      key={opt.id}
                      style={{ display: "block", cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={answers[q.id] === opt.id}
                        onChange={() => setSingle(q.id, opt.id)}
                      />{" "}
                      {opt.text}
                    </label>
                  ))}

                {type === "multiple" &&
                  (q.options || []).map((opt) => {
                    const selected =
                      Array.isArray(answers[q.id]) &&
                      answers[q.id].includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        style={{ display: "block", cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => toggleMulti(q.id, opt.id)}
                        />{" "}
                        {opt.text}
                      </label>
                    );
                  })}

                {type === "truefalse" && (
                  <div>
                    <label style={{ marginRight: 12 }}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={answers[q.id] === "true"}
                        onChange={() => setTf(q.id, "true")}
                      />{" "}
                      True
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={answers[q.id] === "false"}
                        onChange={() => setTf(q.id, "false")}
                      />{" "}
                      False
                    </label>
                  </div>
                )}

                {type === "fill" && (
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={answers[q.id] || ""}
                    onChange={(e) => setFill(q.id, e.target.value)}
                  />
                )}
              </div>
            );
          })}

          <button onClick={handleSubmit}>Finish</button>
          <button
            style={{ marginLeft: 8 }}
            onClick={() => navigate(`/quizzes/${quizId}`)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3>Result</h3>
          <p>
            Correct: <strong>{score?.correct}</strong> / {score?.total} (
            {score?.percent}%)
          </p>

          <h4>Review answers:</h4>
          {(questions || []).map((q, idx) => {
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
                  <strong>Your answer:</strong>{" "}
                  {(() => {
                    if (type === "single") {
                      const chosenOpt = (q.options || []).find(
                        (o) => o.id === userAnswer
                      );
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
                  })()}
                </div>
                <div>
                  <strong>Correct answer:</strong>{" "}
                  {type === "single" || type === "multiple"
                    ? (q.options || [])
                        .filter((o) => o.isCorrect)
                        .map((o) => o.text)
                        .join(", ")
                    : q.answer}
                </div>
              </div>
            );
          })}

          <button onClick={() => navigate(`/quizzes/${quizId}`)}>
            Back to quiz
          </button>
        </>
      )}
    </div>
  );
};

export default QuizSolve;
