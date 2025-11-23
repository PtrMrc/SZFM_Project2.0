import React, { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { Wheel } from "react-custom-roulette";
import { motion, AnimatePresence } from "framer-motion";

export default function SoloGameScreen({ username, sessionId, setScreen }) {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [roundFeedback, setRoundFeedback] = useState(null);
  const currentRoundId = useRef(null);
  const animationFrameId = useRef(null);
  const [roundEndTime, setRoundEndTime] = useState(null);

  // Wheel spinning
  const [spinning, setSpinning] = useState(false);
  const [categories, setCategories] = useState([]);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTopic, setShowTopic] = useState(false);

  // Game stats
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);

  //AI commentator message
  const [aiMessage, setAiMessage] = useState("");

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
    console.log("🎮 SoloGameScreen mounted");

    socket.on("spin_wheel", (data) => {
      console.log("spin_wheel:", data);
      setSelectedCategory(data.topic);
      const idx = categories.findIndex(c => c.option === data.topic);
      setPrizeNumber(idx >= 0 ? idx : 0);
      setShowTopic(false);
      setSpinning(true);
    });

    socket.on("solo_question", (data) => {
      console.log("🧠 Solo question received:", data);

      if (data.round_id === currentRoundId.current) {
        console.log("🔄 Ignoring duplicate question");
        return;
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      currentRoundId.current = data.round_id;
      setQuestion(data.question);
      setRoundEndTime(data.round_end_time);
      setRoundFeedback(null);
      setTimer(data.timer);
      setAnswered(false);
      setCurrentRound(data.current_round);
      setTotalRounds(data.total_rounds);
      setPlayerScore(data.player_score);
      setAiScore(data.ai_score);

      console.log(`⏱️ Round ${data.current_round}/${data.total_rounds} started`);
    });

    socket.on("solo_round_result", (data) => {
      console.log("📊 Solo round result:", data);

      if (data.round_id !== currentRoundId.current) {
        console.log("⚠️ Ignoring stale round result");
        return;
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      setTimer(0);
      setRoundEndTime(null);
      setPlayerScore(data.player_score);
      setAiScore(data.ai_score);

      const playerResult = data.player_correct ? "✅ Correct!" : `❌ Incorrect! Correct: ${data.correct_answer}`;
      const aiResult = data.ai_correct ? "AI: ✅ Correct" : "AI: ❌ Incorrect";

      setRoundFeedback(`${playerResult}\n${aiResult}\n\n📊 Score: You ${data.player_score} - ${data.ai_score} AI`);

      setTimeout(() => setRoundFeedback(null), 5000);

      // AI reaction message
      const correctBothMessages = [
        "We both got it right!",
        "Nice, solid answers from both sides.",
        "Looks like we're evenly matched this round.",
        "Great call — both correct.",
        "Strong play from both of us."
      ];

      const playerWonMessages = [
        "You took this round — well played.",
        "Nice one, you got me this time.",
        "Point goes to you.",
        "Clean win. Respect.",
        "You outplayed me on that one."
      ];

      const aiWonMessages = [
        "Looks like I got this one.",
        "Point for me this round.",
        "I was quicker this time.",
        "Got it — advantage AI.",
        "I'll take this one."
      ];

      const bothWrongMessages = [
        "Well… that wasn't it.",
        "Missed by both of us.",
        "No points this round.",
        "Yeah… not our best moment.",
        "We both slipped on that one."
      ];

      let messageList = [];
      if (data.player_correct && data.ai_correct) {
        messageList = correctBothMessages;
      } else if (data.player_correct && !data.ai_correct) {
        messageList = playerWonMessages;
      } else if (!data.player_correct && data.ai_correct) {
        messageList = aiWonMessages;
      } else {
        messageList = bothWrongMessages;
      }

      const aiReaction = messageList[Math.floor(Math.random() * messageList.length)];
      setAiMessage(aiReaction);
      setTimeout(() => setAiMessage(""), 3000);
    });

    socket.on("solo_game_over", (data) => {
      console.log("🏁 Solo game over:", data);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      setTimer(0);
      setRoundEndTime(null);

      localStorage.setItem("soloResult", JSON.stringify(data));

      setTimeout(() => {
        setScreen("solo-result");
      }, 5000);
    });

    return () => {
      socket.off("spin_wheel");
      socket.off("solo_question");
      socket.off("solo_round_result");
      socket.off("solo_game_over");
      socket.off("ai_comment");

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [sessionId, setScreen, categories]);

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
    if (answered || timer <= 0) return;

    socket.emit("solo_answer", {
      session_id: sessionId,
      answer: choice,
      round_id: currentRoundId.current
    });

    setAnswered(true);
    console.log(`📤 Answer sent: ${choice}`);
  };

  // If wheel is spinning
  if (spinning) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
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
              setShowTopic(true);
              setTimeout(() => {
                setSpinning(false);
              }, 2000);
            }}
          />
        ) : (
          <p className="text-gray-400">Loading...</p>
        )}
        <div className="h-20 flex items-center justify-center">
          {selectedCategory && showTopic && (
            <motion.div
              className="mt-2 text-4xl font-extrabold text-yellow-400 text-center drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >
              Topic: <span className="text-white">{selectedCategory}</span>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Waiting for question
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-900">
        <h2 className="text-3xl mb-4">⏳ Waiting for the question...</h2>
        <p className="text-gray-400">AI opponent loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* AI Commentator */}
      <AnimatePresence>
        {aiMessage && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="absolute top-8 left-8 flex items-start gap-3"
          >
            {/* AI Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
              🤖
            </div>

            {/* Chat Bubble */}
            <div className="relative">
              {/* Bubble tail */}
              <div className="absolute left-0 top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800 -ml-2"></div>

              {/* Bubble content */}
              <div className="bg-gray-800 px-6 py-3 rounded-2xl rounded-tl-sm shadow-xl border border-gray-700 max-w-md">
                <p className="text-white font-medium text-lg">{aiMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score header */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-8 text-xl font-bold">
        <div className="bg-blue-600 px-6 py-2 rounded-lg">
          👤 You: {playerScore}
        </div>
        <div className="bg-gray-700 px-4 py-2 rounded-lg">
          Round {currentRound}/{totalRounds}
        </div>
        <div className="bg-purple-600 px-6 py-2 rounded-lg">
          🤖 AI: {aiScore}
        </div>
      </div>

      <h2 className="text-2xl mb-6 mt-20">{question.question}</h2>
      <p className="mb-4 text-gray-400">⏰ Time remaining: {timer}s</p>

      <div className="grid grid-cols-2 gap-4 w-2/3">
        {question.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => sendAnswer(choice)}
            disabled={answered}
            className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50 transition-colors"
          >
            {choice}
          </button>
        ))}
      </div>

      {roundFeedback && (
        <p
          style={{ whiteSpace: 'pre-line' }}
          className="mt-8 text-xl font-bold text-center text-yellow-400"
        >
          {roundFeedback}
        </p>
      )}

      {answered && !roundFeedback && (
        <p className="mt-6 text-gray-400">✅ Answer sent, AI answering... ✅</p>
      )}
    </div>
  );
}