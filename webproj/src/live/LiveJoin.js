// src/pages/LiveJoin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveJoin.css";

const LiveJoin = () => {
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomCode || !displayName) {
      alert("Unesi room kod i svoje ime!");
      return;
    }
    localStorage.setItem("liveDisplayName", displayName);
    navigate(`/live/arena/${roomCode}`);
  };

  return (
    <div className="livejoin-container">
      <h2>Join room</h2>
      <input
        placeholder="Room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <br />
      <input
        placeholder="Your name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <br />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default LiveJoin;
