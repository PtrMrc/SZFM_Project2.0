import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import Lobby from "./components/Lobby";

function App() {
  const [screen, setScreen] = useState("join");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

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

  if (screen === "lobby") {
    return (
      <Lobby
        room={room}
        username={username}
        onStart={() => setScreen("game")}
      />
    );
  }

  return <div>Játék képernyő (hamarosan)</div>;
}

export default App;
