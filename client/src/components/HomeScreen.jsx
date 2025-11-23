import React from "react";
import { motion } from "framer-motion";

export default function HomeScreen({ setScreen, setGameMode }) {
  const [showInfo, setShowInfo] = React.useState(false);

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
      {/* Info button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => setShowInfo(true)}
        className="absolute bottom-8 right-8 bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-gray-600 hover:border-blue-500 transition-all"
      >
        ℹ️
      </motion.button>

      {/* Info Modal */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowInfo(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl max-w-2xl mx-4 border-2 border-blue-500 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold text-blue-400">📚 Game Information</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-white text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-gray-300">

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-2">🎯 Goal of the Game</h4>
                <p>Answer the quiz questions correctly! The last surviving player wins!</p>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-2">👥 Multiplayer Mode</h4>
                <p>Play with your friends! At the end of each round, players who answer incorrectly are eliminated. The wheel selects a topic, and you have 20 seconds to answer.</p>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-2">🤖 Solo Mode</h4>
                <p>Test your knowledge against an AI! Choose a difficulty level and number of questions. Whoever gives more correct answers wins!</p>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-2">🧩 50-50 Help</h4>
                <p>You can use this once during a round! It removes two incorrect answers, making it easier to find the correct one.</p>
              </div>

            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Got it, let's start! 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
      </div>
  );
}