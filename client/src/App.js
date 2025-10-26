import React from "react";
import Lobby from "./components/Lobby";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">🎮 Multiplayer Game Lobby</h1>
      <p className="text-lg text-gray-300 mb-6">
        Csatlakozz vagy hozz létre egy szobát, és játssz másokkal!
      </p>

      <div className="flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg">
          Szoba létrehozása
        </button>
        <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg">
          Csatlakozás szobához
        </button>
      </div>
    </div>
  );
}

export default App;
