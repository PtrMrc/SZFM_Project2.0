import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";

export default function Lobby({ username, room, setScreen }) {
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState(null);

  useEffect(() => {
    socket.on("player_joined", (data) => {
      setPlayers(data.players);
      setHost(data.host);
    });

    // 🔹 Csak logoljuk, ne állítsuk le az eseményt
    socket.on("new_question", () => {
      console.log("🎮 Game starting – switching to GameScreen");
      setScreen("game"); // átvisz a játékba, de a GameScreen is újra kér kérdést
    });

    return () => {
      socket.off("player_joined");
      socket.off("new_question");
    };
  }, [room]);

  const startGame = () => {
    socket.emit("start_game", { room, username });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4">Szoba: {room}</h2>
      <p className="text-gray-400 mb-4">Host: {host}</p>

      <div className="bg-gray-800 p-4 rounded-lg w-72 shadow-md">
        <h3 className="text-lg mb-3 font-semibold text-center">👥 Játékosok:</h3>
        <ul className="space-y-2">
          {players.map((p, i) => (
            <li
              key={i}
              className={`p-2 rounded ${
                p === username ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {p}
              {p === host && " ⭐"}
            </li>
          ))}
        </ul>
      </div>

      {username === host && (
        <button
          onClick={startGame}
          className="mt-8 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold"
        >
          🎮 Játék indítása
        </button>
      )}
    </div>
  );
}
