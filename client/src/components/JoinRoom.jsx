import { useState } from "react";
import socket from "../socket";

export default function JoinRoom({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleJoin = () => {
    if (!username || !room) return alert("Add meg a neved és a szobakódot!");
    socket.emit("join_room", { username, room });
    onJoin(room, username);
  };

  return (
    <div className="join-container">
      <h2>Quiz Royale</h2>
      <input
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Szobakód"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={handleJoin}>Csatlakozás</button>
    </div>
  );
}
