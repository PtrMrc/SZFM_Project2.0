import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";

function Lobby() {
  const [room, setRoom] = useState("ROOM123");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("player_joined", (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off("player_joined");
    };
  }, []);

  const joinRoom = () => {
    socket.emit("join_room", { username, room });
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold mb-4">Csatlakozás a szobához</h2>

      <input
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-3 py-2 rounded mb-2"
      />

      <input
        placeholder="Szobakód"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="border px-3 py-2 rounded mb-4"
      />

      <button
        onClick={joinRoom}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Csatlakozás
      </button>

      <h3 className="mt-6 font-semibold">Játékosok:</h3>
      <ul>
        {players.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
