import React, {useEffect, useState} from "react";
import { socket } from "../utils/socket";
import {motion, AnimatePresence} from "framer-motion";

export default function ResultScreen({ setScreen }) {
  
  const [ranking, setRanking] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {

    const stored = localStorage.getItem("finalResult");
    if (stored) {
      const parsed = JSON.parse(stored);
      setWinner(parsed.winner || null);
      setRanking(parsed.ranking || []);
    }


    console.log("ResultScreen mounted, waiting for game_over...");

    socket.on("game_over", (data) => {

      console.log("game_over event received:", data);
      if (data){
        setWinner(data.winner);
        setRanking(data.ranking || []);
      }
    });

    socket.emit("request_room_state", {});

    return () => {
      socket.off("game_over");
    };
  }, []);
  
  return (
    <AnimatePresence>
      <motion.div
        key="result-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      >
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-8"
        >
          🏁 Játék vége!
        </motion.h1>

        {winner ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl mb-6 text-green-400"
          >
            🏆 Győztes: <span className="font-bold">{winner}</span>
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl mb-6 text-red-400"
          >
            😢 Mindenki kiesett!
          </motion.p>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">🏅 Ranglista</h2>
          {ranking && ranking.length > 0 ? (
            <ol className="space-y-2">
              {ranking.map((player, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                  className={`text-lg ${
                    i === 0
                      ? "text-yellow-400 font-bold"
                      : i === 1
                      ? "text-gray-200"
                      : i === 2
                      ? "text-orange-300"
                      : "text-gray-400"
                  }`}
                >
                  {i+1}. {player}
                </motion.li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-400 text-center">Nincs adat...</p>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={() => {
            socket.disconnect(); // bontja a kapcsolatot, ha új játék indulna
            setScreen("home");
          }}
          className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-semibold shadow-md transition-transform hover:scale-105"
        >
          🔙 Kilépés a főmenübe
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
