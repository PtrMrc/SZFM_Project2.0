import React, { useState } from "react";
import { socket } from "../utils/socket";

export default function JoinRoom({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleJoin = () => {
    if (!username || !room) return alert("Add meg a neved és a szobakódot!");

    // 1️⃣ Csatlakozás a szerverhez
    socket.emit("join_room", { username, room });

    // 2️⃣ Átadjuk az App.js-nek a room és username értéket
    onJoin(room, username);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Csatlakozás a szobához</h2>

      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-64 p-2 mb-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Szobakód"
        value={room}
        onChange={(e) => setRoom(e.target.value.toUpperCase())}
        className="w-64 p-2 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleJoin}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
      >
        Csatlakozás
      </button>
    </div>
  );
}
