// src/live/LiveArena.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { on, joinRoom, startQuiz, submitAnswer } from "../services/liveService";

const LiveArena = () => {
  const { roomCode } = useParams();
  const [snapshot, setSnapshot] = useState(null);
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const currentUser = {
    name:
      localStorage.getItem("liveDisplayName") ||
      localStorage.getItem("userName") ||
      "Anon",
    role: localStorage.getItem("userRole") || "user",
    id: localStorage.getItem("userId") || null,
  };

  // za prikaz rezultata odgovora
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(null);

  useEffect(() => {
    if (currentUser.role !== "admin") {
      joinRoom(roomCode, currentUser.name);
    }

    const off1 = on("RoomUpdated", (snap) => setSnapshot(snap));

    const off2 = on("QuestionStarted", ({ question, snapshot }) => {
      setQuestion(question);
      setSnapshot(snapshot);
      setAnswered(false);
      setCorrect(null);
      if (snapshot?.questionStartUtc && snapshot?.questionTimeSec) {
        startTimer(snapshot.questionStartUtc, snapshot.questionTimeSec);
      }
    });

    const off3 = on("QuestionEnded", (snap) => {
      setSnapshot(snap);
      setTimeLeft(0);
    });

    const off4 = on("QuizEnded", (snap) => {
      setSnapshot(snap);
      setQuestion(null);
      setTimeLeft(null);
      alert("Kviz je završen!");
    });

    const off5 = on("LeaderboardUpdated", (snap) => setSnapshot(snap));

    return () => {
      off1();
      off2();
      off3();
      off4();
      off5();
    };
  }, [roomCode, currentUser.name, currentUser.role]);

  // tajmer
  const startTimer = (startUtc, durationSec) => {
    const start = new Date(startUtc).getTime();
    setTimeLeft(durationSec);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(durationSec - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) clearInterval(interval);
    }, 1000);
  };

  // helper za slanje odgovora
  const doSubmit = async (payload) => {
    if (answered || timeLeft <= 0) return;
    try {
      const res = await submitAnswer(roomCode, {
        ...payload,
        elapsedMs: (snapshot?.questionTimeSec - timeLeft) * 1000 || 1000,
      });
      if (res?.correct !== undefined) {
        setCorrect(res.correct);
      }
      setAnswered(true);
    } catch (e) {
      console.error("Submit failed", e);
    }
  };

  // ========== RENDER PITANJA PO TIPU ==========
  const renderQuestion = () => {
    if (!question) return <p>Nema aktivnog pitanja...</p>;

    return (
      <div>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>{question.text}</p>

        {timeLeft !== null && (
          <p
            style={{
              fontWeight: "bold",
              color: timeLeft <= 5 ? "red" : "black",
            }}
          >
            Preostalo vreme: {timeLeft}s
          </p>
        )}

        {/* SINGLE CHOICE */}
        {question.type === "single" && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {question.options?.map((o) => (
              <li key={o.id} style={{ marginBottom: 8 }}>
                <button
                  style={{
                    padding: "8px 16px",
                    background: answered
                      ? correct
                        ? "green"
                        : "red"
                      : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor:
                      timeLeft > 0 && !answered ? "pointer" : "not-allowed",
                  }}
                  disabled={timeLeft <= 0 || answered}
                  onClick={() => doSubmit({ singleOptionId: o.id.toString() })}
                >
                  {o.text}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* MULTIPLE CHOICE */}
        {question.type === "multiple" && (
          <MultipleChoice
            question={question}
            roomCode={roomCode}
            timeLeft={timeLeft}
            snapshot={snapshot}
            answered={answered}
            doSubmit={doSubmit}
          />
        )}

        {/* TRUE/FALSE */}
        {question.type === "truefalse" && (
          <div>
            <button
              disabled={timeLeft <= 0 || answered}
              style={{ margin: "4px", padding: "8px 16px" }}
              onClick={() => doSubmit({ trueFalse: "true" })}
            >
              True
            </button>
            <button
              disabled={timeLeft <= 0 || answered}
              style={{ margin: "4px", padding: "8px 16px" }}
              onClick={() => doSubmit({ trueFalse: "false" })}
            >
              False
            </button>
          </div>
        )}

        {/* FILL */}
        {question.type === "fill" && (
          <FillText
            question={question}
            roomCode={roomCode}
            timeLeft={timeLeft}
            snapshot={snapshot}
            answered={answered}
            doSubmit={doSubmit}
          />
        )}

        {/* Feedback */}
        {answered && (
          <p style={{ marginTop: 12, fontWeight: "bold" }}>
            {correct ? "✔ Tačno!" : "✘ Netačno!"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 16 }}>
      <h2>Live Arena – soba {roomCode}</h2>

      {/* ADMIN view */}
      {currentUser.role === "admin" ? (
        <>
          <button
            style={{ margin: "12px 0", padding: "8px 16px" }}
            onClick={() => startQuiz(roomCode)}
          >
            Start Quiz
          </button>

          <h3>Trenutno pitanje (pregled)</h3>
          {question ? <p>{question.text}</p> : <p>Nema aktivnog pitanja...</p>}
        </>
      ) : (
        /* USER view */
        <div style={{ marginTop: 24 }}>
          <h3>Trenutno pitanje</h3>
          {renderQuestion()}
        </div>
      )}

      {/* Leaderboard zajednički */}
      <div style={{ marginTop: 24 }}>
        <h3>Leaderboard</h3>
        {snapshot?.leaderboard?.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 8,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    padding: 8,
                  }}
                >
                  Učesnik
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "right",
                    padding: 8,
                  }}
                >
                  Poeni
                </th>
              </tr>
            </thead>
            <tbody>
              {snapshot.leaderboard
                .filter((row) => row.displayName !== currentUser.name || currentUser.role !== "admin") // sakrij admina
                .map((row, i) => (
                  <tr
                    key={row.userId}
                    style={{ background: i % 2 ? "#fafafa" : "white" }}
                  >
                    <td style={{ padding: 8 }}>{row.displayName}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      {row.score}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>Nema još učesnika...</p>
        )}
      </div>
    </div>
  );
};

export default LiveArena;

// ======= dodatne komponente =======
const MultipleChoice = ({ question, timeLeft, snapshot, answered, doSubmit }) => {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = () => {
    doSubmit({
      multipleOptionIds: selected.map((x) => x.toString()),
    });
  };

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {question.options?.map((o) => (
          <li key={o.id}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(o.id)}
                onChange={() => toggle(o.id)}
                disabled={timeLeft <= 0 || answered}
              />
              {o.text}
            </label>
          </li>
        ))}
      </ul>
      <button
        disabled={timeLeft <= 0 || answered}
        onClick={handleSubmit}
        style={{ marginTop: 8, padding: "6px 12px" }}
      >
        Potvrdi
      </button>
    </div>
  );
};

const FillText = ({ timeLeft, answered, doSubmit }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    doSubmit({ fillText: answer });
  };

  return (
    <div>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={timeLeft <= 0 || answered}
        style={{ padding: "6px", marginRight: "8px" }}
      />
      <button
        disabled={timeLeft <= 0 || answered}
        onClick={handleSubmit}
        style={{ padding: "6px 12px" }}
      >
        Pošalji
      </button>
    </div>
  );
};
