import React, { useState } from "react";
import { socket } from "../utils/socket";

export default function CreateRoom({ onCreate }) {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = () => {
    if (!username) return alert("Adj meg egy nevet!");
    // Ha nincs megadva szobakód, generálunk egyet
    const code = roomCode || Math.random().toString(36).substring(2, 7).toUpperCase();
    socket.emit("join_room", { username, room: code });
    onCreate(code, username);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">🛠️ Szoba létrehozása</h2>

      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-64 p-2 mb-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Szobakód (hagyhatod üresen)"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        className="w-64 p-2 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleCreate}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
      >
        🚀 Létrehozás
      </button>
    </div>
  );
}
