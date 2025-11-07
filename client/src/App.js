import React, {useState} from "react";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";
import JoinRoom from "./components/JoinRoom";
import ResultScreen from "./components/ResultScreen";
import CreateRoom from "./components/CreateRoom";

function App() {
  const [screen, setScreen] = useState("home"); // home, join, lobby, game, result
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const handleJoin = (roomCode, user) => {
  setRoom(roomCode);
  setUsername(user);
  setScreen("lobby"); // Átváltunk a lobby képernyőre
};

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 text-white">
      {screen === "home" && (
        <div>
          <h1 className="text-4xl font-bold mb-4">🎮 Multiplayer Quiz Royale</h1>
          <p className="text-lg text-gray-300 mb-6">
            Csatlakozz vagy hozz létre egy szobát, és játssz másokkal valós időben!
          </p>

          <div className="flex gap-4 justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
              onClick={() => setScreen("create")}
            >
              Szoba létrehozása
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
              onClick={() => setScreen("join")}
            >
              Csatlakozás szobához
            </button>
          </div>
        </div>
      )}

      {screen === "join" && (
        <JoinRoom
          onJoin={handleJoin}
          setScreen={setScreen}
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
        />
      )}

      {screen === "lobby" && (
        <Lobby
          setScreen={setScreen}
          username={username}
          room={room}
          setRoom={setRoom}
        />
      )}

      {screen === "create" && (
        <CreateRoom
          onCreate={(roomCode, user) => {
            setRoom(roomCode);
            setUsername(user);
            setScreen("lobby");
          }}
          />
      )}

      {screen === "game" && <GameScreen setScreen={setScreen} room={room} username={username} />}

      {screen === "result" && <ResultScreen setScreen={setScreen} />}
    </div>
  );
}

export default App;
