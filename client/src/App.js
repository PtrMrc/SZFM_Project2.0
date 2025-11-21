import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import Lobby from "./components/Lobby";
import CreateRoom from "./components/CreateRoom";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import HomeScreen from "./components/HomeScreen";
import SoloSetup from "./components/SoloSetup";
import SoloGameScreen from "./components/SoloGame";
import SoloResultScreen from "./components/SoloResultScreen";

function App() {
  const [screen, setScreen] = useState("home");
  const [gameMode, setGameMode] = useState("multiplayer");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [soloSessionId, setSoloSessionId] = useState("");

  if (screen === "home") {
    return <HomeScreen setScreen={setScreen} setGameMode={setGameMode} />;
  }

  if (gameMode === "multiplayer" && screen === "multiplayer-menu") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-8">👥 Multiplayer mode</h2>
        <div className="flex gap-6">
          <button
            onClick={() => setScreen("join")}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-semibold"
          >
            🚪 Join Room
          </button>
          <button
            onClick={() => setScreen("create")}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-semibold"
          >
            ➕ Create Room
          </button>
        </div>
        <button
          onClick={() => setScreen("home")}
          className="mt-8 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>
    );
  }

  if (gameMode === "solo") {
    if (screen === "solo-setup") {
      return (
        <SoloSetup
          username={username}
          setUsername={setUsername}
          onStart={(sessionId) => {
            setSoloSessionId(sessionId);
            setScreen("solo-game");
          }}
        />
      );
    }

    if (screen === "solo-game") {
      return (
        <SoloGameScreen
          username={username}
          sessionId={soloSessionId}
          setScreen={setScreen}
        />
      );
    }

    if (screen === "solo-result") {
      return <SoloResultScreen setScreen={setScreen} />;
    }
  }

  // Multiplayer flow
  if (screen === "join") {
    return (
      <JoinRoom
        onJoin={(r, u) => {
          setRoom(r);
          setUsername(u);
          setScreen("lobby");
        }}
      />
    );
  }

  if (screen === "create") {
    return (
      <CreateRoom
        onCreate={(r, u) => {
          setRoom(r);
          setUsername(u);
          setScreen("lobby");
        }}
      />
    );
  }

  if (screen === "lobby") {
    return (
      <Lobby
        room={room}
        username={username}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "game") {
    return (
      <GameScreen
        room={room}
        username={username}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "result") {
    return <ResultScreen setScreen={setScreen} />;
  }

  return <div>Unknown screen</div>;
}

export default App;