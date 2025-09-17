// src/live/LiveCreateRoom.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "../services/quizService";
import { createRoom, on } from "../services/liveService";

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
      } catch (e) {
        console.error(e);
        alert("Ne mogu da učitam listu kvizova.");
      }
    })();
  }, []);

  // slušaj RoomUpdated nakon kreiranja sobe
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
    } catch (e) {
      console.error(e);
      alert("Kreiranje sobe nije uspelo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "2rem auto", padding: 16 }}>
      <h2>Live Quiz Arena – Kreiranje sobe (Admin)</h2>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Kviz:
          <select
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.category}) – {q.difficulty}
              </option>
            ))}
          </select>
        </label>

        <label>
          Vreme po pitanju (sek):
          <input
            type="number"
            min={5}
            max={300}
            value={questionTimeSec}
            onChange={(e) => setQuestionTimeSec(e.target.value)}
            style={{ marginLeft: 8, width: 100 }}
          />
        </label>

        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Kreiram..." : "Kreiraj sobu"}
        </button>
      </div>

      {roomCode && (
        <div style={{ marginTop: 24, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div>
            <strong>Šifra sobe:</strong> <code>{roomCode}</code>
            <button
              style={{ marginLeft: 8 }}
              onClick={() => navigator.clipboard.writeText(roomCode)}
            >
              Kopiraj
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => nav(`/live/arena/${roomCode}`)}>Otvori arenu</button>
          </div>

          {snapshot && (
            <div style={{ marginTop: 12, fontSize: 14, color: "#555" }}>
              <div>QuizId: {snapshot.quizId}</div>
              <div>Učesnika: {snapshot.leaderboard?.length ?? 0}</div>
              <div>Status: {snapshot.isRunning ? "Pokrenut" : "Čeka start"}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveCreateRoom;
