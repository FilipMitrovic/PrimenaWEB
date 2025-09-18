// src/live/LiveCreateRoom.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "../services/quizService";
import { createRoom, on } from "../services/liveService";
import "./LiveCreateRoom.css";

const LiveCreateRoom = () => {
  const nav = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [questionTimeSec, setQuestionTimeSec] = useState(30);
  const [roomCode, setRoomCode] = useState("");
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const list = await quizService.getAllQuizzes();
        setQuizzes(list);
        if (list.length > 0) setQuizId(list[0].id);
      } catch {
        alert("Ne mogu da učitam listu kvizova.");
      }
    })();
  }, []);

  useEffect(() => {
    const off = on("RoomUpdated", (snap) => setSnapshot(snap));
    return off;
  }, []);

  async function handleCreate() {
    if (!token) {
      alert("Moraš biti ulogovan da bi kreirao sobu.");
      return;
    }
    if (!quizId) {
      alert("Izaberi kviz.");
      return;
    }
    setLoading(true);
    try {
      const res = await createRoom(quizId, questionTimeSec);
      setRoomCode(res?.roomCode || "");
    } catch {
      alert("Kreiranje sobe nije uspelo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="livecreate-container">
      <h2>Live Quiz Arena – Create room (Admin)</h2>

      <div className="livecreate-form">
        <label>
          Quiz:
          <select value={quizId} onChange={(e) => setQuizId(e.target.value)}>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.category}) – {q.difficulty}
              </option>
            ))}
          </select>
        </label>

        <label>
          Time per question (sec):
          <input
            type="number"
            min={5}
            max={300}
            value={questionTimeSec}
            onChange={(e) => setQuestionTimeSec(e.target.value)}
          />
        </label>

        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Kreiram..." : "Create room"}
        </button>
      </div>

      {roomCode && (
        <div className="livecreate-roominfo">
          <div>
            <strong>Šifra sobe:</strong> <code>{roomCode}</code>
            <button onClick={() => navigator.clipboard.writeText(roomCode)}>
              Copy
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => nav(`/live/arena/${roomCode}`)}>
              Open arena
            </button>
          </div>

          {snapshot && (
            <div style={{ marginTop: 12, fontSize: 14, color: "#555" }}>
              <div>QuizId: {snapshot.quizId}</div>
              <div>Participant: {snapshot.leaderboard?.length ?? 0}</div>
              <div>Status: {snapshot.isRunning ? "Pokrenut" : "Čeka start"}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveCreateRoom;
