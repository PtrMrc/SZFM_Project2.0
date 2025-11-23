import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import Lobby from "./components/Lobby";
import CreateRoom from "./components/CreateRoom";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import HomeScreen from "./components/HomeScreen";
import SoloSetup from "./components/SoloSetup";
import SoloGameScreen from "./components/SoloGameScreen";
import SoloResultScreen from "./components/SoloResultScreen";

function App() {
  const [screen, setScreen] = useState("home");

  console.log("🎯 App rendered, screen =", screen);
  console.log("🎯 First condition check (screen === 'home'):", screen === "home");

  const [gameMode, setGameMode] = useState("multiplayer");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [soloSessionId, setSoloSessionId] = useState("");

  if (screen === "home") {
    return <HomeScreen setScreen={setScreen} setGameMode={setGameMode} />;
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