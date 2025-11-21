import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function SoloResultScreen({ setScreen }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("soloResult");
    if (stored) {
      const parsed = JSON.parse(stored);
      setResult(parsed);

      // Confetti if player won
      if (parsed.winner === "player") {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffcc00', '#ffffff', '#ff6600']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffcc00', '#ffffff', '#ff6600']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })();
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-2xl">⏳ Betöltés...</p>
      </div>
    );
  }

  const getResultMessage = () => {
    if (result.winner === "player") {
      return { emoji: "🎉", text: "Győztél!", color: "text-green-400" };
    } else if (result.winner === "ai") {
      return { emoji: "😢", text: "Az AI nyert!", color: "text-red-400" };
    } else {
      return { emoji: "🤝", text: "Döntetlen!", color: "text-yellow-400" };
    }
  };

  const resultMsg = getResultMessage();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <AnimatePresence>
        <motion.div
          key="solo-result"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-8"
          >
            {resultMsg.emoji} Játék vége!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-3xl mb-8 font-bold ${resultMsg.color}`}
          >
            {resultMsg.text}
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-gray-800 rounded-lg shadow-xl p-8 w-96 border border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">📊 Eredmények</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-600 rounded-lg">
                <span className="text-xl font-semibold">👤 Te</span>
                <span className="text-2xl font-bold">{result.player_score}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-600 rounded-lg">
                <span className="text-xl font-semibold">🤖 AI</span>
                <span className="text-2xl font-bold">{result.ai_score}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <span className="text-lg">Összesen kérdés</span>
                <span className="text-xl font-bold">{result.total_questions}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <span className="text-lg">Pontosságod</span>
                <span className="text-xl font-bold">
                  {Math.round((result.player_score / result.total_questions) * 100)}%
                </span>
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              localStorage.removeItem("soloResult");
              setScreen("home");
            }}
            className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-semibold shadow-md transition-transform"
          >
            🏠 Vissza a főmenübe
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}