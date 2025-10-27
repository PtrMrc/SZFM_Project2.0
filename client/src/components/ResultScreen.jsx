import React from "react";

export default function ResultScreen({ setScreen }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-4xl font-bold mb-6">🏁 Játék vége!</h2>
      <p>Köszönjük, hogy játszottál!</p>
      <button
        onClick={() => setScreen("home")}
        className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
      >
        Vissza a főmenübe
      </button>
    </div>
  );
}
