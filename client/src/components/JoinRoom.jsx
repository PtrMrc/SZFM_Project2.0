import React, { useState,useEffect  } from "react";
import { socket } from "../utils/socket";

export default function JoinRoom({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
    socket.on("join_success", (data) => {
      console.log("✅ Successfully joined:", data);
      setSuccessMsg(data.msg || "Sikeresen csatlakoztál!");
      setErrorMsg("");

      
      setTimeout(() => {
        onJoin(room, username);
      }, 2000);
    });

    socket.on("join_error", (data) => {
      console.warn("Join error:", data);
      setErrorMsg(data.msg || "Ismeretlen hiba történt.");
      setSuccessMsg("");
    });

    return () => {
      socket.off("join_success");
      socket.off("join_error");
    };
  }, [room, username, onJoin]);

  const handleJoin = () => {
  if (!username || !room) return alert("Add meg a neved és a szobakódot!");

  setErrorMsg("");

  socket.emit("join_room", { username, room });
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

      {errorMsg && (
        <p className="mt-4 text-red-400 font-semibold">{errorMsg}</p>
      )}
      {successMsg && (
        <p className="mt-4 text-green-400 font-semibold">{successMsg}</p>
      )}

    </div>
  );
}
