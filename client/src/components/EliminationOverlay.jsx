import React from "react";

export default function EliminationOverlay() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black/80 text-white">
      <h2 className="text-4xl font-bold mb-4">😢 Eliminated!</h2>
      <p className="text-gray-300 text-lg mb-6">Don't worry, try again!</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 px-6 py-3 rounded-lg font-semibold"
      >
        Back to Home
      </button>
    </div>
  );
}
