import React, { useEffect, useState, useRef} from "react";
import { socket } from "../utils/socket";
import { Wheel } from "react-custom-roulette";
import { motion } from "framer-motion";


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

 //Kerékpörgetés
  const[spinning, setSpinning] = useState(false);
  const[categories, setCategories] = useState([]);
  const[prizeNumber, setPrizeNumber] = useState(0);
  const[selectedCategory, setSelectedCategory] = useState(null);
  const [showTopic, setShowTopic] = useState(false);

  //Segítség
  const [usedHelp, setUsedHelp] = useState(false);
  const [removedAnswers, setRemovedAnswers] = useState([]);

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
    .then((res) => res.json())
    .then((data) => {
      const formatted = data.trivia_categories.map((c) => ({
        option: c.name,
        id: c.id
      }));
      setCategories(formatted);
    })
    .catch((err) => console.error("Kategóriák lekérése sikertelen:", err));
  }, []);

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

    socket.on("spin_wheel", (data) => {
      console.log("spin_wheel:", data);
      setSelectedCategory(data.topic);
      const idx = categories.findIndex(c => c.option === data.topic);
      setPrizeNumber(idx >= 0 ? idx: 0);
      setShowTopic(false);
      setSpinning(true);
    });

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
      const statsMessage = `\n(Eliminated: ${eliminatedCount}, Survivors: ${survivorCount})`;

      if (noRightAnswers) {
        setRoundFeedback(`${noRightAnswers}\n (Correct answer: ${data.correct}) ${statsMessage}`);
        setTimeout(() => setRoundFeedback(null), 5000);

      } else
      {
        const isEliminated = data.eliminated.includes(username);
        const isSurvivor = data.survivors.includes(username);

        if (isEliminated) {
          setRoundFeedback(`❌ Incorrect! Eliminated! Correct answer: ${data.correct}`);
          setTimeout(() => {setEliminated(true);}, 5000);

        } else if (isSurvivor) {
          setRoundFeedback(`✅ Correct! ${statsMessage}`);
          setTimeout(() => setRoundFeedback(null), 5000);

        } else {
          setRoundFeedback("⏰ Timeout!");
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
        localStorage.setItem("finalResult", JSON.stringify(data));
        setTimeout(() => {setScreen("result");}, 4000);
      }, 5000);
      });

    socket.on("help_result", (data) => {
      console.log("🎯 HELP RESULT:", data);
      setRemovedAnswers(data.removed_answers);
    });


    return () => {
      socket.off("new_question");
      socket.off("round_result");
      socket.off("player_eliminated");
      socket.off("game_over");
      socket.off("help_result");


    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [username, room, setScreen, eliminated, categories]);

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

  const useHelp = () => {
    if (usedHelp || !question || eliminated) return;

    socket.emit("use_help", { room, username });
    setUsedHelp(true);
  };

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
        <h2 className="text-3xl font-bold mb-4">❌ Eliminated!</h2>
        <p>Please wait for the game to end...</p>
      </div>
    );
  }

  //Ha épp forog a kerék
  if(spinning){
    return(
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white transition-opacity duration-1000"
      style={{ opacity: spinning ? 1 : 0 }}>
      <h2 className="text-3xl mb-6 animate-pulse">🎡 The wheel of fortune</h2>
      {categories.length > 0 ? (
        <Wheel
          mustStartSpinning={spinning}
          prizeNumber={prizeNumber}
          data={categories}
          outerBorderWidth={1}
          spinDuration={2}
          innerRadius={0}
          backgroundColors={["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]}
          textColors={["#fff"]}
          fontSize={9}
          textDistance={60}
          radiusLineWidth={0.2}
          onStopSpinning={() => {
            console.log("Kerék leállt");
            setShowTopic(true);
            setTimeout(() => {
              setSpinning(false);
            }, 2000);
          }}
        />
      ) : (
        <p className="text-gray-400">Loading</p>
      )}
        <div className="h-20 flex items-center justify-center">
          {selectedCategory && showTopic === true && (
            <motion.div
              className="mt-2 text-4xl font-extrabold text-yellow-400 text-center drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
              animate={{
                opacity: 1,
                scale: [1.2, 1],
                rotate: [5, 0],
              }}
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 100,
                damping: 8,
              }}
              whileHover={{
                scale: 1.1,
                textShadow: "0px 0px 12px rgba(255, 230, 150, 0.9)",
                transition: { duration: 0.6 },
              }}
            >
              Topic: <span className="text-white">{selectedCategory}</span>
            </motion.div>
          )}</div>
      </div>
    );
  }


  // 🔹 Ha még nincs kérdés
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h2 className="text-3xl">⏳ Waiting for the question...</h2>
      </div>
    );
  }

  // 🔹 Ha vége a játéknak
  if (winner) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-800 text-white">
        <h2 className="text-4xl font-bold">
          🏆 The winner is: {winner || "Nobody"} 🎉
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-6">{question.question}</h2>
      <p className="mb-4 text-gray-400">⏰ Time remaining: {timer}s</p>

      <div className="grid grid-cols-2 gap-4 w-2/3">
        {question.choices
          .filter(choice => !removedAnswers.includes(choice))
          .map((choice, idx) => (
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
      <button
          onClick={useHelp}
          disabled={usedHelp || answered || !question}
          className="mt-10 mb-4 bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50">
            🧩 Help: 50-50
      </button>

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
        <p className="mt-6 text-gray-400">✅ Answer sent ✅</p>
      )}
    </div>
  );
}
