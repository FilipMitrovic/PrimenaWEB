import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { on, joinRoom, startQuiz, submitAnswer } from "../services/liveService";
import "./LiveArena.css";

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
    const off6 = on("AnswerResult", (res) => {
      if (res?.correct !== undefined) {
        setCorrect(res.correct);
        setAnswered(true);
      }
    });

    return () => {
      off1(); off2(); off3(); off4(); off5(); off6();
    };
  }, [roomCode, currentUser.name, currentUser.role]);

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

  const doSubmit = async (payload) => {
    if (answered || timeLeft <= 0) return;
    try {
      await submitAnswer(roomCode, {
        ...payload,
        elapsedMs: (snapshot?.questionTimeSec - timeLeft) * 1000 || 1000,
      });
    } catch (e) {
      console.error("Submit failed", e);
    }
  };

  const renderQuestion = () => {
    if (!question) return <p>No active ...</p>;

    return (
      <div className="livearena-question">
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>{question.text}</p>
        {timeLeft !== null && (
          <p className={`livearena-timer ${timeLeft <= 5 ? "red" : ""}`}>
            Time left: {timeLeft}s
          </p>
        )}

        {question.type === "single" && (
          <div className="livearena-options">
            {question.options?.map((o) => (
              <button
                key={o.id}
                disabled={timeLeft <= 0 || answered}
                onClick={() => doSubmit({ singleOptionId: o.id.toString() })}
                style={{
                  background: answered ? (correct ? "green" : "red") : "#007bff",
                }}
              >
                {o.text}
              </button>
            ))}
          </div>
        )}

        {question.type === "multiple" && (
          <MultipleChoice
            question={question}
            timeLeft={timeLeft}
            answered={answered}
            doSubmit={doSubmit}
          />
        )}

        {question.type === "truefalse" && (
          <div className="livearena-options row">
            <button
              disabled={timeLeft <= 0 || answered}
              onClick={() => doSubmit({ trueFalse: "true" })}
            >
              True
            </button>
            <button
              disabled={timeLeft <= 0 || answered}
              onClick={() => doSubmit({ trueFalse: "false" })}
            >
              False
            </button>
          </div>
        )}

        {question.type === "fill" && (
          <FillText
            timeLeft={timeLeft}
            answered={answered}
            doSubmit={doSubmit}
          />
        )}

        {answered && (
          <p
            className={`livearena-feedback ${
              correct ? "correct" : "incorrect"
            }`}
          >
            {correct ? "✔ Correct!" : "✘ Incorrect!"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="livearena-container">
      <h2>Live Arena – room {roomCode}</h2>

      {currentUser.role === "admin" ? (
        <>
          <button onClick={() => startQuiz(roomCode)}>Start Quiz</button>
          <h3>Current question (view)</h3>
          {question ? <p>{question.text}</p> : <p>No active question...</p>}
        </>
      ) : (
        <div style={{ marginTop: 24 }}>
          <h3>Current question</h3>
          {renderQuestion()}
        </div>
      )}

      <div className="livearena-leaderboard">
        <h3>Leaderboard</h3>
        {snapshot?.leaderboard?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.leaderboard
                .filter((row) => row.userId !== snapshot.adminUserId)
                .map((row, i) => (
                  <tr key={row.userId}>
                    <td>{row.displayName}</td>
                    <td style={{ textAlign: "right" }}>{row.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No participants yet...</p>
        )}
      </div>
    </div>
  );
};

export default LiveArena;

const MultipleChoice = ({ question, timeLeft, answered, doSubmit }) => {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  const handleSubmit = () => {
    doSubmit({ multipleOptionIds: selected.map((x) => x.toString()) });
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
      <button disabled={timeLeft <= 0 || answered} onClick={handleSubmit}>
        Confirm
      </button>
    </div>
  );
};

const FillText = ({ timeLeft, answered, doSubmit }) => {
  const [answer, setAnswer] = useState("");
  return (
    <div className="livearena-fill">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={timeLeft <= 0 || answered}
      />
      <button
        disabled={timeLeft <= 0 || answered}
        onClick={() => doSubmit({ fillText: answer })}
      >
        Send
      </button>
    </div>
  );
};
