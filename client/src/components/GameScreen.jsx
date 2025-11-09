import React, { useEffect, useState, useRef} from "react";
import { socket } from "../utils/socket";

export default function GameScreen({ username, room, setScreen }) {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [eliminated, setEliminated] = useState(false);
  const [winner, setWinner] = useState(null);
  const [roundFeedback, setRoundFeedback] = useState(null);
  const currentRoundId = useRef(null);
  const animationFrameId = useRef(null);
 const [roundEndTime, setRoundEndTime] = useState(null);

  useEffect(() => {
    const requestTimer = setTimeout(() => {
        if (!question) {
            console.log("❓ Still no question, requesting from server...");
            socket.emit("request_current_question", {room});
        }
    }, 3000);   
    return () => {
        clearTimeout(requestTimer);
    };
  }, [question, room]);

  useEffect(() => {
    console.log("🎧 GameScreen mounted, waiting for questions...");
    socket.emit("join_room", { username, room });
    console.log("📡 Sent join_room from GameScreen:", { username, room });

    socket.on("new_question", (data) => {
    console.log("🧠 Új kérdés esemény érkezett:", data);
    if (!data || !data.question || !data.round_end_time || !data.round_id) {
      console.warn("⚠️ new_question hiányos adatot kapott!");
      return;
      }

    if (data.round_id === currentRoundId.current) {
        console.log(`🔄 Ignoring duplicate new_question for round ${data.round_id}`);
        return;
    }
    if (eliminated) {
        console.log("⏹️ Player eliminated, ignoring new question");
        return;
    }

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }

    currentRoundId.current = data.round_id;
    setQuestion(data.question)
    setRoundEndTime(data.round_end_time); 
  	setRoundFeedback(null);
    setTimer(data.timer); 
    setAnswered(false);

    console.log(`⏱️ New round ${data.round_id} started with ${data.timer}s`);
    });

    socket.on("round_result", (data) => {

      if (data.round_id !== currentRoundId.current) {
        console.log(`⚠️ Ignoring stale round_result for ${data.round_id}`);
        return;
      }

 	    if (animationFrameId.current) {
	  	cancelAnimationFrame(animationFrameId.current);
      }
 	    setTimer(0); 
      setRoundEndTime(null); 

      const eliminatedCount = data.eliminated.length;
      const survivorCount = data.survivors.length;
      const noRightAnswers=data.message;
      const statsMessage = `\n(Kiesettek: ${eliminatedCount}, Túlélők: ${survivorCount})`;

      if (noRightAnswers) {
        setRoundFeedback(`${noRightAnswers}\n (A helyes válasz: ${data.correct}) ${statsMessage}`);
        setTimeout(() => setRoundFeedback(null), 5000);

      } else
      {
        const isEliminated = data.eliminated.includes(username);
        const isSurvivor = data.survivors.includes(username);

        if (isEliminated) {
          setRoundFeedback(`❌ Rossz válasz! Kiestél! A helyes: ${data.correct}`);
          setTimeout(() => {setEliminated(true);}, 5000);

        } else if (isSurvivor) {
          setRoundFeedback(`✅ Helyes válasz! ${statsMessage}`);
          setTimeout(() => setRoundFeedback(null), 5000);

        } else {
          setRoundFeedback("⏰ Nem válaszoltál időben!");
          setTimeout(() => {setEliminated(true);}, 5000);
        }
      }
    });

    socket.on("player_eliminated", (data) => {
      console.log("❌", data.username, "kiesett");
    });

    socket.on("game_over", (data) => {
 	    if (animationFrameId.current) {
 	  	cancelAnimationFrame(animationFrameId.current);
 	    }
      setTimer(0);
        setRoundEndTime(null);
        
      setTimeout(() => {
        setWinner(data.winner);
        setTimeout(() => {setScreen("result");}, 4000);
      }, 5000);
      });

    return () => {
      socket.off("new_question");
      socket.off("round_result");
      socket.off("player_eliminated");
      socket.off("game_over");

    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [username, room, setScreen,eliminated]);

   // Timer logic
  useEffect(() => {
    if (roundEndTime) {
      const updateTimer = () => {
        const nowInSeconds = Date.now() / 1000;
        const remaining = Math.max(0, roundEndTime - nowInSeconds);
        
        setTimer(Math.ceil(remaining)); 

        if (remaining > 0) {
          animationFrameId.current = requestAnimationFrame(updateTimer);
        } else {
          setTimer(0); 
        }
      };

      animationFrameId.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [roundEndTime]);

  const sendAnswer = (choice) => {
    if (answered || eliminated || timer <= 0) return;
    socket.emit("answer_question", { room, username, answer: choice,round_id: currentRoundId.current});
    setAnswered(true);
    console.log(`📤 Answer sent: ${choice} for round ${currentRoundId.current}`);
  };

  // 🔹 Ha kiesett
  if (eliminated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-red-800">
        <h2 className="text-3xl font-bold mb-4">❌ Kiestél!</h2>
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
          style={{ whiteSpace:'pre-line'}}
          className={`mt-8 text-2xl font-bold ${
            roundFeedback.includes("✅")
              ?"text-green-400"
              :(roundFeedback.startsWith("❌")||roundFeedback.startsWith("⏰"))
              ?"text-red-400" 
              :"text-yellow-400" 
          }`}
        >
          {roundFeedback}
        </p>
      )}

      {answered && !roundFeedback && (
        <p className="mt-6 text-gray-400">✅ Válasz elküldve ✅</p>
      )}
    </div>
  );
}
