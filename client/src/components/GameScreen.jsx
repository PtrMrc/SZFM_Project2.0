import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";

export default function GameScreen({ username, room, setScreen }) {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [eliminated, setEliminated] = useState(false);
  const [winner, setWinner] = useState(null);
  const [roundFeedback, setRoundFeedback] = useState(null);

  useEffect(() => {
    console.log("🎧 GameScreen mounted, waiting for questions...");
    socket.emit("join_room", { username, room });
    console.log("📡 Sent join_room from GameScreen:", { username, room });

    socket.on("new_question", (data) => {
    console.log("🧠 Új kérdés esemény érkezett:", data);
    if (!data || !data.question) {
        console.warn("⚠️ new_question üres adatot kapott!");
        return;
    }
    setQuestion(data.question);
    setTimer(data.timer);
    setAnswered(false);
    setRoundFeedback(null);
    });

    socket.on("round_result", (data) => {
      const isEliminated = data.eliminated.includes(username);
      const isSurvivor = data.survivors.includes(username);

      if (isEliminated) {
        setRoundFeedback("❌ Rossz válasz! Kiesettél!");
        setEliminated(true);
      } else if (isSurvivor) {
        setRoundFeedback("✅ Helyes válasz!");
      } else {
        setRoundFeedback("⏰ Nem válaszoltál időben!");
        setEliminated(true);
      }

      // 3 másodperc múlva töröljük a feedbacket (vagy jön új kérdés)
      setTimeout(() => setRoundFeedback(null), 3000);
    });

    socket.on("player_eliminated", (data) => {
      console.log("❌", data.username, "kiesett");
    });

    socket.on("game_over", (data) => {
      setWinner(data.winner);
      setTimeout(() => setScreen("result"), 4000);
    });

    socket.emit("request_current_question", {room});

    return () => {
      socket.off("new_question");
      socket.off("round_result");
      socket.off("player_eliminated");
      socket.off("game_over");
    };
  }, []);

  // 🔹 Timer logika
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const sendAnswer = (choice) => {
    if (answered || eliminated) return;
    socket.emit("answer_question", { room, username, answer: choice });
    setAnswered(true);
  };

  // 🔹 Ha kiesett
  if (eliminated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-red-800">
        <h2 className="text-3xl font-bold mb-4">❌ Kiesettél!</h2>
        <p>Várd meg, amíg a játék véget ér...</p>
      </div>
    );
  }

  // 🔹 Ha még nincs kérdés
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h2 className="text-3xl">⏳ Várakozás a kérdésre...</h2>
      </div>
    );
  }

  // 🔹 Ha vége a játéknak
  if (winner) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-800 text-white">
        <h2 className="text-4xl font-bold">
          🏆 Győztes: {winner || "Senki"} 🎉
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-6">{question.question}</h2>
      <p className="mb-4 text-gray-400">⏰ Hátralévő idő: {timer}s</p>

      <div className="grid grid-cols-2 gap-4 w-2/3">
        {question.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => sendAnswer(choice)}
            disabled={answered}
            className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
          >
            {choice}
          </button>
        ))}
      </div>

      {/* 🔹 Feedback a kör végén */}
      {roundFeedback && (
        <p
          className={`mt-8 text-2xl font-bold ${
            roundFeedback.includes("✅")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {roundFeedback}
        </p>
      )}

      {answered && !roundFeedback && (
        <p className="mt-6 text-gray-400">✅ Válasz elküldve, várd az eredményt...</p>
      )}
    </div>
  );
}
