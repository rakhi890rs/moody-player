import React from "react";
import FaceDetection from "./Components/FaceDetection";
import MoodSongs from "./Components/MoodSongs";

function App() {
  return (
    <div className="App">
      {/* <h1 style={{ textAlign: "center" }}>Real-Time Face Detection</h1> */}
      <FaceDetection />
      <MoodSongs/>
    </div>
  );
}

export default App;
