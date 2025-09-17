// src/pages/LiveJoin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LiveJoin = () => {
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomCode || !displayName) {
      alert("Unesi room kod i svoje ime!");
      return;
    }

    // sačuvaj ime da ga Arena koristi za joinRoom
    localStorage.setItem("liveDisplayName", displayName);

    // prebaci u arenu (joinRoom se zove tek tamo)
    navigate(`/live/arena/${roomCode}`);
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", textAlign: "center" }}>
      <h2>Pridruži se sobi</h2>
      <input
        placeholder="Room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        style={{ margin: "8px", padding: "8px" }}
      />
      <br />
      <input
        placeholder="Tvoje ime"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        style={{ margin: "8px", padding: "8px" }}
      />
      <br />
      <button
        style={{ background: "#20c997", color: "white", padding: "6px 12px" }}
        onClick={handleJoin}
      >
        Join
      </button>
    </div>
  );
};

export default LiveJoin;
