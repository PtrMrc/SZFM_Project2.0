import React, { useState } from "react";
import { socket } from "../utils/socket";
import { motion } from "framer-motion";

export default function SoloSetup({ username, setUsername, onStart }) {
  const [numQuestions, setNumQuestions] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState(50);
  const [isCreating, setIsCreating] = useState(false);

  const handleStart = () => {
    if (!username) return alert("Add meg a nevedet!");

    setIsCreating(true);

    socket.emit("start_solo_game", {
      username,
      num_questions: numQuestions,
      ai_difficulty: aiDifficulty
    });

    socket.once("solo_game_created", (data) => {
      console.log("✅ Solo game created:", data.session_id);
      onStart(data.session_id);
    });

    socket.once("error", (data) => {
      alert(data.msg || "Hiba történt!");
      setIsCreating(false);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">🤖 Solo mód beállítása</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Felhasználónév</label>
          <input
            type="text"
            placeholder="Add meg a neved"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Kérdések száma: <span className="text-purple-400">{numQuestions}</span>
          </label>
          <input
            type="range"
            min="5"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5</span>
            <span>20</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            AI nehézség: <span className="text-purple-400">{aiDifficulty}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="10"
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10%</span>
            <span>50%</span>
            <span>90%</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {aiDifficulty <= 30 && "🟢 Könnyű"}
            {aiDifficulty > 30 && aiDifficulty <= 60 && "🟡 Közepes"}
            {aiDifficulty > 60 && "🔴 Nehéz"}
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={isCreating}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? "⏳ Indítás..." : "🚀 Játék indítása"}
        </button>
      </motion.div>
    </div>
  );
}