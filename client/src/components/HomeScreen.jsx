import React from "react";
import { motion } from "framer-motion";

export default function HomeScreen({ setScreen, setGameMode }) {
  const handleMultiplayer = () => {
    setGameMode("multiplayer");
    setScreen("multiplayer-menu");
  };

  const handleSolo = () => {
    setGameMode("solo");
    setScreen("solo-setup");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-bold mb-4"
      >
        🎯 Quiz Royale
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-xl text-gray-300 mb-12"
      >
        Choose a game mode!
      </motion.p>

      <div className="flex gap-8">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "tween" }}
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-72 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
          onClick={handleMultiplayer}
        >
          <div className="text-6xl mb-4 text-center">👥</div>
          <h2 className="text-2xl font-bold mb-3 text-center">Multiplayer</h2>
          <p className="text-gray-400 text-center mb-4">
            Play with your friends or anyone online!
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors">
            Start
          </button>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "tween" }}
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-72 cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all"
          onClick={handleSolo}
        >
          <div className="text-6xl mb-4 text-center">🤖</div>
          <h2 className="text-2xl font-bold mb-3 text-center">Solo</h2>
          <p className="text-gray-400 text-center mb-4">
            Play against the computer and improve your skills!
          </p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-colors">
            Start
          </button>
        </motion.div>
      </div>
    </div>
  );
}