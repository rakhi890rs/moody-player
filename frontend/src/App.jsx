import React, { useState } from "react";
import FaceDetection from "./Components/FaceDetection";
import MoodSongs from "./Components/MoodSongs";

function App() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]); // ✅ songs state parent me

  return (
    <div className="App">
      <FaceDetection setMood={setMood} setSongs={setSongs} />

      <h2 style={{ textAlign: "center" }}>Detected Mood: {mood}</h2>

      <MoodSongs songs={songs} />
    </div>
  );
}

export default App;
